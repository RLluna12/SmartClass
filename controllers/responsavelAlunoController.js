const connection = require('../config/database'); // MySQL接続設定ファイル


// すべてのResponsavel_Alunoのリストを取得
exports.getAllResponsavelAluno = async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM responsavel_aluno;');
    res.json(results);
  } catch (err) {
    console.error('Erro ao obter a lista de Responsavel_Aluno: ' + err);
    res.status(500).json({ message: 'Erro ao obter os dados' });
  }
};

exports.getResponsavelAlunoByIdResponsavel = async (req, res) => {
  const id_responsavel = parseInt(req.params.id_responsavel);
  try {
    const [results] = await connection.query('SELECT * FROM responsavel_aluno WHERE id_responsavel = ?', [id_responsavel]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Tabela de responsavel_aluno not found' });
    } else {
      res.json(results[0]);
    }
  } catch (err) {
    console.error('Error fetching disciplina: ' + err);
    res.status(500).json({ message: 'Error fetching disciplina' });
  }
};

// 新しいResponsavel_Alunoを追加
exports.addResponsavelAluno = async (req, res) => {
  const newAlunoResp = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO responsavel_aluno (id_responsavel, id_aluno) VALUES (?, ?)',
      [newAlunoResp.id_responsavel, newAlunoResp.id_aluno]
    );
    res.status(201).json(newAlunoResp);
  } catch (err) {
    console.error('Erro ao adicionar dados no MySQL: ' + err);
    res.status(500).json({ message: 'Erro ao adicionar Responsavel_Aluno' });
  }
};

// 指定されたResponsavel_Alunoを削除
exports.deleteResponsavelAluno = async (req, res) => {
  const id_resp_aluno = parseInt(req.params.id_resp_aluno);
  /* const index = alunoResps.findIndex(alunoResp => alunoResp.id_resp_aluno === id_resp_aluno); */
  
  try {
    await connection.query('DELETE FROM responsavel_aluno WHERE id_resp_aluno=?', [id_resp_aluno]);
    res.json({ message: 'Disciplina deleted successfully' });
  } catch (err) {
    console.error('Error deleting disciplina: ' + err);
    res.status(500).json({ message: 'Failed to delete disciplina' });
  }

/* 
  if (index !== -1) {
    try {
      await connection.query('DELETE FROM responsavel_aluno WHERE id_resp_aluno = ?', [id_resp_aluno]);
      const removedAlunoResp = alunoResps.splice(index, 1);
      res.json(removedAlunoResp[0]);
    } catch (err) {
      console.error('Erro ao excluir dados no MySQL: ' + err);
      res.status(500).json({ message: 'Erro ao excluir Responsavel_Aluno' });
    }
  } else {
    res.status(404).json({ message: 'Responsavel_Aluno não encontrado' });
  } */
};




// 保護者が担当する生徒のリストを取得
exports.getAlunosByResponsavel = async (req, res) => {
  const { id_responsavel } = req.params;
  
  try {
    const [rows] = await connection.query(
      `SELECT al.id_aluno, al.ra_aluno, us.nome_usuario 
       FROM responsavel_aluno AS ra 
       JOIN aluno AS al ON ra.id_aluno = al.id_aluno 
       JOIN usuario AS us ON us.id_usuario = al.id_usuario
       WHERE ra.id_responsavel = ?`,
      [id_responsavel]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No students found for this responsavel' });
    }
  } catch (error) {
    console.error('Error fetching students by responsavel:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
// 選択された生徒の成績・欠席情報を取得
exports.getAlunoNotasFaltas = async (req, res) => {
  const { id_aluno } = req.params;

  try {
    const [rows] = await connection.query(
      `SELECT nf.id_disciplina, d.nome_disciplina, nf.N1 , nf.AP,  nf.AI, nf.faltas, nf.ano_academico, nf.semestre 
      FROM notas_faltas nf
      JOIN disciplina d ON nf.id_disciplina = d.id_disciplina 
      WHERE nf.id_aluno = ?`,
      [id_aluno]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'Notas and Faltas not found for this aluno' });
    }
  } catch (error) {
    console.error('Error fetching notas and faltas:', error);
    res.status(500).json({ message: 'Server error' });
  }
}