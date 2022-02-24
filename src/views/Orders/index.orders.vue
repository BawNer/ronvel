<template>
  <v-container fluid>
    <v-row class="mt-4">
      <v-col cols="12" md="3">
        <v-card class="pa-3">
          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="mmogaDeamon"
                label="Проводить заказ автоматически"
                @change="changeOrderWorkerState"
              ></v-switch>
            </v-col>
            <v-col cols="12">
              <span class="text-caption">Фильт по категориям</span>
              <v-btn large text @click="activeCategory = 0" :disabled="!activeCategory">Сбросить</v-btn>
            </v-col>
            <v-col cols="10">
              <v-select
                :items="categories"
                item-value="id"
                item-text="name"
                outlined
                label="Веберите категорию"
                v-model="activeCategory"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <span class="text-caption">Фильт по статусу заказа</span>
            </v-col>
            <v-col cols="12">
              <v-btn-toggle
                v-model="activeStatus"
                mandatory
              >
                <v-btn
                  v-for="control in orderStatus"
                  :key="control.id"
                  color="blue-grey darken-1"
                  plain
                  @click="getOrdersByStatus(control.status)"
                >
                  <v-icon left color="green lighten-2">mdi-cart-variant</v-icon>
                  {{control.name}}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="7" v-if="orders.length !== 0">
        <v-row>
            <v-col cols="12" v-for="order in orders" :key="order.id[0]">
              <order-component
                :order="order"
                :accounts="accounts"
                :orderWorker="mmogaDeamon"
              ></order-component>
            </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="7" v-else>
        <span class="text-h4">Заказы не найдены</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import bus from '../../bus'
import orderComponent from './order.orders.vue'

export default {
  name: 'Orders',
  components: {
    orderComponent
  },
  data() {
    return {
      mmogaDeamon: true,
      activeCategory: 0,
      activeStatus: 0,
      orderStatus: [
        { id: 1, name: 'В процессе', status: 'progressing' },
        { id: 2, name: 'Новые', status: 'new' }
      ]
    }
  },
  computed: {
    orders() {
      if ( this.activeCategory !== 0) {
        return this.$store.getters.getOrders.filter(o => o?.categoryId === this.categories[this.categories.map(c => c.id).indexOf(this.activeCategory)].id)
      } else {
        return this.$store.getters.getOrders
      }
    },
    categories() {
      return this.$store.getters.getCategories
    },
    accounts() {
      return this.$store.getters.getAccounts.filter(account => account.status == 'pending')
    }
  },
  methods: {
    getOrdersByStatus(status) {
      this.$store.dispatch('findOrders', status)
    },
    changeOrderWorkerState() {
      this.$store.dispatch('changeStateDeamon', this.mmogaDeamon)
    }
  },
  mounted() {
    bus.$emit('setLoadingNotification', 'Получение данных с сервера')
    this.$store.dispatch('findOrders').then(() => bus.$emit('killLoadingNotification'))
    this.$store.dispatch('findCategories')
    this.$store.dispatch('getStateDeamon')
    this.$store.dispatch('findAccounts')
    this.mmogaDeamon = this.$store.getters.getDeamonState
  }
}
</script>