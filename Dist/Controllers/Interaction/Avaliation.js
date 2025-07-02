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
exports.default = RoutesAvaliation;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesAvaliation() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/create/avaliation/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { avaliation, dataPublication, userEmail, userId, idTouristPoint } = body;
            try {
                if (!avaliation || !dataPublication || !userEmail || !userId || !idTouristPoint) {
                    return reply.status(500).send({ message: "algum campo inválido" });
                }
                const userIdExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: userId } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                if (!userIdExisting) {
                    return reply.status(500).send({ message: "o usuario não existe no banco de dados" });
                }
                ;
                if (userEmail != userIdExisting.email) {
                    return reply.status(400).send({ message: "o email não é igual ao do usuario" });
                }
                ;
                if (!idTouristPointExisting) {
                    return reply.status(500).send({ message: "o ponto turistico não foi encontrado no banco de dados" });
                }
                ;
                yield prismaClient_1.prismaClient.avaliationTouristPoint.create({
                    data: {
                        dataPublication,
                        avaliation,
                        userClientByEmail: { connect: { email: userEmail } },
                        userTouristPointByIdTouristPoint: { connect: { id: idTouristPoint } },
                        userClientByIdClient: { connect: { id: userId } }
                    }
                });
                return reply.status(201).send({ message: "avaliação foi criado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/create/avaliation/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { avaliation, dataPublication, userEmail, userId, idCommercialPoint } = body;
            try {
                if (!avaliation || !dataPublication || !userEmail || !userId || !idCommercialPoint) {
                    return reply.status(500).send({ message: "algum campo inválido" });
                }
                ;
                const userIdExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: userId } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                if (!userIdExisting) {
                    return reply.status(500).send({ message: "o usuario não existe no banco de dados" });
                }
                ;
                if (userEmail != userIdExisting.email) {
                    return reply.status(400).send({ message: "o email não é igual ao do usuario" });
                }
                ;
                if (!idCommercialPointExisting) {
                    return reply.status(500).send({ message: "o ponto comercial não foi encontrado no banco de dados" });
                }
                ;
                yield prismaClient_1.prismaClient.avaliationCommercialPoint.create({
                    data: {
                        dataPublication,
                        avaliation,
                        userClientByEmailClient: { connect: { email: userEmail } },
                        userCommercialPointByIdCommercialPoint: { connect: { id: idCommercialPoint } },
                        userClientByIdClient: { connect: { id: userId } }
                    }
                });
                return reply.status(201).send({ message: "avaliação foi criado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/avaliation/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint } = body;
            try {
                const idTouristPointExisting = prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                if (!idTouristPointExisting) {
                    return reply.status(500).send({ message: "id não encontrado no banco de dados" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.avaliationTouristPoint.findMany({ where: { id: idTouristPoint } });
                const avaliations = response.map(({ avaliation }) => avaliation);
                const average = avaliations.reduce((sum, value) => sum + value, 0) / avaliations.length;
                return reply.status(400).send({ average, message: "A media das Avaliações" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/avaliation/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCommercialPoint } = body;
            try {
                const idCommercialPointExisting = prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                if (!idCommercialPointExisting) {
                    return reply.status(500).send({ message: "id não encontrado no banco de dados" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.avaliationCommercialPoint.findMany({ where: { id: idCommercialPoint } });
                const avaliations = response.map(({ avaliation }) => avaliation);
                const average = avaliations.reduce((sum, value) => sum + value, 0) / avaliations.length;
                return reply.status(400).send({ average, message: "A media das Avaliações" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
