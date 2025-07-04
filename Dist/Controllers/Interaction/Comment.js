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
exports.default = RoutesComment;
// Importa o servidor Fastify já configurado
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
// Importa o cliente do Prisma para realizar operações no banco de dados
const prismaClient_1 = require("../../Database/prismaClient");
// Função que define todas as rotas relacionadas a comentários
function RoutesComment() {
    return __awaiter(this, void 0, void 0, function* () {
        // Rota para criar comentário em um ponto turístico
        exeServer_1.default.post("/create/touristPoint/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            // Extrai os campos do corpo da requisição
            const body = request.body;
            const { content, userEmail, idTouristPoint, idUser, datePublishNotFormatted } = body;
            try {
                const datePublish = new Date(body.datePublishNotFormatted);
                // Verifica se todos os campos obrigatórios estão preenchidos
                if (!content || !userEmail || !idTouristPoint || !idUser || !datePublish) {
                    return reply.status(400).send({ message: "algum campo não foi preenchido" });
                }
                ;
                // Verifica se o usuário com email e id existe
                const userIdExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                // Verifica se o ponto turístico existe
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                // Retorna erro caso usuário ou ponto não existam
                if (!userIdExisting) {
                    return reply.status(400).send({ message: "o id não existe no banco de dados" });
                }
                ;
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "o ponto turistico não existe no banco de dados" });
                }
                ;
                // Cria o comentário no banco
                yield prismaClient_1.prismaClient.commentTouristPoint.create({
                    data: {
                        content,
                        dataPublication: datePublish,
                        userClientByClientEmail: { connect: { email: userEmail } },
                        userClientByClientId: { connect: { id: idUser } },
                        userTouristPointByTouristPointId: { connect: { id: idTouristPoint } }
                    }
                });
                return reply.status(201).send({ message: "Comentario publicado com sucesso" });
            }
            catch (error) {
                // Tratamento de erro
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para criar comentário em um ponto comercial
        exeServer_1.default.post("/create/commercialPoint/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { content, userEmail, idCommercialPoint, idUser, datePublishNotFormatted } = body;
            try {
                const datePublish = new Date(body.datePublishNotFormatted);
                if (!content || !userEmail || !idCommercialPoint || !idUser || !datePublish) {
                    return reply.status(400).send({ message: "algum campo não foi preenchido" });
                }
                ;
                const userIdExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                if (!userIdExisting) {
                    return reply.status(400).send({ message: "o id não existe no banco de dados" });
                }
                ;
                if (!idCommercialPointExisting) {
                    return reply.status(400).send({ message: "o ponto comercial não existe no banco de dados" });
                }
                ;
                yield prismaClient_1.prismaClient.commentCommercialPoint.create({
                    data: {
                        content,
                        dataPublication: datePublish,
                        userClientByClientEmail: { connect: { email: userEmail } },
                        userClientByClientId: { connect: { id: idUser } },
                        userCommercialPointByCommercialPointId: { connect: { id: idCommercialPoint } }
                    }
                });
                return reply.status(201).send({ message: "Comentario publicado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para criar comentário em um roadmap
        exeServer_1.default.post("/create/roadMap/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { content, userEmail, idRoadMap, datePublishNotFormatted, idUser } = body;
            try {
                const datePublish = new Date(body.datePublishNotFormatted);
                if (!content || !userEmail || !idRoadMap || !idUser || !datePublish) {
                    return reply.status(400).send({ message: "algum campo não foi preenchido" });
                }
                ;
                const userIdExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idRoadMapExisting = yield prismaClient_1.prismaClient.imageRoadMap.findUnique({ where: { id: idRoadMap } });
                if (!userIdExisting) {
                    return reply.status(400).send({ message: "o id não existe no banco de dados" });
                }
                ;
                if (!idRoadMapExisting) {
                    return reply.status(400).send({ message: "o roadMap não existe no banco de dados" });
                }
                ;
                yield prismaClient_1.prismaClient.commentRoadMap.create({
                    data: {
                        content,
                        dataPublication: datePublish,
                        userClientByClientEmail: { connect: { email: userEmail } },
                        userClientByClientId: { connect: { id: idUser } },
                        userRoadMapByRoadMapId: { connect: { id: idRoadMap } }
                    }
                });
                return reply.status(201).send({ message: "Comentario publicado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para obter todos os comentários de um ponto turístico
        exeServer_1.default.post("/get/touristPoint/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint } = body;
            try {
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "o id não existe no banco de dados" });
                }
                const response = yield prismaClient_1.prismaClient.commentTouristPoint.findMany({ where: { idTouristPoint } });
                return reply.status(200).send({ response, message: "Todos os comentarios de um certo ponto turistico" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para obter todos os comentários de um ponto comercial
        exeServer_1.default.post("/get/commercialPoint/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCommercialPoint } = body;
            try {
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                if (!idCommercialPointExisting) {
                    return reply.status(400).send({ message: "o id não existe no banco de dados" });
                }
                const response = yield prismaClient_1.prismaClient.commentCommercialPoint.findMany({ where: { idCommercialPoint } });
                return reply.status(200).send({ response, message: "Todos os comentarios de um certo ponto comercial" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para obter todos os comentários de um roadmap
        exeServer_1.default.post("/get/roadMap/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idRoadmap } = body;
            try {
                const idRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadmap } });
                if (!idRoadMapExisting) {
                    return reply.status(400).send({ message: "o id não existe no banco de dados" });
                }
                const response = yield prismaClient_1.prismaClient.commentRoadMap.findMany({ where: { idTravelRoadMap: idRoadmap } });
                return reply.status(200).send({ response, message: "Todos os comentarios de um certo roadMap" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
