import http from '../http'
import bus from '../bus'

export default {
  state: () => ({
    orders: [],
    orderWorker: false
  }),
  mutations: {
    SET_ORDERS(state, payload) {
      state.orders = payload
    },
    SET_DEAMON_STATE(state, payload) {
      state.orderWorker = payload
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
    async changeStateDeamon(ctx, payload) {
      try {
        await http.post(`/mmoga/orders/deamon/${payload}`, null,
        {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        }
      )
        ctx.commit('SET_DEAMON_STATE', payload)
      } catch(err) {
        bus.$emit('setSystemNotification', 'Ошибка, перезагрузите страницу')
      }
    },
    async getStateDeamon(ctx) {
      await http.get(`/mmoga/orders/deamon/status`,
        {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        }
      ).then(res => {
        ctx.commit('SET_DEAMON_STATE', res.data)
      })
    },
    async executeOrderById(ctx, payload) {
      await http.post(`/mmoga/execute/${payload.orderId}`, { accountId: payload.accountId },
        {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        }
      ).then(() => {
        bus.$emit('setSystemNotification', 'Успех!')
      }).catch((err) => {
        bus.$emit('setSystemNotification', 'Ошибка, возможно аккаунт не прошел валидацию...')
      })
    }
  },
  getters: {
    getOrders(state) {
      return state.orders
    },
    getDeamonState(state) {
      return state.orderWorker
    }
  }
}