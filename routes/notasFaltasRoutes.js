// routes/notasFaltasRoutes.js
const express = require('express');
const router = express.Router();
const notasFaltasController = require('../controllers/notasFaltasController');

// 成績を取得するルート
router.get('/notas/:alunoId', notasFaltasController.getNotas);
router.get('/notasByid_notas_faltas/:id_notas_faltas', notasFaltasController.getNotasByid_notas_faltas);
router.get('/notasByid_notas_faltas/:id_aluno/:id_disciplina', notasFaltasController.getFaltasDetalhesById_alunoId_disciplina);
// 成績を特定の学年・学期で取得するルート
router.get('/notas/:alunoId/:ano/:semestre', notasFaltasController.getNotasByAnoESemestre);
// 成績を更新するルート（例えば教員向けの機能）
router.put('/notas/:id_notas_faltas', notasFaltasController.updateNota);
// 新しい成績を追加するルート（例えば教員向けの機能）
router.post('/notas', notasFaltasController.addNota);
// 成績を削除するルート
router.delete('/notas/:notaId', notasFaltasController.deleteNota);

// /notas_faltasApri エンドポイントのルート設定
router.get('/notas_faltasApri', notasFaltasController.getNotasFaltasApri);

// /notas_faltasApriエンドポイントにGETリクエストを設定
router.get('/faltas_detalhes', notasFaltasController.getNotasFaltasDetails);

// 欠席日の削除ルート
router.delete('/delete/:id_faltas_detalhes', notasFaltasController.deleteFaltasDetalhes);

// 選択されたIDをもとに faltas_detalhes に欠席を追加
router.put('/faltas', notasFaltasController.addFaltasDetalhes);

// 生徒の詳細ページ
router.get('/detalhesAluno', notasFaltasController.getAlunoDetails);


module.exports = router;
