import Vue from 'vue'
import Vuex from 'vuex'
// 导入模块
import menu from './modules/menu'
import role from './modules/role'
import user from './modules/user'
import category from './modules/category'
import specs from './modules/specs'
import goods from './modules/goods'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        // 模块
        // 属性名称就是模块的名称， 值是 store对象
        menu,
        role,
        user,
        category,
        specs,
        goods
      }
})

export default store