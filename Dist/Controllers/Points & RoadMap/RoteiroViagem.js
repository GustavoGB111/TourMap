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
exports.default = RoutesRoadMap;
const exeServer_1 = __importDefault(require("../../Test/exeServer"));
const prismaClient_1 = require("../../Database/prismaClient");
function RoutesRoadMap() {
    return __awaiter(this, void 0, void 0, function* () {
        exeServer_1.default.post("/register/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { title, description, idCreator } = body;
            try {
                if (!title || !description || !idCreator) {
                    return reply.status(404).send({ message: "algum campo não foi preenchido corretamente" });
                }
                const idIsExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idCreator } });
                if (!idIsExisting) {
                    return reply.status(500).send({ message: "usuario não encontrado" });
                }
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.create({
                    data: {
                        title,
                        description,
                        idCreator
                    }
                });
                return reply.status(200).send({ response, message: "Roteiro de viagem criado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/update/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { title, description, idCommercialPoint, idTouristingPoint, idCreator, id } = body;
            try {
                if (!id || !idCreator) {
                    return reply.status(500).send({ message: "id do criador ou id do roteiro não encontrado" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "roadMap não encontrado" });
                    ;
                }
                ;
                const idCreatorExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { idCreator, id } });
                if (!idCreatorExisting) {
                    return reply.status(500).send({ message: "Erro na consulta do banco de dados referente ao idCreator" });
                }
                ;
                if (!idTouristingPoint && !!idCommercialPoint) {
                    const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                    if (idCommercialPointExisting === null) {
                        return reply.status(500).send({ message: "erro na consulta do banco de dados" });
                    }
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id },
                        data: {
                            title,
                            description,
                            Commercial_Point: { connect: { id: idCommercialPoint } }
                        }
                    });
                    return reply.status(200).send({ response, message: "Atualização bem sucedida" });
                }
                ;
                if (!!idTouristingPoint && !idCommercialPoint) {
                    const idTouristingPointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idTouristingPoint } });
                    if (idTouristingPointExisting === null) {
                        return reply.status(500).send({ message: "erro na consulta do banco de dados" });
                    }
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id },
                        data: {
                            title,
                            description,
                            Touristing_Point: { connect: { id: idTouristingPoint } }
                        }
                    });
                    return reply.status(200).send({ response, message: "Atualização bem sucedida" });
                }
                ;
                if (!idTouristingPoint && !idCommercialPoint) {
                    const idCommercialPointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idCommercialPoint } });
                    if (idCommercialPointExisting === null) {
                        return reply.status(500).send({ message: "erro na consulta do banco de dados" });
                    }
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id },
                        data: {
                            title,
                            description
                        }
                    });
                    return reply.status(200).send({ response, message: "Atualização bem sucedida" });
                }
                ;
                return reply.status(200).send({ message: "roteiro de viagem atualizado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/published/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCreator, id } = body;
            try {
                if (!id || !idCreator) {
                    return reply.status(500).send({ message: "id do criador ou id do roteiro não encontrado" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "roadMap não existe" });
                }
                ;
                const idCreatorExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { idCreator, id } });
                if (!idCreatorExisting) {
                    return reply.status(500).send({ message: "Erro na consulta do banco de dados referente ao idCreator" });
                }
                ;
                const isPublished = travelRoadMapExisting.isPublished;
                if (!isPublished) {
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id },
                        data: {
                            isPublished: true
                        }
                    });
                    return reply.status(200).send({ response, message: "publicado com sucesso" });
                }
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/delete/roadMap/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCreator, id } = body;
            try {
                if (!id || !idCreator) {
                    return reply.status(500).send({ message: "id do criador ou id do roteiro não encontrado" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "RoadMap não existe" });
                }
                ;
                const idCreatorExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { idCreator, id } });
                if (!idCreatorExisting) {
                    return reply.status(500).send({ message: "Erro na consulta do banco de dados referente ao idCreator" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.delete({ where: { idCreator, id } });
                return reply.status(200).send({ response, message: "Road Map deletado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/delete/point/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCreator, id, idPoint, typePoint } = body; // typePoint deve ser "commercial" ou "tourist"
            try {
                if (!id || !idCreator) {
                    return reply.status(500).send({ message: "id do criador ou id do roteiro não encontrado" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "RoadMap não existe" });
                }
                ;
                const idCreatorExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { idCreator, id } });
                if (!idCreatorExisting) {
                    return reply.status(500).send({ message: "Erro na consulta do banco de dados referente ao idCreator" });
                }
                ;
                if (typePoint == "commercial") {
                    const pointExisting = yield prismaClient_1.prismaClient.ponto_Comercial.findUnique({ where: { id: idPoint } });
                    if (!pointExisting) {
                        return reply.status(500).send({ message: "ponto não encontrado " });
                    }
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id, idCreator },
                        data: {
                            Commercial_Point: { disconnect: [{ id: idPoint }] }
                        }
                    });
                    return reply.status(200).send({ response, message: "Desconexão feita com sucesso entre o ponto comercial e o roadMap" });
                }
                if (typePoint == "tourist") {
                    const pointExisting = yield prismaClient_1.prismaClient.ponto_Turistico.findUnique({ where: { id: idPoint } });
                    if (!pointExisting) {
                        return reply.status(500).send({ message: "ponto não encontrado " });
                    }
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id, idCreator },
                        data: {
                            Touristing_Point: { disconnect: [{ id: idPoint }] }
                        }
                    });
                    return reply.status(200).send({ response, message: "Desconexão feita com sucesso entre o ponto turistico e o roadMap" });
                }
                if (typePoint != "tourist" && typePoint != "commercial") {
                    return reply.status(500).send({ message: "o tipo não foi bem definido" });
                }
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idCreator, id } = body;
            try {
                if (!id || !idCreator) {
                    return reply.status(500).send({ message: "id do criador ou id do roteiro não encontrado" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "RoadMap não existe" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if ((response === null || response === void 0 ? void 0 : response.idCreator) != idCreator) {
                    return reply.status(500).send({ message: "idCreator não é o do roadMap" });
                }
                return reply.status(200).send({ response, message: "Road Map pego com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/list/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.findMany();
                return reply.status(200).send({ response, message: "Todos os RoadMaps" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
