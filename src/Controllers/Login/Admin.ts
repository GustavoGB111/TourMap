import server from "../../Test/exeServer";
import { prismaClient } from "../../Database/prismaClient";
import { request } from "http";

// Define todas as rotas relacionadas ao ADMIN
export default async function RoutesAdmin() {

// Cadastro de novo ADMIN
    server.post("/register/admin", async (request, reply) => {
    const body = request.body as {name: string; email: string; password: string};
    const {name, email, password} = body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // uso de regex pra validação de email

    try {
        const existingUserEmail = await prismaClient.user_Admin.findUnique({where: {email}})
        // consulta no banco de dados pra saber se o email existe

        // validações de campos obrigatórios e formato
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

        // Criação de um novo admin no banco
        const userAdmin = await prismaClient.user_Admin.create({
            data: {
                name,
                email,
                password
            }
        }); // adição de um admin no banco de dados

        return reply.status(201).send({response: userAdmin.id, message: "admin registrado com sucesso"}); // resposta da api caso tudo ok
        
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
         return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error}); // resposta pra alguma consulta invalida no banco de dados      
    };
});

// Login de um ADMIN
    server.post("/login/admin", async (request, reply) => {
        const body = request.body as {email: string; password: string};
        const {email, password} = body;

        try {
            if (!email || !password) {
                return reply.status(404).send({message: "Email ou Senha não preenchidos"});
            }; 
            // validação pra saber se email ou senha são nulos

            const userAdminExisting = await prismaClient.user_Admin.findUnique({where: {email}}); 
            // consulta no banco de dados pra saber se o usuario com o dado email existe

            if (!userAdminExisting) {
                return reply.status(404).send({message: "Usuario não cadastrado"});
            }; // validação para saber se o usuario está ou não cadastrado

            if (userAdminExisting.password !== password){
                return reply.status(404).send({message: "Algum campo preenchido incorretamente"});
            }; // validação para saber se as senhas coincidem

            return reply.status(200).send({response: userAdminExisting.id, message: "admin logado com sucesso"}); // resposta para caso tudo dê certo
        
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error}); // resposta pra alguma consulta invalida no banco de dados      
        }
    });

// Busca de ADMIN por ID
    server.post("/get/admin/id", async (request, reply) => {
            const body = request.body as {id: string};
            const {id} = body
            try {
            if (!id) {
                return reply.status(404).send({message: "ID não preenchido"});
            }; // validação pra saber se o id não é nulo

            const userAdminExisting = await prismaClient.user_Admin.findUnique({where: {id}}); 
            // busca no banco de dados para os dados do id registrado

            if (!userAdminExisting) {
                return reply.status(404).send({message: "Usuario não encontrado"});
            }; // para saber se o id existe ou não

            return reply.status(200).send({response: userAdminExisting, message: "usuario admin"}); // resposta da api pro get
            
        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});  // resposta pra alguma consulta invalida no banco de dados        
        }
    });

// Listagem de todos os ADMINs
    server.post("/get/admin/list", async (request, reply) => {
        const body = request.body as {idUser: string};
        const {idUser} = body;

        try {
            const idUserExisting = prismaClient.user_Admin.findUnique({where: {id: idUser}});

            if(!idUserExisting) {
                return reply.status(200).send({message: "você não é um admin"});
            } // validação pra saber se o id é de um admin

            const adminListExisting = await prismaClient.user_Admin.findMany(); 
            
            if (!adminListExisting) { 
                return reply.status(404).send({message: "Admin List não encontrado"});
            }; // validação pra lista de admins

            return reply.status(200).send({response: adminListExisting, message: "a lista de admins"}); // resposta pra tudo ok

        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});  // resposta pra alguma consulta invalida no banco de dados        
        }
    });

// Atualização de ADMIN
    server.post("/update/admin", async (request, reply) => {
        const body = request.body as {id: string, oldName: string, newName?: string, oldPassword: string, newPassword?: string};
        const {id ,oldName, newName, oldPassword, newPassword} = body;

        try {
            const userExisting = await prismaClient.user_Admin.findUnique({where: {id}}) as {name: string, password: string};
            // busca no banco de dados por um usuario admin

            if (!userExisting) {
                return reply.status(500).send({message: "Usuario não existe"});
            } // saber se o usuario admin existe no banco de dados
            
            const {name, password} = userExisting; // desestruturação 

            if (!oldName || !oldPassword) {
                return reply.status(500).send({message: "Algum dos campo não foi preenchido"});
            } // validação pra saber se o oldName ou oldPassword não são nulos

            if (!!newPassword) {
                if (newPassword.length < 8) {
                    return reply.status(500).send({message: "Senha não pode ter menos que 8 caracteres"});  
                }
            } // validando a newPassword

            if (name !== oldName  || password !== oldPassword) {
                return reply.status(404).send({ message: "Campos Inválidos"});
            }; // validação do nome e da senha serem iguais

            const response = await prismaClient.user_Admin.update({
                where: { id },
                data: {
                    name: newName ?? oldName,
                    password: newPassword ?? oldPassword
                }
            }); // update do admin

            return reply.status(200).send({response, message: "Atualizado com sucesso"}); // resposta pra tudo OK

        } catch (error) {
            return reply.status(500).send({message: "Erro desconhecido ou interno no servidor...", error});   
        }
    })

// Rota perigosa — não deve ser usada
    server.delete("/delete/admin/list", async (request, reply) => {
        try {
            await prismaClient.user_Admin.deleteMany({});
            console.log("Todos os itens da tabela user_Admin foram deletados."); // Apenas log no terminal
            return reply.status(200).send({ message: "Todos os registros foram excluídos com sucesso!" }); // Resposta correta
        } catch (error) {
            console.error("Erro ao excluir registros:", error);
            return reply.status(500).send({ message: "Erro interno no servidor ", error }); // resposta pra alguma consulta invalida no banco de dados      
        }
    });
}