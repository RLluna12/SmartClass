const db = require('../db'); // DB接続ファイル

// 全てのTurmaを取得
exports.getAllTurmas = async (req, res) => {
  try {
    const [turmas] = await db.query('SELECT * FROM Turma');
    res.json(turmas);
  } catch (error) {
    console.error('Error fetching Turmas:', error);
    res.status(500).json({ message: 'Error fetching Turmas' });
  }
};

// 特定のTurmaに関連するDisciplinasを取得
exports.getTurmaDisciplinas = async (req, res) => {
  const { turmaId } = req.params;
  try {
    const [disciplinas] = await db.query(`
      SELECT d.*
      FROM disciplina d
      JOIN turma_disciplina td ON td.id_disciplina = d.id_disciplina
      WHERE td.id_turma = ?
    `, [turmaId]);
    res.json(disciplinas);
  } catch (error) {
    console.error('Error retrieving disciplinas for turma:', error);
    res.status(500).json({ message: 'Error retrieving disciplinas' });
  }
};

// Turmaに所属するすべてのAlunoを取得
exports.getAlunosByTurma = async (turmaId) => {
  try {
    const [alunos] = await db.query(`
      SELECT a.id_aluno
      FROM aluno a
      JOIN turma ta ON ta.id_turma = a.id_turma
      WHERE ta.id_turma = ?
    `, [turmaId]);
    return alunos;
  } catch (error) {
    console.error('Error retrieving alunos for turma:', error);
    throw error;
  }
};

// DisciplinaをTurmaに割り当てる処理
exports.assignDisciplinas = async (req, res) => {
  const { id_turma, id_disciplinas, ano_academico, semestre } = req.body;

  try {
    // Turmaに所属するAlunosを取得
    const alunos = await exports.getAlunosByTurma(id_turma);

    // それぞれのAlunoに対してNotas_Faltasを登録
    for (const aluno of alunos) {
      for (const disciplinaId of id_disciplinas) {
        // notas_faltasテーブルにレコードを挿入
        await db.query(`
          INSERT INTO notas_faltas (id_aluno, id_disciplina, ano_academico, semestre)
          VALUES (?, ?, ?, ?)
        `, [aluno.id_aluno, disciplinaId, ano_academico, semestre]);
      }
    }

    res.json({ message: 'Disciplinas assigned to all alunos successfully.' });
  } catch (error) {
    console.error('Error assigning disciplinas:', error);
    res.status(500).json({ message: 'Error assigning disciplinas' });
  }
};