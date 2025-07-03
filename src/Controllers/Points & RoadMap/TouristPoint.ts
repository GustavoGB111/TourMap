// Importa o servidor Fastify configurado
import server from "../../Test/exeServer";

// Importa a instância do cliente Prisma (ORM usado para acesso ao banco)
import { prismaClient } from "../../Database/prismaClient";

// Importações desnecessárias neste contexto (não estão sendo usadas)
import { connect } from "http2";
import { get, request } from "http";
import { REPLServer } from "repl";

// Função principal responsável por declarar todas as rotas relacionadas aos pontos turísticos
export default async function RoutesTouristPoints() {

    // Rota: Cadastrar ponto turístico
    server.post("/register/touristPoint", async (request, reply) => {
        // Recebe os dados do corpo da requisição
        const body = request.body as { id: string;name: string; description: string; creationDate: Date; local: string};
        const {id, name, description, creationDate, local} = body;      
        
        try {
            // Verifica se todos os campos obrigatórios foram preenchidos
            if (!name || !description || !creationDate || !local) {
                return reply.status(400).send({message: "Algum campo não preenchido"});
            };
            if (!id) {
                return reply.status(400).send({message: "id não fornecido"});
            };

            // Verifica se já existe um ponto com o mesmo local
            const localExistingOnDatabase = await prismaClient.ponto_Turistico.findUnique({where: {local}});

            // Verifica se o usuário cliente existe
            const idClientExisting = await prismaClient.user_Client.findUnique({where: {id}});

            if (!!localExistingOnDatabase) {
                return reply.status(500).send({message: "local já existente no banco de dados..."});
            };
            if(!idClientExisting) {
                return reply.status(500).send({message: "o cliente não existe no banco de dados..."});
            }

            // Cria o novo ponto turístico
            const response = await prismaClient.ponto_Turistico.create({
                data: {
                    name,
                    description,
                    local,
                    creationDate
                }
            });
            return reply.status(201).send({response: response.id ,message: "Ponto turistico adicionado"})
            
        } catch (error) {
            // Tratamento de erro genérico
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha"});
        };
    });

    // Rota: Atualizar ponto turístico
    server.put("/update/touristPoint", async (request, reply) => {
        // Recebe os dados da requisição
        const body = request.body as { idUser: string; idTouristPoint: string; newName?:string; newDescription?: string; newLocal?: string}
        const {idUser, idTouristPoint, newName, newDescription, newLocal} = body

        try {
            // Validação dos campos obrigatórios
            if (!idTouristPoint) {
                return reply.status(400).send({message: "id do Ponto Turistico não fornecido"});
            };
            if (!idUser) {
                return reply.status(400).send({message: "id do Usuario não fornecido"});
            }
            if (!newDescription || !newLocal || !newName) {
                return reply.status(400).send({message: "algum campo não foi preenchido"});
            };

            // Verifica se o usuário admin existe
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});

            // Busca os dados do ponto turístico atual
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}}) as {name: String; description: String; local: String};

            // Verifica se o novo local já existe
            const localExisting = await prismaClient.ponto_Turistico.findUnique({where: {local: newLocal}});

            // Dados atuais
            const {name, description, local} = idTouristPointExisting;

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            }
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turístico não existente" });
            }
            if (!!localExisting) {
                return reply.status(400).send({ message: "local ja ocupado"})
            }

            // Atualiza o ponto turístico
            const response = await prismaClient.ponto_Turistico.update({
                where: {id: idTouristPoint},
                data: {
                    name: newName ?? name,
                    description: newDescription ?? description,
                    local: newLocal ?? local
                }
            });
            return reply.status(200).send({response, message: "Atualizado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Obter ponto turístico pelo ID
    server.post("/get/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string};
        const {idTouristPoint} = body;

        try {
            if (!idTouristPoint) {
                return reply.status(400).send({message: "campos não preenchidos"});
            }

            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
            
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turístico não existente" });
            }
            
            const response = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            reply.status(200).send({response, message: "id do ponto turistico retornado"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Listar todos os pontos turísticos
    server.get("/get/list/touristPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Turistico.findMany();
            reply.status(200).send({response, message: "Todos os registros de Pontos Turisticos"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Deletar ponto turístico (admin)
    server.delete("/delete/touristPoint", async (request, reply) => {
        const body = request.body as {idUser: string; idTouristPoint: string};
        const {idUser, idTouristPoint} = body

        try {
            if (!idUser || !idTouristPoint)  {
                reply.status(400).send({message: "Algum campo não completado"});
            }

            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});
        
            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            }
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            }

            await prismaClient.ponto_Turistico.delete({where: {id: idTouristPoint}});
            return reply.status(200).send({ message: "Deletado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }

    });

    // Rota: Denunciar ponto turístico
    server.post("/report/touristPoint", async (request, reply) => {
        const body = request.body as {idUser: string; idTouristPoint: string, contentReport: string};
        const {idUser, idTouristPoint, contentReport} = body

        try {
            if (!idUser || !idTouristPoint || !contentReport)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}}) as {reportNumber: number};
            const reportExisting = await prismaClient.reportTouristPoint.findUnique({where: {idUserReport : idUser, idTouristPoint}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };
            if (!!reportExisting){
                return reply.status(400).send({ message: "você já denunciou esse ponto turistico" });
            }

            // Incrementa o número de denúncias
            const {reportNumber} = idTouristPointExisting;
            const reportNum = reportNumber + 1;
            await prismaClient.ponto_Turistico.update({where: {id: idTouristPoint}, data: {reportNumber: reportNum}});

            // Cria a denúncia
            await prismaClient.reportTouristPoint.create({
                data: {
                    content: contentReport,
                    userReportTouristPointByIdTouristPoint:{connect: {id: idTouristPoint}},
                    userReportTouristPointByIdUserReport:{connect: {id: idUser}}
                }
            })
            return reply.status(200).send({ message:"Denunciado com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Adicionar imagem ao ponto turístico
    server.post("/create/image/TouristPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idTouristPoint: string, ImageUrl: string}
        const {idUser, idTouristPoint, ImageUrl} = body

        try {
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}}) 
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };
            if (!ImageUrl) {
                return reply.status(400).send({ message: "a url não pode ser vazia" });
            };
            
            await prismaClient.imageTouristPoint.create({
                data: {
                    image: ImageUrl,
                    userTouristPointByTouristPointId: {connect: {id: idTouristPoint}}
                }
            });

            return reply.status(201).send({message: "imagem adicionada com sucesso"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Obter lista de imagens associadas a um ponto turístico
    server.post("/get/image/list/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string}
        const {idTouristPoint} = body

        try {
            // Busca todas as imagens associadas ao ID fornecido
            const response = await prismaClient.imageTouristPoint.findMany({where: {idTouristPoint}});
            
            return reply.status(200).send({response, message:"Lista de imagens de um certo ponto turistico"});

        } catch (error) {
            // Tratamento de erro caso o banco ou o servidor falhe
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        };
    });

    // Rota: Deletar imagem associada a um ponto turístico
    server.delete("/delete/image/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string, imageUrl: string, idUser: string}
        const {idTouristPoint, imageUrl, idUser} = body

        try {
            // Verifica se todos os campos obrigatórios estão preenchidos
            if (!idUser || !idTouristPoint || !imageUrl)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            // Verifica se usuário admin e ponto turístico existem
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };

            // Verifica se a imagem a ser deletada realmente existe
            const imageUrlExisting = await prismaClient.imageTouristPoint.findUnique({where: {idTouristPoint, image: imageUrl}});

            if (!imageUrlExisting) {
                return reply.status(400).send({ message: "imagem não existente" });
            };

            // Deleta a imagem
            await prismaClient.imageTouristPoint.delete({where: {idTouristPoint, image: imageUrl}});

            return reply.status(200).send({message: "imagem excluida com sucesso"});
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Publicar ponto turístico (disponibilizar para visualização pública)
    server.post("/publishOn/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string, idUser: string}
        const {idTouristPoint, idUser} = body

        try {
            // Valida campos obrigatórios
            if (!idUser || !idTouristPoint)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            // Verifica existência do admin e do ponto turístico
            const idUserExisting = await prismaClient.user_Admin.findUnique({where: {id: idUser}});
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findUnique({where: {id: idTouristPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idTouristPointExisting) {
                return reply.status(400).send({ message: "ID do ponto turistico não existente" });
            };

            // Atualiza o campo de publicação do ponto turístico
            await prismaClient.ponto_Turistico.update({
                where: {id: idTouristPoint},
                data: {
                    isPublished: true
                }
            });

            // Cria uma notificação associada à publicação do ponto turístico
            await prismaClient.notificationTouristPoint.create({
                data: {
                    userNotificationTouristPointByIdClient: {connect: {id: idUser}},
                    userNotificationTouristPointByIdTouristPoint: {connect: {id: idTouristPoint}}
                }
            });
            
            return reply.status(200).send({message: "ponto turistico publicado com sucesso"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Obter todas as denúncias de um ponto turístico
    server.post("/get/reports/touristPoint", async (request, reply) => {
        const body = request.body as {idTouristPoint: string};
        const {idTouristPoint} = body;

        try {
            // Verifica se o ponto turístico existe
            const idTouristPointExisting = await prismaClient.ponto_Turistico.findMany({where: {id: idTouristPoint}});

            if(!idTouristPointExisting) {
                reply.status(500).send({message: "o ponto turistico não existe"});
            }

            // Busca todas as denúncias associadas
            const response = await prismaClient.reportTouristPoint.findMany({where: {idTouristPoint}});

            return reply.status(200).send({response, message: "todas as denuncias do ponto turistico"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Obter pontos turísticos ainda não publicados
    server.get("/get/notPublished/touristPoint", async (request, reply) => {
        try {
            // Filtra por pontos com isPublished = false
            const response = await prismaClient.ponto_Turistico.findMany({where: {isPublished: false}});
            reply.status(200).send({response, message: "todas as rotas não publicadas de touristPoint"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    // Rota: Obter pontos turísticos publicados
    server.get("/get/Published/touristPoint", async (request, reply) => {
        try {
            // Filtra por pontos com isPublished = true
            const response = await prismaClient.ponto_Turistico.findMany({where: {isPublished: true}});
            reply.status(200).send({response, message: "todas as rotas publicadas de touristPoint"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}

