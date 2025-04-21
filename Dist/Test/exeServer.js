"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const Admin_1 = __importDefault(require("../Controllers/Login/Admin"));
const Client_1 = __importDefault(require("../Controllers/Login/Client"));
const Business_1 = __importDefault(require("../Controllers/Login/Business"));
const server = (0, fastify_1.fastify)();
exports.default = server;
server.register(Admin_1.default, { prefix: "admin" });
server.register(Client_1.default, { prefix: "client" });
server.register(Business_1.default, { prefix: "business" });
server.listen({ port: 3333 });
