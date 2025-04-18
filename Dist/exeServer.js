"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = __importDefault(require("./users/register"));
const get_1 = __importDefault(require("./users/get"));
const loginAdmin_1 = __importDefault(require("./users/loginAdmin"));
const fastify_1 = require("fastify");
const server = (0, fastify_1.fastify)();
exports.default = server;
server.register(register_1.default, { prefix: "register" });
server.register(get_1.default, { prefix: "get" });
server.register(loginAdmin_1.default, { prefix: "login" });
server.listen({ port: 3333 }, (error) => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
    else {
        console.log('Servidor iniciado na porta 3333');
    }
});
