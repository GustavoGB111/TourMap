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
exports.default = RoutesClient;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesClient() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/register/client", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { name, email, password } = body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            try {
                const existingUserEmail = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { email } });
                if (!name || !email) {
                    return reply.status(400).send({ message: "Nome ou Email não pode ser vazio" });
                }
                if (!emailRegex.test(email)) {
                    return reply.status(400).send({ message: "Formato de email não suportado" });
                }
                if (password.length < 8) {
                    return reply.status(400).send({ message: "Senha deve ter pelo menos 8 caracteres" });
                }
                if (existingUserEmail) {
                    return reply.status(400).send({ message: "Email já cadastrado" });
                }
                const response = yield prismaClient_1.prismaClient.user_Client.create({
                    data: {
                        name,
                        email,
                        password
                    }
                });
                return reply.status(201).send(response.id);
            }
            catch (error) {
                console.error("Erro ao criar usuário:", error);
                return reply.status(500).send({ message: "Erro interno do servidor" });
            }
            ;
        }));
        //Login CLIENT
        exeServer_1.default.post("/login/client", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { name, email, password } = body;
            try {
                if (!name || !email || !password) {
                    return reply.status(404).send({ message: "Email ou Nome ou Senha não preenchidos" });
                }
                const existingUser = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { email } });
                if (existingUser) {
                    if (existingUser.email === email && existingUser.name === name && existingUser.password === password) {
                        return reply.status(200).send(existingUser.id);
                    }
                    else {
                        return reply.status(404).send({ message: "Algum campo preenchido incorretamente" });
                    }
                }
                else {
                    return reply.status(404).send({ message: "Usuario não cadastrado" });
                }
            }
            catch (error) {
                return reply.status(500).send({ error });
            }
        }));
        //Get CLIENT
        exeServer_1.default.get("/get/client/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.params;
            const { id } = body;
            try {
                const existingUserEmail = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id } });
                if (!id) {
                    return reply.status(404).send({ message: "ID não preenchido" });
                }
                if (existingUserEmail) {
                    return reply.status(200).send(existingUserEmail);
                }
                else {
                    return reply.status(404).send({ message: "Usuario não encontrado" });
                }
                ;
            }
            catch (error) {
                return reply.status(500).send(error);
            }
        }));
        //Get CLIENT LIST
        exeServer_1.default.get("/get/client/list", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clientList = yield prismaClient_1.prismaClient.user_Client.findMany();
                if (clientList) {
                    return reply.status(200).send(clientList);
                }
                else {
                    return reply.status(404).send({ message: "Cliente List não encontrado" });
                }
            }
            catch (error) {
                return reply.status(500).send(error);
            }
        }));
        exeServer_1.default.delete("/delete/client/list", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prismaClient_1.prismaClient.user_Client.deleteMany({});
                console.log("Todos os itens da tabela user_Client foram deletados."); // Apenas log no terminal
                return reply.status(200).send({ message: "Todos os registros foram excluídos com sucesso!" }); // Resposta correta
            }
            catch (error) {
                console.error("Erro ao excluir registros:", error);
                return reply.status(500).send({ message: "Erro interno no servidor", error });
            }
        }));
        exeServer_1.default.post("/update/client", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { id, oldName, newName, oldEmail, newEmail, oldPassword, newPassword } = body;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            try {
                const userExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id } });
                const userExistingEmail = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { email: newEmail } });
                if (!userExisting) {
                    return reply.status(500).send({ message: "Usuario não existe" });
                }
                const { name, email, password } = userExisting;
                if (!oldEmail || !oldName || !oldPassword) {
                    return reply.status(500).send({ message: "Algum dos campo não foi preenchido" });
                }
                if (newEmail != undefined) {
                    if (!emailRegex.test(newEmail)) {
                        return reply.status(500).send({ message: "Novo Email inválido" });
                    }
                }
                if (!emailRegex.test(oldEmail)) {
                    return reply.status(500).send({ message: "Antigo Email inválido" });
                }
                if (newPassword != undefined) {
                    if (newPassword.length < 8) {
                        return reply.status(500).send({ message: "Senha não pode ter menos que 8 caracteres" });
                    }
                }
                if (userExistingEmail != null) {
                    return reply.status(500).send({ message: "Email ja cadastrado" });
                }
                if (name === oldName && email === oldEmail && password === oldPassword) {
                    const response = yield prismaClient_1.prismaClient.user_Client.update({
                        where: { id },
                        data: {
                            name: newName !== null && newName !== void 0 ? newName : oldName,
                            email: newEmail !== null && newEmail !== void 0 ? newEmail : oldEmail,
                            password: newPassword !== null && newPassword !== void 0 ? newPassword : oldPassword
                        }
                    });
                    return reply.status(200).send({ message: "Atualizado com sucesso", data: response });
                }
                else {
                    return reply.status(404).send({ message: "Campos Inválidos" });
                }
            }
            catch (error) {
                return reply.status(500).send({ message: "Erro desconhecido ou interno no servidor...", error });
            }
        }));
    });
}
