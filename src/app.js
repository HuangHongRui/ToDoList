

import Vue from 'vue';
import AV from 'leancloud-storage'

var APP_ID = 'csqhAn20paClt8VylwLQLkFb-gzGzoHsz';
var APP_KEY = 'PrurrzrjeRLwTlEMMUISf17c';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
testObject.save({
  words: 'Hello World!'
}).then(function(object) {
  // alert('LeanCloud Rocks!');
})


new Vue({
  el: '#app',
  data: {
    actionType: 'signUp',
    newTodo: '',
    todoList: [],
    currentUser: null,
    formData: {
          username: '',
          password: ''
        },

  },
 created: function(){
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList) 
    var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      avTodos.set('content', dataString);
      avTodos.save().then(function (todo) {
        // 成功保存之后，执行其他逻辑.
        console.log('保存成功');
      }, function (error) {
        // 异常处理
        console.error('保存失败');
      });

    }
    // let oldDataString = window.localStorage.getItem('myTodos')
    // let oldData = JSON.parse(oldDataString)
    // this.todoList = oldData || []

    this.currentUser = this.getCurrentUser();
  },

  methods: {

    saveTodos: function(){
       let dataString = JSON.stringify(this.todoList)
       var AVTodos = AV.Object.extend('AllTodos');
       var avTodos = new AVTodos();
       avTodos.set('content', dataString);
       avTodos.save().then(function (todo) {
         alert('保存成功');
       }, function (error) {
         alert('保存失败');
       });
     },

    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false 
      })
      this.newTodo = ''
      this.saveTodos()
    },


  	removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
      this.saveTodos()
	},

  signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        alert('注册失败')
      });
    },

    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password)
        .then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        alert('登录失败')
      });
    },

    getCurrentUser: function() {
      let current = AV.User.current()
      if (current) {
        let {id, createdAt, attributes: {username}} = current
        return {id, username, createdAt}
      } else {
        return null
      }
    },

    logout: function () {
       AV.User.logOut()
       this.currentUser = null
       window.location.reload()
    }
  }
})         


    
    