import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";
import { connect } from "http2";
import { get, request } from "http";
import { REPLServer } from "repl";

export default async function RoutesTouristPoints() {
    server.post("/register/touristPoint", async (request, reply) => {
        const body = request.body as { id: string;name: string; description: string; creationDate: Date; local: string};
        const {id, name, description, creationDate, local} = body;      
        
        try {
            if (!name || !description || !creationDate || !local) {
                return reply.status(400).send({message: "Algum campo não preenchido"});
            };
            if (!id) {
                return reply.status(400).send({message: "id não fornecido"});
            };

            const localExistingOnDatabase = await prismaClient.ponto_Turistico.findUnique({where: {local}});
            const idClientExisting = await prismaClient.user_Client.findUnique({where: {id}});

            if (!!localExistingOnDatabase) {
                return reply.status(500).send({message: "local já existente no banco de dados..."});
            };
            if(!idClientExisting) {
                return reply.status(500).send({message: "o cliente não existe no banco de dados..."});
            }

            const response = await prismaClient.ponto_Turistico.create({
                data: {
                    name,
                    description,
                    local,
                    creationDate
                }
            });
            return reply.status(201).send({response: response.id ,message: "Ponto turistico adicionado"})
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha"});
        };
    });

    server.put("/update/touristPoint", async (request, reply) => {
        const body = request.body as { idUser: string; idTouristPoint: string; newName?:string; newDescription?: string; newLocal?: string}
        const {idUser, idTouristPoint, newName, newDescription, newLocal} = body

        try {
            if (!idTouristPoint) {
                return reply.status(400).send({message: "id do Ponto Turistico não fornecido"});
            };
            if (!idUser) {
                return reply.status(400).send({message: "id do Usuario não fornecido"});
            }
            if (!newDescription || !newLocal || !newName) {
                return reply.status(400).send({message: "algum campo não foi preenchido"});
            };

            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}}) as {name: String; description: String; local: String};
            const localExisting = await prismaClient.ponto_Turistico.findUnique({where: {local: newLocal}});

            const {name, description, local} = idTouristPointExisting;

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            }
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turístico não existente" });
            }
            if (!!localExisting) {
                return reply.status(400).send({ message: "local ja ocupado"})
            }

            const response = await prismaClient.ponto_Turistico.update({
                where: {id: idTouristPoint},
                data: {
                    name: newName ?? name,
                    description: newDescription ?? description,
                    local: newLocal ?? local
                }
            });
            return reply.status(200).send({response, message: "Atualizado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string};
        const {idTouristPoint} = body;

        try {
            if (!idTouristPoint) {
                return reply.status(400).send({message: "campos não preenchidos"});
            }

            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turístico não existente" });
            }
            
            const response = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            reply.status(200).send({response, message: "id do ponto turistico retornado"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.get("/get/list/touristPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Turistico.findMany();
            reply.status(200).send({response, message: "Todos os registros de Pontos Turisticos"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.delete("/delete/touristPoint", async (request, reply) => {
        const body = request.body as {idUser: string; idTouristPoint: string};
        const {idUser, idTouristPoint} = body

        try {
            if (!idUser || !idTouristPoint)  {
                reply.status(400).send({message: "Algum campo não completado"});
            }
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
        
            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            }
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            }

            await prismaClient.ponto_Turistico.delete({where: {id: idTouristPoint}});
            return reply.status(200).send({ message: "Deletado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }

    });

    server.post("/report/touristPoint", async (request, reply) => {
        const body = request.body as {idUser: string; idTouristPoint: string, contentReport: string};
        const {idUser, idTouristPoint, contentReport} = body

        try {
            if (!idUser || !idTouristPoint || !contentReport)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }
            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}}) as {reportNumber: number};
            const reportExisting = await prismaClient.reportTouristPoint.findUnique({where: {idUserReport : idUser, idTouristPoint}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };
            if (!!reportExisting){
                return reply.status(400).send({ message: "você já denunciou esse ponto turistico" });
            }

            const {reportNumber} = idTouristPointExisting;
            const reportNum = reportNumber + 1;
            await prismaClient.ponto_Turistico.update({where: {id: idTouristPoint}, data: {reportNumber: reportNum}});

            await prismaClient.reportTouristPoint.create({
                data: {
                    content: contentReport,
                    userReportTouristPointByIdTouristPoint:{connect: {id: idTouristPoint}},
                    userReportTouristPointByIdUserReport:{connect: {id: idUser}}
                }
            })
            return reply.status(200).send({ message:"Denunciado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/create/image/TouristPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idTouristPoint: string, ImageUrl: string}
        const {idUser, idTouristPoint, ImageUrl} = body

        try {
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}}) 
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };
            if (!ImageUrl) {
                return reply.status(400).send({ message: "a url não pode ser vazia" });
            };
            
            await prismaClient.imageTouristPoint.create({
                data: {
                    image: ImageUrl,
                    userTouristPointByTouristPointId: {connect: {id: idTouristPoint}}
                }
            });

            return reply.status(201).send({message: "imagem adicionada com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/image/list/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string}
        const {idTouristPoint} = body

        try {
            const response = await prismaClient.imageTouristPoint.findMany({where: {idTouristPoint}});
            
            return reply.status(200).send({response, message:"Lista de imagens de um certo ponto turistico"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        };
    });

    server.delete("/delete/image/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string, imageUrl: string, idUser: string}
        const {idTouristPoint, imageUrl, idUser} = body

        try {
            if (!idUser || !idTouristPoint || !imageUrl)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };

            const imageUrlExisting = await prismaClient.imageTouristPoint.findUnique({where: {idTouristPoint, image: imageUrl}});

            if (!imageUrlExisting) {
                return reply.status(400).send({ message: "imagem não existente" });
            };

            await prismaClient.imageTouristPoint.delete({where: {idTouristPoint, image: imageUrl}});

            return reply.status(200).send({message: "imagem excluida com sucesso"});
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/publishOn/touristPoint", async (request, reply) => { // pode trocar tanto de on pra off
        const body = request.body as {idTouristPoint: string, idUser: string}
        const {idTouristPoint, idUser} = body

        try {
            if (!idUser || !idTouristPoint)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };

            await prismaClient.ponto_Turistico.update({where: {id: idTouristPoint},
            data: {
                isPublished: true
            }
            });

            await prismaClient.notificationTouristPoint.create({
                data: {
                    userNotificationTouristPointByIdClient: {connect: {id: idUser}},
                    userNotificationTouristPointByIdTouristPoint: {connect: {id: idTouristPoint}}
                }
            });
            
            return reply.status(200).send({message: "ponto turistico publicado com sucesso"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/reports/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string};
        const {idTouristPoint} = body;

        try {
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findMany({where: {id: idTouristPoint}});

            if(!idTouristPointExisting) {
                reply.status(500).send({message: "o ponto turistico não existe"});
            }

            const response = await prismaClient.reportTouristPoint.findMany({where: {idTouristPoint}});

            return reply.status(200).send({response, message: "todas as denuncias do ponto turistico"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.get("/get/notPublished/touristPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Turistico.findMany({where: {isPublished: false}});
            reply.status(200).send({response, message: "todas as rotas não publicadas de touristPoint"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.get("/get/Published/touristPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Turistico.findMany({where: {isPublished: true}});
            reply.status(200).send({response, message: "todas as rotas publicadas de touristPoint"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}