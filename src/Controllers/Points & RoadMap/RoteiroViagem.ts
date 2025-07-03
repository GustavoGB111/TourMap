import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient";
import { connect } from "http2"; // importação não utilizada

// Função principal que define as rotas relacionadas ao "road map"
export default async function RoutesRoadMap() {

    // Criação de um novo roteiro de viagem
    server.post("/register/roadMap", async (request, reply)  => {
        const body = request.body as {title: string, description: string, idCreator: string};
        const {title, description, idCreator} = body;

        try {
            // Validação dos campos
            if (!title || !description || !idCreator ) {
                return reply.status(404).send({message: "algum campo não foi preenchido corretamente"});
            }

            // Verifica se o usuário criador existe
            const idIsExisting = await prismaClient.user_Client.findUnique({where: {id: idCreator}});
            
            if (!idIsExisting) {
                return reply.status(500).send({message:"usuario não encontrado"});
            }
            
            // Cria o road map
            const response = await prismaClient.travel_Road_Map.create({
                data: {
                    title,
                    description,
                    userClient: {connect: {id: idCreator}}
                }
            });

            return reply.status(200).send({response, message:"Roteiro de viagem criado com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    
    });

    // Atualiza um roteiro de viagem com novos dados
    server.post("/update/roadMap", async (request, reply) => {
        const body = request.body as {title?: string, description?: string, idCommercialPoint?: string, idTouristingPoint?: string, idCreator: string, idRoadMap: string, country?: string, state?: string, city?: string, userImageUrl?: string};
        const {title, description, idCommercialPoint, idTouristingPoint , idCreator, idRoadMap, country, state, city, userImageUrl} = body;

        try {
            // Criação de localizações caso não existam
            if (country) {
                const countryAlreadyExist = await prismaClient.country.findUnique({where: {name: country}})
                if (!countryAlreadyExist) {
                    await prismaClient.country.create({ data: { name: country } });
                }    
            }
            if (state) {
                const stateAlreadyExist = await prismaClient.state.findUnique({where: {name: state}})
                if (!stateAlreadyExist) {
                    await prismaClient.state.create({
                        data: {
                            name: state,
                            CountryByCountryName: {connect: {name: country}}
                        }
                    });
                }
            }
            if (city) {
                const cityAlreadyExist = await prismaClient.city.findUnique({where: {name: city}})
                if (!cityAlreadyExist) {
                    await prismaClient.city.create({
                        data: {
                            name: city,
                            CityByCountryName: {connect: {name: country}},
                            StateByStateName: {connect: {name: state}}
                        }
                    });
                }
            }

            // Validação de identificadores
            if (!idRoadMap || !idCreator) {
                return reply.status(500).send({message: "id do criador ou id do roteiro não preenchido"})
            };

            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"roadMap não existe"});
            };
            if(idCreator != travelRoadMapExisting.idCreator) {
                return reply.status(500).send({message:"Você não é o dono do RoadMap"});
            };

            // Atualização dos dados do roadmap
            const response = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap, idCreator}});
            await prismaClient.travel_Road_Map.update({
                where: {id: idRoadMap, idCreator},
                data: {
                    title: title ?? response?.title,
                    description: description ?? response?.description,
                    userImageUrl,
                    PontosComerciaisRelation: {connect: {id: idCommercialPoint}},
                    PontosTuristicosRelation: {connect: {id: idTouristingPoint}},
                    CityRelation: {connect: {name: city}},
                    StateRelation: {connect: {name: state}},
                    CountryRelation: {connect: {name: country}}
                }
            });

            return reply.status(200).send({message:"roteiro de viagem atualizado com sucesso"})
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }

    });

    // Publica ou despublica um roadmap
    server.post("/publishOnOff/roadMap", async (request, reply) => {
        const body = request.body as {idCreator: string, id: string}
        const {idCreator, id} = body;

        try {
            if (!id || !idCreator) {
                return reply.status(500).send({message: "id do criador ou id do roteiro não encontrado"})
            };
        
            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"roadMap não existe"});
            };

            const idCreatorExisting = await prismaClient.travel_Road_Map.findUnique({where: {idCreator, id}});

            if(!idCreatorExisting) {
                return reply.status(500).send({message:"Erro na consulta do banco de dados referente ao idCreator"});
            };

            const {isPublished} = travelRoadMapExisting;

            if(isPublished === false) {
                const response = await prismaClient.travel_Road_Map.update({
                    where: {id},
                    data: {
                        isPublished: true
                    }
                });
                return reply.status(200).send({response ,message:"publicado com sucesso"});
            }

            const response = await prismaClient.travel_Road_Map.update({
                where: {id},
                data: {
                    isPublished: false
                }
            });

            return reply.status(200).send({response ,message:"o roteiro de viagem foi tirado de publicado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Exclusão de um roadmap
    server.post("/delete/roadMap/roadMap", async (request, reply) => {
        const body = request.body as {id: string, idCreator: string}
        const {idCreator, id} = body;

        try {
            if (!id || !idCreator) {
                return reply.status(500).send({message: "id do criador ou id do roteiro não encontrado"});
            };
        
            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"RoadMap não existe"});
            };

            if(idCreator != travelRoadMapExisting.id) {
                return reply.status(500).send({message:"Você não é o dono do roadmap"});
            };

            const response = await prismaClient.travel_Road_Map.delete({where: {idCreator, id}});

            return reply.status(200).send({response, message:"Road Map deletado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Desconecta um ponto turístico ou comercial de um roadmap
    server.post("/delete/point/roadMap", async (request, reply) => { 
        const body = request.body as {id: string, idCreator: string, idPoint: string, typePoint: string}
        const {idCreator, id, idPoint, typePoint} = body;

        try {
            if (!id || !idCreator) {
                return reply.status(500).send({message: "id do criador ou id do roteiro não encontrado"})
            };
        
            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"RoadMap não existe"});
            };

            const idCreatorExisting = await prismaClient.travel_Road_Map.findUnique({where: {idCreator, id}});

            if(!idCreatorExisting) {
                return reply.status(500).send({message:"Erro na consulta do banco de dados referente ao idCreator"});
            };

            if (typePoint == "commercial") {
                const pointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idPoint}})
                if (!pointExisting) {
                    return reply.status(500).send({message: "ponto não encontrado "})
                }

                const response = await prismaClient.travel_Road_Map.update({
                    where:{id, idCreator},
                    data: {
                        commentRoadMapByRoadMapId: {disconnect: [{id: idPoint}]}
                    }
                });

               return reply.status(200).send({response, message:"Desconexão feita com sucesso entre o ponto comercial e o roadMap"});
            } 
            
            if (typePoint == "tourist") {
                const pointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idPoint}})
                if (!pointExisting) {
                    return reply.status(500).send({message: "ponto não encontrado "})
                }

                const response = await prismaClient.travel_Road_Map.update({
                    where:{id, idCreator},
                    data: {
                        PontosTuristicosRelation: {disconnect: [{id: idPoint}]}
                    }
                });

               return reply.status(200).send({response, message:"Desconexão feita com sucesso entre o ponto turistico e o roadMap"});
            } 

            if (typePoint != "tourist" && typePoint != "commercial") {
                return reply.status(500).send({message:"o tipo não foi bem definido"});
            }

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Busca um roadmap específico
    server.post("/get/roadMap", async (request, reply) => {
        const body = request.body as {id: string, idCreator: string}
        const {id} = body; 
        
        try {
            if (!id) {
                return reply.status(500).send({message: "id do roteiro não encontrado"})
            };
        
            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"RoadMap não existe"});
            };

            const response = await prismaClient.travel_Road_Map.findUnique({where: {id}});
          
            return reply.status(200).send({response, message:"Road Map pego com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Retorna a lista de todos os roadmaps cadastrados
    server.post("/get/list/roadMap", async (request, reply) => {
        try {
            const response = await prismaClient.travel_Road_Map.findMany();
            return reply.status(200).send({response, message:"Todos os RoadMaps"})
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Cria uma imagem associada a um roadmap
    server.post("/create/image/roadMap", async (request, reply) => {
        const body = request.body as {idUser: string, idRoadMap: string, ImageUrl: string}
        const {idUser, idRoadMap, ImageUrl} = body

        try {
            // Verifica se o usuário e o roadmap existem
            const idUserExisting = await prismaClient.user_Business.findUnique({where: {id: idUser}}) 
            const idRoadMapPointExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idRoadMapPointExisting) {
                return reply.status(400).send({ message: "ID do RoadMap não existente" });
            };
            if (!ImageUrl) {
                return reply.status(400).send({ message: "a url não pode ser vazia" });
            };
            if (idUser != idRoadMapPointExisting.id) {
                return reply.status(400).send({ message: "você não é o dono do roadMap"});
            };

            // Cria a imagem no banco
            await prismaClient.imageRoadMap.create({
                data: {
                    image: ImageUrl,
                    userRoadMapByRoadMapId: {connect: {id: idRoadMap}}
                }
            });

            return reply.status(201).send({message: "imagem adicionada com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Deleta uma imagem associada a um roadmap
    server.delete("/delete/image/roadMap", async (request, reply) => {
        const body = request.body as {idUser: string, imageUrl: string, idRoadMap: string}
        const {idUser, imageUrl, idRoadMap} = body

        try {
            if (!idUser || !idRoadMap || !imageUrl)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            // Verifica existência do usuário, roadmap e imagem
            const idUserExisting = await prismaClient.user_Business.findUnique({where: {id: idUser}});
            const idRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}});
            const imageUrlExisting = await prismaClient.imageRoadMap.findUnique({where: {idRoadMap, image: imageUrl}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idRoadMapExisting) {
                return reply.status(400).send({ message: "ID do roadMap não existente" });
            };
            if (!imageUrlExisting) {
                return reply.status(400).send({ message: "imagem não existente" });
            };

            // Deleta a imagem
            await prismaClient.imageRoadMap.delete({where: {idRoadMap, image: imageUrl}});

            return reply.status(200).send({message: "imagem excluida com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Retorna a lista de imagens associadas a um determinado roadmap
    server.post("/get/image/list/roadMap", async (request, reply) => {
        const body = request.body as {idRoadMap: string}
        const {idRoadMap} = body

        try {
            const response = await prismaClient.imageRoadMap.findMany({where: {idRoadMap}});
            
            return reply.status(200).send({response, message:"Lista de imagens de um certo roadMap"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        };
    });

    // Permite a um usuário denunciar um roadmap
    server.post("/report/roadMap", async (request, reply) => {
        const body = request.body as {idUser: string, idRoadMap: string, contentReport: string}
        const {idUser, idRoadMap, contentReport} = body

        try {
            if (!idUser || !idRoadMap || !contentReport)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            // Verifica se já foi reportado anteriormente
            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idUser}});
            const idRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}});
            const reportExisting = await prismaClient.reportRoadMap.findUnique({where: {idUserReport: idUser, idRoadMap}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idRoadMapExisting) {
                return reply.status(400).send({ message: "ID do roadMap não existente" });
            };
            if (!!reportExisting) {
                return reply.status(400).send({ message: "você já denunciou esse roadMap" });
            };

            // Atualiza número de denúncias no roadmap
            const {reportNumber} = idRoadMapExisting
            const reportNum = reportNumber + 1;
            await prismaClient.travel_Road_Map.update({where: {id: idRoadMap}, data: {reportNumber: reportNum}})

            // Cria a denúncia
            await prismaClient.reportRoadMap.create({
                data: {
                    content: contentReport,
                    userReportRoadMapByIdRoadMap: {connect: {id: idRoadMap}},
                    userReportRoadMapByIdUserReport: {connect: {id: idUser}}
                }
            });

            return reply.status(200).send({ message: "Denunciado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Publica um roadmap (sem alternância como na outra rota)
    server.post("/publishOn/roadMap", async (request, reply) => {
        const body = request.body as {idRoadMap: string, idUser: string}
        const {idRoadMap, idUser} = body

        try {
            if (!idUser || !idRoadMap)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idUser}});
            const idtravelMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idtravelMapExisting) {
                return reply.status(400).send({ message: "ID do roadMap não existente" });
            };
            if (idtravelMapExisting.idCreator !== idUser) {
                return reply.status(400).send({ message: "Você não é o dono do roadMap" });
            };

            // Publica o roadmap
            await prismaClient.travel_Road_Map.update({
                where: {id: idRoadMap},
                data: {
                    isPublished: true
                }
            });
            
            return reply.status(200).send({message: "roadMap publicado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Retorna todas as denúncias feitas para um roadmap
    server.post("/get/reports/roadMap", async (request, reply) => {
        const body = request.body as {idRoadMap: string};
        const {idRoadMap} = body;

        try {
            const idRoadMapExisting = await prismaClient.travel_Road_Map.findMany({where: {id: idRoadMap}});

            if(!idRoadMapExisting) {
                reply.status(500).send({message: "o roadMap não existe"});
            }

            // Busca todas as denúncias
            const response = await prismaClient.reportRoadMap.findMany({where: {idRoadMap}});

            return reply.status(200).send({response, message: "todas as denuncias do roadMap"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}


