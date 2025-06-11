import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient";


export default async function RoutesRoadMap() {
    server.post("/register/roadMap", async (request, reply)  => {
        const body = request.body as {title: string, description: string, idCreator: string};
        const {title, description, idCreator} = body;

        try {
            if (!title || !description || !idCreator ) {
                return reply.status(404).send({message: "algum campo não foi preenchido corretamente"});
            }

            const idIsExisting = await prismaClient.user_Client.findUnique({where: {id: idCreator}});
            
            if (!idIsExisting) {
                return reply.status(500).send({message:"usuario não encontrado"});
            }
            
            const response = await prismaClient.travel_Road_Map.create({
                data: {
                    title,
                    description,
                    idCreator
                }
            });

            return reply.status(200).send({response, message:"Roteiro de viagem criado com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    
    });

    server.post("/update/roadMap", async (request, reply) => {
        const body = request.body as {title?: string, description?: string, idCommercialPoint?: string, idTouristingPoint?: string, idCreator: string, id: string}
        const {title, description, idCommercialPoint, idTouristingPoint , idCreator, id} = body;

        try {
            if (!id || !idCreator) {
                return reply.status(500).send({message: "id do criador ou id do roteiro não encontrado"})
            };
        
            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"roadMap não encontrado"});;
            };

            const idCreatorExisting = await prismaClient.travel_Road_Map.findUnique({where: {idCreator, id}});

            if(!idCreatorExisting) {
                return reply.status(500).send({message:"Erro na consulta do banco de dados referente ao idCreator"});
            };
            
            if (!idTouristingPoint && !!idCommercialPoint) {
                const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}})
                if (idCommercialPointExisting === null) {
                    return reply.status(500).send({message:"erro na consulta do banco de dados"})
                }

                const response = await prismaClient.travel_Road_Map.update({
                    where: {id},
                    data: {
                        title,
                        description,
                        Commercial_Point: {connect: {id: idCommercialPoint}}
                    }
                });

                return reply.status(200).send({response, message:"Atualização bem sucedida"})
            };
            
            if (!!idTouristingPoint && !idCommercialPoint){
                const idTouristingPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristingPoint}})
                if (idTouristingPointExisting === null) {
                    return reply.status(500).send({message:"erro na consulta do banco de dados"})
                }

                const response = await prismaClient.travel_Road_Map.update({
                    where: {id},
                    data: {
                        title,
                        description,
                        Touristing_Point: {connect: {id: idTouristingPoint}}
                    }
                });

                return reply.status(200).send({response, message:"Atualização bem sucedida"})
            };

            if (!idTouristingPoint && !idCommercialPoint){
                const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}})
                if (idCommercialPointExisting === null) {
                    return reply.status(500).send({message:"erro na consulta do banco de dados"})
                }

                const response = await prismaClient.travel_Road_Map.update({
                    where: {id},
                    data: {
                        title,
                        description
                    }
                });

                return reply.status(200).send({response, message:"Atualização bem sucedida"})
            };

            return reply.status(200).send({message:"roteiro de viagem atualizado com sucesso"})
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }

    });

    server.post("/published/roadMap", async (request, reply) => {
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

            const isPublished = travelRoadMapExisting.isPublished

            if(!isPublished) {
                const response = await prismaClient.travel_Road_Map.update({
                    where: {id},
                    data: {
                        isPublished: true
                    }
                });

                return reply.status(200).send({response ,message:"publicado com sucesso"})
            }

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/delete/roadMap/roadMap", async (request, reply) => {
        const body = request.body as {id: string, idCreator: string}
        const {idCreator, id} = body;

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

            const response = await prismaClient.travel_Road_Map.delete({where: {idCreator, id}})

            return reply.status(200).send({response, message:"Road Map deletado com sucesso"})
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/delete/point/roadMap", async (request, reply) => { 
        const body = request.body as {id: string, idCreator: string, idPoint: string, typePoint: string}
        const {idCreator, id, idPoint, typePoint} = body; // typePoint deve ser "commercial" ou "tourist"

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
                        Commercial_Point: {disconnect: [{id: idPoint}]}
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
                        Touristing_Point: {disconnect: [{id: idPoint}]}
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

    server.post("/get/roadMap", async (request, reply) => {
        const body = request.body as {id: string, idCreator: string}
        const {idCreator, id} = body; 
        
        try {
            if (!id || !idCreator) {
                return reply.status(500).send({message: "id do criador ou id do roteiro não encontrado"})
            };
        
            const travelRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if(!travelRoadMapExisting ) {
                return reply.status(500).send({message:"RoadMap não existe"});
            };

            const response = await prismaClient.travel_Road_Map.findUnique({where: {id}});

            if (response?.idCreator != idCreator) {
                return reply.status(500).send({message:"idCreator não é o do roadMap"});
            }
          
            return reply.status(200).send({response, message:"Road Map pego com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/list/roadMap", async (request, reply) => {
        try {
             const response = await prismaClient.travel_Road_Map.findMany();

            return reply.status(200).send({response, message:"Todos os RoadMaps"})
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

}