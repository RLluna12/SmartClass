// notasFaltasController.js
const db = require('../db') // データベース接続

// 特定の生徒の全ての成績を取得
exports.getNotas = async (req, res) => {
  const id_aluno = req.params.id_aluno
  try {
    const [rows] = await db.query(`SELECT * FROM notas_faltas WHERE id_aluno = ?`, [id_aluno])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nota not found' });
    }
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}

// 特定の生徒の全ての成績を取得
exports.getNotasByid_notas_faltas = async (req, res) => {
  const id_notas_faltas  = req.params.id_notas_faltas 
  try {
    const [rows] = await db.query(`
      SELECT nf.*, d.nome_disciplina
      FROM notas_faltas nf 
      JOIN disciplina d ON d.id_disciplina = nf.id_disciplina
      WHERE id_notas_faltas  = ?;
      `, [id_notas_faltas])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nota not found' });
    }
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}
// 特定の生徒の全ての成績を取得
exports.getFaltasDetalhesById_alunoId_disciplina = async (req, res) => {
  const id_aluno  = req.params.id_aluno 
  const id_disciplina  = req.params.id_disciplina 
  try {
    const [rows] = await db.query(`
      SELECT nf.*, d.nome_disciplina, fd.data_falta, fd.id_faltas_detalhes
      FROM notas_faltas nf 
      JOIN disciplina d ON d.id_disciplina = nf.id_disciplina
      JOIN faltas_detalhes fd ON fd.id_notas_faltas = nf.id_notas_faltas
      WHERE nf.id_aluno  = ?
      AND nf.id_disciplina = ?;
      `, [id_aluno, id_disciplina])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nota not found' });
    }
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}

// 特定の生徒の特定の学年・学期の成績を取得
exports.getNotasByAnoESemestre = async (req, res) => {
  const { id_aluno, ano_academico, semestre } = req.params
  try {
    const [rows] = await db.query(
      'SELECT * FROM notas_faltas WHERE id_aluno = ? AND ano_academico = ? AND semestre = ?',
      [id_aluno, ano_academico, semestre]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'データの取得中にエラーが発生しました。' })
  }
}

// 成績を更新
exports.updateNota = async (req, res) => {
  const id_notas_faltas = req.params.id_notas_faltas
  const { n1, ai, ap, faltas } = req.body
  try {
    const [result] = await db.query('UPDATE notas_faltas SET n1 = ?, ai = ?, ap = ?, faltas = ? WHERE id_notas_faltas = ?', [
      n1,
      ai,
      ap,
      faltas,
      id_notas_faltas
    ])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Nenhuma nota encontrada.' })
    } else {
      res.json({ message: 'As notas foram atualizadas.' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar os dados.' })
  }
}

// 新しい成績を追加
exports.addNota = async (req, res) => {
  const { id_aluno, nota, faltas, ano_academico, semestre } = req.body
  try {
    const [result] = await db.query(
      'INSERT INTO notas_faltas (id_aluno, nota, faltas, ano_academico, semestre) VALUES (?, ?, ?, ?, ?)',
      [id_aluno, nota, faltas, ano_academico, semestre]
    )
    res.status(201).json({ message: '成績が追加されました。', id_notas_faltas: result.insertId })
  } catch (error) {
    res.status(500).json({ error: 'データの追加中にエラーが発生しました。' })
  }
}

// 成績を削除
exports.deleteNota = async (req, res) => {
  const id_notas_faltas = req.params.id_notas_faltas
  try {
    const [result] = await db.query('DELETE FROM notas_faltas WHERE id = ?', [id_notas_faltas])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '成績が見つかりません。' })
    } else {
      res.json({ message: '成績が削除されました。' })
    }
  } catch (error) {
    res.status(500).json({ error: 'データの削除中にエラーが発生しました。' })
  }
}

exports.getEditNotaPage = (req, res) => {
  const { alunoId, disciplinaId, idNotasFaltas } = req.query

  // 必要なデータをデータベースから取得するロジックを追加
  // 例えば、特定の生徒の成績を取得するためのクエリを実行
  res.render('editarNota', {
    alunoId,
    disciplinaId,
    idNotasFaltas
    // 他の必要なデータを渡す
  })
}

