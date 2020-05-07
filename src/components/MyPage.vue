<template>
    <v-container fluid pa-0>
      <!-- screenHeight: {{screenHeight}}
      <br>
      screenWidth: {{screenWidth}} -->
      <!-- sappType: {{sappType}}<br>
      myWeb: {{myWeb}}<br>
      myDesk: {{myDesk}} -->
      <!-- {{todos}} -->
      
        <v-layout pa-0 row wrap>
          <v-flex xs6>
            <v-card class="scroll" :height="screenHeight * 1">
              <v-toolbar text color="white" dense>
                <v-toolbar-title class="headline">My Common App</v-toolbar-title>
                <v-spacer></v-spacer>
                Add
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="goToStore('web_all')" fab small>
                      <v-icon>web</v-icon>
                    </v-btn>
                  </template>
                  
                  <span>Store for web-app</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="goToStore('desktop_all')" fab small>
                      <v-icon>desktop_windows</v-icon>
                    </v-btn>
                  </template>
                  
                  <span>Store for desktop-app</span>
                </v-tooltip>
              </v-toolbar>
              <v-divider></v-divider>
              <v-layout pa-2>
                <v-flex pa-0 xs6>
                  <v-card-title>Web</v-card-title>
                  <ul>
                    <li style="list-style: none;" v-for="(system, i) in myWeb" :key="i + 'a'">
                      <v-layout pt-3>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn class="caption" @contextmenu.prevent="deleteApp(i, 'myWeb')" @click="appRun(system, 'App Store')" right style="width: 230px" v-on="on" small>{{system.title | shorthenten}} </v-btn>
                          </template>
                          <span>{{system.title}}</span>
                        </v-tooltip>
                      </v-layout>
                      
                    </li>
                  </ul>
                </v-flex>
                <v-flex pa-0 xs6>
                  <v-card-title>Desktop</v-card-title>
                  <ul>
                    <li style="list-style: none;" v-for="(system, i) in myDesk" :key="i + 'b'">
                      <v-layout pt-3>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn @contextmenu.prevent="deleteApp(i, 'myDesk')" @click="appRun(system, 'Desktop')" right style="width: 230px" v-on="on" small>
                            {{system.title | shorthentwent}} 
                          </v-btn>
                          </template>
                          
                          <span>{{system.title}}</span>
                        </v-tooltip>
                      </v-layout>
                      
                    </li>
                  </ul>
                </v-flex>
              </v-layout>
            </v-card>

            <!-- <v-card class="scroll" :height="screenHeight * .25" v-if="storeIsClosed">
              <v-layout pl-4>
                <v-flex xs12>
                  <v-alert v-for="(rec, a) in recDoc" :key="a + 'd'" outlined
                    :value="true"
                    type="success"
                    dismissible
                    icon="fiber_new"
                  >
                    {{rec.document_title}}
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" @click="onViewDocumentInformation(rec)" color="indigo lighten-1">pageview</v-icon>
                      </template>
                        <span>View document</span>
                    </v-tooltip>
                  </v-alert>
                </v-flex>
              </v-layout>
              
            </v-card> -->
          </v-flex>
            <!-- TODO:: -->
            
          <v-flex xs6>
              <v-card class="scroll" :height="screenHeight">
                <v-toolbar dense>
                    <v-toolbar-title class="headline">My Todos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <p class="text-xs-right"><b>{{todos.length}}</b> Tasks</p>
                </v-toolbar>
                <v-layout pa-2>
                  <v-flex xs4>
                    <v-menu v-model="menuDate">
                      <template v-slot:activator="{on}">
                        <v-text-field label="Schedule" v-model="picker" v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="picker"  @input="menuDate = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex pl-2 pr-2 xs8>
                    <v-text-field v-model="newTodo" id="newTodo" name="newTodo" label="Type your task (add and search)" @keyup.enter="addTodo">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                
              <!-- {{todos}} -->
              <v-list two-line subheader>
                <!-- <v-subheader class="subheading">Your Tasks</v-subheader> -->
                <div v-for="(todo, i) in filteredTodos" :key="i">
                  <v-list-item>
                    <v-list-item-action>
                      <v-checkbox v-model="todo.done"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title :class="{
                  done: todo.done
                  }" class="title">{{todo.title | capitalize}}
                      </v-list-item-title>
                      <span v-html="todo.sched"></span>
                      </v-list-item-content>
                    <v-btn ripple fab small color="red"  v-if="todo.done" @click="removeTodo(todo)">
                      <v-icon class="white--text">close</v-icon>
                    </v-btn>
                  </v-list-item>
                </div>
              </v-list>
            </v-card>
          </v-flex>
          
        </v-layout>

        <v-snackbar
          v-model="savedOk"
          :timeout="3000"
        >
          Saved Ok!
          <v-btn
            color="pink"
            text
            @click="savedOk = false"
          >
            Close
          </v-btn>
        </v-snackbar>
        <!-- MyApp:: -->
        <v-dialog v-model="aStore" width="900px">
          <v-card>
            <v-container pa-4>

            
            <template v-if="isLoading">
              <div class="cent text-xs-center">
                <circle-loader color="red" :loading="isLoading"/>
              </div>
            </template>
            <template v-else>
              <v-toolbar text>
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field outlined v-model="searchAllApp" label="search"></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-btn @click="aStore = false" small text fab><v-icon>close</v-icon></v-btn>
                </v-layout>
              </v-toolbar>
              <v-layout row wrap>
                <template v-for="(app,i) in filteredAllApp">
                  <v-flex xs6 :key="i + 'z'">
                    <v-layout pt-3>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on" @click="addApp(app)">{{app.title | shorthenforth}}</v-btn>
                        </template>
                        <span>{{app.title}}</span>
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                </template>
              </v-layout>
            </template>
            </v-container>
          </v-card>
        </v-dialog>
        <!-- <v-dialog v-model="dialogViewDocumentInfo" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-if="dialogViewDocumentInfo">
                <view-document-detail/>
            </template>
        </v-dialog> -->
      </v-container>
