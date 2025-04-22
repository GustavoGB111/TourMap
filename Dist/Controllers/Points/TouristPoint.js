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
exports.default = RoutesTouristPoints;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesTouristPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/register/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { id, name, description, creationDateUnformated, local } = body;
            const creationDate = new Date(creationDateUnformated).toISOString().split("T")[0];
            try {
                if (!name || !description || !creationDate || !local) {
                    return reply.status(400).send({ message: "Algum campo não preenchido" });
                }
                ;
                if (!id) {
                    return reply.status(400).send({ message: "id não fornecido" });
                }
                ;
                const localExistingOnDatabase = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { local } });
                const idAdmin = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id } });
                if (!!localExistingOnDatabase) {
                    return reply.status(500).send({ message: "local já existente..." });
                }
                ;
                if (!idAdmin) {
                    return reply.status(400).send({ message: "Você não é admin para adicionar um ponto turistico" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.create({
                    data: {
                        name,
                        description,
                        local,
                        creationDate: creationDateUnformated
                    }
                });
                return reply.status(201).send({ response, message: "Ponto turistico adicionado" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha" });
            }
            ;
        }));
        exeServer_1.default.put("/update/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idTouristPoint, newName, newDescription, newLocal } = body;
            try {
                if (!idUser || !idTouristPoint) {
                    return reply.status(400).send({ message: "id do Ponto Turistico não fornecido" });
                }
                ;
                if (!idUser) {
                    return reply.status(400).send({ message: "id do Usuario não fornecido" });
                }
                if (!newDescription || !newLocal || !newName) {
                    return reply.status(400).send({ message: "algum campo não foi preenchido" });
                }
                ;
                const idUserExisting = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                const localExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { local: newLocal } });
                const { name, description, local } = idTouristPointExisting;
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "ID do ponto turístico não existente" });
                }
                if (!!localExisting) {
                    return reply.status(400).send({ message: "local ja ocupado" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.update({
                    where: { id: idTouristPoint },
                    data: {
                        name: newName !== null && newName !== void 0 ? newName : name,
                        description: newDescription !== null && newDescription !== void 0 ? newDescription : description,
                        local: newLocal !== null && newLocal !== void 0 ? newLocal : local
                    }
                });
                return reply.status(200).send({ response, message: "Atualizado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/post/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idTouristPoint } = body;
            try {
                if (!idTouristPoint || !idUser) {
                    return reply.status(400).send({ message: "campos não preenchidos" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "ID do ponto turístico não existente" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                reply.status(200).send({ response });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/post/list/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { idUser } = request.body;
            try {
                if (!idUser) {
                    reply.status(400).send({ message: "campos não preenchidos" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id: idUser } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findMany();
                reply.status(200).send({ response });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.delete("/delete/list", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idTouristPoint } = body;
            try {
                if (!idUser || !idTouristPoint) {
                    reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "ID do ponto turistico não existente" });
                }
                yield prismaClient_1.prismaClient.ponto_Turistico.delete({ where: { id: idTouristPoint } });
                return reply.status(200).send({ message: "Deletado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/report/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idTouristPoint } = body;
            try {
                if (!idUser || !idTouristPoint) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                ;
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "ID do ponto turistico não existente" });
                }
                ;
                const { reportNumber } = idTouristPointExisting;
                const reportNum = reportNumber + 1;
                yield prismaClient_1.prismaClient.ponto_Turistico.update({ where: { id: idTouristPoint }, data: { reportNumber: reportNum } });
                return reply.status(200).send({ message: "Denunciado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
