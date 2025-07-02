import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";

export default async function RoutesBusiness() {

    server.post("/register/business", async (request, reply) => {
        const body = request.body as {name: string; email: string; password: string; CNPJ: string; telefone: string};
        const {name, email, password, CNPJ, telefone} = body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const CNPJRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

        try {
            const existingUserEmail = await prismaClient.user_Business.findUnique({where: {email}})
    
            if (!name || !email || !telefone) {
                return reply.status(400).send({ message: "Nome, telefone ou Email não pode ser vazio" });
            }
            if (!emailRegex.test(email)) {
                return reply.status(400).send({ message: "Formato de email não suportado" });
            }
            if (!CNPJRegex.test(CNPJ)) {
                return reply.status(400).send({ message: "Formato de CNPJ não suportado" });   
            } 
            if (password.length < 8) {
                return reply.status(400).send({ message: "Senha deve ter pelo menos 8 caracteres" });
            } 
            if (existingUserEmail) {
                return reply.status(400).send({ message: "Usuario já cadastrado" });
            }
    
            const response = await prismaClient.user_Business.create({
                data: {
                    name,
                    email,
                    password,
                    CNPJ,
                    telefone
                }
            });
    
            return reply.status(201).send({response: response.id, message: "criado com sucesso"});
            
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});       
        };
    });
    
    //Login BUSINESS
    server.post("/login/business", async (request, reply) => {
        const body = request.body as {email: string; password: string};
        const {email, password} = body;
    
        try {
            if (!email || !password) {
                return reply.status(404).send({message: "Email ou Senha não preenchidos"})
            }  
    
            const response = await prismaClient.user_Business.findUnique({where: {email}})
    
            if (!response) {
                return reply.status(404).send({message: "Usuario não cadastrado"});
            };
            if (response.email !== email && response.password !== password){
                return reply.status(404).send({message: "Algum campo preenchido incorretamente"});
            };

            return reply.status(200).send({response: response.id, message: "id retornado com sucesso"});

        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});                   
        }
    
    });
    
    //Get BUSINESS
    server.post("/get/business/id", async (request, reply) => {
        const body = request.body as {id: string};
        const {id} = body
        try {
            if (!id) {
                return reply.status(404).send({message: "ID não preenchido"});
            };

            const response = await prismaClient.user_Business.findUnique({where: {id}});

            if (!response) {
                return reply.status(404).send({message: "Usuario não encontrado"});
            };

            return reply.status(200).send({response, message: "usuario business retornado"});
            
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});       
        }
    });
    
    //Get BUSINESS LIST
    server.get("/get/business/list", async (request, reply) => {
        try {
            const response = await prismaClient.user_Business.findMany();
            if (!response) {
                return reply.status(404).send({message: "Empresa List não encontrado"})
            }

            return reply.status(200).send({response, message: "lista de business"});
            
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});        
        }
    });

    server.post("/update/business", async (request, reply) => {
        const body = request.body as {id: string, newName?: string, oldPassword: string, newPassword?: string, newTelefone?: string, userImageUrl?: string};
        const {id, newName, oldPassword, newPassword, newTelefone, userImageUrl} = body;

        try {
            if (!id || !oldPassword) {
                return reply.status(500).send({message: "o campo id ou o campo senha não podem ser vazios"})  
            }

            const idExisting = await prismaClient.user_Business.findUnique({where: {id}});

            if(!idExisting) {
                return reply.status(500).send({message: "não existe esse usuario dentro do banco de dados"});
            };

            if(idExisting.password != oldPassword) {
                return reply.status(500).send({message: "as senhas não se coincidem"});
            };

            const response = await prismaClient.user_Business.update({
                where: {id},
                data: {
                    name: newName ?? idExisting.name,
                    password: newPassword ?? oldPassword,
                    telefone: newTelefone ?? idExisting.telefone,
                    userImageUrl
                }
            });

            return reply.status(200).send({response, message:"atualizado com sucesso"})
    
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});    
        }
    })

        // não deve ser usado
    server.delete("/delete/business/list", async (request, reply) => {
        try {
            await prismaClient.user_Business.deleteMany({});
            console.log("Todos os itens da tabela user_Business foram deletados."); // Apenas log no terminal
            return reply.status(200).send({ message: "Todos os registros foram excluídos com sucesso!" }); // Resposta correta
        } catch (error) {
            console.error("Erro ao excluir registros:", error);
            return reply.status(500).send({ message: "Erro interno no servidor", error });
        }
    });
}