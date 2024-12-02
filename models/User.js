// models/User.js
const pool = require('../db');

const User = {};

// ユーザーを email で探す
User.findByEmail = async (email) => {
  const query = `
    SELECT u.*, a.ra_aluno, a.data_matricula, a.id_turma, a.id_aluno, r.id_responsavel, p.id_professor 
    FROM usuario u
    LEFT JOIN aluno a ON u.id_usuario = a.id_usuario
    LEFT JOIN responsavel r ON u.id_usuario = r.id_usuario
    LEFT JOIN professor p ON u.id_usuario = p.id_usuario
    WHERE u.email_usuario = ?;
  `;

  const [rows] = await pool.query(query, [email]);
  return rows[0];
};

// パスワードリセット用のトークンと有効期限を保存
User.saveResetToken = async (userId, token, expiration) => {
  await pool.query('UPDATE usuario SET reset_token = ?, reset_token_expiration = ? WHERE id_usuario = ?', [token, new Date(expiration), userId]);
};

// リセットトークンでユーザーを探す
User.findByResetToken = async (token) => {
  const [rows] = await pool.query('SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expiration > ?', [token, new Date()]);
  return rows[0];
};

// パスワードを更新
User.updatePassword = async (userId, newPassword) => {
  await pool.query('UPDATE usuario SET senha = ? WHERE id_usuario = ?', [newPassword, userId]);
};

// 新規ユーザーの作成
User.create = async ({ nome_usuario, cpf_usuario, email_usuario, senha, id_perfil }) => {
  await pool.query(
    `INSERT INTO usuario (nome_usuario, cpf_usuario, email_usuario, senha, id_perfil) VALUES (?, ?, ?, ?, ?)`,
    [nome_usuario, cpf_usuario, email_usuario, senha, id_perfil]
  );
};

module.exports = User;
