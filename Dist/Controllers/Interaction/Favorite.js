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
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesFavorite() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/FavoriteOnOff/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idTouristPoint } = body;
            try {
                if (!idUser || !idTouristPoint) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto turistico não pode ser nulo" });
                }
                ;
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                const hasFavorite = yield prismaClient_1.prismaClient.favoriteTouristPoint.findUnique({ where: { idTouristPoint } });
                if (!idUserExisting || !idTouristPointExisting) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto turistico não foram encontrados no banco de dados" });
                }
                ;
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
                if (hasFavorite.Favorite === false) {
                    yield prismaClient_1.prismaClient.favoriteTouristPoint.update({ where: { idTouristPoint, idUserClient: idUser },
                        data: {
                            Favorite: true
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                yield prismaClient_1.prismaClient.favoriteTouristPoint.update({ where: { idTouristPoint, idUserClient: idUser },
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
        exeServer_1.default.post("/FavoriteOnOff/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idCommercialPoint } = body;
            try {
                if (!idUser || !idCommercialPoint) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto comercial não pode ser nulo" });
                }
                ;
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                const hasFavorite = yield prismaClient_1.prismaClient.favoriteCommercialPoint.findUnique({ where: { idCommercialPoint } });
                if (!idUserExisting || !idCommercialPointExisting) {
                    return reply.status(400).send({ message: "o id do usuario ou do ponto comercial não foram encontrados no banco de dados" });
                }
                ;
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
                if (hasFavorite.Favorite === false) {
                    yield prismaClient_1.prismaClient.favoriteCommercialPoint.update({ where: { idCommercialPoint, idUserClient: idUser },
                        data: {
                            Favorite: true
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                yield prismaClient_1.prismaClient.favoriteCommercialPoint.update({ where: { idCommercialPoint, idUserClient: idUser },
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
        exeServer_1.default.post("/FavoriteOnOff/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idRoadMap } = body;
            try {
                if (!idUser || !idRoadMap) {
                    return reply.status(400).send({ message: "o id do usuario ou do roadMap não pode ser nulo" });
                }
                ;
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idRoadMapPointExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                const hasFavorite = yield prismaClient_1.prismaClient.favoriteRoadMap.findUnique({ where: { idRoadMap } });
                if (!idUserExisting || !idRoadMapPointExisting) {
                    return reply.status(400).send({ message: "o id do usuario ou do roadMap não foram encontrados no banco de dados" });
                }
                ;
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
                if (hasFavorite.Favorite === false) {
                    yield prismaClient_1.prismaClient.favoriteRoadMap.update({ where: { idRoadMap, idUserClient: idUser },
                        data: {
                            Favorite: true
                        }
                    });
                    return reply.status(200).send({ message: "favoritado com sucesso" });
                }
                yield prismaClient_1.prismaClient.favoriteRoadMap.update({ where: { idRoadMap, idUserClient: idUser },
                    data: {
                        Favorite: false
                    }
                });
                return reply.status(200).send({ message: "favoritado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
