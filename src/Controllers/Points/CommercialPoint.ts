import {prismaClient} from "../../Database/prismaClient"
import server from "../../Test/exeServer"

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

            

            return reply.status(201).send({response, message:"ponto turistico criado com sucesso"})

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
                return reply.status(400).send({message: "Você não é a empresa responsavel pelo ponto turistico..."});
            }

            const response = await prismaClient.ponto_Comercial.findUnique({where: {id: idPoint}});

            reply.status(200).send({response, message: "dados do ponto comercial"})

        } catch (error) {
            return reply.status(500).send({message:"erro interno no servidor ou requisição ao banco de dados falha", error});
        }
    });

    server.post("/get/list/commercialPoint", async (request, reply) => {
        const body = request.body as {idBusiness: string}
        const {idBusiness} = body

        try {
            if (!idBusiness) {
                return reply.status(400).send({message: "id da Empresa não fornecido"});
            }

            const idBusinessExisting = await prismaClient.user_Business.findUnique({where: {id: idBusiness}});
     
            if (!idBusinessExisting) {
                return reply.status(400).send({message: "id da Empresa não existe"});
            }

            const response = await prismaClient.ponto_Comercial.findMany({where: {businessId: idBusiness}});

            reply.status(200).send({response, message: "dados dos pontos comerciais da empresa"})
            
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
}