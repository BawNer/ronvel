import http from '../http'

export default {
  state: () => ({
    accounts: []
  }),
  mutations: {
    SET_ACCOUNTS(state, payload) {
      state.accounts = payload
    }
  },
  actions: {
    async createAccount(ctx, logFile) {
    await http.post('/account', { account: { log: logFile } }, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async executeMmoga() {
      await axios.post('/mmoga/execute', {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        })
    },
    async findAccounts(ctx) {
      await http.get('/accounts', {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      }).then((res) => {
        res.data.accounts.forEach(acc => acc.info = JSON.parse(acc.info))
        ctx.commit('SET_ACCOUNTS', res.data.accounts)
      })
    }
  },
  getters: {
    getAccounts(state) {
      return state.accounts
    }
  }
}