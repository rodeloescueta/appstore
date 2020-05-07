<template>
  <v-container fluid pa-4>
    <v-layout v-if="error != null" row wrap>
      <v-flex xs12 sm12 md12>
        <template>
          <v-alert :value="true" type="error">
            {{ error }}
          </v-alert>
        </template>
      </v-flex>
    </v-layout>
    <v-layout class="text-xs-center">
      <v-flex offset-xs3 xs6>
        <v-card class="elevation-12">
          <v-toolbar dark color="grey darken-4">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                autofocus
                prepend-icon="person"
                name="login"
                label="User"
                type="text"
                @change="getInfo"
                v-model="userId">
              </v-text-field>

              <v-text-field
                @keyup.enter="go()"
                id="password"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="userPass">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <span>Guest account(guest/guest)</span>
            <v-spacer></v-spacer>
            <v-btn dark color="grey darken-4" @click.prevent="go()">Login</v-btn>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
    <v-layout pt-4>
      <v-container pt-4>
        <v-layout>
          <v-flex xs12>
            <v-alert
              :value="true"
              dismissible
              color="cyan"
            >
              <v-btn @click="openLink()" text>User's Guide <v-icon>help</v-icon></v-btn>
            </v-alert>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import md5 from 'md5-hex'

export default{
  name: 'Login',
  data () {
    return {
      userId: '',
      userPass: '',
      reqInfo: null,
      error: null,
      api: process.env.VUE_APP_URL
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    pass: function () {
      return md5(this.userPass)
    }
  },
  methods: {
    openLink() {
      var win = window.open('http://hrdapps48:3001/ftp/webmailer_attachment/1570002530576usersguide.pdf', '_blank');
      win.focus();
    },
    getInfo: function () {
      let url = `${this.api}masterlist/id2/${this.userId}`
      axios.get(url)
        .then(res => {
          if(!res.data.newRights){
            res.data.newRights = {}
          }
          this.reqInfo = res.data
          this.error = null
        })
    },
    go: function () {
      
      if (this.pass === this.reqInfo.password) {
        this.ADD_INFO(this.reqInfo)
        this.$router.push('/')
        // alert('success')
      } else {
        this.error = 'Wrong User and Password'
        this.userId = ''
        this.userPass = ''
      }
    },
    deleteInfo: function () {
      this.ADD_INFO('')
    },
    ...mapMutations([
      'ADD_INFO'
    ])
  }
}
</script>
