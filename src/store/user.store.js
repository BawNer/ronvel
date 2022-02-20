export default {
  state: () => ({
    user: false,
    token: null
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    }
  },
  actions: {
    userLogin(ctx, payload) {
      ctx.commit('SET_USER', payload)
    },
    setToken(ctx, payload) {
      ctx.commit('SET_TOKEN', payload)
    }
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getToken(state) {
      return state.token
    }
  }
}