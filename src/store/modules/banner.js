import { getBannerList } from '@/api/banner'
export default {
    namespaced:true,
    state:{
        list:[]  //轮播图数据
    },
    mutations:{
        SET_LIST(state,list){
            state.list = list
        }
    },
    actions:{
        // 通过接口获取数据
        getBannerList({commit}){
            getBannerList().then(res =>{
                // console.log(res);
                commit('SET_LIST',res)
            })
        }
    }
}
