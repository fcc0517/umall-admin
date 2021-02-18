<template>
  <div class="container">
    <div class="login-form">
      <h3 class="title">管理员登录</h3>
      <el-form ref="form" :model="loginData" :rules="rules" v-on:keyup.enter.native="login()">
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginData.username"
            placeholder="账号"
            clearable
            class="login-input"
          >
            <template slot="prepend">
              <i class="el-icon-user-solid"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginData.password"
            placeholder="密码"
            clearable
            show-password
            class="login-input"
          >
            <template slot="prepend">
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          style="width: 100%"
          class="login-btn"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
// 从user中导入user方法
import {login} from '@/api/user'
export default {
  data() {
    return {
      loginData: {
        username: "",
        password: ""
      },
      // 表单验证的规则 名字可以跟data里面的不一样
      rules: {
        // 编写规则
        username: [
          // 规则{规则，操作信息，失去焦点}
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      // 触发表单验证 触发form组件的validate方法
      this.$refs.form.validate((valid)=>{
        // console.log('valid',valid);
        if(valid){
          // 全部通过，做登录处理
          this.login()
        }
      })
    },
    login(){
      // 发送http请求
      login(this.loginData.username,this.loginData.password).then(res => {
        // console.log(res);
        // 登录成功，把登录的信息保存到sessionStorage里面
        // user名字已经在导航守卫里面取好了
        // 是一个对象
        sessionStorage.setItem('user',JSON.stringify(res))
        // 跳转到后台首页
        this.$router.push('/')
      }).catch(err => {
        // console.error信息变成红色
        // console.error('err',err.message);
        this.$message.error(err.message);
      })
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/bgbg.jpg") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  background: #fff;
  padding: 25px 20px;
  border-radius: 10px;
  width: 400px;
}
.login-form .title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 25px;
  width: 100%;
  text-align: center;
}
.login-btn {
  font-size: 18px;
  font-weight: 500;
}
.login-input {
  font-size: 16px;
}
</style>
