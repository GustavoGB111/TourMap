# TourMap

#API Tour_Map (Ainda incompleta)
API utiliza typescript, prisma ORM e node.js

ter o node instalado na maquina
O prisma precisa de um banco de dados, a URL deve ser posta dentro de "DATABASE_URL" no arquivo ".env"

Instalar pacotes do:
prisma
typescript

instalar extensões:
REST Client -- para consumir rotas http

para rodar: 
deve ser rodado o comando "npm run dev" que irá inicializar a porta por onde a API será consumida

//////////////// Rotas //////////////////////

*Login/Register Admin Routes*
POST - /register/admin -- necessita de: {name: string; email: string; password: string}
Rota de registro de um admin

POST - /login/admin -- necessita de: {name: string; email: string; password: string}
Rota de Login de um admin

GET - /get/admin/:id -- necessita de: {id: string}
Rota que busca um admin por id

GET - /get/admin/list -- não necessita de nada
Rota que busca a lista de admins

POST - /update/admin -- necessita de: {id: string, oldName: string, newName?: string, oldEmail:string ,newEmail?: string, oldPassword: string, newPassword?: string}
Rota que atualiza registros de um admin

////////////////////////////////////////////

*Login/Register Client Routes*
POST - /register/client -- necessita de: {name: string; email: string; password: string}
Rota que registra um Cliente

POST - /login/client -- necessita de: {name: string; email: string; password: string}
Rota que faz Login de um Cliente

GET - /get/client/:id -- necessita de: {id: string}
Rota que busca um Cliente por id

GET - /get/client/list -- não necessita de nada
Rota que busca a lista de Clientes

POST - /update/client -- necessita de: {id: string, oldName: string, newName?: string, oldEmail:string ,newEmail?: string, oldPassword: string, newPassword?: string}
Rota que atualiza dados de um Cliente

////////////////////////////////////////////

*Login/Register Business Routes*
POST - /register/business -- necessita de: {name: string; email: string; password: string; CNPJ: string}
Rota que registra uma Empresa

POST - /login/business -- necessita de: {name: string; email: string; password: string; CNPJ: string}
Rota que faz Login de uma Empresa

GET - /get/business/:id -- necessita de: {id: string}
Rota que busca uma Empresa por id

GET - /get/business/list -- não necessita de nada
Rota que retorna a lista de Empresas

POST - /update/business -- necessita de: {id: string, oldName: string, newName?: string, oldEmail:string ,newEmail?: string, oldPassword: string, newPassword?: string};
Rota que atualiza o registro de uma Empresa

////////////////////////////////////////////

*Commercial Point Routes*
POST - /register/commercialPoint -- necessita de: {idBusiness: string; name:string; local:string ; description:string; creationDate:Date}
Rota que cria um novo ponto comercial

POST - /update/commercialPoint -- necessita de: {idBusiness: string; idPoint: string; newName: string; newLocal: string; newDescription: string}
Rota que atualiza um ponto comercial existente

POST - /get/commercialPoint -- necessita de: {idBusiness: string; idPoint: string}
rota que busca um ponto comercial de uma dada empresa

POST - /get/list/commercialPoint -- necessita de: {idBusiness: string}
rota que pega todos os pontos comerciais de uma empresa

DELETE - /delete/commercialPoint -- necessita de: {idBusiness: string; idPoint: string}
rota que deleta um ponto comercial

////////////////////////////////////////////

*Tourist Point Routes*
POST - /register/touristPoint -- necessita de: { id: string;name: string; description: string; creationDate: Date; local: string};
Rota que registra um Ponto Turistico

POST - /update/touristPoint -- necessita de: { idUser: string; idTouristPoint: string; newName?:string; newDescription?: string; newLocal?: string}
Rota que atualiza um Ponto Turistico

POST - /get/touristPoint -- necessita de: {idUser: string; idTouristPoint: string};
Rota que busca um ponto turistico por id

POST - /get/list/touristPoint -- necessita de: {idUser: string}
Rota que busca a lista de pontos turisticos

DELETE - /delete/list -- necessita de: {idUser: string; idTouristPoint: string}
Rota que deleta um ponto turistico

POST - /report/touristPoint -- necessita de: {idUser: string; idTouristPoint: string}
Rota que reporta um ponto Turistico


////////////////// OBSERVAÇÕES //////////////////////////

1- as rotas ainda não verificam a tipagem dos dados passados 

2- as rotas Avaliações, Comentario e RoteiroViagem ainda não estão finalizadas pelos motivos:
2.1- o banco de dados não esta adequado a estas rotas e deve ser ligeiramente atualizado
2.2- não produzi tanto a API por alguns problemas psicologicos e pessoais e ela não esta documentada pelos mesmos motivos
2.3- ainda estou em processo de aprendizado em relação a APIs, PRISMA e TYPESCRIPT

3- as rotas podem ser consumidas dentro da pasta "Test" dentro do "src"


////////////////////////// ASS: Gustavo //////////////////////////