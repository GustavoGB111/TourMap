import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient";
import { connect } from "http2";
import { request } from "http";

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
                return reply.status(500).send("roadMap não existe");
            };

            const idCreatorExisting = await prismaClient.travel_Road_Map.findUnique({where: {idCreator, id}});

            if(!idCreatorExisting) {
                return reply.status(500).send("Erro na consulta do banco de dados referente ao idCreator");
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
                return reply.status(500).send("roadMap não existe");
            };

            const idCreatorExisting = await prismaClient.travel_Road_Map.findUnique({where: {idCreator, id}});

            if(!idCreatorExisting) {
                return reply.status(500).send("Erro na consulta do banco de dados referente ao idCreator");
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

    });

    server.post("/delete/point/roadMap", async (request, reply) => { 

    });

    server.post("/get/roadMap", async (request, reply) => {

    });

    server.post("/get/list/roadMap", async (request, reply) => {

    });

    
}