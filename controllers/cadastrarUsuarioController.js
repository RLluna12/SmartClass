// controllers/cadastrarUsuarioController.js
const connection = require('../config/database'); 
const bcrypt = require('bcryptjs');

// Função para obter todos os usuários
exports.getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM usuario;');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err); // Log do erro para o console
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

// Função para obter um usuário específico por ID
exports.getUsuarioById = async (req, res) => {
  const usuarioID = parseInt(req.params.id_usuario);

  try {
    const [results] = await connection.query('SELECT * FROM usuario WHERE id_usuario = ?', [usuarioID]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      res.status(200).json(results[0]);
    }
  } catch (err) {
    console.error('Erro ao buscar o usuário no MySQL:', err);
    res.status(500).json({ message: 'Erro ao buscar o usuário' });
  }
};

// Função para cadastrar um novo usuário
exports.createUsuario = async (req, res) => {
  const {
    nome_usuario,
    cpf_usuario,
    endereco_usuario,
    telefone_usuario,
    email_usuario,
    nascimento_usuario,
    senha,
    id_perfil,
    ra_aluno,
    data_matricula
  } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);
    const [result] = await connection.query(
      'INSERT INTO usuario (nome_usuario, cpf_usuario, endereco_usuario, telefone_usuario, email_usuario, nascimento_usuario, senha, id_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nome_usuario, cpf_usuario, endereco_usuario, telefone_usuario, email_usuario, nascimento_usuario, hashedPassword, id_perfil]
    );

    const id_usuario = result.insertId;

    if (id_perfil == 3) {
      await connection.query(
        'INSERT INTO aluno (id_usuario, ra_aluno, data_matricula) VALUES (?, ?, ?)',
        [id_usuario, ra_aluno, data_matricula]
      );
      res.status(201).json({ message: 'Usuário e Aluno cadastrados com sucesso!' });
    } else if (id_perfil == 2) {
      await connection.query('INSERT INTO professor (id_usuario) VALUES (?)', [id_usuario]);
      res.status(201).json({ message: 'Usuário e Professor cadastrados com sucesso!' });
    } else if (id_perfil == 4) {
      await connection.query('INSERT INTO responsavel (id_usuario) VALUES (?)', [id_usuario]);
      res.status(201).json({ message: 'Usuário e Responsável cadastrados com sucesso!' });
    } else {
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
  } catch (err) {
    console.error('Erro ao cadastrar o usuário no MySQL:', err);
    res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
  }
};

// Função para atualizar um usuário existente
exports.updateUsuario = async (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario, 10); // Converte o ID para número

  // Verifica se o ID é válido
  if (isNaN(id_usuario) || id_usuario <= 0) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }

  const {
    nome_usuario,
    cpf_usuario,
    endereco_usuario,
    telefone_usuario,
    email_usuario,
    id_perfil,
  } = req.body;

  try {
    const [result] = await connection.query(
      `UPDATE usuario 
       SET 
         nome_usuario = ?, 
         cpf_usuario = ?, 
         endereco_usuario = ?, 
         telefone_usuario = ?, 
         email_usuario = ?, 
         id_perfil = ? 
       WHERE id_usuario = ?`,
      [
        nome_usuario,
        cpf_usuario,
        endereco_usuario,
        telefone_usuario,
        email_usuario,
        id_perfil,
        id_usuario,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id_usuario,
      nome_usuario,
      cpf_usuario,
      endereco_usuario,
      telefone_usuario,
      email_usuario,
      id_perfil,
      message: 'Usuário atualizado com sucesso!',
    });
  } catch (err) {
    console.error('Erro ao atualizar usuário no MySQL:', err);
    res.status(500).json({ message: 'Erro ao atualizar o usuário' });
  }
};


exports.deleteUsuario = async (req, res) => {
  const id = req.params.id_usuario;
  try {
    // Delete dependent records in responsavel first
    await connection.query('DELETE FROM responsavel WHERE id_usuario=?', [id]);
    // Now delete the user
    await connection.query('DELETE FROM usuario WHERE id_usuario=?', [id]);
    res.json({ message: 'Usuario deleted successfully' });
  } catch (err) {
    console.error('Error deleting usuario: ' + err);
    res.status(500).json({ message: 'Failed to delete usuario' });
  }
};
