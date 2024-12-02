const connection = require('../config/database'); // Promiseベースの接続を取得

// 全てのを取得
exports.getAllAlunos = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM usuario u WHERE ip_perfil = 3;');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching data from Usuario Aluno: ' + err);
    res.status(500).json({ message: 'Error fetching Usuario Aluno' });
  }
};

