<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-row>
          <v-col cols="12" v-for="account in accounts" :key="account.id">
            <v-card>
              <v-subheader>
                <span class="text-caption">Игра: {{account.info.game}}, {{account.info.account.region.index}} </span>
              </v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Username: {{account.info.account.username}}</v-list-item-title>
                  <v-list-item-subtitle>Статус: 
                    <v-chip
                      label
                      small
                      text-color="white"
                      :color="account.status !== 'pending' ? account.status === 'closed' ? 'purple' : 'error' : 'primary'">{{account.status}}</v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Категория:
                    <span v-if="account.category === null">не найдено</span>
                    <span v-else>{{account.category.name}}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Последний матч:
                    <span>{{new Date(account.info.account.lastMatch).toLocaleString()}}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined color="error">Удалить</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'accounts',
  data() {
    return {
    }
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