import { fastify } from 'fastify';

import RoutesAdmin from "../Controllers/Login/Admin";
import RoutesClient from '../Controllers/Login/Client';
import RoutesBusiness from '../Controllers/Login/Business';

import RoutesPontoTuristicos from '../Controllers/Points & RoadMap/TouristPoint';
import RoutesCommercialPoint from '../Controllers/Points & RoadMap/CommercialPoint';
import RoutesRoadMap from '../Controllers/Points & RoadMap/RoteiroViagem';

import RoutesAvaliation from '../Controllers/Interaction/Avaliation';
import RoutesComment from '../Controllers/Interaction/Comment';
import RoutesFavorite from '../Controllers/Interaction/Favorite';

const server = fastify();

export default server;

server.register(RoutesAdmin, {prefix: "admin"});
server.register(RoutesClient, {prefix: "client"});
server.register(RoutesBusiness, {prefix: "business"});

server.register(RoutesPontoTuristicos, {prefix: "touristPoint"});
server.register(RoutesCommercialPoint, {prefix: "commercialPoint"});
server.register(RoutesRoadMap, {prefix: "roadMap"});

server.register(RoutesAvaliation, {prefix: "Avaliation"});
server.register(RoutesComment, {prefix: "Comment"});
server.register(RoutesFavorite, {prefix: "Favorite"});

server.listen({port: 3333});