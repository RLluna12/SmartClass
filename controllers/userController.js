const pool = require('../db');

exports.getUserProfile = async (req, res) => {
    const userId = req.session.user.id;

    try {
        const [rows] = await pool.query(`
                SELECT u.*, a.ra_aluno, a.data_matricula, a.id_turma, a.id_aluno
                FROM usuario u
                LEFT JOIN aluno a ON u.id_usuario = a.id_usuario
                WHERE u.id_usuario = ?;
            `, [userId]);
        
        if (rows.length > 0) {
            res.render('home', { user: rows[0] });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro do servidor/サーバーエラー');
    }
};
/* 
SELECT u.*, a.ra_aluno, a.data_matricula, a.id_turma
FROM usuario u
LEFT JOIN aluno a ON u.id_usuario = a.id_usuario
WHERE u.id_usuario = ?;
 */