// turmaId, disciplinaId, year, semestre に基づき notas_faltas データを取得する関数
exports.getNotasFaltasApri = async (req, res) => {
  const { turmaId, disciplinaId, year, semestre } = req.query

  try {
    const [results] = await db.query(
      `
        SELECT nf.id_notas_faltas, nf.id_disciplina, nf.id_aluno, nf.N1, nf.AI, nf.AP, SUM(fd.justificado) AS faltas, 
          nf.ano_academico, nf.semestre, u.nome_usuario AS nome_aluno, u.foto, fd.id_faltas_detalhes
        FROM notas_faltas nf
        JOIN aluno a ON nf.id_aluno = a.id_aluno
        JOIN usuario u ON a.id_usuario = u.id_usuario
        LEFT JOIN faltas_detalhes fd ON fd.id_notas_faltas = nf.id_notas_faltas
        WHERE a.id_turma = ? AND nf.id_disciplina = ? AND nf.ano_academico = ? AND nf.semestre = ?
        GROUP BY u.nome_usuario, u.nome_usuario;
    `,
      [turmaId, disciplinaId, year, semestre]
    )

    res.json(results)
  } catch (error) {
    console.error('Error fetching notas_faltas:', error)
    res.status(500).json({ message: 'Error retrieving notas_faltas' })
  }
}


// notas_faltasを取得する関数
exports.getNotasFaltasDetails = async (req, res) => {
  const { alunoId, disciplinaId, year, semestre } = req.query

  try {
    const [results] = await db.query(
      `
        SELECT nf.id_disciplina, nf.id_aluno, nf.ano_academico, nf.semestre, u.nome_usuario AS nome_aluno, fd.data_falta
        FROM notas_faltas nf
        JOIN aluno a ON nf.id_aluno = a.id_aluno
        JOIN usuario u ON a.id_usuario = u.id_usuario
        JOIN faltas_detalhes fd ON fd.id_notas_faltas = nf.id_notas_faltas
        WHERE a.id_aluno = ? AND nf.id_disciplina = ? AND nf.ano_academico = ? AND nf.semestre = ? AND fd.justificado = ?;
    `,
      [alunoId, disciplinaId, year, semestre]
    )

    res.json(results)
  } catch (error) {
    console.error('Error fetching notas_faltas:', error)
    res.status(500).json({ message: 'Error retrieving notas_faltas' })
  }
};

exports.getAlunoDetails = async (req, res) => {
  const { id_notas_faltas } = req.query;

  if (!id_notas_faltas) {
    return res.status(400).send('ID do notas_faltas não fornecido');
  }

  try {
    // 生徒の基本情報を取得
    const alunoQuery = `
      SELECT nf.*, a.nome_aluno, a.foto
      FROM notas_faltas nf
      JOIN aluno a ON nf.id_aluno = a.id_aluno
      WHERE nf.id_notas_faltas = ?`;

    const alunoResults = await new Promise((resolve, reject) => {
      db.query(alunoQuery, [id_notas_faltas], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (alunoResults.length === 0) {
      return res.status(404).send('Aluno não encontrado');
    }

    // 欠席詳細を取得
    const faltasDetalhesQuery = `
      SELECT data_falta, justificado
      FROM faltas_detalhes
      WHERE id_notas_faltas = ?`;

    const faltasResults = await new Promise((resolve, reject) => {
      db.query(faltasDetalhesQuery, [id_notas_faltas], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // レンダリング
    res.render('detalhesAluno', {
      aluno: alunoResults[0],
      faltasDetalhes: faltasResults
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar dados do aluno');
  }
};

exports.deleteFaltasDetalhes = async (req, res) => {
  const id_faltas_detalhes = req.params.id_faltas_detalhes;

  try {
    const [result] = await db.query('DELETE FROM faltas_detalhes WHERE id_faltas_detalhes = ?', [id_faltas_detalhes]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'データが見つかりませんでした。' });
    }

    res.json({ message: '削除が成功しました。' });
  } catch (error) {
    res.status(500).json({ error: '削除中にエラーが発生しました。' });
  }
};
// Faltas Detalhes に欠席を記録
exports.addFaltasDetalhes = async (req, res) => {
  const { ids } = req.body; // 選択された notas_faltas の ID
  const dataFalta = new Date().toISOString().split('T')[0]; // 今日の日付 (YYYY-MM-DD)

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' });
  }

  try {
    // IDsをループしてそれぞれの欠席を記録
    const values = ids.map(id => [id, dataFalta, 1]); // 配列形式で値を準備
    const query = `
      INSERT INTO faltas_detalhes (id_notas_faltas, data_falta, justificado)
      VALUES ?
    `;

    await db.query(query, [values]); // バッチインサート
    res.status(200).json({ message: 'Faltas adicionadas com sucesso' });
  } catch (error) {
    console.error('Error adding faltas detalhes:', error);
    res.status(500).json({ error: 'Erro ao adicionar faltas detalhes' });
  }
};
