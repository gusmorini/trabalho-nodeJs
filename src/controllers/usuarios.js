const { Usuario } = require ('../models');
const {gerarToken} = require('../utils/token');
const bcrypt = require('bcryptjs');


function cadastro(request, response, next) {

    const { body:{ nome, email, cpf, nascimento, senha } } = request

    const senhaCrypt = bcrypt.hashSync(senha,bcrypt.genSaltSync(10));

    Usuario.create({
        nome, email, cpf, nascimento, senha:senhaCrypt
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
            email
        }
    })
    .then(usuario => {
        if( (usuario !== null) || bcrypt.compareSync(senha, usuario.senha))
        {
            const token = gerarToken(usuario);
            response.status(200).cookie('token',token).send('usuário logado');
        }
        else
        {
            response.status(401).send('E-mail ou senha inválidos');
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possivel consultar o banco de dados')
    })
}

function usuario(request, response, next){
    response.json(request.usuarioLogado);
}

function logout (request, response, next){
    request.usuarioLogado = null;
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
