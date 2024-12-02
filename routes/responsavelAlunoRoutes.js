// responsavelAlunoRoutes.js
const express = require('express');
const router = express.Router();
const responsavelAlunoController = require('../controllers/responsavelAlunoController');

// すべてのResponsavel_Alunoのリストを取得
router.get('/', responsavelAlunoController.getAllResponsavelAluno);

// 特定のResponsavel_Alunoを取得
router.get('/:id_responsavel', responsavelAlunoController.getResponsavelAlunoByIdResponsavel);

// 新しいResponsavel_Alunoを追加
router.post('/', responsavelAlunoController.addResponsavelAluno);

// 指定されたResponsavel_Alunoを削除
router.delete('/:id_resp_aluno', responsavelAlunoController.deleteResponsavelAluno);



// 保護者の担当生徒を取得
router.get('/:id_responsavel/alunos', responsavelAlunoController.getAlunosByResponsavel);

// 生徒の成績・欠席情報を取得
router.get('/:id_aluno/notas_faltas', responsavelAlunoController.getAlunoNotasFaltas);


module.exports = router;
