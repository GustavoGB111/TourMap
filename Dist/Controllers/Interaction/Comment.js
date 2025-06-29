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
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesComment() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/publish/comment", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { content, userEmail, idCreator } = body;
            try {
                if (!content) {
                    return reply.status(400).send({ message: "conteudo vazio" });
                }
                if (!userEmail || !idCreator) {
                    return reply.status(400).send({ message: "Email ou Id não fornecidos" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idCreator } });
                const emailExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { email: userEmail } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "id não existe" });
                }
                if (!emailExisting) {
                    return reply.status(400).send({ message: "email não existe" });
                }
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
