const TYPE_SYSTEM = '0001'
const TYPE_MYSEFY = '0002'
const TYPE_OTHER = '0003'
new Vue({
  el: '#app',
  data: {
    isLogin: false,
    username: '',
    headPiecePath: '',
    headIndex: -1,
    testArea: '',
    socket: null,
    usersList: [],
    msgList: [],
    inputText: '',
  },
  mounted(){
    if(this.isLogin) {
      document.querySelector('.box-bd').scrollTop = document.querySelector('.box-bd').scrollHeight
    }
      
    this.socket = io.connect('http://localhost:3001')
    this.socket.on('loginSuccess', this.loginSuccess)
    this.socket.on('loginError', this.loginError)
    this.socket.on('usersList', this.handleUsersList)
    this.socket.on('addUser', this.handleAddUser)
    this.socket.on('delUser', this.handleDelUser)
    this.socket.on('pullmessage', this.handlePullMessage)
  },
  computed: {
    usersCount(){
      return this.usersList.length
    }
  },
  methods: {
    checkImgName(val) {
      val += 1
      if(val < 10) return `images/head-piece-00${val}.jpg`
      else return `images/head-piece-0${val}.jpg`
    },
    handleClickHead(num) {
      this.headIndex = num
      this.headPiecePath = this.checkImgName(num -1) 
    },
    handleLogin() {
      const data = {
        username: this.username,
        headPiecePath: this.headPiecePath
      }
      console.log("login Data", data);
      
      this.socket.emit('login', data)
    },
    loginSuccess(data) {    // 用户登陆成功
      console.log('success', data);
      this.isLogin = true
    },
    loginError(data) {    // 用户id存在
      console.log('error', data);
      alert(data.resMsg)
    },
    handleUsersList(data) {
      console.log('checked UserList>', data);
      this.usersList = data
    },
    handleAddUser(data) {
      console.log('add a user', data);
      const da = {
        message: data.isDel ? '' : `${data.username}进入聊天室`,
        type: TYPE_SYSTEM,
      }
     this.msgList.push({...data, ...da}) 
    },
    handleDelUser(data) {
      console.log('delete a user', data);
      const da = {
        message: data.isDel ? `${data.username}离开聊天室` : '',
        type: TYPE_SYSTEM,
      }
     this.msgList.push({...data, ...da}) 
    },

    handleSendMsg() {
      let msg = this.inputText
      console.log('====>>>>', msg);
     this.socket.emit('pushmessage', { username: this.username, headPiecePath: this.headPiecePath, message: msg }) 
    },
    handlePullMessage(data) {
      console.log('pull message', data);
      const da = {
        type: data.username === this.username ? '0002' : '0003'
      }
      this.msgList.push({...data, ...da})
    }
  },
  watch: {
    msgList() {
      this.$nextTick(() => {
        let container = this.$el.querySelector(".box-bd");
        container.scrollTop = container.scrollHeight;
      });
    }
  }
})