</template>

<script>
// import ViewDocumentDetail from '@/components/ViewDocumentDetail.vue'
import axios from 'axios'
import {getIPv4} from 'webrtc-ips';
import moment from 'moment';
import { CircleLoader } from '@saeris/vue-spinners'

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/x-bat;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    // element.setAttribute('target', '_parent')

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
}
const ipv4 = getIPv4();

export default({
    components: {
        // ViewDocumentDetail,
        CircleLoader
    },
    created(){
      this.getRecentDocs()
      this.screenHeight = window.screen.availHeight - 175
      this.screenWidth = window.screen.availWidth
    },
    data () {
        return {
        screenHeight: 0,
        screenWidth: 0,
        menuDate: false,
        savedOk: false,
        picker: new Date().toISOString().substr(0, 10),
        isDark:true,
        show: true,
        newTodo: '',
        storeIsClosed: true,
        aStore: false,
        allApp: [],
        searchAllApp: '',
        sappType: '',
        recDoc: [],
        isLoading: false
      }
    },
    watch: {
      todos:{
        handler: function(val) {
          this.CHANGE_TODOS(val)
        },
        deep: true
      },
      myWeb:{
        handler: function(val) {
          this.CHANGE_MYWEB(val)
        },
        deep: true
      },
      myDesk:{
        handler: function(val) {
          this.CHANGE_MYDESK(val)
        },
        deep: true
      }
    },
    methods: {
      sortTodos(){
        this.todos.sort((a,b) => (a.sched > b.sched)? 1: -1)
      },
      getRecentDocs() {
        let url = `${this.api}get/recentdocs/${this.userInfo.department}`
        axios.get(url).then(res=>{
          this.recDoc = res.data
        })
      },
      addApp(val) {
        if(this.sappType === 'web_all'){
          this.myWeb.push({title:val.title, href: val.href})
          this.myWeb.sort((a,b) => (a.title > b.title)? 1: -1)
          this.savedOk = true
        }else{
          this.myDesk.push({title:val.title, href: val.href, code: val.code})
          this.myDesk.sort((a,b) => (a.title > b.title)? 1: -1)
          this.savedOk = true
        }
      },
      goToStore(val){
        this.isLoading = true
        this.sappType = val
        this.aStore = true
        let url = `${this.api}hrdappstore/get_application_store/${val}`

        axios.get(url).then(res => {
            this.allApp = res.data
            this.isLoading = false
        })
      },
        onViewDocumentInformation(val) {
          if(this.noStamp.includes(val.request_type)){
            this.pdfTab(val)
          }else{
            this.onChangeDialogView_DocumentInfo(true)
            this.onChangeDocumentView(val)
          }          
        },
        // appstore
        deleteApp(i, type) {
          if(confirm("Do you really want to delete?")){
            if(type === 'myWeb'){
              this.myWeb.splice(i, 1)
              // alert('Delete Ok')
              this.savedOk = true
            }else{
              this.myDesk.splice(i, 1)
              this.savedOk = true
            }
          }
        },
        addTodo() {
          var value = this.newTodo && this.newTodo.trim();
          if (!value) {
              return;
          }
          this.todos.push({
              title: this.newTodo,
              done: false,
              sched: this.picker
          });
          this.sortTodos()
          this.newTodo = '';
        },
        removeTodo(val) {
          const index = this.todos.indexOf(val)
          this.todos.splice(index, 1);
        },

        // appRun
        appRun(val, type) {
          // console.log(val)
          // console.log('ab')
          // console.log(type)

            let href = val.href
            let title = val.title
            let reqUrl = `${this.api}hrdappstore/check_application`
            axios.post(reqUrl, {href: href, title: title, type: type}).then(res => {
                if(res.data != 'without'){
                    // run application
                    let url = `${this.api}post/run_system`
                    let appType = ''
                    if(type == 'App Store'){
                        window.open(href, '_blank')
                        appType = 'web'                        
                    }else{
                        let content = null
                        if(!res.data.code){
                            content = 
`@echo off
start iexplore  "${href}"
DEL "%~f0"
EXIT`
                        }else{
                            content = `${res.data.code}\nDEL "%~f0" \nEXIT`
                        }

                        let filename = `${title}.bat`;
                        download(filename, content);
                        appType = 'desktop'
                    }
                    let myReq = {
                        href: href,
                        title: title,
                        appType: appType
                    }
                    ipv4.then(userIp => {
                        myReq.data = {
                            stamp: moment().format('YYYY-MM-DD, h:mm:ss a'),
                            department: this.userInfo.department, 
                            user: userIp, 
                            user_employeecode: this.userInfo.employeeCode
                        }
                        axios.post(url, myReq).then(res2 => {
                            console.log(res2.data)
                        })
                    })
                }else{
                    alert('This application is not updated in server.. \n Please ask your leaders to delete this application \n and download new in App Store')
                }
            })
        },
    },
    computed: {
      filteredTodos() {
        return this.todos.filter(todo => {
          return todo.title.toLowerCase().includes(this.newTodo.toLowerCase())
        })
      },
      filteredAllApp() {
        return this.allApp.filter(a => {
          return a.title.toLowerCase().includes(this.searchAllApp.toLowerCase())
        })
      }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    }
})
</script>

<style>
.done {
  text-decoration: line-through;
}

.cent {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}


</style>