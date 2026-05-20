const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '20060207',
  multipleStatements: true,
})

const sql = fs.readFileSync(path.join(__dirname, '..', 'mysql1.sql'), 'utf8')

db.query(sql, (err) => {
  if (err) {
    console.error('初始化失败：', err.message)
    process.exit(1)
  }

  db.query('SELECT username FROM user_db.users', (err2, rows) => {
    if (err2) {
      console.error('读取用户失败：', err2.message)
      process.exit(1)
    }

    console.log('数据库初始化成功，已创建用户：')
    rows.forEach((row) => console.log(`  - ${row.username}`))
    db.end()
  })
})
