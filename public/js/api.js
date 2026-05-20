// 只有从 http://localhost:3000 打开时才用相对路径，其它情况都连 3000 端口后端
;(function () {
  const host = window.location.hostname
  const port = window.location.port
  const onOurServer =
    (host === 'localhost' || host === '127.0.0.1') && port === '3000'

  window.API_BASE = onOurServer ? '' : 'http://localhost:3000'
})()

async function apiPost(path, body) {
  const url = `${window.API_BASE}${path}`
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('NETWORK')
  }

  if (!res.ok) {
    throw new Error('HTTP_' + res.status)
  }

  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('NETWORK')
  }
}

async function checkServer() {
  try {
    const res = await fetch(`${window.API_BASE}/api/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}

function showServerError(toast) {
  const port = window.location.port
  let extra = ''
  if (port && port !== '3000') {
    extra = ` 你当前在端口 ${port} 打开页面，请改用 http://localhost:3000`
  }
  const msg =
    '无法连接服务器。请先在项目文件夹运行 npm start，再用浏览器打开 http://localhost:3000' +
    extra
  if (typeof toast === 'function') toast(msg, 'error')
  else alert(msg)
}
