// Importa o servidor Fastify configurado
import server from "../../Test/exeServer";

// Importa o cliente Prisma para comunicação com o banco de dados
import {prismaClient} from "../../Database/prismaClient"

// Importações de módulos do Node.js (somente 'connect' e 'request' do http/http2 são importados, mas não utilizados)
import { request } from "http";
import { connect } from "http2";

// Função principal que registra as rotas relacionadas a avaliações
export default async function RoutesAvaliation() {

    // Rota para criar avaliação de ponto turístico
    server.post("/create/avaliation/touristPoint", async (request, reply) => {
        // Extrai os dados da requisição
        const body = request.body as {avaliation: number, dataPublication: Date, userEmail: string, userId: string, idTouristPoint: string};
        const {avaliation, dataPublication, userEmail, userId, idTouristPoint} = body;

        try {
            // Verifica se todos os campos foram preenchidos
            if (!avaliation || !dataPublication || !userEmail || !userId || !idTouristPoint) {
                return reply.status(400).send({message: "algum campo inválido"});
            }

            // Verifica se o usuário existe
            const userIdExisting = await prismaClient.user_Client.findUnique({where: {id: userId}});
            // Verifica se o ponto turístico existe
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            // Se usuário não encontrado
            if (!userIdExisting) {
                return reply.status(400).send({message: "o usuario não existe no banco de dados"});
            };
            // Verifica se o e-mail informado bate com o e-mail do usuário
            if (userEmail != userIdExisting.email) {
                return reply.status(400).send({message: "o email não é igual ao do usuario"});
            };
            // Se o ponto turístico não for encontrado
            if (!idTouristPointExisting) {
                return reply.status(400).send({message: "o ponto turistico não foi encontrado no banco de dados"});
            };

            // Cria a avaliação no banco de dados
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
            // Captura qualquer erro e responde com status 500
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota para criar avaliação de ponto comercial
    server.post("/create/avaliation/commercialPoint", async (request, reply) => {
        const body = request.body as {avaliation: number, dataPublication: Date, userEmail: string, userId: string, idCommercialPoint: string};
        const {avaliation, dataPublication, userEmail, userId, idCommercialPoint} = body;

        try {
            // Verifica se todos os campos estão preenchidos
            if (!avaliation || !dataPublication || !userEmail || !userId || !idCommercialPoint) {
                return reply.status(400).send({message: "algum campo inválido"});
            };

            // Busca o usuário e o ponto comercial no banco
            const userIdExisting = await prismaClient.user_Client.findUnique({where: {id: userId}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});

            // Se usuário não encontrado
            if (!userIdExisting) {
                return reply.status(400).send({message: "o usuario não existe no banco de dados"});
            };
            // Verifica se e-mail corresponde ao do usuário
            if (userEmail != userIdExisting.email) {
                return reply.status(400).send({message: "o email não é igual ao do usuario"});
            };
            // Se ponto comercial não encontrado
            if (!idCommercialPointExisting) {
                return reply.status(400).send({message: "o ponto comercial não foi encontrado no banco de dados"});
            };

            // Cria a avaliação no banco
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

    // Rota para obter média de avaliações de um ponto turístico
    server.post("/get/avaliation/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string};
        const {idTouristPoint} = body;

        try {
            // Verifica se o ponto turístico existe
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            
            if (!idTouristPointExisting) {
                return reply.status(400).send({message: "id não encontrado no banco de dados"});
            };

            // Busca todas as avaliações do ponto turístico
            const response = await prismaClient.avaliationTouristPoint.findMany({where: {idTouristPoint}}) as {avaliation: number}[];

            // Extrai apenas os valores de avaliação
            const avaliations = response.map(({ avaliation }) => avaliation);  

            // Calcula a média
            const average = avaliations.reduce((sum, value) => sum + value, 0) / avaliations.length;

            return reply.status(200).send({average, message: "A media das Avaliações"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota para obter média de avaliações de um ponto comercial
    server.post("/get/avaliation/commercialPoint", async (request, reply) => {
        const body = request.body as {idCommercialPoint: string};
        const {idCommercialPoint} = body;

        try {
            // Verifica se o ponto comercial existe
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});
            
            if (!idCommercialPointExisting) {
                return reply.status(400).send({message: "id não encontrado no banco de dados"});
            };

            // Busca todas as avaliações do ponto comercial
            const response = await prismaClient.avaliationCommercialPoint.findMany({where: {idCommercialPoint}}) as {avaliation: number}[];
            const avaliations = response.map(({ avaliation }) => avaliation);  

            // Calcula a média das avaliações
            const average = avaliations.reduce((sum, value) => sum + value, 0) / avaliations.length;

            return reply.status(200).send({average, message: "A media das Avaliações"});
        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}
