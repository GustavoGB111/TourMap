import server from "../../Test/exeServer";
import {prismaClient} from "../../Database/prismaClient"

export default async function RoutesComment() {
    server.post("/publish/comment", async (request, reply) => {
        const body = request.body as {content: string; userEmail: string; idCreator: string};
        const {content, userEmail, idCreator} = body;

        try {
            if (!content) {
                return reply.status(400).send({message: "conteudo vazio"});
            }
            if (!userEmail || !idCreator) {
                return reply.status(400).send({message: "Email ou Id não fornecidos"});
            }

            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idCreator}});
            const emailExisting = await prismaClient.user_Client.findUnique({where: {email: userEmail}});

            if (!idUserExisting) {
                return reply.status(400).send({message: "id não existe"});
            }
            if (!emailExisting) {
                return reply.status(400).send({message: "email não existe"});
            }

        } catch (error) {
            return reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}