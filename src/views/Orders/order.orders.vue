<template>
  <v-card>
    <v-subheader>
      <span class="text-caption">Идентификатор заказа: {{order.id[0]}}{{order.quantity[0]}}</span>
    </v-subheader>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title v-text="order.game[0]"></v-list-item-title>
        <v-list-item-subtitle>Приоритет: 
          <v-chip
            label
            text-color="white"
            :color="order.priority[0] === 'high' ? 'error' : 'primary'">{{order.priority[0]}}</v-chip>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Статус аккаунта:
          <span class="text-caption" v-text="order.quantity[0] === '1' ? 'Gold' : 'Silver'"></span>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="order.categoryId">
          id категории:
          <span class="text-caption" v-text="order.categoryId"></span>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else class="red--text">
          подходящей категории не найдено
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text v-text="order.date[0]"></v-list-item-action-text>  
        <span><v-icon color="success">mdi-cash</v-icon>
        {{order.unitPriceFromXML[0]}}</span>
      </v-list-item-action>
    </v-list-item>
    <v-card-actions v-if="!orderWorker">
      <v-select
        :items="accounts"
        item-value="id"
        :item-text="(account) => `${account.info.account.login}:${account.info.account.password}, ${account.info.account.region.index}, category: ${account.category.id}`"
        outlined
        dense
        label="Выберите аккаунт"
        v-model="accountId"
      >
      </v-select>
      <v-spacer></v-spacer>
      <v-btn outlined color="primary" @click="executeOrder" :disabled="!accountId" :loading="executing">Провести</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import bus from '../../bus'
export default {
  name: 'orderComponent',
  props: [
    'order',
    'accounts',
    'orderWorker'
  ],
  data() {
    return {
      accountId: null,
      executing: false
    }
  },
  computed: {
    accountValue() {
      return `id: ${this.accounts.id}, name: ${this.accounts.info.account.username}, login: ${this.accounts.info.account.login}`
    }
  },
  methods: {
    async executeOrder() {
      bus.$emit('setLoadingNotification', 'Проведение заказа')
      this.executing = !this.executing
      await this.$store.dispatch('executeOrderById', { orderId: this.order.id[0], accountId: this.accountId })
      bus.$emit('killLoadingNotification')
      this.executing = !this.executing
      this.$store.dispatch('findAccounts')
    }
  }
}
</script>