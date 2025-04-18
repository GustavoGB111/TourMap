"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const Admin_1 = __importDefault(require("../Controllers/Admin"));
const server = (0, fastify_1.fastify)();
exports.default = server;
server.register(Admin_1.default, { prefix: "admin" });
server.listen({ port: 3333 });
