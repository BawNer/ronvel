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
    return await http.post('/account', { account: { log: logFile } }, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async deleteAccountsBycategoryId(ctx, categoryId) {
      return await http.delete(`/accounts/category/${categoryId}`, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async deleteAccountsByStatus(ctx, status) {
      return await http.delete(`/accounts/status/${status}`, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async deleteAllAccounts(ctx) {
      return await http.delete(`/accounts`, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async createAccountWithCategory(ctx, payload) {
      return await http.post(`/account/${payload.categoryId}`, { account: { log: payload.log } }, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async createSimplifyAccounts(ctx, payload) {
      return await http.post(`/accounts`, payload, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async updateAccount(ctx, payload) {
      return await http.put(`/account/${payload.id}`, { account: { categoryId: payload.categoryId, status: 'pending' } }, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async executeMmoga(ctx) {
      await http.post('/mmoga/orders/execute', null, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      })
    },
    async deleteAccount(ctx, id) {
      await http.delete(`/account/${id}`, {
        headers: {
          'Authorization': `Token ${ctx.getters.getToken}`
        }
      }).then(() => ctx.dispatch('findAccounts'))
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
      return state.accounts.reverse()
    },
    getAccountWithPagination(state) {
      return (page) => {
        const accounts = []
          if (page > 1) {
            for (let i = (page-1)*10; i < page*10; i++) {
              if (state.accounts[i]) {
                accounts.push(state.accounts[i])
              }
            }
          } else if (page == 1) {
            for (let i = 0; i < page*10; i++) {
              if (state.accounts[i]) {
                accounts.push(state.accounts[i])
              }
            }
          }
          return accounts.reverse()
      }
    }
  }
}