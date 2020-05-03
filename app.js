const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const usersList = []

server.listen(3001, _ => {
  console.log(`listened port: 3001`);
});

app.use(require('express').static('src/views'))


app.get('/', (req, res) => {
  res.redirect(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A new user connected!');
  
  socket.on('login', data => {
    console.log('==userName and paths==>>>', data);
    let user = usersList.find(item => item.username === data.username)
    if(user) {
      // 用户存在、请更换Id登陆
      socket.emit('loginError', {resCode: 'APP0401', resMsg: '用户存在' })
      return false
    } else {
      // 符合用户名规范、可以登陆
      usersList.push(data)
      socket.emit('loginSuccess', {resCode: 'APP0000', resMsg: '登陆成功', data})
     socket.username = data.username 
      // 告诉所有用户有人登录
      // socket.emit 单个用户
      // io.emit 广播
      io.emit('addUser', data)
      io.emit('usersList', usersList)
    }
    
  })
  // 监听用户断开连接功能
  socket.on('disconnect', () => {
    // 删除当前用户的信息从usersList删掉
    let indx = usersList.findIndex(item => item.username === socket.username)
    io.emit('delUser', {
      username: socket.username,
      isDel: true,
    })
    usersList.splice(indx, 1)
    io.emit('usersList', usersList)
  })

  socket.on('pushmessage', data => {
    console.log('MESSAGE', data);
    io.emit('pullmessage', data)
  })
});
