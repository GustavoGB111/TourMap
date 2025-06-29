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
            const { id, name, description, creationDate, local } = body;
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
                        creationDate
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
                if (!idTouristPoint) {
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
        exeServer_1.default.post("/get/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint } = body;
            try {
                if (!idTouristPoint) {
                    return reply.status(400).send({ message: "campos não preenchidos" });
                }
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
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
        exeServer_1.default.get("/get/list/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findMany();
                reply.status(200).send({ response, message: "Todos os registros de Pontos Turisticos" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.delete("/delete/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
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
            const { idUser, idTouristPoint, contentReport } = body;
            try {
                if (!idUser || !idTouristPoint || !contentReport) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                const reportExisting = yield prismaClient_1.prismaClient.reportTouristPoint.findUnique({ where: { idUserReport: idUser, idTouristPoint } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                ;
                if (!idTouristPointExisting) {
                    return reply.status(400).send({ message: "ID do ponto turistico não existente" });
                }
                ;
                if (!!reportExisting) {
                    return reply.status(400).send({ message: "você já denunciou esse ponto turistico" });
                }
                const { reportNumber } = idTouristPointExisting;
                const reportNum = reportNumber + 1;
                yield prismaClient_1.prismaClient.ponto_Turistico.update({ where: { id: idTouristPoint }, data: { reportNumber: reportNum } });
                yield prismaClient_1.prismaClient.reportTouristPoint.create({
                    data: {
                        content: contentReport,
                        userReportTouristPointByIdTouristPoint: { connect: { id: idTouristPoint } },
                        userReportTouristPointByIdUserReport: { connect: { id: idUser } }
                    }
                });
                return reply.status(200).send({ message: "Denunciado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/create/image/TouristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idTouristPoint, ImageUrl } = body;
            try {
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
                if (!ImageUrl) {
                    return reply.status(400).send({ message: "a url não pode ser vazia" });
                }
                ;
                yield prismaClient_1.prismaClient.imageTouristPoint.create({
                    data: {
                        image: ImageUrl,
                        userTouristPointByTouristPointId: { connect: { id: idTouristPoint } }
                    }
                });
                return reply.status(200).send({ message: "imagem adicionada com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/image/list/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint } = body;
            try {
                const response = yield prismaClient_1.prismaClient.imageTouristPoint.findMany({ where: { idTouristPoint } });
                return reply.status(200).send({ response, message: "Lista de imagens de um certo ponto turistico" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
            ;
        }));
        exeServer_1.default.delete("/delete/image/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint, imageUrl, idUser } = body;
            try {
                if (!idUser || !idTouristPoint || !imageUrl) {
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
                const imageUrlExisting = yield prismaClient_1.prismaClient.imageTouristPoint.findUnique({ where: { idTouristPoint, image: imageUrl } });
                if (!imageUrlExisting) {
                    return reply.status(400).send({ message: "imagem não existente" });
                }
                ;
                yield prismaClient_1.prismaClient.imageTouristPoint.delete({ where: { idTouristPoint, image: imageUrl } });
                return reply.status(200).send({ message: "imagem excluida com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/publishOnOff/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint, idUser } = body;
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
                if (idTouristPointExisting.isPublished == true) {
                    yield prismaClient_1.prismaClient.ponto_Turistico.update({ where: { id: idTouristPoint },
                        data: {
                            isPublished: false
                        }
                    });
                    yield prismaClient_1.prismaClient.notificationTouristPoint.delete({ where: { idTouristPoint } });
                    return reply.status(200).send({ message: "ponto turistico retirado de publicado com sucesso" });
                }
                yield prismaClient_1.prismaClient.ponto_Turistico.update({ where: { id: idTouristPoint },
                    data: {
                        isPublished: true
                    }
                });
                yield prismaClient_1.prismaClient.notificationTouristPoint.create({
                    data: {
                        userNotificationTouristPointByIdClient: { connect: { id: idUser } },
                        userNotificationTouristPointByIdTouristPoint: { connect: { id: idTouristPoint } }
                    }
                });
                return reply.status(200).send({ message: "ponto turistico publicado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.get("/get/threeOrMoreReports/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findMany({ where: { reportNumber: { gte: 3 } } });
                return reply.status(200).send({ response, message: "pontos turisticos com mais de 3 denuncias" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
