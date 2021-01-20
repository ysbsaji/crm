import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    athendication: false,
    login:{},
    FORM_TYPE: {
      TEXT: 'text',
      TEXTAREA: 'textarea',
      CHECKBOX: 'checkbox',
      SELECT: 'select',
      AUTO_COMPLETE: 'auto_complete',
      COMBOBOX: 'combobox',
      DATE: 'date',
      PASSWORD: 'password',
      NUMBER: 'number',
      DATEPICKER: 'datepicker',
      QUICKADD: 'quickadd',
      TIMEPICKER: 'timepicker',
      FILES: 'files',
      ALERT: 'alert',
      COLORPICKER: 'color',
      BUTTON: 'btn',
      BTNDROPDOWN: 'btnDropdown',
      RADIO: 'radio'
    },
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
  },
  getters:{
    formType (state) {
      return state.FORM_TYPE
    },
  }
})
