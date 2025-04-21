import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";

export default async function RoutesClient() {

    server.post("/register/client", async (request, reply) => {
        const body = request.body as {name: string; email: string; password: string};
        const {name, email, password} = body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        try {
            const existingUserEmail = await prismaClient.user_Client.findUnique({where: {email}})
    
            if (!name || !email) {
                return reply.status(400).send({ message: "Nome ou Email não pode ser vazio" });
            } 
            if (!emailRegex.test(email)) {
                return reply.status(400).send({ message: "Formato de email não suportado" });
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
            if (existingUserEmail) {
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

    server.post("/edit/client", async (request, reply) => {
        const body = request.body as {id: string, oldName: string, newName?: string, oldEmail:string ,newEmail?: string, oldPassword: string, newPassword?: string};
        const {id ,oldName, newName, oldEmail, newEmail, oldPassword, newPassword} = body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        try {
            const userExisting = await prismaClient.user_Client.findUnique({where: {id}}) as {name: string, email: string, password: string};
            const userExistingEmail = await prismaClient.user_Client.findUnique({where: {email: newEmail}});
    
            if (!userExisting) {
                return reply.status(500).send({message: "Usuario não existe"});
            }
            
            const {name, email, password} = userExisting; 
    
            if (!oldEmail || !oldName || !oldPassword) {
                return reply.status(500).send({message: "Algum dos campo não foi preenchido"});
            }
            if (newEmail != undefined) {
                if (!emailRegex.test(newEmail)){
                    return reply.status(500).send({message: "Novo Email inválido"});  
                }
            }
            if (!emailRegex.test(oldEmail))  {
                return reply.status(500).send({message: "Antigo Email inválido"});
            }
            if (newPassword != undefined) {
                if (newPassword.length < 8) {
                    return reply.status(500).send({message: "Senha não pode ter menos que 8 caracteres"});  
                }
            }   
            if (userExistingEmail != null) {
                return reply.status(500).send({message: "Email ja cadastrado"})  
            }
    
            if (name === oldName && email === oldEmail && password === oldPassword) {
                const response = await prismaClient.user_Client.update({
                    where: { id },
                    data: {
                        name: newName ?? oldName,
                        email: newEmail ?? oldEmail,
                        password: newPassword ?? oldPassword
                    }
                });
                return reply.status(200).send({ message: "Atualizado com sucesso", data: response });
            } else {
                return reply.status(404).send({ message: "Campos Inválidos"});
            }
    
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error})    
        }
    })
}