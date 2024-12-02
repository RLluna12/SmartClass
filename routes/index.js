const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController');
const { ensureAuthenticated, authorizeRoles } = require('../middleware/authorize');

// ルートにGETリクエストが来た時の処理
router.get('/', (req, res) => {
  res.send('Welcome to the application!')
})

// その他のルートの設定もここに追加できます


module.exports = router
