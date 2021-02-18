import { getSeckillList } from '@/api/seckill'
export default {
  namespaced: true,
  state: {
    list: [] // 限时秒杀数据
  },
  mutations: {
    SET_LIST (state, list) {
      state.list = list
    }
  },
  actions: {
    getSeckillList ({ commit }) {
      // 通过接口获取数据
      getSeckillList().then(res => {
        // console.log(res)
        commit('SET_LIST', res)
      })
    }
  }
}
