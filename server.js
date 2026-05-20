const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '20060207',
  database: 'user_db',
})

db.connect((err) => {
  if (err) {
    console.log('数据库连接失败：', err.message)
  } else {
    console.log('数据库连接成功')
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, msg: '服务运行中' })
})

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/api/register', (req, res) => {
  const { username, password } = req.body
  const name = (username || '').trim()

  if (!name || !password) {
    return res.json({ code: 400, msg: '请输入用户名和密码' })
  }

  if (name.length < 3 || name.length > 30) {
    return res.json({ code: 400, msg: '用户名长度需在 3～30 个字符之间' })
  }

  if (password.length < 6) {
    return res.json({ code: 400, msg: '密码至少 6 位' })
  }

  const checkSql = 'SELECT id FROM users WHERE username = ?'
  db.query(checkSql, [name], (err, existing) => {
    if (err) {
      console.error('注册查重失败：', err.message)
      return res.json({ code: 500, msg: '服务器错误，请稍后重试' })
    }

    if (existing.length > 0) {
      return res.json({ code: 400, msg: '该用户名已被注册' })
    }

    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)'
    db.query(insertSql, [name, password], (err2, result) => {
      if (err2) {
        console.error('注册写入失败：', err2.message)
        return res.json({ code: 500, msg: '服务器错误，请稍后重试' })
      }

      return res.json({
        code: 200,
        msg: '注册成功',
        user: { id: result.insertId, username: name },
      })
    })
  })
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ code: 400, msg: '请输入用户名和密码' })
  }

  const sql = 'SELECT id, username FROM users WHERE username = ? AND password = ?'
  db.query(sql, [username.trim(), password], (err, result) => {
    if (err) {
      console.error('登录查询失败：', err.message)
      return res.json({ code: 500, msg: '服务器错误，请稍后重试' })
    }

    if (result.length > 0) {
      return res.json({
        code: 200,
        msg: '登录成功',
        user: result[0],
      })
    }

    return res.json({ code: 400, msg: '用户名或密码错误' })
  })
})

app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`)
})
