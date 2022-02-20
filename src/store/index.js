import Vue from 'vue'
import Vuex from 'vuex'

import categories from './categories.store'
import user from './user.store'
import orders from './orders.store'
import accounts from './accounts.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    categories,
    user,
    orders,
    accounts
  }
})
