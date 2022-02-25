<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-row v-if="accounts.length">
          <v-col cols="12" v-for="account in accounts" :key="account.id">
            <account
              :account="account"
            />
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
import account from './account.component.vue'

export default {
  name: 'accounts',
  data() {
    return {
    }
  },
  components: {
    account
  },
  computed: {
    accounts() {
      return this.$store.getters.getAccounts
    }
  },
  beforeMount() {
    this.$store.dispatch('findAccounts')
  }
}
</script>