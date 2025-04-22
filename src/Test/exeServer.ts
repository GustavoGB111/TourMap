import { fastify } from 'fastify';

import RoutesAdmin from "../Controllers/Login/Admin";
import RoutesClient from '../Controllers/Login/Client';
import RoutesBusiness from '../Controllers/Login/Business';

import RoutesPontoTuristicos from '../Controllers/Points/TouristPoint';

const server = fastify();

export default server;

server.register(RoutesAdmin, {prefix: "admin"});
server.register(RoutesClient, {prefix: "client"})
server.register(RoutesBusiness, {prefix: "business"})

server.register(RoutesPontoTuristicos, {prefix: "touristPoint"})

server.listen({port: 3333});