import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    headTitle: '',
    userId: localStorage.getItem('userId')?localStorage.getItem('userId'):'', // 我的id
    classId: localStorage.getItem('classId')?localStorage.getItem('classId'):'',// 我的班级id
    userName: localStorage.getItem('userName')?localStorage.getItem('userName'):''
  },
  mutations: {
    changeTitle(state, title) {
      state.headTitle = title;
    },
    initUserId(state, userId) {
      localStorage.setItem('userId', userId);
      state.userId = userId;
    },
    initClassId(state, classId) {
      localStorage.setItem('classId', classId);
      state.classId = classId;
    },
    initUserName(state, userName) {
      localStorage.setItem('userName', userName);
      state.userName = userName;
    }
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
