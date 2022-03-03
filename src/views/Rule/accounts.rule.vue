<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12">
        <v-row justify="center">
          <v-btn class="ma-2" depressed color="orange" @click="deleteAllAccounts()">Удалить все аккаунты</v-btn>
          <v-btn class="ma-2" depressed color="primary" @click="deleteAccountsByStatus('pending')">Удалить аккаунты со статусом pending</v-btn>
          <v-btn class="ma-2" depressed color="error" @click="deleteAccountsByStatus('not valid')">Удалить аккаунты со статусом not valid</v-btn>
          <v-btn class="ma-2" depressed dark color="purple" @click="deleteAccountsByStatus('closed')">Удалить аккаунты со статусом closed</v-btn>
        </v-row>
      </v-col>
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
    },
    deleteAccountsByStatus(status) {
      bus.$emit('setLoadingNotification', 'Удаляю аккаунты....')
      this.$store.dispatch('deleteAccountsByStatus', status).then(() => {
        bus.$emit('killLoadingNotification')
        bus.$emit('setSystemNotification', `Успех!`)
        this.accounts = []
        this.page = 1
        this.$store.dispatch('findAccounts').then(() => {
          this.$store.getters.getAccountWithPagination(this.page).forEach(acc => this.accounts.push(acc))
        })
      }).catch(err => {
        bus.$emit('killLoadingNotification')
        bus.$emit('setSystemNotification', `Произошла ошибка: ${err}`)
      })
    },
    deleteAllAccounts() {
      bus.$emit('setLoadingNotification', 'Удаляю аккаунты....')
      this.$store.dispatch('deleteAllAccounts').then(() => {
        bus.$emit('killLoadingNotification')
        bus.$emit('setSystemNotification', `Успех!`)
        this.accounts = []
        this.page = 1
        this.$store.dispatch('findAccounts').then(() => {
          this.$store.getters.getAccountWithPagination(this.page).forEach(acc => this.accounts.push(acc))
        })
      }).catch(err => {
        bus.$emit('killLoadingNotification')
        bus.$emit('setSystemNotification', `Произошла ошибка: ${err}`)
      })
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