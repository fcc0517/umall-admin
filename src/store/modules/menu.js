import {getMenuList} from '@/api/menu'
export default {
    namespaced:true,
    state:{
        list:[]  //菜单数据
    },
    getters:{
        // 从list中筛选出一级菜单 ==》 目录
        firstMenuList(state){
            return state.list.filter(item => item.type === 1 && item.pid === 0).map(item => ({
                id:item.id,
                title:item.title 
            }))
        }
    },
    mutations:{
        SET_LIST(state,list){
            state.list = list
        }
    },
    actions:{
        // 通过接口获取数据
        getMenuList({commit}){
            getMenuList().then(res =>{
                // console.log(res);
                commit('SET_LIST',res)
            })
        }
    }
}