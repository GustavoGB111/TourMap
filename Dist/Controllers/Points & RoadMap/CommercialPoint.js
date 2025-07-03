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
// Função principal que define as rotas relacionadas ao ponto comercial
function RoutesCommercialPoint() {
    return __awaiter(this, void 0, void 0, function* () {
        // Rota para registrar um novo ponto comercial
        exeServer_1.default.post("/register/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, name, local, description, creationDate } = body;
            try {
                // Verifica se os campos obrigatórios foram fornecidos
                if (!name || !local || !description || !creationDate) {
                    return reply.status(400).send({ message: "Campos inválidos" });
                }
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                // Verifica se o ID da empresa existe e se o local já está ocupado
                const businessIdExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                const localExistingTourist = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { local } });
                const localExistingCommercial = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { local } });
                if (!businessIdExisting) {
                    return reply.status(400).send({ message: "id da Empresa não existente" });
                }
                if (!!localExistingCommercial || !!localExistingTourist) {
                    return reply.status(400).send({ message: "local já ocupado" });
                }
                // Cria o ponto comercial no banco de dados
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
                return reply.status(201).send({ response: response.id, message: "ponto turistico criado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota para atualizar um ponto comercial
        exeServer_1.default.post("/update/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, idPoint, newName, newLocal, newDescription } = body;
            try {
                // Validações dos campos
                if (!newName || !newLocal || !newDescription) {
                    return reply.status(400).send({ message: "Campos inválidos" });
                }
                if (!idBusiness) {
                    return reply.status(400).send({ message: "id da Empresa não fornecido" });
                }
                if (!idPoint) {
                    return reply.status(400).send({ message: "id do Ponto Comercial não fornecido" });
                }
                // Verificações de existência
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
                // Atualiza os dados do ponto comercial
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
        // Rota para buscar um ponto comercial específico
        exeServer_1.default.post("/get/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, idPoint } = body;
            try {
                // Validações e verificações
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
                    return reply.status(400).send({ message: "Você não é a empresa responsavel pelo ponto comercial..." });
                }
                // Retorna o ponto comercial
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                reply.status(200).send({ response: response === null || response === void 0 ? void 0 : response.id, message: "dados do ponto comercial" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Lista todos os pontos comerciais (sem filtro por empresa)
        exeServer_1.default.post("/get/list/commercialPoint/idBusiness", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findMany();
                reply.status(200).send({ response, message: "dados dos pontos comerciais da empresa" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Lista geral de todos os pontos comerciais
        exeServer_1.default.get("/get/list/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findMany();
                reply.status(200).send({ response, message: "Todos os registros de pontos comerciais" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Deleta um ponto comercial (verificando se é o dono)
        exeServer_1.default.delete("/delete/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idBusiness, idPoint } = body;
            try {
                if (!idBusiness || !idPoint) {
                    return reply.status(400).send({ message: "Campos obrigatórios não fornecidos" });
                }
                const idBusinessExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idBusiness } });
                const idPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                if (!idBusinessExisting || !idPointExisting) {
                    return reply.status(400).send({ message: "Empresa ou ponto comercial não existente" });
                }
                if (idPointExisting.businessId != idBusiness) {
                    return reply.status(400).send({ message: "Você não é a empresa responsavel pelo ponto turistico..." });
                }
                yield prismaClient_1.prismaClient.ponto_Comercial.delete({ where: { id: idPoint } });
                return reply.status(400).send({ message: "ponto turistico removido com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Denúncia de ponto comercial por um usuário
        exeServer_1.default.post("/report/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idCommercialPoint, contentReport } = body;
            try {
                // Validação e verificações
                if (!idUser || !idCommercialPoint || !contentReport) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                const reportExisting = yield prismaClient_1.prismaClient.reportCommercialPoint.findUnique({ where: { idCommercialPoint, idUserReport: idUser } });
                if (!idUserExisting || !idCommercialPointExisting) {
                    return reply.status(400).send({ message: "ID inválido" });
                }
                if (!!reportExisting) {
                    return reply.status(400).send({ message: "você já denunciou esse ponto comercial" });
                }
                // Cria denúncia e incrementa contador
                const { reportNumber } = idCommercialPointExisting;
                const reportNum = reportNumber + 1;
                yield prismaClient_1.prismaClient.ponto_Comercial.update({ where: { id: idCommercialPoint }, data: { reportNumber: reportNum } });
                yield prismaClient_1.prismaClient.reportCommercialPoint.create({
                    data: {
                        content: contentReport,
                        userReportCommercialPointByIdCommercialPoint: { connect: { id: idCommercialPoint } },
                        userReportCommercialPointByIdUserReport: { connect: { id: idUser } }
                    }
                });
                return reply.status(200).send({ message: "Denunciado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Upload de imagem para ponto comercial
        exeServer_1.default.post("/create/image/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idCommercialPoint, ImageUrl } = body;
            try {
                const idUserExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                if (!idUserExisting || !idCommercialPointExisting || !ImageUrl) {
                    return reply.status(400).send({ message: "Campos inválidos" });
                }
                yield prismaClient_1.prismaClient.imageCommercialPoint.create({
                    data: {
                        image: ImageUrl,
                        userCommercialPointByCommercialPointId: { connect: { id: idCommercialPoint } }
                    }
                });
                return reply.status(201).send({ message: "imagem adicionada com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Lista imagens de um ponto comercial
        exeServer_1.default.post("/get/image/list/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCommercialPoint } = body;
            try {
                const response = yield prismaClient_1.prismaClient.imageCommercialPoint.findMany({ where: { idCommercialPoint } });
                return reply.status(200).send({ response, message: "Lista de imagens de um certo ponto comercial" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Exclui imagem de um ponto comercial
        exeServer_1.default.delete("/delete/image/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCommercialPoint, imageUrl, idUser } = body;
            try {
                if (!idUser || !idCommercialPoint || !imageUrl) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                const imageUrlExisting = yield prismaClient_1.prismaClient.imageCommercialPoint.findUnique({ where: { idCommercialPoint, image: imageUrl } });
                if (idUser != (idCommercialPointExisting === null || idCommercialPointExisting === void 0 ? void 0 : idCommercialPointExisting.businessId)) {
                    return reply.status(400).send({ message: "Você não é o dono do ponto comercial" });
                }
                if (!imageUrlExisting) {
                    return reply.status(400).send({ message: "imagem não existente" });
                }
                yield prismaClient_1.prismaClient.imageCommercialPoint.delete({ where: { idCommercialPoint, image: imageUrl } });
                return reply.status(200).send({ message: "imagem excluida com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Publica o ponto comercial (ativa visibilidade)
        exeServer_1.default.post("/publishOn/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCommercialPoint, idUser } = body;
            try {
                if (!idUser || !idCommercialPoint) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idUser } });
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                if (!idUserExisting || !idCommercialPointExisting) {
                    return reply.status(400).send({ message: "ID inválido" });
                }
                if (idCommercialPointExisting.businessId != idUser) {
                    return reply.status(400).send({ message: "Você não é o dono do ponto comercial" });
                }
                yield prismaClient_1.prismaClient.ponto_Comercial.update({ where: { id: idCommercialPoint }, data: { isPublished: true } });
                return reply.status(200).send({ message: "ponto comercial publicado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Lista de pontos comerciais não publicados
        exeServer_1.default.get("/get/notPublished/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findMany({ where: { isPublished: false } });
                reply.status(200).send({ response, message: "todas as rotas não publicadas de commercialPoint" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Lista de pontos comerciais publicados
        exeServer_1.default.get("/get/Published/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Comercial.findMany({ where: { isPublished: true } });
                reply.status(200).send({ response, message: "todas as rotas publicadas de commercialPoint" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Lista de denúncias de um ponto comercial
        exeServer_1.default.post("/get/reports/commercialPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCommercialPoint } = body;
            try {
                const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findMany({ where: { id: idCommercialPoint } });
                if (!idCommercialPointExisting) {
                    reply.status(500).send({ message: "o ponto comercial não existe" });
                }
                const response = yield prismaClient_1.prismaClient.reportCommercialPoint.findMany({ where: { idCommercialPoint } });
                return reply.status(200).send({ response, message: "todas as denuncias do ponto comercial" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
