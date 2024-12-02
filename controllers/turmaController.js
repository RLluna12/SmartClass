// controllers/turmaController.js
const db = require('../db'); // 既存のDB接続ファイルを使用

// すべてのTurmaを取得
exports.getAllTurmas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM turma');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getTurmaById = async (req, res) => {
  const id_turma = parseInt(req.params.id_turma);

  try {
    const [rows] = await db.query(`SELECT * FROM turma WHERE id_turma = ?;`, [id_turma]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Não foi possível obter o Turma do banco de dados' });
    }
  } catch (error) {
    console.error('Erro de aquisição Turma:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Turmaを追加
exports.addTurma = async (req, res) => {
  const { nome_turma, ano_letivo } = req.body;

  try {
    const result = await db.query('INSERT INTO turma (nome_turma, ano_letivo) VALUES (?, ?)', [nome_turma, ano_letivo]);
    res.status(201).json({ id_turma: result.insertId, nome_turma, ano_letivo });
  } catch (err) {
    console.error('Turma追加エラー: ' + err);
    res.status(500).json({ message: 'データベースにTurmaを追加できませんでした' });
  }
};

// Turmaを更新
exports.updateTurma = async (req, res) => {
  const id_turma = parseInt(req.params.id_turma);
  const { nome_turma, ano_letivo } = req.body;
  try {
    await db.query(
    'UPDATE turma SET nome_turma = ?, ano_letivo = ? WHERE id_turma = ?',
    [nome_turma, ano_letivo, id_turma]);
    res.json({ message: 'Turma updated successfully' });
  } catch (err) {
        console.error('Turma更新エラー: ' + err);
        res.status(500).json({ message: 'データベースでTurmaを更新できませんでした' });
  }
};

// Turmaを削除
exports.deleteTurma = async (req, res) => {
  const id_turma = parseInt(req.params.id_turma);

  try {
    await db.query('DELETE FROM turma WHERE id_turma = ?', [id_turma]);
    res.json({ message: 'Turmaが削除されました' });
  } catch (err) {
    console.error('Turma削除エラー: ' + err);
    res.status(500).json({ message: 'データベースからTurmaを削除できませんでした' });
  }
};


// 特定の turmaId に関連する disciplinas を取得する関数
exports.getTurmaDisciplinas = async (req, res) => {
  const { turmaId  } = req.params; // Turma ID
  try {
      const [disciplina] = await db.query(`
          SELECT d.*
          FROM disciplina d
          JOIN turma_disciplina td ON td.id_disciplina  = d.id_disciplina 
          WHERE td.id_turma = ?
      `, [turmaId]);

      res.json(disciplina);
  } catch (error) {
      console.error('Error retrieving disciplinas for turma:', error);
      res.status(500).json({ message: 'Error retrieving disciplinas' });
  }
};