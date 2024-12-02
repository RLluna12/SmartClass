// controllers/disciplinasController.js
const connection = require('../config/database'); // Promiseベースの接続を取得

// 全ての科目を取得
exports.getAllDisciplinas = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM disciplina;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching data from Disciplina: ' + err);
    res.status(500).json({ message: 'Error fetching disciplinas' });
  }
};

// IDで科目を取得
exports.getDisciplinaById = async (req, res) => {
  const id = req.params.id_disciplina;
  try {
    const [results] = await connection.query('SELECT * FROM disciplina WHERE id_disciplina = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Disciplina not found' });
    } else {
      res.json(results[0]);
    }
  } catch (err) {
    console.error('Error fetching disciplina: ' + err);
    res.status(500).json({ message: 'Error fetching disciplina' });
  }
};

// 新しい科目を作成
exports.createDisciplina = async (req, res) => {
  const { nome_disciplina, horario } = req.body;
  try {
    const [result] = await connection.query('INSERT INTO disciplina (nome_disciplina, horario) VALUES (?, ?)', 
    [nome_disciplina, horario]);
    res.status(201).json({ id_disciplina: result.insertId, nome_disciplina, horario });
  } catch (err) {
    console.error('Error adding data to MySQL: ' + err);
    res.status(500).json({ message: 'Failed to add disciplina' });
  }
};

// 科目を更新
exports.updateDisciplina = async (req, res) => {
  const id = req.params.id_disciplina;
  const { nome_disciplina, horario } = req.body;
  try {
    await connection.query('UPDATE disciplina SET nome_disciplina=?, horario=? WHERE id_disciplina=?', 
    [nome_disciplina, horario, id]);
    res.json({ message: 'Disciplina updated successfully' });
  } catch (err) {
    console.error('Error updating disciplina: ' + err);
    res.status(500).json({ message: 'Failed to update disciplina' });
  }
};

// 科目を削除
exports.deleteDisciplina = async (req, res) => {
  const id = req.params.id_disciplina;
  try {
    await connection.query('DELETE FROM disciplina WHERE id_disciplina=?', [id]);
    res.json({ message: 'Disciplina deleted successfully' });
  } catch (err) {
    console.error('Error deleting disciplina: ' + err);
    res.status(500).json({ message: 'Failed to delete disciplina' });
  }
};
