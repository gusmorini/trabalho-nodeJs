const { Usuario } = require ('../models');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "&uaQ76gR#SQPthHV82#Dt=HnUwzbM8KnP&T#uTvG*NsQZMspRt";
//const bcrypt = require('bcryptjs');

//let token = null;


function cadastro(request, response, next) {

    const { body } = request;
    const { nome, email, cpf, nascimento, senha} = body

    Usuario.create({
        nome, email, cpf, nascimento, senha
    })
    .then( usuario => {
        response.status(201).json(usuario)
    })
    .catch( ex => {
        console.error(ex);
        response.status(412).send('não foi possível incluir o registro')
    })
}

function buscaPorId(request, response, next) {
    
    const { params:{usuarioId} } = request

    Usuario.findById(usuarioId)
    .then(usuario => {
        if (!usuario){
            response.status(404).send('usuário não encontrado')
        }else{
            response.status(200).json(usuario)
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })

}

function edicao(request, response, next) {

    const {params:{usuarioId}, body:{nome, email, cpf, nascimento, senha}} = request

    Usuario.findById(usuarioId)
    .then( usuario => {
        if (!usuario){
            response.status(404).send('usuário não encontrado')
        }else{
            return usuario.update({
                nome, email, cpf, nascimento, senha
            })
            .then(()=>{
                response.status(200).json(usuario)
            })
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })
}

function login(request, response, next) {
    
    const {body:{ email, senha }} = request

    Usuario.findOne({
        where:{
            email,
            senha
        }
    })
    .then(usuario=>{
        if(usuario !== null){
            const { id, nome, email, cof, nascimento } = usuario
            const payload = {
                id, nome, email, cof, nascimento
            }
            const token = jwt.sign(payload, SECRET_KEY)
            response.status(200).cookie('token',token).send('usuário logado')
        }else{
            response.status(401).send('E-mail ou senha inválidos')
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possivel consultar o banco de dados')
    })


}

function usuario(request, response, next){

    const { cookies: {token} } = request;

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        console.log('Token válido', payload);
        response.status(200).send(payload);
      } catch (exception) {
        console.error('Token inválido', exception);
        response.status(403).send('Acesso negado');
      }

}

function logout (request, response, next){
    response.status(200).cookie('token',null).send('usuário deslogado')
}

module.exports = {
    cadastro,
    buscaPorId,
    usuario,
    edicao,
    login,
    logout
};
