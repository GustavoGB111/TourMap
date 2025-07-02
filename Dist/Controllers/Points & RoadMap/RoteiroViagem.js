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
                        userClient: { connect: { id: idCreator } }
                    }
                });
                return reply.status(200).send({ response, message: "Roteiro de viagem criado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/update/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body; // se for adicionar cidade precisa de estado e país, se for adicionar estado, precisa de país
            const { title, description, idCommercialPoint, idTouristingPoint, idCreator, idRoadMap, country, state, city, userImageUrl } = body;
            try {
                if (country) {
                    const countryAlreadyExist = yield prismaClient_1.prismaClient.country.findUnique({ where: { name: country } });
                    if (!countryAlreadyExist) {
                        yield prismaClient_1.prismaClient.country.create({
                            data: {
                                name: country
                            }
                        });
                    }
                }
                if (state) {
                    const stateAlreadyExist = yield prismaClient_1.prismaClient.state.findUnique({ where: { name: state } });
                    if (!stateAlreadyExist) {
                        yield prismaClient_1.prismaClient.state.create({
                            data: {
                                name: state,
                                CountryByCountryName: { connect: { name: country } }
                            }
                        });
                    }
                }
                if (city) {
                    const cityAlreadyExist = yield prismaClient_1.prismaClient.city.findUnique({ where: { name: city } });
                    if (!cityAlreadyExist) {
                        yield prismaClient_1.prismaClient.city.create({
                            data: {
                                name: city,
                                CityByCountryName: { connect: { name: country } },
                                StateByStateName: { connect: { name: state } }
                            }
                        });
                    }
                }
                if (!idRoadMap || !idCreator) {
                    return reply.status(500).send({ message: "id do criador ou id do roteiro não preenchido" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "roadMap não existe" });
                }
                ;
                if (idCreator != travelRoadMapExisting.idCreator) {
                    return reply.status(500).send({ message: "Você não é o dono do RoadMap" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap, idCreator } });
                yield prismaClient_1.prismaClient.travel_Road_Map.update({
                    where: { id: idRoadMap, idCreator },
                    data: {
                        title: title !== null && title !== void 0 ? title : response === null || response === void 0 ? void 0 : response.title,
                        description: description !== null && description !== void 0 ? description : response === null || response === void 0 ? void 0 : response.description,
                        userImageUrl,
                        PontosComerciaisRelation: { connect: { id: idCommercialPoint } },
                        PontosTuristicosRelation: { connect: { id: idTouristingPoint } },
                        CityRelation: { connect: { name: city } },
                        StateRelation: { connect: { name: state } },
                        CountryRelation: { connect: { name: country } }
                    }
                });
                return reply.status(200).send({ message: "roteiro de viagem atualizado com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/publishOnOff/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
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
                const { isPublished } = travelRoadMapExisting;
                if (isPublished === false) {
                    const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                        where: { id },
                        data: {
                            isPublished: true
                        }
                    });
                    return reply.status(200).send({ response, message: "publicado com sucesso" });
                }
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.update({
                    where: { id },
                    data: {
                        isPublished: false
                    }
                });
                return reply.status(200).send({ response, message: "o roteiro de viagem foi tirado de publicado com sucesso" });
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
                if (idCreator != travelRoadMapExisting.id) {
                    return reply.status(500).send({ message: "Você não é o dono do roadmap" });
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
                            commentRoadMapByRoadMapId: { disconnect: [{ id: idPoint }] }
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
                            PontosTuristicosRelation: { disconnect: [{ id: idPoint }] }
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
            const { id } = body;
            try {
                if (!id) {
                    return reply.status(500).send({ message: "id do roteiro não encontrado" });
                }
                ;
                const travelRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
                if (!travelRoadMapExisting) {
                    return reply.status(500).send({ message: "RoadMap não existe" });
                }
                ;
                const response = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id } });
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
        exeServer_1.default.post("/create/image/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idRoadMap, ImageUrl } = body;
            try {
                const idUserExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idUser } });
                const idRoadMapPointExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                ;
                if (!idRoadMapPointExisting) {
                    return reply.status(400).send({ message: "ID do RoadMap não existente" });
                }
                ;
                if (!ImageUrl) {
                    return reply.status(400).send({ message: "a url não pode ser vazia" });
                }
                ;
                if (idUser != idRoadMapPointExisting.id) {
                    return reply.status(400).send({ message: "você não é o dono do roadMap" });
                }
                ;
                yield prismaClient_1.prismaClient.imageRoadMap.create({
                    data: {
                        image: ImageUrl,
                        userRoadMapByRoadMapId: { connect: { id: idRoadMap } }
                    }
                });
                return reply.status(201).send({ message: "imagem adicionada com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.delete("/delete/image/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, imageUrl, idRoadMap } = body;
            try {
                if (!idUser || !idRoadMap || !imageUrl) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Business.findUnique({ where: { id: idUser } });
                const idRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                ;
                if (!idRoadMapExisting) {
                    return reply.status(400).send({ message: "ID do roadMap não existente" });
                }
                ;
                const imageUrlExisting = yield prismaClient_1.prismaClient.imageRoadMap.findUnique({ where: { idRoadMap, image: imageUrl } });
                if (!imageUrlExisting) {
                    return reply.status(400).send({ message: "imagem não existente" });
                }
                ;
                yield prismaClient_1.prismaClient.imageRoadMap.delete({ where: { idRoadMap, image: imageUrl } });
                return reply.status(200).send({ message: "imagem excluida com sucesso" });
            }
            catch (error) {
                return reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/get/image/list/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idRoadMap } = body;
            try {
                const response = yield prismaClient_1.prismaClient.imageRoadMap.findMany({ where: { idRoadMap } });
                return reply.status(200).send({ response, message: "Lista de imagens de um certo roadMap" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
            ;
        }));
        exeServer_1.default.post("/report/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idUser, idRoadMap, contentReport } = body;
            try {
                if (!idUser || !idRoadMap || !contentReport) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idRoadMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                const reportExisting = yield prismaClient_1.prismaClient.reportRoadMap.findUnique({ where: { idUserReport: idUser, idRoadMap } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                ;
                if (!idRoadMapExisting) {
                    return reply.status(400).send({ message: "ID do roadMap não existente" });
                }
                ;
                if (!!reportExisting) {
                    return reply.status(400).send({ message: "você já denunciou esse roadMap" });
                }
                ;
                const { reportNumber } = idRoadMapExisting;
                const reportNum = reportNumber + 1;
                yield prismaClient_1.prismaClient.travel_Road_Map.update({ where: { id: idRoadMap }, data: { reportNumber: reportNum } });
                yield prismaClient_1.prismaClient.reportRoadMap.create({
                    data: {
                        content: contentReport,
                        userReportRoadMapByIdRoadMap: { connect: { id: idRoadMap } },
                        userReportRoadMapByIdUserReport: { connect: { id: idUser } }
                    }
                });
                return reply.status(200).send({ message: "Denunciado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
        exeServer_1.default.post("/publishOn/roadMap", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const { idRoadMap, idUser } = body;
            try {
                if (!idUser || !idRoadMap) {
                    return reply.status(400).send({ message: "Algum campo não completado" });
                }
                const idUserExisting = yield prismaClient_1.prismaClient.user_Client.findUnique({ where: { id: idUser } });
                const idtravelMapExisting = yield prismaClient_1.prismaClient.travel_Road_Map.findUnique({ where: { id: idRoadMap } });
                if (!idUserExisting) {
                    return reply.status(400).send({ message: "ID do usuário não existente" });
                }
                ;
                if (!idtravelMapExisting) {
                    return reply.status(400).send({ message: "ID do roadMap não existente" });
                }
                ;
                if (idtravelMapExisting.idCreator !== idUser) {
                    return reply.status(400).send({ message: "Você não é o dono do roadMap" });
                }
                ;
                yield prismaClient_1.prismaClient.travel_Road_Map.update({ where: { id: idRoadMap },
                    data: {
                        isPublished: true
                    }
                });
                return reply.status(200).send({ message: "roadMap publicado com sucesso" });
            }
            catch (error) {
                reply.status(500).send({ message: "erro interno no servidor ou requisição ao banco de dados falha", error });
            }
        }));
    });
}
