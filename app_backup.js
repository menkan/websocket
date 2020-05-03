/**
 * Created by menkan on 20200502
 * Description: websocket
 * Desc: 基于 library nodejs-websocket 创建服务
 * "nodejs-websocket": "^1.7.2"
 */
const ws = require('nodejs-websocket')
const PORT = 3001
let count = 0

let server = ws.createServer( connect => {
  console.log('A new user in Server!');
  count++
  connect.userName = `用户${count}`
  broadcast(`${connect.userName}进入了聊天室`)
  
  connect.on('text', data => {
    console.log('request>>>>>', data)
    // connect.send(data.toUpperCase() + '!@!!!!!!!')
    broadcast(data)
  })

  connect.on('close', () => {
    console.log('关闭了connect');
    broadcast(`${connect.userName}离开了聊天室`)
  })

  connect.on('error', _ => {
    console.log('链接错误、请联系网络管理员');
  })
})

// broadcast all users
function broadcast(msg){
  server.connections.forEach(item => {
    item.send(msg)
  })
}

server.listen(PORT, _ => {
  console.log('SERVER OPENED. LISTEN PORT IS:' + PORT)
})