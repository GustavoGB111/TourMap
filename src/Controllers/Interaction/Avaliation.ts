import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient"
import { request } from "http";
import { connect } from "http2";

export default async function RoutesAvaliation() {
    server.post("/create/avaliation/touristPoint", async (request, reply) => {
        const body = request.body as {avaliation: number, dataPublication: Date, userEmail: string, userId: string, idTouristPoint: string};
        const {avaliation, dataPublication, userEmail, userId, idTouristPoint} = body;

        try {
        if (!avaliation || !dataPublication || !userEmail || !userId || !idTouristPoint) {
            return reply.status(500).send({message: "algum campo inválido"});
        }

        const userIdExisting = await prismaClient.user_Client.findUnique({where: {id: userId}});
        const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

        if (!userIdExisting) {
            return reply.status(500).send({message: "o usuario não existe no banco de dados"});
        };
        if (userEmail != userIdExisting.email) {
            return reply.status(400).send({message: "o email não é igual ao do usuario"});
        };
        if (!idTouristPointExisting) {
            return reply.status(500).send({message: "o ponto turistico não foi encontrado no banco de dados"});
        };

        await prismaClient.avaliationTouristPoint.create({
            data: {
                dataPublication,
                avaliation,
                userClientByEmail: {connect: {email: userEmail}},
                userTouristPointByIdTouristPoint: {connect: {id: idTouristPoint}},
                userClientByIdClient: {connect: {id: userId}}
            }
        });

        return reply.status(201).send({message: "avaliação foi criado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/create/avaliation/commercialPoint", async (request, reply) => {
        const body = request.body as {avaliation: number, dataPublication: Date, userEmail: string, userId: string, idCommercialPoint: string};
        const {avaliation, dataPublication, userEmail, userId, idCommercialPoint} = body;

        try {
        if (!avaliation || !dataPublication || !userEmail || !userId || !idCommercialPoint) {
            return reply.status(500).send({message: "algum campo inválido"});
        };

        const userIdExisting = await prismaClient.user_Client.findUnique({where: {id: userId}});
        const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});

        if (!userIdExisting) {
            return reply.status(500).send({message: "o usuario não existe no banco de dados"});
        };
        if (userEmail != userIdExisting.email) {
            return reply.status(400).send({message: "o email não é igual ao do usuario"});
        };
        if (!idCommercialPointExisting) {
            return reply.status(500).send({message: "o ponto comercial não foi encontrado no banco de dados"});
        };

        await prismaClient.avaliationCommercialPoint.create({
            data: {
                dataPublication,
                avaliation,
                userClientByEmailClient: {connect: {email: userEmail}},
                userCommercialPointByIdCommercialPoint: {connect: {id: idCommercialPoint}},
                userClientByIdClient: {connect: {id: userId}}
            }
        });

        return reply.status(201).send({message: "avaliação foi criado com sucesso"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/avaliation/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string};
        const {idTouristPoint} = body;

        try {
            const idTouristPointExisting = prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            
            if (!idTouristPointExisting) {
                return reply.status(500).send({message: "id não encontrado no banco de dados"});
            };

            const response = await prismaClient.avaliationTouristPoint.findMany({where: {id: idTouristPoint}}) as {avaliation: number}[];
            const avaliations = response.map(({ avaliation }) => avaliation);  

            const average = avaliations.reduce((sum, value) => sum + value, 0) / avaliations.length;

            return reply.status(400).send({average, message: "A media das Avaliações"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/avaliation/commercialPoint", async (request, reply) => {
        const body = request.body as {idCommercialPoint: string};
        const {idCommercialPoint} = body;

        try {
            const idCommercialPointExisting = prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});
            
            if (!idCommercialPointExisting) {
                return reply.status(500).send({message: "id não encontrado no banco de dados"});
            };

            const response = await prismaClient.avaliationCommercialPoint.findMany({where: {id: idCommercialPoint}}) as {avaliation: number}[];
            const avaliations = response.map(({ avaliation }) => avaliation);  

            const average = avaliations.reduce((sum, value) => sum + value, 0) / avaliations.length;

            return reply.status(400).send({average, message: "A media das Avaliações"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}