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
      <v-dialog
        v-model="loadingNotificationState"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            {{loadingNotificationMessage}}
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
      v-model="systemNotification"
      persistent
      max-width="350"
    >
      <v-card>
        <v-card-title class="text-h5">
          Уведомление системы
        </v-card-title>
        <v-card-text>{{systemNotificationText}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="systemNotification = false"
          >
            Ок
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import cookie from './cookie'
import bus from './bus'

export default {
  name: 'App',
  data: () => ({
    loadingNotificationState: false,
    loadingNotificationMessage: '',
    systemNotification: false,
    systemNotificationText: ''
  }),
  computed: {
    user() {
      return this.$store.getters.getUser
    }
  },
  mounted() {
    bus.$on('setLoadingNotification', message => {
      this.loadingNotificationState = true
      this.loadingNotificationMessage = message
    })
    bus.$on('killLoadingNotification', () => {
      this.loadingNotificationState = false
    })
    bus.$on('closeSystemNotification', () => {
      this.systemNotification = false
    })
    bus.$on('setSystemNotification', message => {
      this.systemNotification = true
      this.systemNotificationText = message
    })
    const user = cookie.getCookie('user')
    if (user) {
      this.$store.dispatch('userLogin', true)
      this.$store.dispatch('setToken', user.token)
      this.$store.dispatch('getStateDeamon')
      this.$store.dispatch('findCategories')
    } else {
      this.$store.dispatch('userLogin', false)
    }
  }
};
</script>
