import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";
import { request } from "http";

export default async function RoutesAdmin() {
//Register ADMIN
    server.post("/register/admin", async (request, reply) => {
    const body = request.body as {name: string; email: string; password: string};
    const {name, email, password} = body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        const existingUserEmail = await prismaClient.user_Admin.findUnique({where: {email}})

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

        const response = await prismaClient.user_Admin.create({
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

//Login ADMIN
    server.post("/login/admin", async (request, reply) => {
        const body = request.body as {name: string; email: string; password: string};
        const {name, email, password} = body;

        try {
            if (!name || !email || !password) {
                return reply.status(404).send({message: "Email ou Nome ou Senha não preenchidos"})
            }  

            const existingUser = await prismaClient.user_Admin.findUnique({where: {email}})

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

//Get ADMIN
    server.get("/get/admin/:id", async (request, reply) => {
            const body = request.params as {id: string};
            const {id} = body
            try {
            const existingUserEmail = await prismaClient.user_Admin.findUnique({where: {id}});
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

//Get ADMIN LIST
    server.get("/get/admin/list", async (request, reply) => {
        try {
            const adminList = await prismaClient.user_Admin.findMany();
            if (adminList) {
                return reply.status(200).send(adminList);
            } else {
                return reply.status(404).send({message: "Admin List não encontrado"})
            }
            
        } catch (error) {
            return reply.status(500).send(error);
        }
    });

//Update Admin 
    server.post("/update/admin", async (request, reply) => {
        const body = request.body as {id: string, oldName: string, newName?: string, oldPassword: string, newPassword?: string};
        const {id ,oldName, newName, oldPassword, newPassword} = body;

        try {
            const userExisting = await prismaClient.user_Admin.findUnique({where: {id}}) as {name: string, password: string};

            if (!userExisting) {
                return reply.status(500).send({message: "Usuario não existe"});
            }
            
            const {name, password} = userExisting; 

            if (!oldName || !oldPassword) {
                return reply.status(500).send({message: "Algum dos campo não foi preenchido"});
            }
            if (!!newPassword) {
                if (newPassword.length < 8) {
                    return reply.status(500).send({message: "Senha não pode ter menos que 8 caracteres"});  
                }
            }

            if (name === oldName  && password === oldPassword) {
                const response = await prismaClient.user_Admin.update({
                    where: { id },
                    data: {
                        name: newName ?? oldName,
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

// não deve ser mexida
    server.delete("/delete/admin/list", async (request, reply) => {
        try {
            await prismaClient.user_Admin.deleteMany({});
            console.log("Todos os itens da tabela user_Admin foram deletados."); // Apenas log no terminal
            return reply.status(200).send({ message: "Todos os registros foram excluídos com sucesso!" }); // Resposta correta
        } catch (error) {
            console.error("Erro ao excluir registros:", error);
            return reply.status(500).send({ message: "Erro interno no servidor ", error });
        }
    });
}