const express = require('express');
const router = express.Router();
const calendarioController = require('../controllers/calendarioController');

// Rota para listar todos os eventos (permite acesso ao administrador e professor)
router.get('/listar', calendarioController.getAllEventos);

// Rota para criar um novo evento (permite acesso ao administrador e professor)
router.post('/criar', calendarioController.createEvento);

// Rota para editar um evento existente (permite acesso ao administrador e professor)
router.put('/editar/:id_evento', calendarioController.updateEvento);

// Rota para excluir um evento (permite acesso ao administrador e professor)
router.delete('/deletar/:id_evento', calendarioController.deleteEvento);

module.exports = router;
