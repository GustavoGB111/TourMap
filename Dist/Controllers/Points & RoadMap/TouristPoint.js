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
// Importa o servidor Fastify configurado
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
// Importa a instância do cliente Prisma (ORM usado para acesso ao banco)
const prismaClient_1 = require("../../Database/prismaClient");
// Função principal responsável por declarar todas as rotas relacionadas aos pontos turísticos
function RoutesTouristPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        // Rota: Cadastrar ponto turístico
        exeServer_1.default.post("/register/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            // Recebe os dados do corpo da requisição
            const body = request.body;
            const { id, name, description, creationDate, local } = body;
            try {
                // Verifica se todos os campos obrigatórios foram preenchidos
                if (!name || !description || !creationDate || !local) {
                    return reply.status(400).send({ message: "Algum campo não preenchido" });
                }
                ;
                if (!id) {
                    return reply.status(400).send({ message: "id não fornecido" });
                }
                ;
                // Verifica se já existe um ponto com o mesmo local
                const localExistingOnDatabase = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { local } });
                // Verifica se o usuário cliente existe
                const idClientExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id } });
                if (!!localExistingOnDatabase) {
                    return reply.status(500).send({ message: "local já existente no banco de dados..." });
                }
                ;
                if (!idClientExisting) {
                    return reply.status(500).send({ message: "o cliente não existe no banco de dados..." });
                }
                // Cria o novo ponto turístico
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.create({
                    data: {
                        name,
                        description,
                        local,
                        creationDate
                    }
                });
                return reply.status(201).send({ response: response.id, message: "Ponto turistico adicionado" });
            }
            catch (error) {
                // Tratamento de erro genérico
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha" });
            }
            ;
        }));
        // Rota: Atualizar ponto turístico
        exeServer_1.default.put("/update/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            // Recebe os dados da requisição
            const body = request.body;
            const { idUser, idTouristPoint, newName, newDescription, newLocal } = body;
            try {
                // Validação dos campos obrigatórios
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
                // Verifica se o usuário admin existe
                const idUserExisting = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { id: idUser } });
                // Busca os dados do ponto turístico atual
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristPoint } });
                // Verifica se o novo local já existe
                const localExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { local: newLocal } });
                // Dados atuais
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
                // Atualiza o ponto turístico
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
        // Rota: Obter ponto turístico pelo ID
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
                reply.status(200).send({ response, message: "id do ponto turistico retornado" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota: Listar todos os pontos turísticos
        exeServer_1.default.get("/get/list/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findMany();
                reply.status(200).send({ response, message: "Todos os registros de Pontos Turisticos" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota: Deletar ponto turístico (admin)
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
        // Rota: Denunciar ponto turístico
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
                // Incrementa o número de denúncias
                const { reportNumber } = idTouristPointExisting;
                const reportNum = reportNumber + 1;
                yield prismaClient_1.prismaClient.ponto_Turistico.update({ where: { id: idTouristPoint }, data: { reportNumber: reportNum } });
                // Cria a denúncia
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
        // Rota: Adicionar imagem ao ponto turístico
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
                return reply.status(201).send({ message: "imagem adicionada com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota: Obter lista de imagens associadas a um ponto turístico
        exeServer_1.default.post("/get/image/list/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint } = body;
            try {
                // Busca todas as imagens associadas ao ID fornecido
                const response = yield prismaClient_1.prismaClient.imageTouristPoint.findMany({ where: { idTouristPoint } });
                return reply.status(200).send({ response, message: "Lista de imagens de um certo ponto turistico" });
            }
            catch (error) {
                // Tratamento de erro caso o banco ou o servidor falhe
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
            ;
        }));
        // Rota: Deletar imagem associada a um ponto turístico
        exeServer_1.default.delete("/delete/image/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint, imageUrl, idUser } = body;
            try {
                // Verifica se todos os campos obrigatórios estão preenchidos
                if (!idUser || !idTouristPoint || !imageUrl) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                // Verifica se usuário admin e ponto turístico existem
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
                // Verifica se a imagem a ser deletada realmente existe
                const imageUrlExisting = yield prismaClient_1.prismaClient.imageTouristPoint.findUnique({ where: { idTouristPoint, image: imageUrl } });
                if (!imageUrlExisting) {
                    return reply.status(400).send({ message: "imagem não existente" });
                }
                ;
                // Deleta a imagem
                yield prismaClient_1.prismaClient.imageTouristPoint.delete({ where: { idTouristPoint, image: imageUrl } });
                return reply.status(200).send({ message: "imagem excluida com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota: Publicar ponto turístico (disponibilizar para visualização pública)
        exeServer_1.default.post("/publishOn/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint, idUser } = body;
            try {
                // Valida campos obrigatórios
                if (!idUser || !idTouristPoint) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                // Verifica existência do admin e do ponto turístico
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
                // Atualiza o campo de publicação do ponto turístico
                yield prismaClient_1.prismaClient.ponto_Turistico.update({
                    where: { id: idTouristPoint },
                    data: {
                        isPublished: true
                    }
                });
                // Cria uma notificação associada à publicação do ponto turístico
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
        // Rota: Obter todas as denúncias de um ponto turístico
        exeServer_1.default.post("/get/reports/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idTouristPoint } = body;
            try {
                // Verifica se o ponto turístico existe
                const idTouristPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findMany({ where: { id: idTouristPoint } });
                if (!idTouristPointExisting) {
                    reply.status(500).send({ message: "o ponto turistico não existe" });
                }
                // Busca todas as denúncias associadas
                const response = yield prismaClient_1.prismaClient.reportTouristPoint.findMany({ where: { idTouristPoint } });
                return reply.status(200).send({ response, message: "todas as denuncias do ponto turistico" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota: Obter pontos turísticos ainda não publicados
        exeServer_1.default.get("/get/notPublished/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Filtra por pontos com isPublished = false
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findMany({ where: { isPublished: false } });
                reply.status(200).send({ response, message: "todas as rotas não publicadas de touristPoint" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        // Rota: Obter pontos turísticos publicados
        exeServer_1.default.get("/get/Published/touristPoint", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Filtra por pontos com isPublished = true
                const response = yield prismaClient_1.prismaClient.ponto_Turistico.findMany({ where: { isPublished: true } });
                reply.status(200).send({ response, message: "todas as rotas publicadas de touristPoint" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
