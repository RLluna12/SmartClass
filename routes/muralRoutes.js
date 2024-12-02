// routes/publicacaoRoutes.js
const express = require('express');
const router = express.Router();
const muralController = require('../controllers/muralController');

// Rota para listar todas as publicações
router.get('/', muralController.getAllPublicacoes);

// Rota para obter uma publicação específica por ID
router.get('/:id_pub', muralController.getPublicacaoById);

// Rota para adicionar uma nova publicação
router.post('/', muralController.createPublicacao);

// Rota para atualizar uma publicação existente
router.put('/:id_pub', muralController.updatePublicacao);

// Rota para deletar uma publicação existente
router.delete('/:id_pub', muralController.deletePublicacao);

module.exports = router;
