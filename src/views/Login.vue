<template>

<v-layout align-center justify-center fill-height>
    <v-card width="350px">
      <v-card-title style="justify-content: center">Авторизация</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field required v-model="login" :rules="[v => !!v || 'Логин не должен быть пустым']" label="Логин"></v-text-field>
          <v-text-field required v-model="password" :rules="[v => !!v || 'Пароль не должен быть пустым']" label="Пароль"></v-text-field>
          <span v-if="!auth" class="red--text">Логин/пароль введены неверно!</span>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text :disabled="!valid" :loading="isLoading" @click="signin()">Войти</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>

</template>

<script>
import axios from "axios"
import cookie from '../cookie'

export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      auth: true,
      isLoading: false,
      login: '',
      password: ''
    }
  },

  methods: {
    async signin() {
      this.isLoading = true
      await axios.post('http://localhost:3000/users/login', {
        user: {
          login: this.login,
          password: this.password
        }
      }).then(res => {
        cookie.setCookie('user', JSON.stringify({token: res.data.user.token}))
        this.$store.dispatch('userLogin', true)
        this.$store.dispatch('setToken', res.data.user.token)
        this.auth = true
        this.$router.push('/')
      }).catch(err => {
        this.auth = false
      })
      this.isLoading = false
    }
  },
}

</script>