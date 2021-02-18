<template>
  <el-container style="height:100%;overflow:hidden">
    <el-header style="padding:0">
      <u-header />
    </el-header>
    <el-container>
      <el-aside style="width:200px" class="menu-container">
        <u-menu />
      </el-aside>
      <el-main class="main-container">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/" style="margin-bottom:15px">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <!-- 面包屑的名字根据路由定义的title来确定 -->
          <el-breadcrumb-item>{{$route.meta.title || ''}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 使用嵌套路由，点击左边选项按钮的时候切换右边的主页 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import UHeader from "./components/Header";
import UMenu from "./components/Menu";
export default {
  components: {
    UHeader,
    UMenu
  }
};
</script>

<style scoped>
.menu-container {
  background-color: #545c64;
  height: 100%;
}
.main-container{
  overflow: auto;
  width: 100%;
  height: calc(100% - 60px);
}
</style>
