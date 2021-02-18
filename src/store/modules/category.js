import {getCategoryList} from '@/api/category'
export default {
    namespaced:true,
    state:{
        list:[]  //菜单数据
    },
    getters:{
        // 从list中筛选出一级菜单 ==》 目录
        firstCategoryList(state){
            return state.list.filter(item => item.pid === 0).map(item => ({
                id:item.id,
                catename:item.catename 
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
        getCategoryList({commit}){
            getCategoryList().then(res =>{
                // console.log(res);
                commit('SET_LIST',res)
            })
        }
    }
}