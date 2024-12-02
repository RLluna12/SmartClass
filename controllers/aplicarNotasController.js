// controllers/aplicarNotasController.js
const db = require('../db');

exports.fetchNotasFaltas = (req, res) => {
  const { turmaId, disciplinaId, year, semestre } = req.query;
  const query = `
    SELECT A.id_aluno, A.nome_aluno, A.foto, NF.N1, NF.AP, NF.AI, NF.id_notas_faltas
    FROM aluno A
    JOIN NotasFaltas NF ON A.id_aluno = NF.id_aluno
    WHERE NF.id_turma = ? AND NF.id_disciplina = ? AND NF.ano = ? AND NF.semestre = ?
  `;
  
  db.query(query, [turmaId, disciplinaId, year, semestre], (err, results) => {
    if (err) {
      console.error('Error fetching notas_faltas: ' + err);
      res.status(500).json({ message: '成績データの取得中にエラーが発生しました' });
    } else {
      res.json(results);
    }
  });
};