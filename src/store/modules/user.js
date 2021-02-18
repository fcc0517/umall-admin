// 引入管理员接口文件
import { getPageUser , getUserTotal } from '@/api/user'
export default {
    namespaced:true,
    state:{
        list:[],
        page:1,//当前的页码
        size:10 ,//每页获取的页数
        total:0 //管理员总数量
    },
    mutations:{
        SET_LIST(state,list){
            state.list = list
        },
        SET_TOTAL(state,total){
            state.total = total
        },
        // 要通过不同的page改变数据，就要改变vuex里面的page
        SET_PAGE(state,page){
            state.page = page
        }
    },
    actions:{
        getUserList( { commit , state } ){
            getPageUser(state.page,state.size).then( res => {
                // console.log(res);
                commit('SET_LIST',res)
            })
        },
        getUserTotal({commit}){
            getUserTotal().then(res => {
                // console.log(res);
                commit('SET_TOTAL',res[0].total || 0)
            })
        }
    }
}