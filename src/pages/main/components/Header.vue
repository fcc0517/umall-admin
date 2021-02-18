<template>
  <div class="header-container">
    <div class="logo">
      小u商场后台管理系统
    </div>
    <el-dropdown @command='handleCommand'>
      <span class="el-dropdown-link">
        欢迎！{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <!-- 下拉菜单 @command监听指令事件-->
      <el-dropdown-menu slot="dropdown"  >
          <!-- 下拉菜单选项 divided添加横线  disabled禁用 -->
        <el-dropdown-item command="updataInfo">个人信息</el-dropdown-item>
        <el-dropdown-item command="updataassword">修改密码</el-dropdown-item>
        <el-dropdown-item divided command="onLogot">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
    data () {
        return {
            username:''
        }
    },
    mounted () {
        // 之前的登录信息已经存在本地中
        const userinfo = JSON.parse(sessionStorage.getItem('user'))
        // console.log(userinfo);
        this.username = userinfo.username
    },
    methods:{
        // 会接受一个参数，否则不知道点击的是谁
        // command一定要跟下面函数名字一致
        // this[attr]，其实是原生js里面获取对象属性的方法,或者给对象属性赋值。动态传参
        handleCommand (command) {
            this[command]() 
        },
        // 退出系统onLogot
        onLogot(){
            // 清除本地存储的用户信息
            sessionStorage.removeItem('user')
            // 跳转到登录页面
            this.$router.replace('/login')
            // console.log("command");
        },
        
    }
};
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 100%;
  background-color: #518ecb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  box-sizing: border-box;
}
.logo {
  font-size: 20px;
  color: #fff;
  font-weight: 700;
}
.el-dropdown-link{
    color: #fff;
    font-size: 16px;
}
</style>
