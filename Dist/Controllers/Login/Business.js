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
exports.default = RoutesBusiness;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesBusiness() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/register/business", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { name, email, password, CNPJ, telefone } = body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const CNPJRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
            try {
                const existingUserEmail = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { email } });
                if (!name || !email || !telefone) {
                    return reply.status(400).send({ message: "Nome, telefone ou Email não pode ser vazio" });
                }
                if (!emailRegex.test(email)) {
                    return reply.status(400).send({ message: "Formato de email não suportado" });
                }
                if (!CNPJRegex.test(CNPJ)) {
                    return reply.status(400).send({ message: "Formato de CNPJ não suportado" });
                }
                if (password.length < 8) {
                    return reply.status(400).send({ message: "Senha deve ter pelo menos 8 caracteres" });
                }
                if (existingUserEmail) {
                    return reply.status(400).send({ message: "Usuario já cadastrado" });
                }
                const response = yield prismaClient_1.prismaClient.user_Business.create({
                    data: {
                        name,
                        email,
                        password,
                        CNPJ,
                        telefone
                    }
                });
                return reply.status(201).send({ response: response.id, message: "criado com sucesso" });
            }
            catch (error) {
                console.error("Erro ao criar usuário:", error);
                return reply.status(500).send({ message: "Erro desconhecido ou interno no servidor...", error });
            }
            ;
        }));
        //Login BUSINESS
        exeServer_1.default.post("/login/business", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { email, password } = body;
            try {
                if (!email || !password) {
                    return reply.status(404).send({ message: "Email ou Senha não preenchidos" });
                }
                const response = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { email } });
                if (!response) {
                    return reply.status(404).send({ message: "Usuario não cadastrado" });
                }
                ;
                if (response.email !== email && response.password !== password) {
                    return reply.status(404).send({ message: "Algum campo preenchido incorretamente" });
                }
                ;
                return reply.status(200).send({ response: response.id, message: "id retornado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "Erro desconhecido ou interno no servidor...", error });
            }
        }));
        //Get BUSINESS
        exeServer_1.default.post("/get/business/id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { id } = body;
            try {
                if (!id) {
                    return reply.status(404).send({ message: "ID não preenchido" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id } });
                if (!response) {
                    return reply.status(404).send({ message: "Usuario não encontrado" });
                }
                ;
                return reply.status(200).send({ response, message: "usuario business retornado" });
            }
            catch (error) {
                return reply.status(500).send({ message: "Erro desconhecido ou interno no servidor...", error });
            }
        }));
        //Get BUSINESS LIST
        exeServer_1.default.get("/get/business/list", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.user_Business.findMany();
                if (!response) {
                    return reply.status(404).send({ message: "Empresa List não encontrado" });
                }
                return reply.status(200).send({ response, message: "lista de business" });
            }
            catch (error) {
                return reply.status(500).send({ message: "Erro desconhecido ou interno no servidor...", error });
            }
        }));
        exeServer_1.default.post("/update/business", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { id, newName, oldPassword, newPassword, newTelefone, userImageUrl } = body;
            try {
                if (!id || !oldPassword) {
                    return reply.status(500).send({ message: "o campo id ou o campo senha não podem ser vazios" });
                }
                const idExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id } });
                if (!idExisting) {
                    return reply.status(500).send({ message: "não existe esse usuario dentro do banco de dados" });
                }
                ;
                if (idExisting.password != oldPassword) {
                    return reply.status(500).send({ message: "as senhas não se coincidem" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.user_Business.update({
                    where: { id },
                    data: {
                        name: newName !== null && newName !== void 0 ? newName : idExisting.name,
                        password: newPassword !== null && newPassword !== void 0 ? newPassword : oldPassword,
                        telefone: newTelefone !== null && newTelefone !== void 0 ? newTelefone : idExisting.telefone,
                        userImageUrl
                    }
                });
                return reply.status(200).send({ response, message: "atualizado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "Erro desconhecido ou interno no servidor...", error });
            }
        }));
        // não deve ser usado
        exeServer_1.default.delete("/delete/business/list", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prismaClient_1.prismaClient.user_Business.deleteMany({});
                console.log("Todos os itens da tabela user_Business foram deletados."); // Apenas log no terminal
                return reply.status(200).send({ message: "Todos os registros foram excluídos com sucesso!" }); // Resposta correta
            }
            catch (error) {
                console.error("Erro ao excluir registros:", error);
                return reply.status(500).send({ message: "Erro interno no servidor", error });
            }
        }));
    });
}
