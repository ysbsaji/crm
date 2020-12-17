import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    athendication: false,
    login:{}
  },
  mutations: {
    athendication(state,payload){
      state.athendication = payload
    },
    login(state,payload){
      state.login = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
