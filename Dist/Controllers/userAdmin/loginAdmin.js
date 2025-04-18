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
exports.default = routesLogin;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function routesLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/loginADM", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { nome, email, senha } = body;
            try {
                const existingUserEmail = yield prismaClient_1.prismaClient.user_Admin.findUnique({ where: { email } });
                if (!nome || !email) {
                    return reply.status(404).send({ message: "Email ou Nome não preenchidos" });
                }
                else if (existingUserEmail) {
                    return reply.status(200).send(existingUserEmail.id);
                }
                else {
                    return reply.status(404).send({ message: "Usuario não cadastrado" });
                }
            }
            catch (error) {
                return reply.status(500).send({ error });
            }
        }));
    });
}
