import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";

export default async function RoutesClient() {

    server.post("/register/client", async (request, reply) => {
        const body = request.body as {name: string; email: string; password: string; };
        const {name, email, password} = body;
    
        try {
            const existingUserEmail = await prismaClient.user_Client.findUnique({where: {email}})

            if (!name || !email) {
                return reply.status(400).send({ message: "Nome ou Email não pode ser vazio" });
            }
            if (password.length < 8) {
                return reply.status(400).send({ message: "Senha deve ter pelo menos 8 caracteres" });
            } 
            if (existingUserEmail) {
                return reply.status(400).send({ message: "Email já cadastrado" });
            }
    
            const response = await prismaClient.user_Client.create({
                data: {
                    name,
                    email,
                    password
                }
            });
    
            return reply.status(201).send({response: response.id, message: "cliente criado com sucesso"});
            
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return reply.status(500).send({ message: "Erro interno do servidor" });
        };
    });
    
    //Login CLIENT
    server.post("/login/client", async (request, reply) => {
        const body = request.body as {email: string; password: string};
        const {email, password} = body;
    
        try {
            if (!email || !password) {
                return reply.status(404).send({message: "Email ou Senha não preenchidos"})
            }  
    
            const response = await prismaClient.user_Client.findUnique({where: {email}})
    
            if (!response ) {
                return reply.status(404).send({message: "Usuario não cadastrado"});
            };
            
            if (response.email !== email || response.password !== password){
                return reply.status(404).send({message: "Algum campo preenchido incorretamente"});
            };

            return reply.status(200).send({response: response.id, message: "id retornado com sucesso"});

        } catch (error) {
            return reply.status(500).send({error});            
        }
    
    });
    
    //Get CLIENT
    server.post("/get/client/id", async (request, reply) => {
        const body = request.body as {id: string}
        const {id} = body
        try {
            if (!id) {
                return reply.status(404).send({message: "ID não preenchido"});
            }

            const response = await prismaClient.user_Client.findUnique({where: {id}});
            
            if (!response) {
                return reply.status(404).send({message: "Usuario não encontrado"});
            };

            return reply.status(200).send({response, message: "o usuario cliente"});
            
        } catch (error) {
            return reply.status(500).send(error);
        }
    });
    
    //Get CLIENT LIST
    server.get("/get/client/list", async (request, reply) => {
        try {
            const response = await prismaClient.user_Client.findMany();

            if (!response) {
               return reply.status(404).send({message: "Cliente List não encontrado"})
            };

            return reply.status(200).send({response, message: "lista de clientes"});
            
        } catch (error) {
            return reply.status(500).send(error);
        }
    });

    server.post("/update/client", async (request, reply) => {
        const body = request.body as {id: string, oldName: string, newName?: string, oldPassword: string, newPassword?: string, userImageUrl?: string};
        const {id ,oldName, newName, oldPassword, newPassword, userImageUrl} = body;
    
        try {
            const userExisting = await prismaClient.user_Client.findUnique({where: {id}}) as {name: string, password: string};
    
            if (!userExisting) {
                return reply.status(500).send({message: "Usuario não existe"});
            }
            
            const {name, password} = userExisting; 
    
            if (!oldName || !oldPassword) {
                return reply.status(500).send({message: "Algum dos campo não foi preenchido"});
            }
    
            if (name !== oldName && password !== oldPassword) {
                return reply.status(404).send({message: "Campos Inválidos"});
            };

            const response = await prismaClient.user_Client.update({
                where: { id },
                data: {
                    name: newName ?? oldName,
                    password: newPassword ?? oldPassword,
                    userImageUrl
                }
            });

            return reply.status(200).send({response, message: "Atualizado com sucesso"});
    
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error})    
        }
    })
    
    // não deve ser usado
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

    server.post("/get/list/notificationTouristPoint/client", async (request, reply) => {
        const body = request.body as {idUser: string}
        const {idUser} = body
        try {
            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idUser}});
            if (!idUserExisting) {
                return reply.status(500).send({message: "id não existe no banco de dados"});
            };

            const response = await prismaClient.notificationTouristPoint.findMany({where: {idClient: idUser}})

            return reply.status(200).send({response, message: "notificações de adição do ponto turistico ao banco de dados" });
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error})    
        }
    });
}