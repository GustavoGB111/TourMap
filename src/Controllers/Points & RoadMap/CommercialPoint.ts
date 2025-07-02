import { connect } from "http2";
import {prismaClient} from "../../Database/prismaClient"
import server from "../../Test/exeServer"
import { request } from "http";

export default async function RoutesCommercialPoint() {
    server.post("/register/commercialPoint", async (request, reply) => {
        const body = request.body as {idBusiness: string; name:string; local:string ; description:string; creationDate:Date}
        const {idBusiness, name, local, description, creationDate} = body
        
        try {
            
            if (!name || !local || !description || !creationDate) {
                return reply.status(400).send({message: "Campos inválidos"});
            }
            if (!idBusiness) {
                return reply.status(400).send({message: "id da Empresa não fornecido"})
            }

            const businessIdExisting = await prismaClient.user_Business.findUnique({where: {id: idBusiness}});
            const localExistingTourist = await prismaClient.ponto_Turistico.findUnique({where: {local}});
            const localExistingCommercial = await prismaClient.ponto_Comercial.findUnique({where: {local}})
            
            
            if (!businessIdExisting) {
                return reply.status(400).send({message: "id da Empresa não existente"});
            }
            if (!!localExistingCommercial || !!localExistingTourist) {
                return reply.status(400).send({message: "local já ocupado"});
            }

            const response = await prismaClient.ponto_Comercial.create({
                data: {
                    name,
                    local,
                    description,
                    creationDate,
                    User_Business: {
                        connect: { id: idBusiness }
                      }
                }
            });

            return reply.status(201).send({response: response.id, message:"ponto turistico criado com sucesso"})

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    
    });

    server.post("/update/commercialPoint", async (request, reply) => {
        const body = request.body as {idBusiness: string; idPoint: string; newName: string; newLocal: string; newDescription: string};
        const {idBusiness, idPoint, newName, newLocal, newDescription} = body

        try {
        if (!newName || !newLocal || !newDescription) {
            return reply.status(400).send({message: "Campos inválidos"});
        }
        if (!idBusiness) {
            return reply.status(400).send({message: "id da Empresa não fornecido"});
        }
        if (!idPoint) {
            return reply.status(400).send({message: "id do Ponto Comercial não fornecido"});
        }

        const idBusinessExisting = await prismaClient.user_Business.findUnique({where: {id: idBusiness}});
        const idPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idPoint}}) as {name: string; description: string; local: string; businessId: string};
        const localExisting = await prismaClient.ponto_Comercial.findUnique({where: {local: newLocal}})    

        if (!idBusinessExisting) {
            return reply.status(400).send({message: "id da Empresa não existe"});
        }
        if (!idPointExisting) {
            return reply.status(400).send({message: "id do ponto comercial não existe"});
        }
        
        const {name, description, local, businessId} = idPointExisting;

        if (businessId != idBusiness) {
            return reply.status(400).send({message: "Você não é a empresa responsavel pelo ponto turistico..."});
        }
        if (!!localExisting) {
            return reply.status(400).send({message: "local já ocupado"});
        }
        

        const response = await prismaClient.ponto_Comercial.update({where: {id: idPoint}, 
            data: {
                name: newName ?? name,
                description: newDescription ?? description,
                local: newLocal ?? local
            }
        })

        return reply.status(200).send({response, message: "atualizado com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }

    });

    server.post("/get/commercialPoint", async (request, reply) => {
        const body = request.body as {idBusiness: string; idPoint: string}
        const {idBusiness, idPoint} = body

        try {
            if (!idBusiness) {
                return reply.status(400).send({message: "id da Empresa não fornecido"});
            }
            if (!idPoint) {
                return reply.status(400).send({message: "id do Ponto Comercial não fornecido"});
            }

            const idBusinessExisting = await prismaClient.user_Business.findUnique({where: {id: idBusiness}});
            const idPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idPoint}}) as {businessId: string};
     
            if (!idBusinessExisting) {
                return reply.status(400).send({message: "id da Empresa não existe"});
            }
            if (!idPointExisting) {
                return reply.status(400).send({message: "id do ponto comercial não existe"});
            }
            
            const {businessId} = idPointExisting;

            if (businessId != idBusiness) {
                return reply.status(400).send({message: "Você não é a empresa responsavel pelo ponto comercial..."});
            }

            const response = await prismaClient.ponto_Comercial.findUnique({where: {id: idPoint}});

            reply.status(200).send({response: response?.id, message: "dados do ponto comercial"})

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/list/commercialPoint/idBusiness", async (request, reply) => { // busca com base em um idbusiness, ou seja, procura todos os pontos comerciais dessa empresa
        try {
            const response = await prismaClient.ponto_Comercial.findMany();

            reply.status(200).send({response, message: "dados dos pontos comerciais da empresa"})
            
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.get("/get/list/commercialPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Comercial.findMany()

            reply.status(200).send({response, message: "Todos os registros de pontos comerciais"})
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.delete("/delete/commercialPoint", async (request, reply) => {
        const body = request.body as {idBusiness: string; idPoint: string}
        const {idBusiness, idPoint} = body

        try {
        if (!idBusiness) {
            return reply.status(400).send({message: "id da Empresa não fornecido"});
        }
        if (!idPoint) {
            return reply.status(400).send({message: "id do Ponto Comercial não fornecido"});
        }

        const idBusinessExisting = await prismaClient.user_Business.findUnique({where: {id: idBusiness}});
        const idPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idPoint}}) as {businessId: string};
 
        if (!idBusinessExisting) {
            return reply.status(400).send({message: "id da Empresa não existe"});
        }
        if (!idPointExisting) {
            return reply.status(400).send({message: "id do ponto comercial não existe"});
        }

        const {businessId} = idPointExisting;

        if (businessId != idBusiness) {
            return reply.status(400).send({message: "Você não é a empresa responsavel pelo ponto turistico..."});
        }

        await prismaClient.ponto_Comercial.delete({where:{id: idPoint}});

        return reply.status(400).send({message: "ponto turistico removido com sucesso"})
            
        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/report/commercialPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idCommercialPoint: string, contentReport: string}
        const {idUser, idCommercialPoint, contentReport} = body

        try {
            if (!idUser || !idCommercialPoint || !contentReport)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }
            const idUserExisting = await prismaClient.user_Client.findUnique({where: {id: idUser}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}});
            const reportExisting = await prismaClient.reportCommercialPoint.findUnique({where: {idCommercialPoint, idUserReport: idUser}});

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idCommercialPointExisting) {
                return reply.status(400).send({ message: "ID do ponto Comercial não existente" });
            };
            if (!!reportExisting) {
                return reply.status(400).send({ message: "você já denunciou esse ponto comercial" });
            }

            const {reportNumber} = idCommercialPointExisting
            const reportNum = reportNumber + 1;
            await prismaClient.ponto_Comercial.update({where: {id: idCommercialPoint}, data: {reportNumber: reportNum}})

            await prismaClient.reportCommercialPoint.create({
                data: {
                    content: contentReport,
                    userReportCommercialPointByIdCommercialPoint: {connect: {id: idCommercialPoint}},
                    userReportCommercialPointByIdUserReport: {connect: {id: idUser}}
                }
            });

            return reply.status(200).send({ message: "Denunciado com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/create/image/commercialPoint", async (request, reply) => {
        const body = request.body as {idUser: string, idCommercialPoint: string, ImageUrl: string}
        const {idUser, idCommercialPoint, ImageUrl} = body

        try {
            const idUserExisting = await prismaClient.user_Business.findUnique({where: {id: idUser}}) 
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idCommercialPointExisting) {
                return reply.status(400).send({ message: "ID do ponto Comercial não existente" });
            };
            if (!ImageUrl) {
                return reply.status(400).send({ message: "a url não pode ser vazia" });
            };

            await prismaClient.imageCommercialPoint.create({
                data: {
                    image: ImageUrl,
                    userCommercialPointByCommercialPointId: {connect: {id: idCommercialPoint}}
                }
                });

            return reply.status(201).send({message: "imagem adicionada com sucesso"});

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/image/list/commercialPoint", async (request, reply) => {
        const body = request.body as {idCommercialPoint: string}
        const {idCommercialPoint} = body

        try {
            const response = await prismaClient.imageCommercialPoint.findMany({where: {idCommercialPoint}});
            
            return reply.status(200).send({response, message:"Lista de imagens de um certo ponto comercial"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.delete("/delete/image/commercialPoint", async (request, reply) => {
        const body = request.body as {idCommercialPoint: string, imageUrl: string, idUser: string}
        const {idCommercialPoint, imageUrl, idUser} = body

        try {
            if (!idUser || !idCommercialPoint || !imageUrl)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }
            const idUserExisting = await prismaClient.user_Business.findUnique({where: {id: idUser}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idCommercialPointExisting) {
                return reply.status(400).send({ message: "ID do ponto comercial não existente" });
            };

            const imageUrlExisting = await prismaClient.imageCommercialPoint.findUnique({where: {idCommercialPoint, image: imageUrl}}) 

            if (idUser != idCommercialPointExisting.businessId) {
                return reply.status(400).send({ message: "Você não é o dono do ponto comercial" });
            }
            if (!imageUrlExisting) {
                return reply.status(400).send({ message: "imagem não existente" });
            };           
            
            await prismaClient.imageCommercialPoint.delete({where: {idCommercialPoint, image: imageUrl}});

            return reply.status(200).send({message: "imagem excluida com sucesso"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/publishOn/commercialPoint", async (request, reply) => { // pode trocar tanto de on pra off
        const body = request.body as {idCommercialPoint: string, idUser: string}
        const {idCommercialPoint, idUser} = body

        try {
            if (!idUser || !idCommercialPoint)  {
                return reply.status(400).send({message: "Algum campo não completado"});
            }

            const idUserExisting = await prismaClient.user_Business.findUnique({where: {id: idUser}});
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findUnique({where: {id: idCommercialPoint}})

            if (!idUserExisting) {
                return reply.status(400).send({ message: "ID do usuário não existente" });
            };
            if (!idCommercialPointExisting) {
                return reply.status(400).send({ message: "ID do ponto comercial não existente" });
            };
            if (idCommercialPointExisting.businessId != idUser){
                return reply.status(400).send({ message: "Você não é o dono do ponto comercial" });
            };

            await prismaClient.ponto_Comercial.update({where: {id: idCommercialPoint},
            data: {
                isPublished: true
            }
            });
            
            return reply.status(200).send({message: "ponto comercial publicado com sucesso"})

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.get("/get/notPublished/commercialPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Comercial.findMany({where: {isPublished: false}});
            reply.status(200).send({response ,message: "todas as rotas não publicadas de commercialPoint"});

        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.get("/get/Published/commercialPoint", async (request, reply) => {
        try {
            const response = await prismaClient.ponto_Comercial.findMany({where: {isPublished: true}});
            reply.status(200).send({response ,message: "todas as rotas publicadas de commercialPoint"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/reports/commercialPoint", async (request, reply) => {
        const body = request.body as {idCommercialPoint: string};
        const {idCommercialPoint} = body;

        try {
            const idCommercialPointExisting = await prismaClient.ponto_Comercial.findMany({where: {id: idCommercialPoint}});

            if(!idCommercialPointExisting) {
                reply.status(500).send({message: "o ponto comercial não existe"});
            }

            const response = await prismaClient.reportCommercialPoint.findMany({where: {idCommercialPoint}});

            return reply.status(200).send({response, message: "todas as denuncias do ponto comercial"});
            
        } catch (error) {
            reply.status(500).send({message: "erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });
}