import http from '../http'

export default {
  state: () => ({
    orders: []
  }),
  mutations: {
    SET_ORDERS(state, payload) {
      state.orders = payload
    }
  },
  actions: {
    async findOrders(ctx, status = 'progressing') {
      await http.get(`/mmoga/orders/${status}`,
        {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        }
      ).then(response => ctx.commit('SET_ORDERS', response.data.orders))
    },
  },
  getters: {
    getOrders(state) {
      return state.orders
    }
  }
}