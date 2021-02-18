// 导入会员的接口文件（分页获取）
import { getPageGoods, getGoodsTotal } from '@/api/goods'
export default {
  namespaced: true,
  state: {
    allList: [], // 所有的规格
    list: [],
    page: 1, // 当前的页码
    size: 10, // 每页获取的数据
    total: 0 // 管理员总数量
  },
  mutations: {
    SET_LIST (state, list) {
      state.list = list
    },
    SET_TOTAL (state, total) {
      state.total = total
    },
    SET_PAGE (state, page) {
      state.page = page
    },
    SET_ALLLIST (state, list) {
      state.allList = list
    }
  },
  actions: {
    // 获取所有的规格
    async getAllGoods ({ commit }) {
      const total = await getGoodsTotal().then(res => res[0].total || 0)
      if (total > 0) {
        const list = await getPageGoods(1, total)
        commit('SET_ALLLIST', list)
      }
    },
    getGoodsList ({ commit, state }) {
      getPageGoods(state.page, state.size).then(res => {
        // console.log(res)
        commit('SET_LIST', res)
      })
    },
    getGoodsTotal ({ commit }) {
      getGoodsTotal().then(res => {
        commit('SET_TOTAL', res[0].total || 0)
      })
    }
  }
}
