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
const exeServer_1 = __importDefault(require("../exeServer"));
const extension_1 = require("@prisma/client/extension");
function routesLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/loginADM", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { nomeUser, emailUser, senhaUser } = body;
            try {
                const createdUser = yield extension_1.PrismaClient.user.create({
                    data: {
                        nomeUser,
                        emailUser,
                        senhaUser
                    }
                });
                return reply.status(201).send();
            }
            catch (error) {
                return reply.status(500).send({ error: "Erro desconhecido..." });
            }
        }));
        exeServer_1.default.delete("/loginADM/delete", () => {
        });
        exeServer_1.default.get("/loginADM/get", () => {
        });
    });
}
