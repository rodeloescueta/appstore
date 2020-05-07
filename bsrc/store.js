import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: 'a',
    // recentMessages: [],
    myPage: 'App Store',
    documentViewInformation: {},
    // dialogViewDocumentInfo: false,
    dialogPersonalInfo: true,
    myPersonalInfo: {},
    todos: [
      { "title": "pause", "done": false, "sched": '2019-08-31' },
      { "title": "breathe", "done": false, "sched": '2019-08-31' },
      { "title": "smile", "done": false, "sched": '2019-08-31' }
    ],
    myWeb: [
      { "href": "http://hrdinfoonline:8080/hrdwebportal/", "title": "HRDInfoonlineNew" }
    ],
    myDesk: [
      { "href": "http://hrdapps2/AccessCenter/Deployment/BatchFile/Filing.bat", "title": "Filing" }
     ],
    // departmentInformationStore: {}
  },
  plugins: [
    createPersistedState()
  ],
  mutations: {
    ADD_INFO: (state, data) => {
      state.userInfo = data
    },
    // CHANGE_RECENT_MESSAGES: (state, data) => {
    //   state.recentMessages = data
    // },
    CHANGE_PAGE: (state, data) => {
      state.myPage = data
    },
    CHANGE_DOCUMENT_VIEW: (state, data) => {
      state.documentViewInformation = data
    },
    // CHANGE_DIALOG_VIEW_DOCUMENT_INFO: (state, data) => {
    //   state.dialogViewDocumentInfo = data
    // },
    CHANGE_DIALOG_PERSONAL_INFO: (state, data) => {
      state.dialogPersonalInfo = data
    },
    CHANGE_PERSONAL_INFO: (state, data) => {
      state.myPersonalInfo = data
    },
    CHANGE_TODOS: (state, data) => {
      state.todos = data
    },
    CHANGE_MYWEB: (state, data) => {
      state.myWeb = data
    },
    CHANGE_MYDESK: (state, data) => {
      state.myDesk = data
    }
  },
  actions: {

  }
})
