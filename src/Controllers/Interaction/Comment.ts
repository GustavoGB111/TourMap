import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient"
import { connect } from "http2";

export default async function RoutesComment() {
    server.post("/create/touristPoint/comment", async (request, reply) => {
        const body = request.body as {content: string; userEmail: string; idTouristPoint: string, idUser: string, datePublish: Date};
        const {content, userEmail, idTouristPoint, idUser, datePublish} = body;

        try {
            if (!content || !userEmail || !idTouristPoint || !idUser || !datePublish)  {
                return reply.status(400).send({message: "algum campo não foi preenchido"});
            };

            const userEmailAndIdExisting = await prismaClient.user_Client.findUnique({where: {email: userEmail, id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            
            if(!userEmailAndIdExisting) {
                return reply.status(400).send({message: "o email ou id não existe no banco de dados"});
            };
            if(!idTouristPointExisting) {
                return reply.status(400).send({message: "o ponto turistico não existe no banco de dados"});
            };

            await prismaClient.commentTouristPoint.create({
                data: {
                    content,
                    dataPublication: datePublish,
                    userClientByClientEmail: {connect: {email: userEmail}},
                    userClientByClientId: {connect: {id: idUser}},
                    userTouristPointByTouristPointId: {connect: {id: idTouristPoint}}
                    }
            });

            return reply.status(201).send({message: "Comentario publicado com sucesso"})
            
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/create/commercialPoint/comment", async (request, reply) => {
        const body = request.body as {content: string; userEmail: string; idCommercialPoint: string, idUser: string, datePublish: Date};
        const {content, userEmail, idCommercialPoint, idUser, datePublish} = body;

        try {
            if (!content || !userEmail || !idCommercialPoint || !idUser || !datePublish)  {
                return reply.status(400).send({message: "algum campo não foi preenchido"});
            };

            const userEmailAndIdExisting = await prismaClient.user_Client.findUnique({where: {email: userEmail, id: idUser}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});
            
            if(!userEmailAndIdExisting) {
                return reply.status(400).send({message: "o email ou id não existe no banco de dados"});
            };
            if(!idCommercialPointExisting) {
                return reply.status(400).send({message: "o ponto comercial não existe no banco de dados"});
            };

            await prismaClient.commentCommercialPoint.create({
                data: {
                    content,
                    dataPublication: datePublish,
                    userClientByClientEmail: {connect: {email: userEmail}},
                    userClientByClientId: {connect: {id: idUser}},
                    userCommercialPointByCommercialPointId: {connect: {id: idCommercialPoint}}
                    }
            });

            return reply.status(201).send({message: "Comentario publicado com sucesso"});
            
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }   
    });

    server.post("/create/roadMap/comment", async (request, reply) => {
        const body = request.body as {content: string; userEmail: string; idRoadMap: string; datePublish: Date; idUser: string};
        const {content, userEmail, idRoadMap, datePublish, idUser} = body;

try {
            if (!content || !userEmail || !idRoadMap || !idUser || !datePublish) {
                return reply.status(400).send({message: "algum campo não foi preenchido"});
            };

            const userEmailAndIdExisting = await prismaClient.user_Client.findUnique({where: {email: userEmail, id: idUser}});
            const idRoadMapExisting = await prismaClient.imageRoadMap.findUnique({where: {id: idRoadMap}});
            
            if(!userEmailAndIdExisting) {
                return reply.status(400).send({message: "o email ou id não existe no banco de dados"});
            };
            if(!idRoadMapExisting) {
                return reply.status(400).send({message: "o roadMap não existe no banco de dados"});
            };

            await prismaClient.commentRoadMap.create({
                data: {
                    content,
                    dataPublication: datePublish,
                    userClientByClientEmail: {connect: {email: userEmail}},
                    userClientByClientId: {connect: {id: idUser}},
                    userRoadMapByRoadMapId: {connect: {id: idRoadMap}}
                    }
            });

            return reply.status(201).send({message: "Comentario publicado com sucesso"});
            
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }   
    });

    server.post("/get/touristPoint/comment", async (request, reply) => {
        const body = request.body as {idTouristPoint: string}
        const {idTouristPoint} = body

        try {
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            if (!idTouristPointExisting) {
                return reply.status(400).send({message: "o id não existe no banco de dados"});
            }

            const response = await prismaClient.commentTouristPoint.findMany({where: {idTouristPoint}})

             return reply.status(200).send({response, message: "Todos os comentarios de um certo ponto turistico"});

        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/commercialPoint/comment", async (request, reply) => {
        const body = request.body as {idCommercialPoint: string}
        const {idCommercialPoint} = body

        try {
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});

            if (!idCommercialPointExisting) {
                return reply.status(400).send({message: "o id não existe no banco de dados"});
            }

            const response = await prismaClient.commentCommercialPoint.findMany({where: {idCommercialPoint}})

             return reply.status(200).send({response, message: "Todos os comentarios de um certo ponto comercial"});

        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/roadMap/comment", async (request, reply) => {
        const body = request.body as {idRoadmap: string}
        const {idRoadmap} = body

                try {
            const idRoadMapExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadmap}});

            if (!idRoadMapExisting) {
                return reply.status(400).send({message: "o id não existe no banco de dados"});
            }

            const response = await prismaClient.commentRoadMap.findMany({where: {idTravelRoadMap: idRoadmap}})

             return reply.status(200).send({response, message: "Todos os comentarios de um certo roadMap"});

        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}