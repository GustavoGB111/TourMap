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
exports.default = registerRoutes;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function registerRoutes() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/register/admin", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { name, email, senha } = body;
            console.log("chamada com sucesso");
            try {
                yield prismaClient_1.prismaClient.user_Admin.create({
                    data: {
                        name,
                        email,
                        senha
                    }
                });
                return reply.status(201).send();
            }
            catch (error) {
                console.log("Tentando criar usuário:", name, email);
                console.error("Erro ao criar usuário:", error);
                return reply.status(500).send({ message: "Erro interno do servidor" });
            }
        }));
    });
}
