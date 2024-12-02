// responsavelController.js
const pool = require('../config/database')

exports.getAllResponsavel = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT us.id_usuario, us.nome_usuario, us.cpf_usuario, 
      us.endereco_usuario, us.telefone_usuario, us.email_usuario, 
      re.id_responsavel 
      FROM usuario as us JOIN responsavel as re ON us.id_usuario = re.id_usuario 
      `)
    res.json(results)
  } catch (err) {
    console.error('Erro ao obter a lista de Aluno: ' + err)
    res.status(500).json({ message: 'Erro ao obter os dados de tabela aluno' })
  }
}

// 生徒の情報を取得する関数
exports.getResponsavelById = async (req, res) => {
  const { id_responsavel } = req.params
  try {
    const [rows] = await pool.query(
      `
      SELECT us.id_usuario, us.nome_usuario, us.cpf_usuario, 
      us.endereco_usuario, us.telefone_usuario, us.email_usuario, 
      re.id_responsavel 
      FROM usuario as us JOIN responsavel as re ON us.id_usuario = re.id_usuario 
      WHERE id_responsavel = ?;`,
      [id_responsavel]
    )
    if (rows.length > 0) {
      res.json(rows[0])
    } else {
      res.status(404).json({ message: 'Aluno not found' })
    }
  } catch (error) {
    console.error('Error fetching aluno:', error)
    res.status(500).json({ message: 'Server error' })
  }
}