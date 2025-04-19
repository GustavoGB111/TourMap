import { fastify } from 'fastify';
import RoutesAdmin from "../Controllers/Admin";
import RoutesClient from '../Controllers/Client';
import RoutesBusiness from '../Controllers/Business';

const server = fastify();

export default server;

server.register(RoutesAdmin, {prefix: "admin"});
server.register(RoutesClient, {prefix: "client"})
server.register(RoutesBusiness, {prefix: "business"})

server.listen({port: 3333});