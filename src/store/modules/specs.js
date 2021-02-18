// 引入管理员接口文件
import { getSpecsTotal, getPageSpecs } from "@/api/specs";
export default {
  namespaced: true,
  state: {
    allList: [], //所有的规格
    list: [],
    page: 1, //当前的页码
    size: 10, //每页获取的页数
    total: 0 //管理员总数量
  },
  mutations: {
    SET_LIST(state, list) {
      state.list = list;
    },
    SET_TOTAL(state, total) {
      state.total = total;
    },
    // 要通过不同的page改变数据，就要改变vuex里面的page
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_ALLLIST(state, list) {
        state.allList = list;
      },
  },
  actions: {
    // 获取所有的规格
    async getAllSpecs({commit}) {
      const total = await getSpecsTotal().then(res => res[0].total || 0);
      console.log(total);
      if (total > 0) {
       const list = await getPageSpecs(1, total)
      //  console.log(list);
       commit("SET_ALLLIST", list);
      }
    },
    getSpecsList({ commit, state }) {
      getPageSpecs(state.page, state.size).then(res => {
        // console.log(res);
        commit("SET_LIST", res);
      });
    },
    getSpecsTotal({ commit }) {
      getSpecsTotal().then(res => {
        // console.log(res);
        commit("SET_TOTAL", res[0].total || 0);
      });
    }
  }
};
