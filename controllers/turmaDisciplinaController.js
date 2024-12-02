// controllers/turmaDisciplinaController.js
const db = require('../db'); // 既存のDB接続ファイルを使用

// すべてのTurmaを取得
exports.getAllTurmasDisciplinas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM turma_disciplina');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Turmaを追加
exports.addTurmasDisciplinas = async (req, res) => {
  const { id_turma, id_disciplina } = req.body;
  console.log("test :" + id_turma + " : " + id_disciplina)

  try {
    const [result] = await db.query(
      'INSERT INTO turma_disciplina (id_turma, id_disciplina) VALUES (?, ?)',
      [id_turma, id_disciplina]
    );
    res.status(201).json({ id_turma: result.insertId, id_turma, id_disciplina });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Registro já existe para essa combinação de turma e disciplina.' });
    }
    console.error('Error: ' + err);
    console.error(err.stack);
    res.status(500).json({ message: 'Falha ao adicionar tabela ao banco de dados' });
  }
};

// Turmaを削除
exports.deleteTurmasDisciplinas = async (req, res) => {
  const { id_turma, id_disciplina } = req.params;

  try {
    await db.query('DELETE FROM turma_disciplina WHERE id_turma = ? and id_disciplina = ?', [id_turma, id_disciplina]);
    res.json({ message: 'Turma_disciplina foi deletado' });
  } catch (err) {
    console.error('Error: ' + err);
    res.status(500).json({ message: 'Não foi possível excluir a tabela do banco de dados' });
  }
};
