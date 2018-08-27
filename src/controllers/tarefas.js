
const { Tarefa } = require('../models');
const Sequelize = require('sequelize');

function cadastro(request, response, next) {

	const { body:{ titulo, descricao }, usuarioLogado: { id } } = request;

	//const usuarioId = request.usuarioLogado.id;

	Tarefa.create({
        titulo, descricao, usuarioId:id
    })
    .then( tarefa => {
        response.status(201).json(tarefa)
    })
    .catch( ex => {
        console.error(ex);
        response.status(412).send('não foi possível incluir o registro')
    })

}

function listagem(request, response, next) {

	const { usuarioLogado: { id }, query:{titulo}  } = request;

    const tarefaQuery = {
        where:{ usuarioId: id }
    }

    if (titulo){
        tarefaQuery.where.titulo = {
            [Sequelize.Op.like]: `%${titulo}%`
        },
        tarefaQuery.where.usuarioId = id
    }

	Tarefa.findAll(tarefaQuery).then(tarefa => {
		if(!tarefa){
			response.status(404).send('nenhuma tarefa encontrada')
		}else{
			response.status(200).json(tarefa);
		}
	})
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })

}

function buscaPorId(request, response, next) {

	const { params:{tarefaId} } = request

    Tarefa.findById(tarefaId)
    .then(tarefa => {
        if (!tarefa){
            response.status(404).send('tarefa não encontrada')
        }else{
            response.status(200).json(tarefa)
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })

}

function edicao(request, response, next) {
	const { params:{ tarefaId }, body:{ titulo, descricao }} = request;

	Tarefa.findById(tarefaId)
    .then( tarefa => {
        if (!tarefa){
            response.status(404).send('tarefa não encontrada')
        }else{
            return tarefa.update({
                titulo, descricao
            })
            .then(()=>{
                response.status(200).json(tarefa)
            })
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })
}

function remocao(request, response, next) {

    const { params:{tarefaId} } = request;

    Tarefa.destroy({
        where: {
            id: tarefaId
        }
    })
    .then( deletados => {
        if(deletados > 0)
        {
            response.status(204).send()
        }
        else
        {
            response.status(404).send('Tarefa deletada')
        }
    })
    .catch(ex => {
        console.error(ex)
        response.status(412).send('Não foi possivel deletar a tarefa')
    })

}

function marcarConcluida(request, response, next) {

	const { params:{ tarefaId }, body:{ titulo, descricao }} = request;

	Tarefa.findById(tarefaId)
    .then( tarefa => {
        if (!tarefa){
            response.status(404).send('tarefa não encontrada')
        }else{
            return tarefa.update({
                concluida:1
            })
            .then(()=>{
                response.status(200).json(tarefa)
            })
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })

}

function desmarcarConcluida(request, response, next) {

	const { params:{ tarefaId }, body:{ titulo, descricao }} = request;

	Tarefa.findById(tarefaId)
    .then( tarefa => {
        if (!tarefa){
            response.status(404).send('tarefa não encontrada')
        }else{
            return tarefa.update({
                concluida:null
            })
            .then(()=>{
                response.status(200).json(tarefa)
            })
        }
    })
    .catch(ex=>{
        console.error(ex)
        response.status(412).send('não foi possível consultar o banco de dados')
    })

}

module.exports = {
    cadastro,
    listagem,
    buscaPorId,
    edicao,
    remocao,
    marcarConcluida,
    desmarcarConcluida,
};
