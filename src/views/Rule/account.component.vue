<template>
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
      <v-select 
        v-show="showCategories"
        :items="categories"
        item-value="id"
        :item-text="(category) => `id: ${category.id}, name: ${category.name}`"
        dense
        label="Выберите категорию"
        v-model="categoryId"
      ></v-select>
      <v-btn v-show="showCategories" class="ml-4" @click="updateAccount(account.id)">Сохранить</v-btn>
      <v-btn v-show="showCategories" outlined color="success" class="ml-4" @click="showCategories = !showCategories">Отмена</v-btn>
      <v-btn outlined color="primary" v-show="!showCategories && account.status == 'pending'" @click="showCategories = !showCategories">Изменить категорию</v-btn>
      <v-spacer></v-spacer>
      <v-btn outlined color="error" @click="deletAccount(account.id)">Удалить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import bus from '../../bus'
export default {
  props: ['account'],
  data() {
    return {
      showCategories: false,
      categoryId: 0
    }
  },
  computed: {
    categories() {
      return this.$store.getters.getCategories
    }
  },
  methods: {
    deletAccount(id) {
      this.$store.dispatch('deleteAccount', id)
    },
    async updateAccount(id) {
      bus.$emit('setLoadingNotification', 'Обновляю информацию')
      await this.$store.dispatch('updateAccount', {id: id, categoryId: this.categoryId})
      this.$store.dispatch('findAccounts')
      this.showCategories = false
      bus.$emit('killLoadingNotification')
    }
  }
}
</script>