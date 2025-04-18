import { fastify } from 'fastify';
import RoutesAdmin from "../Controllers/Admin";

const server = fastify();

export default server;

server.register(RoutesAdmin, {prefix: "admin"});

server.listen({port: 3333});