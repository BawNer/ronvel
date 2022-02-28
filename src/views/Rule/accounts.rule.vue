<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-row v-if="accounts.length">
          <v-col cols="12" v-for="(account, index) in accounts" :key="account.id">
            <template v-if="index % 9 == 0">
              <account
                v-intersect.once="pushMore"
                :account="account"
              />
            </template>
            <template v-else>
              <account
                :account="account"
              />
            </template>
          </v-col>
        </v-row>
        <v-row v-else justify="center">
          <v-col md="7" cols="12">
            <span class="text-h2">Аккаунтов нет</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import bus from '../../bus'
import account from './account.component.vue'

export default {
  name: 'accounts',
  data() {
    return {
      page: 1,
      accounts: []
    }
  },
  components: {
    account
  },
  methods: {
    pushMore(entries, observer) {
      this.page = this.page + 1
      this.$store.getters.getAccountWithPagination(this.page).forEach(acc => this.accounts.push(acc))
    }
  },
  beforeMount() {
    this.$store.dispatch('findAccounts').then(() => {
      this.$store.getters.getAccountWithPagination(this.page).forEach(acc => this.accounts.push(acc))
    })
    bus.$on('deleteAccount', id => {
      this.accounts = this.accounts.filter(account => account.id !== id)
    })
  }
}
</script>