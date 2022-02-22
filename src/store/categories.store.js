import http from '../http'

export default {
  state: () => ({
    categories: []
  }),
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    }
  },
  actions: {
    async findCategories({commit, getters}) {
      const { data: { categories } } = await http.get('/categories', {
          headers: {
            'Authorization': `Token ${getters.getToken}`
          }
        })
      commit('SET_CATEGORIES', categories)
    },
    async createCategory(ctx, payload) {
      try {
        const category = {
          name: payload.name,
          rule: payload.rule.split(',').filter(c => c.length).join(','),
          weight: payload.weight
        }
        await http.post('/categories', { category }, {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        })
        ctx.dispatch('findCategories')
      } catch (err) {
        return false
      }
    },
    async updateCategory(ctx, payload) {
      try {
        const category = {
          name: payload.name,
          rule: payload.rule.split(',').filter(c => c.length).join(','),
          weight: payload.weight
        }
        await http.put(`/categories/${payload.id}`, { category }, {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        })
        ctx.dispatch('findCategories')
      } catch (error) {
        console.log(error)
      }
    },
    async deleteCategory(ctx, payload) {
      try {
        await http.delete(`/categories/${payload.id}`, {
          headers: {
            'Authorization': `Token ${ctx.getters.getToken}`
          }
        })
        ctx.dispatch('findCategories')
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    getCategories(state) {
      return state.categories
    } 
  }
}