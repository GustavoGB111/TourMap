import server from "../Test/exeServer";
import { prismaClient } from "../Database/prismaClient";

export default async function RoutesClient() {

    server.post("/register/client", async (request, reply) => {
        const body = request.body as {name: string; email: string; password: string};
        const {name, email, password} = body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        try {
            const existingUserEmail = await prismaClient.user_Client.findUnique({where: {email}})
    
            if (!name || !email) {
                return reply.status(400).send({ message: "Nome ou Email não pode ser vazio" });
            } else if (!emailRegex.test(email)) {
                return reply.status(400).send({ message: "Formato de email não suportado" });
            } else if (password.length < 8) {
                return reply.status(400).send({ message: "Senha deve ter pelo menos 8 caracteres" });
            } else if (existingUserEmail) {
                return reply.status(400).send({ message: "Email já cadastrado" });
            }
    
            const response = await prismaClient.user_Client.create({
                data: {
                    name,
                    email,
                    password
                }
            });
    
            return reply.status(201).send(response.id);
            
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return reply.status(500).send({ message: "Erro interno do servidor" });
        };
    });
    
    //Login CLIENT
    server.post("/login/client", async (request, reply) => {
        const body = request.body as {name: string; email: string; password: string};
        const {name, email, password} = body;
    
        try {
            if (!name || !email || !password) {
                return reply.status(404).send({message: "Email ou Nome ou Senha não preenchidos"})
            }  
    
            const existingUser = await prismaClient.user_Client.findUnique({where: {email}})
    
             if (existingUser ) {
                if (existingUser.email === email && existingUser.name === name && existingUser.password === password){
                    return reply.status(200).send(existingUser.id);
                }   
                else {
                    return reply.status(404).send({message: "Algum campo preenchido incorretamente"});
                }
            } else {
                return reply.status(404).send({message: "Usuario não cadastrado"});
            }
        } catch (error) {
            return reply.status(500).send({error});            
        }
    
    });
    
    //Get CLIENT
    server.get("/get/client/:id", async (request, reply) => {
            const body = request.params as {id: string};
            const {id} = body
            try {
            const existingUserEmail = await prismaClient.user_Client.findUnique({where: {id}});
            if (!id) {
                return reply.status(404).send({message: "ID não preenchido"});
            }
            else if (existingUserEmail) {
                return reply.status(200).send(existingUserEmail);
            } else {
                return reply.status(404).send({message: "Usuario não encontrado"});
            };
            
        } catch (error) {
            return reply.status(500).send(error);
        }
    });
    
    //Get CLIENT LIST
    server.get("/get/client/list", async (request, reply) => {
        try {
            const clientList = await prismaClient.user_Client.findMany();
            if (clientList) {
                return reply.status(200).send(clientList);
            } else {
                return reply.status(404).send({message: "Cliente List não encontrado"})
            }
            
        } catch (error) {
            return reply.status(500).send(error);
        }
    });
    
    server.delete("/delete/client/list", async (request, reply) => {
        try {
            await prismaClient.user_Client.deleteMany({});
            console.log("Todos os itens da tabela user_Client foram deletados."); // Apenas log no terminal
            return reply.status(200).send({ message: "Todos os registros foram excluídos com sucesso!" }); // Resposta correta
        } catch (error) {
            console.error("Erro ao excluir registros:", error);
            return reply.status(500).send({ message: "Erro interno no servidor", error });
        }
    });
}