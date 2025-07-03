// Importa o servidor configurado
import server from "../../Test/exeServer";

// Importa o cliente do Prisma para interação com o banco de dados
import {prismaClient} from "../../Database/prismaClient"

// Importa conexão http2 (nesse caso não é usada, pode ser removida)
import { connect } from "http2";

// Função principal que define as rotas relacionadas aos favoritos
export default async function RoutesFavorite() {

    // Rota para favoritar ou desfavoritar um ponto turístico
    server.post("/FavoriteOnOff/touristPoint", async (request, reply) => {
        // Extrai os dados da requisição
        const body = request.body as {idUser: string, idTouristPoint: string};
        const {idUser, idTouristPoint} = body;
        
        try {
            // Valida se os campos foram fornecidos
            if (!idUser || !idTouristPoint) {
                return reply.status(400).send({message: "o id do usuario ou do ponto turistico não pode ser nulo"});
            };

            // Verifica existência do usuário e do ponto turístico no banco
            const idUserExisting = await prismaClient.user_Client.findUnique({where:{id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            // Verifica se já existe um favorito associado
            const hasFavorite = await prismaClient.favoriteTouristPoint.findUnique({where: {idTouristPoint}});

            // Retorna erro se não encontrar os dados no banco
            if (!idUserExisting || !idTouristPointExisting) {
                return reply.status(400).send({message: "o id do usuario ou do ponto turistico não foram encontrados no banco de dados"});
            };

            // Se ainda não existe o registro de favorito, cria como favorito
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

            // Se já existe mas está desfavoritado, atualiza para favoritado
            if (hasFavorite.Favorite === false){
                await prismaClient.favoriteTouristPoint.update({
                    where: {idTouristPoint, idUserClient: idUser},
                    data: {
                        Favorite: true
                    }
                });
                return reply.status(200).send({message: "favoritado com sucesso"});
            }

            // Se já está favoritado, desfavorita
            await prismaClient.favoriteTouristPoint.update({
                where: {idTouristPoint, idUserClient: idUser},
                data: {
                    Favorite: false
                }
            });

            reply.status(200).send({message: "desfavoritado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota para favoritar ou desfavoritar um ponto comercial
    server.post("/FavoriteOnOff/commercialPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idCommercialPoint: string};
        const {idUser, idCommercialPoint} = body;

        try {
            // Verificação de campos obrigatórios
            if (!idUser || !idCommercialPoint) {
                return reply.status(400).send({message: "o id do usuario ou do ponto comercial não pode ser nulo"});
            };

            // Verifica se usuário e ponto comercial existem
            const idUserExisting = await prismaClient.user_Client.findUnique({where:{id: idUser}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});
            const hasFavorite = await prismaClient.favoriteCommercialPoint.findUnique({where: {idCommercialPoint}});

            if (!idUserExisting || !idCommercialPointExisting) {
                return reply.status(400).send({message: "o id do usuario ou do ponto comercial não foram encontrados no banco de dados"});
            };

            // Cria favorito se ainda não existir
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

            // Atualiza para favorito se estava desfavoritado
            if (hasFavorite.Favorite === false){
                await prismaClient.favoriteCommercialPoint.update({
                    where: {idCommercialPoint, idUserClient: idUser},
                    data: {
                        Favorite: true
                    }
                });
                return reply.status(200).send({message: "favoritado com sucesso"});
            }

            // Caso já esteja favoritado, desfavorita
            await prismaClient.favoriteCommercialPoint.update({
                where: {idCommercialPoint, idUserClient: idUser},
                data: {
                    Favorite: false
                }
            });

            reply.status(200).send({message: "desfavoritado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota para favoritar ou desfavoritar um roadMap
    server.post("/FavoriteOnOff/roadMap", async (request, reply) => {
        const body = request.body as {idUser: string, idRoadMap: string};
        const {idUser, idRoadMap} = body;
        
        try {
            // Verifica se os dados foram preenchidos
            if (!idUser || !idRoadMap) {
                return reply.status(400).send({message: "o id do usuario ou do roadMap não pode ser nulo"});
            };

            // Verifica se o usuário e o roadmap existem
            const idUserExisting = await prismaClient.user_Client.findUnique({where:{id: idUser}});
            const idRoadMapPointExisting = await prismaClient.travel_Road_Map.findUnique({where: {id: idRoadMap}});
            const hasFavorite = await prismaClient.favoriteRoadMap.findUnique({where: {idRoadMap}});

            if (!idUserExisting || !idRoadMapPointExisting) {
                return reply.status(400).send({message: "o id do usuario ou do roadMap não foram encontrados no banco de dados"});
            };

            // Se não existe, cria como favorito
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

            // Se estava desfavoritado, atualiza para favoritado
            if (hasFavorite.Favorite === false){
                await prismaClient.favoriteRoadMap.update({
                    where: {idRoadMap, idUserClient: idUser},
                    data: {
                        Favorite: true
                    }
                });
                return reply.status(200).send({message: "favoritado com sucesso"});
            }

            // Se já está favoritado, desfavorita
            await prismaClient.favoriteRoadMap.update({
                where: {idRoadMap, idUserClient: idUser},
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
