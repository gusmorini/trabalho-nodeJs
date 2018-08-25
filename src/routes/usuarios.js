const express = require('express');
const router = express.Router();

const validateSchema = require('./validateSchema');
const controller = require('../controllers/usuarios');

/*******
 * TODO: Definição das rotas do CRUD de Usuários e Login.
 * Exemplo:
 * 
 * const validateBody = {
 *   // Schema de validação do Express Validator
 * };
 * 
 * 
 * router.post('/',
 *   validateSchema(validateBody),
 *   controller.cadastro
 * );
 *******/

router.post('/', controller.cadastro)
router.post('/login', controller.login)
router.get('/logout', controller.logout)
router.get('/:usuarioId', controller.buscaPorId)
router.get('/', controller.usuario)
router.put('/:usuarioId', controller.edicao)

module.exports = router;
