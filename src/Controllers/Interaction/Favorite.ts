import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient"
import { connect } from "http2";

export default async function RoutesFavorite() {
    server.post("/FavoriteOnOff/touristPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idTouristPoint: string};
        const {idUser, idTouristPoint} = body;
        
        try {
            if (!idUser || !idTouristPoint) {
                return reply.status(400).send({message: "o id do usuario ou do ponto turistico não pode ser nulo"});
            };

            const idUserExisting = await prismaClient.user_Client.findUnique({where:{id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            const hasFavorite = await prismaClient.favoriteTouristPoint.findUnique({where: {idTouristPoint}});

            if (!idUserExisting || !idTouristPointExisting) {
                return reply.status(400).send({message: "o id do usuario ou do ponto turistico não foram encontrados no banco de dados"});
            };

            if (!hasFavorite) {
                await prismaClient.favoriteTouristPoint.create({
                    data: {
                        Favorite: true,
                        userClientByClientId: {connect: {id: idUser}},
                        userTouristPointByTouristPointId: {connect: {id: idTouristPoint}}
                    }
                });

                return reply.status(200).send({message: "favoritado com sucesso"});
            };

            if (hasFavorite.Favorite === false){
                await prismaClient.favoriteTouristPoint.update({where: {idTouristPoint, idUserClient: idUser},
                data: {
                    Favorite: true
                }
                });
                return reply.status(200).send({message: "favoritado com sucesso"});
            }

            await prismaClient.favoriteTouristPoint.update({where: {idTouristPoint, idUserClient: idUser},
                data: {
                    Favorite: false
                }
            });

            reply.status(200).send({message: "desfavoritado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/FavoriteOnOff/commercialPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idCommercialPoint: string};
        const {idUser, idCommercialPoint} = body;

        try {
            if (!idUser || !idCommercialPoint) {
                return reply.status(400).send({message: "o id do usuario ou do ponto comercial não pode ser nulo"});
            };

            const idUserExisting = await prismaClient.user_Client.findUnique({where:{id: idUser}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});
            const hasFavorite = await prismaClient.favoriteCommercialPoint.findUnique({where: {idCommercialPoint}});

            if (!idUserExisting || !idCommercialPointExisting) {
                return reply.status(400).send({message: "o id do usuario ou do ponto comercial não foram encontrados no banco de dados"});
            };

            if (!hasFavorite) {
                await prismaClient.favoriteCommercialPoint.create({
                    data: {
                        Favorite: true,
                        userClientByClientId: {connect: {id: idUser}},
                        userCommercialPointByCommercialPointId: {connect: {id: idCommercialPoint}}
                    }
                });

                return reply.status(200).send({message: "favoritado com sucesso"});
            };

            if (hasFavorite.Favorite === false){
                await prismaClient.favoriteCommercialPoint.update({where: {idCommercialPoint, idUserClient: idUser},
                data: {
                    Favorite: true
                }
                });
                return reply.status(200).send({message: "favoritado com sucesso"});
            }

            await prismaClient.favoriteCommercialPoint.update({where: {idCommercialPoint, idUserClient: idUser},
                data: {
                    Favorite: false
                }
            });

            reply.status(200).send({message: "desfavoritado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/FavoriteOnOff/roadMap", async (request, reply) => {
        const body = request.body as {idUser: string, idRoadMap: string};
        const {idUser, idRoadMap} = body;
        
        try {
            if (!idUser || !idRoadMap) {
                return reply.status(400).send({message: "o id do usuario ou do roadMap não pode ser nulo"});
            };

            const idUserExisting = await prismaClient.user_Client.findUnique({where:{id: idUser}});
            const idRoadMapPointExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}});
            const hasFavorite = await prismaClient.favoriteRoadMap.findUnique({where: {idRoadMap}});

            if (!idUserExisting || !idRoadMapPointExisting) {
                return reply.status(400).send({message: "o id do usuario ou do roadMap não foram encontrados no banco de dados"});
            };

            if (!hasFavorite) {
                await prismaClient.favoriteRoadMap.create({
                    data: {
                        Favorite: true,
                        userClientByClientId: {connect: {id: idUser}},
                        userRoadMapPointByRoadMapId: {connect: {id: idRoadMap}}
                    }
                });

                return reply.status(200).send({message: "favoritado com sucesso"});
            };

            if (hasFavorite.Favorite === false){
                await prismaClient.favoriteRoadMap.update({where: {idRoadMap, idUserClient: idUser},
                data: {
                    Favorite: true
                }
                });
                return reply.status(200).send({message: "favoritado com sucesso"});
            }

            await prismaClient.favoriteRoadMap.update({where: {idRoadMap, idUserClient: idUser},
            data: {
                Favorite: false
            }
            });

            return reply.status(200).send({message: "favoritado com sucesso"});
     
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }

    });
}   