

import Vue from 'vue';
import AV from 'leancloud-storage'

var APP_ID = 'csqhAn20paClt8VylwLQLkFb-gzGzoHsz';
var APP_KEY = 'PrurrzrjeRLwTlEMMUISf17c';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

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

  this.currentUser = this.getCurrentUser();
  this.wahaha()
  },

  methods: {

    wahaha: function(){
       if(this.currentUser){
         var query = new AV.Query('AllTodos');
         query.find()
           .then((todos) => {
             let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
             let id = avAllTodos.id
             this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
             this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
           }, function(error){
             console.error(error) 
           })
       }
     },

    updateTodos: function(){
       
       let dataString = JSON.stringify(this.todoList) 
       let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
       avTodos.set('content', dataString)
       avTodos.save().then(()=>{
         console.log('更新成功')
       })
     },

    saveTodos: function(){
       let dataString = JSON.stringify(this.todoList)
       var AVTodos = AV.Object.extend('AllTodos');
       var avTodos = new AVTodos();

       var acl = new AV.ACL()
       acl.setReadAccess(AV.User.current(),true) 
       acl.setWriteAccess(AV.User.current(),true) 

       avTodos.set('content', dataString);
       avTodos.setACL(acl)
       avTodos.save().then((todo) => {
        this.todoList.id = todo.id
         console.log('保存成功');
       }, function (error) {
         alert('保存失败');
       });
     },
    saveOrUpdateTodos: function(){
       if(this.todoList.id){
         this.updateTodos()
       }else{
         this.saveTodos()
       }
     },
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false 
      })
      this.newTodo = ''
      this.saveOrUpdateTodos() 
    },


  	removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index,1)
      this.saveOrUpdateTodos() 
	},

  signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
      }, (error) => {
        alert('注册失败')
        console.log(error)
      });
    },

    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password)
        .then((loginedUser) => {
        this.currentUser = this.getCurrentUser()
        this.wahaha()
      }, function (error) {
        alert('登录失败')
        console.log(error)
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


    
    