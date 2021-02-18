import {getRoleList} from '@/api/role'
export default {
    namespaced:true,
    state:{
        list:[]
    },
    mutations:{
        SET_LIST(state,list){
            state.list = list
        }
    },
    actions:{
        // 通过接口获取数据
        getRoleList({commit}){
            getRoleList().then(res =>{
                // console.log(res);
                commit('SET_LIST',res)
            })
        }
    }
}