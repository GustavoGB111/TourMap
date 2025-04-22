import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";
import { request } from "http";

export default async function RoutesTouristPoints() {
    server.post("/register/touristPoint", async (request, reply) => {
        const body = request.body as { id: string;name: string; description: string; creationDateUnformated: Date; local: string};
        const {id, name, description, creationDateUnformated, local} = body;      
        
        const creationDate = new Date(creationDateUnformated).toISOString().split("T")[0];
        
        try {
            if (!name || !description || !creationDate || !local) {
                return reply.status(400).send({message: "Algum campo não preenchido"});
            };
            if (!id) {
                return reply.status(400).send({message: "id não fornecido"});
            };

            const localExistingOnDatabase = await prismaClient.ponto_Turistico.findUnique({where: {local}});
            const idAdmin = await prismaClient.user_Admin.findUnique({where: {id}});

            if (!!localExistingOnDatabase) {
                return reply.status(500).send({message: "local já existente..."});
            };
            if (!idAdmin) {
                return reply.status(400).send({message: "Você não é admin para adicionar um ponto turistico"})
            } 
            const response = await prismaClient.ponto_Turistico.create({
                data: {
                    name,
                    description,
                    local,
                    creationDate: creationDateUnformated
                }
            });
            return reply.status(201).send({response ,message: "Ponto turistico adicionado"})
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha"});
        };
    });

    server.put("/update/touristPoint", async (request, reply) => {
        const body = request.body as { idUser: string; idTouristPoint: string; newName?:string; newDescription?: string; newLocal?: string}
        const {idUser, idTouristPoint, newName, newDescription, newLocal} = body

        try {
            if (!idUser || !idTouristPoint) {
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

    server.post("/post/touristPoint", async (request, reply) => {
        const body = request.body as {idUser: string; idTouristPoint: string};
        const {idUser, idTouristPoint} = body;

        try {
            if (!idTouristPoint || !idUser) {
                return reply.status(400).send({message: "campos não preenchidos"});
            }

            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            
            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            }
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turístico não existente" });
            }
            
            const response = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            reply.status(200).send({response})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/post/list/touristPoint", async (request, reply) => {
        const {idUser} = request.body as {idUser: string};

        try {
            if (!idUser) {
                reply.status(400).send({message: "campos não preenchidos"});
            }

            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            }
           
            const response = await prismaClient.ponto_Turistico.findMany();
            reply.status(200).send({response})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.delete("/delete/list", async (request, reply) => {
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
        const body = request.body as {idUser: string; idTouristPoint: string};
        const {idUser, idTouristPoint} = body

        try {
            if (!idUser || !idTouristPoint)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}}) as {reportNumber: number};

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };

            const {reportNumber} = idTouristPointExisting;
            const reportNum = reportNumber + 1;
            await prismaClient.ponto_Turistico.update({where: {id: idTouristPoint}, data: {reportNumber: reportNum}})
            return reply.status(200).send({ message: "Denunciado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}