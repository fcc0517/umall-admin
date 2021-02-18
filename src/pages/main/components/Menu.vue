<template>
  <!-- default-active默认选中的
default-active设置为当前路由的path -->
  <el-menu
    router
    :default-active="$route.path"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/statistics">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <template v-for="(menu, index) of menuList">
      <!-- 有下级菜单 -->
      <el-submenu
        :index="'1' + index"
        :key="menu.id"
        v-if="menu.children && menu.children.length > 0"
      >
      <!-- 一级菜单名称 -->
        <template slot="title">
          <i v-if="menu.icon !== ''" :class="menu.icon"></i>
          <span>{{menu.title}}</span>
        </template>
        <!-- 二级菜单项 -->
        <el-menu-item-group>
        <el-menu-item v-for="item of menu.children" :key="item.id"  :index="item.url" >
           <i v-if="item.icon !== ''" :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </el-menu-item-group>
      </el-submenu>
      <el-menu-item :index="menu.url" v-else :key="menu.id">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    };
  },
  mounted() {
    const userinfo = JSON.parse(sessionStorage.getItem("user"));
    // console.log(userinfo);
    this.menuList = userinfo.menus || [];
  }
};
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
