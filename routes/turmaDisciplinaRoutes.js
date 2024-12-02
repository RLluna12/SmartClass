// routes/turmaDisciplinaRoutes.js
const express = require('express');
const router = express.Router();
const turmaDisciplinaController = require('../controllers/turmaDisciplinaController');

// TurmaのCRUDエンドポイント
router.get('/', turmaDisciplinaController.getAllTurmasDisciplinas);
// router.get('/:id_turma/:id_disciplina', turmaDisciplinaController.getTurmaById);
router.post('/', turmaDisciplinaController.addTurmasDisciplinas);
router.delete('/:id_turma/:id_disciplina', turmaDisciplinaController.deleteTurmasDisciplinas);



module.exports = router;
