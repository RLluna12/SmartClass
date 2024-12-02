// controllers/publicacaoController.js
const connection = require('../config/database'); 

// Função para listar todas as publicações
exports.getAllPublicacoes = async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM publicacao ORDER BY data_pub ASC;');
    res.json(results);
  } catch (err) {
    console.error('Ocorreu um erro ao buscar publicações:', err);
    res.status(500).json({ message: 'Erro ao buscar publicações' });
  }
};

// Função para obter uma publicação específica por ID
exports.getPublicacaoById = async (req, res) => {
  const publicacaoID = parseInt(req.params.id_pub);

  try {
    const [results] = await connection.query('SELECT * FROM publicacao WHERE id_pub = ?', [publicacaoID]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Publicação não encontrada' });
    } else {
      res.status(200).json(results[0]);
    }
  } catch (err) {
    console.error('Erro ao buscar a publicação no MySQL:', err);
    res.status(500).json({ message: 'Erro ao buscar a publicação' });
  }
};

// Função para adicionar uma nova publicação
exports.createPublicacao = async (req, res) => {
  const { comentario, data_pub, nome_pubricador } = req.body;

  try {
    const [result] = await connection.query(
      'INSERT INTO publicacao (comentario, data_pub, nome_pubricador) VALUES (?, ?, ?)',
      [comentario, data_pub, nome_pubricador]
    );

    const newPublicacao = { id_pub: result.insertId, comentario, data_pub };
    res.status(201).json(newPublicacao);
  } catch (err) {
    console.error('Erro ao adicionar a publicação no MySQL:', err);
    res.status(500).json({ message: 'Erro ao adicionar a publicação' });
  }
};

// Função para atualizar uma publicação existente
exports.updatePublicacao = async (req, res) => {
  const id_pub = parseInt(req.params.id_pub);
  const { comentario, data_pub , nome_pubricador} = req.body;

  try {
    const [result] = await connection.query(
      'UPDATE publicacao SET comentario = ?, data_pub = ?, nome_pubricador = ? WHERE id_pub = ?',
      [comentario, data_pub, nome_pubricador, id_pub]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Publicação não encontrada' });
    } else {
      res.json({ id_pub, comentario, data_pub });
    }
  } catch (err) {
    console.error('Erro ao atualizar a publicação no MySQL:', err);
    res.status(500).json({ message: 'Erro ao atualizar a publicação' });
  }
};

// Função para deletar uma publicação existente
exports.deletePublicacao = async (req, res) => {
  const id_pub = parseInt(req.params.id_pub);

  try {
    const [result] = await connection.query('DELETE FROM publicacao WHERE id_pub = ?', [id_pub]);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Publicação não encontrada' });
    } else {
      res.json({ message: 'Publicação excluída com sucesso' });
    }
  } catch (err) {
    console.error('Erro ao excluir a publicação no MySQL:', err);
    res.status(500).json({ message: 'Erro ao excluir a publicação' });
  }
};
