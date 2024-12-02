// AlunosRoutes.js
const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunosController');

// すべての生徒のリストを取得
router.get('/', alunoController.getAllAluno);

// 特定の生徒の情報を取得する
router.get('/:id_aluno', alunoController.getAlunoById);

// 特定の生徒の成績情報を取得する
router.get('/:id_aluno/notas_faltas', alunoController.getNotasFaltasByAluno);

router.get('/search/:query', alunoController.searchAlunosByCPFOrEmailOrRa);


router.put('/:id_aluno/turma', alunoController.updateAlunoTurma);

module.exports = router;
