"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoutesFavorite;
// Importa o servidor configurado
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
// Importa o cliente do Prisma para interação com o banco de dados
const prismaClient_1 = require("../../Database/prismaClient");
// Função principal que define as rotas relacionadas aos favoritos
function RoutesFavorite() {
    return __awaiter(this, void 0, void 0, function* () {
        // Rota para favoritar ou desfavoritar um ponto turístico
        exeServer_1.default.post("/FavoriteOnOff/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            // Extrai os dados da requisição
            const body = request.body;
            const { idUser, idTouristPoint } = body;
            try {
                // Valida se os campos foram fornecidos
                if (!idUser || !idTouristPoint) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto turistico não pode ser nulo" });
                }
                ;
                // Verifica existência do usuário e do ponto turístico no banco
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                // Verifica se já existe um favorito associado
                const hasFavorite = yield prismaClient_1.prismaClient.favoriteTouristPoint.findUnique({ where: { idTouristPoint, idUserClient: idUser } });
                // Retorna erro se não encontrar os dados no banco
                if (!idUserExisting || !idTouristPointExisting) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto turistico não foram encontrados no banco de dados" });
                }
                ;
                // Se ainda não existe o registro de favorito, cria como favorito
                if (!hasFavorite) {
                    yield prismaClient_1.prismaClient.favoriteTouristPoint.create({
                        data: {
                            Favorite: true,
                            userClientByClientId: { connect: { id: idUser } },
                            userTouristPointByTouristPointId: { connect: { id: idTouristPoint } }
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                ;
                // Se já existe mas está desfavoritado, atualiza para favoritado
                if (hasFavorite.Favorite === false) {
                    yield prismaClient_1.prismaClient.favoriteTouristPoint.update({
                        where: { idTouristPoint, idUserClient: idUser },
                        data: {
                            Favorite: true
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                // Se já está favoritado, desfavorita
                yield prismaClient_1.prismaClient.favoriteTouristPoint.update({
                    where: { idTouristPoint, idUserClient: idUser },
                    data: {
                        Favorite: false
                    }
                });
                reply.status(200).send({ message: "desfavoritado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para favoritar ou desfavoritar um ponto comercial
        exeServer_1.default.post("/FavoriteOnOff/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idCommercialPoint } = body;
            try {
                // Verificação de campos obrigatórios
                if (!idUser || !idCommercialPoint) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto comercial não pode ser nulo" });
                }
                ;
                // Verifica se usuário e ponto comercial existem
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                const hasFavorite = yield prismaClient_1.prismaClient.favoriteCommercialPoint.findUnique({ where: { idCommercialPoint } });
                if (!idUserExisting || !idCommercialPointExisting) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto comercial não foram encontrados no banco de dados" });
                }
                ;
                // Cria favorito se ainda não existir
                if (!hasFavorite) {
                    yield prismaClient_1.prismaClient.favoriteCommercialPoint.create({
                        data: {
                            Favorite: true,
                            userClientByClientId: { connect: { id: idUser } },
                            userCommercialPointByCommercialPointId: { connect: { id: idCommercialPoint } }
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                ;
                // Atualiza para favorito se estava desfavoritado
                if (hasFavorite.Favorite === false) {
                    yield prismaClient_1.prismaClient.favoriteCommercialPoint.update({
                        where: { idCommercialPoint, idUserClient: idUser },
                        data: {
                            Favorite: true
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                // Caso já esteja favoritado, desfavorita
                yield prismaClient_1.prismaClient.favoriteCommercialPoint.update({
                    where: { idCommercialPoint, idUserClient: idUser },
                    data: {
                        Favorite: false
                    }
                });
                reply.status(200).send({ message: "desfavoritado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para favoritar ou desfavoritar um roadMap
        exeServer_1.default.post("/FavoriteOnOff/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idRoadMap } = body;
            try {
                // Verifica se os dados foram preenchidos
                if (!idUser || !idRoadMap) {
                    return reply.status(400).send({ message: "o id do usuario ou do roadMap não pode ser nulo" });
                }
                ;
                // Verifica se o usuário e o roadmap existem
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idRoadMapPointExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                const hasFavorite = yield prismaClient_1.prismaClient.favoriteRoadMap.findUnique({ where: { idRoadMap } });
                if (!idUserExisting || !idRoadMapPointExisting) {
                    return reply.status(400).send({ message: "o id do usuario ou do roadMap não foram encontrados no banco de dados" });
                }
                ;
                // Se não existe, cria como favorito
                if (!hasFavorite) {
                    yield prismaClient_1.prismaClient.favoriteRoadMap.create({
                        data: {
                            Favorite: true,
                            userClientByClientId: { connect: { id: idUser } },
                            userRoadMapPointByRoadMapId: { connect: { id: idRoadMap } }
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                ;
                // Se estava desfavoritado, atualiza para favoritado
                if (hasFavorite.Favorite === false) {
                    yield prismaClient_1.prismaClient.favoriteRoadMap.update({
                        where: { idRoadMap, idUserClient: idUser },
                        data: {
                            Favorite: true
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                // Se já está favoritado, desfavorita
                yield prismaClient_1.prismaClient.favoriteRoadMap.update({
                    where: { idRoadMap, idUserClient: idUser },
                    data: {
                        Favorite: false
                    }
                });
                return reply.status(200).send({ message: "desfavoritado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
