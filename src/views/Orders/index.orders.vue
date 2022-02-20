<template>
  <v-container fluid>
    <v-row class="mt-4">
      <v-col cols="12" md="3">
        <v-card class="pa-3">
          <v-row>
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
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn outlined color="primary" disabled>Провести</v-btn>
                  <v-btn outlined color="error" disabled>Отменить заказ</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="7" v-else-if="activeCategory === 0" class="mt-4">
        <span class="text-h4" v-text="load ? 'Получение данных...' : 'Ошибка сервера, обратитесь в поддержку'"></span>
      </v-col>
      <v-col cols="12" md="7" v-else>
        <span class="text-h4">Заказы не найдены</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Orders',
  data() {
    return {
      activeCategory: 0,
      activeStatus: 0,
      load: true,
      orderStatus: [
        { id: 1, name: 'В процессе', status: 'progressing' },
        { id: 2, name: 'Новые', status: 'new' }
      ]
    }
  },
  computed: {
    orders() {
      if ( this.activeCategory !== 0) {
        return this.$store.getters.getOrders.filter(o => o.game[0] === this.categories[this.activeCategory - 1].name)
      } else {
        return this.$store.getters.getOrders
      }
    },
    categories() {
      return this.$store.getters.getCategories
    }
  },
  methods: {
    getOrdersByStatus(status) {
      this.$store.dispatch('findOrders', status)
    }
  },
  beforeMount() {
    this.$store.dispatch('findOrders')
  }
}
</script>