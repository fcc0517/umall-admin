import jsx from 'babel-plugin-syntax-jsx'
import Vue from 'vue'
import Router from 'vue-router'
// 导入路由规则
import routes from './router'

Vue.use(Router)

const router =  new Router({
  // 改变模式
  mode:"history",
  routes
})
// 配置完路由页面，在这里做登录拦截

// 通过全局前置首位router.beforeEach来做登录拦截，一般项目用的最多的就是beforeEach，生命周期用的最多的就是mounted
router.beforeEach((to, from,next)=>{
  // 2.1显示不同页面的标题  to.meta
  // console.log(to.meta);
  // 2.2是否设置过title，设置页面标题，因为最终显示的是index.html,docement肯定可以设置
  // 2.3在拦截之前设置页面头部
  document.title = to.meta.title || '小u商场后台管理系统'
  // 如果要登录的页面不是登录页面，就必须登录成功后才能访问
  // 1.1通过to.path来判断是不是登录页面 
  // 1.2如果是，就不做拦截处理
  if(to.path === '/login'){
    next()
  }else{
    // 1.3如果跳转的不是登录页面，就必须要登录才能进行跳转
    // 1.4数据是从sessionStorage里面获取
    let userinfo = sessionStorage.getItem('user')
    // console.log(userinfo);
    // 判断是否有
    if(!userinfo){
      next('/login')
    }else{
      // 判断登录用户是否拥有登录权限
      userinfo = JSON.parse(userinfo)
      // 首页是所有的用户都能访问的
      userinfo.menus_url.push('/','/statistics')
      if(userinfo.menus_url.includes(to.path)){ //userinfo.menus_url就是当前用户能够访问的路由
        next()
      }else{
        // 没有权限就自动跳转首页
        next('/')
      }     
    }
  }
})
export default router
