const express = require('express');
const router = express.Router();

const { authenticationMiddleware } = require('../utils/token');
const validateSchema = require('./validateSchema');
const controller = require('../controllers/tarefas');

/*******
 * TODO: Definição das rotas do CRUD de Tarefas.
 * Exemplo:
 * 
 * const validateBody = {
 *   // Schema de validação do Express Validator
 * };
 * 
 * 
 * router.post('/',
 *   validateSchema(validateBody),
 *   authenticationMiddleware,
 *   controller.cadastro,
 * );
 *******/

router.get('/', (request, response) => {
    response.status(200).send('tarefas');
 });

module.exports = router;
