<template>
  <v-app style="background-color: #f1f2f6">
    <v-app-bar
      app
      v-if="user"
    >
      <v-app-bar-title>
        <span>Ronvel</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>
        <v-btn to="/orders" text>
          <v-icon left>mdi-cart-variant</v-icon>
          Заказы
        </v-btn>
        <v-btn to="/rule" text>
          <v-icon left>mdi-shape-outline</v-icon>
          Управление
        </v-btn>
        <v-btn to="/accounts" text>
          <v-icon left>mdi-shape-outline</v-icon>
          Аккаунты
        </v-btn>
      <v-spacer></v-spacer>

      <v-btn
        href="https://www.fl.ru/users/bauner"
        target="_blank"
        text
      >
        <span class="mr-2">Разработчик</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import cookie from './cookie'

export default {
  name: 'App',
  data: () => ({
  }),
  computed: {
    user() {
      return this.$store.getters.getUser
    }
  },
  mounted() {
    const user = cookie.getCookie('user')
    if (user) {
      this.$store.dispatch('userLogin', true)
      this.$store.dispatch('setToken', user.token)
    } else {
      this.$store.dispatch('userLogin', false)
    }
  }
};
</script>
