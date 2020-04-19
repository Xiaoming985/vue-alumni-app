import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headTitle: '',
    userId: localStorage.getItem('userId')?localStorage.getItem('userId'):'', // 我的id
    classId: localStorage.getItem('classId')?localStorage.getItem('classId'):'',// 我的班级id
  },
  mutations: {
    changeTitle(state, title) {
      state.headTitle = title;
    },
    initUserId(state, userId) {
      localStorage.setItem('userId', userId);
    },
    initClassId(state, classId) {
      localStorage.setItem('classId', classId);
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    userId(state) {
      return state.userId;
    }
  }
})
