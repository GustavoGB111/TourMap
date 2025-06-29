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
exports.default = RoutesCommercialPoint;
const prismaClient_1 = require("../../Database/prismaClient");
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
function RoutesCommercialPoint() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/register/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, name, local, description, creationDate } = body;
            try {
                if (!name || !local || !description || !creationDate) {
                    return reply.status(400).send({ message: "Campos inválidos" });
                }
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                const businessIdExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                const localExistingTourist = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { local } });
                const localExistingCommercial = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { local } });
                if (!businessIdExisting) {
                    return reply.status(400).send({ message: "id da Empresa não existente" });
                }
                if (!!localExistingCommercial || !!localExistingTourist) {
                    return reply.status(400).send({ message: "local já ocupado" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.create({
                    data: {
                        name,
                        local,
                        description,
                        creationDate,
                        User_Business: {
                            connect: { id: idBusiness }
                        }
                    }
                });
                return reply.status(201).send({ response, message: "ponto turistico criado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/update/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, idPoint, newName, newLocal, newDescription } = body;
            try {
                if (!newName || !newLocal || !newDescription) {
                    return reply.status(400).send({ message: "Campos inválidos" });
                }
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                if (!idPoint) {
                    return reply.status(400).send({ message: "id do Ponto Comercial não fornecido" });
                }
                const idBusinessExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                const idPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                const localExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { local: newLocal } });
                if (!idBusinessExisting) {
                    return reply.status(400).send({ message: "id da Empresa não existe" });
                }
                if (!idPointExisting) {
                    return reply.status(400).send({ message: "id do ponto comercial não existe" });
                }
                const { name, description, local, businessId } = idPointExisting;
                if (businessId != idBusiness) {
                    return reply.status(400).send({ message: "Você não é a empresa responsavel pelo ponto turistico..." });
                }
                if (!!localExisting) {
                    return reply.status(400).send({ message: "local já ocupado" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.update({ where: { id: idPoint },
                    data: {
                        name: newName !== null && newName !== void 0 ? newName : name,
                        description: newDescription !== null && newDescription !== void 0 ? newDescription : description,
                        local: newLocal !== null && newLocal !== void 0 ? newLocal : local
                    }
                });
                return reply.status(200).send({ response, message: "atualizado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, idPoint } = body;
            try {
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                if (!idPoint) {
                    return reply.status(400).send({ message: "id do Ponto Comercial não fornecido" });
                }
                const idBusinessExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                const idPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                if (!idBusinessExisting) {
                    return reply.status(400).send({ message: "id da Empresa não existe" });
                }
                if (!idPointExisting) {
                    return reply.status(400).send({ message: "id do ponto comercial não existe" });
                }
                const { businessId } = idPointExisting;
                if (businessId != idBusiness) {
                    return reply.status(400).send({ message: "Você não é a empresa responsavel pelo ponto turistico..." });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                reply.status(200).send({ response, message: "dados do ponto comercial" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/list/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness } = body;
            try {
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                const idBusinessExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                if (!idBusinessExisting) {
                    return reply.status(400).send({ message: "id da Empresa não existe" });
                }
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findMany({ where: { businessId: idBusiness } });
                reply.status(200).send({ response, message: "dados dos pontos comerciais da empresa" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.delete("/delete/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, idPoint } = body;
            try {
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                if (!idPoint) {
                    return reply.status(400).send({ message: "id do Ponto Comercial não fornecido" });
                }
                const idBusinessExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                const idPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                if (!idBusinessExisting) {
                    return reply.status(400).send({ message: "id da Empresa não existe" });
                }
                if (!idPointExisting) {
                    return reply.status(400).send({ message: "id do ponto comercial não existe" });
                }
                const { businessId } = idPointExisting;
                if (businessId != idBusiness) {
                    return reply.status(400).send({ message: "Você não é a empresa responsavel pelo ponto turistico..." });
                }
                yield prismaClient_1.prismaClient.ponto_Comercial.delete({ where: { id: idPoint } });
                return reply.status(400).send({ message: "ponto turistico removido com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
