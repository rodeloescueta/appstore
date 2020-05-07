<template>
    <v-container fluid pa-0>
        <v-toolbar elevation="0" dense>
            <v-btn color="transparent" @click="changeApp('App Store')" elevation="0">
                <v-icon color="secondary" left>web</v-icon>
                <span v-if="myPage == 'App Store'" style="color: #3f51b5">Web</span>
                <span v-else>Web</span>
            </v-btn>
            <v-btn color="transparent" @click="changeApp('Desktop')" elevation="0">
                <v-icon color="secondary" left>desktop_mac</v-icon>
                <span v-if="myPage == 'Desktop'" style="color: #3f51b5">Desktop</span>
                <span v-else>Desktop</span>
            </v-btn>
                <v-text-field class="pt-4" v-model="searchItem" append-icon="search" :placeholder="searchLabel"></v-text-field>
            <v-spacer></v-spacer>

            <v-btn color="transparent" @click="goToAppstore()" elevation="0">
                <v-icon color="secondary" left>store</v-icon>
                <span v-if="appStore == true" style="color: #3f51b5">Store</span>
                <span v-else>Store</span>
            </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-layout v-if="appStore == false" row wrap>
            <template>
                <v-flex pa-3 v-for="(item, i) in filteredSearchData" d-flex xs4 :key="i">
                        <v-card height="60" class="rounded-card">
                            <v-layout row wrap>
                                <v-flex pt-2 xs11>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn color="transparent" width="350" v-on="on" @click="onRunSystem(item)" slot="activator" elevation="0" block large>{{item.title | shorthen}}</v-btn>
                                        </template>
                                        <span>{{item.title}}</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex pt-4 xs1>
                                    <v-icon color="indigo lighten-1" @click="onCheckInfo(item)">info</v-icon>
                                </v-flex>
                            </v-layout>
                        </v-card>
                </v-flex>
            </template>
            
        </v-layout>


        <v-layout row wrap v-else>
            <template>
                <v-flex pa-3 v-for="(item, i) in filteredSearchData" d-flex xs4 :key="i">
                        <v-card height="60" class="rounded-card">
                            <v-layout row wrap>
                                <v-flex pt-2 xs11>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn color="transparent" v-on="on" width="350" @click="onRunSystemStore(item)" slot="activator" elevation="0" block large>{{item.title | shorthen}}</v-btn>
                                        </template>
                                        
                                        <span>{{item.title}}</span>
                                    </v-tooltip>
                                </v-flex>
                                <v-flex pt-4 xs1>
                                    <v-icon color="indigo lighten-1" @click="onCheckInfo(item)">info</v-icon>
                                </v-flex>
                            </v-layout>
                        </v-card>
                </v-flex>
            </template>
        </v-layout>
        <v-dialog width="650" v-model="infoDialog">
            <v-card height="300px" elevation="0">
                <div class="text-center" v-if="bottomNav == 'system' && infoItem">
                    <div class="headline">{{infoItem.title}}</div><br>
                    <span>url: </span><span class="grey--text">{{infoItem.href}}</span><br><br>
                    <span>Purpose: </span><span class="grey--text">{{infoItem.purpose}}</span>
                    <br><br>
                    <span>Registered on: </span><span class="grey--text">{{infoItem.date_registered}}</span>
                </div>
                <div class="text-center" v-if="bottomNav == 'developer' && infoDev">
                    <div class="headline">{{infoDev.full_name}}</div>
                    <span>"</span><span class="grey--text">{{infoDev.nick_name}}</span><span>"</span>
                    <v-layout>
                        <v-flex xs6>
                            <span>Department: {{infoDev.department}}</span><br><br>
                            <span>Section: {{infoDev.section}}</span><br><br>
                            <span>Team: {{infoDev.team}}</span>
                        </v-flex>
                        <v-flex xs6>
                            <span>Email: {{infoDev.work_email}}</span><br><br>
                            <span>I.P.: {{infoDev.work_ip}}</span><br><br>
                            <span>Local#: {{infoDev.work_loc}}</span>
                        </v-flex>
                    </v-layout>
                </div>


                <div class="text-center" v-if="bottomNav == 'action'">
                    <v-container v-if="(isLeader)">
                        <br><br><br>
                        <template v-if="!appStore">
                            <h3>Delete from department list</h3>
                            <v-btn @click="removeItem(infoItem)"><v-icon>delete</v-icon> delete</v-btn>
                        </template>
                        <template v-else>
                            <h3>Add to department list</h3>
                            <v-btn @click="addItem(infoItem)"><v-icon>add</v-icon> add</v-btn>
                        </template>
                    </v-container>
                    <v-container v-else>
                        <br><br><br><h3>You are not allowed to make a changes</h3>
                    </v-container>
                </div>
                <v-bottom-navigation grow
                v-model="bottomNav"
                :value="true"
                absolute
                >
                <v-btn
                    elevation="0"
                    value="system"
                >
                    <span>System</span>
                    <v-icon>dvr</v-icon>
                </v-btn>

                <v-btn
                    elevation="0"
                    value="developer"
                >
                    <span>Developer</span>
                    <v-icon>code</v-icon>
                </v-btn>

                <v-btn
                    elevation="0"
                    value="action"
                >
                    <span>Action</span>
                    <v-icon>build</v-icon>
                </v-btn>
                </v-bottom-navigation>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import {getIPv4} from 'webrtc-ips';
import moment from 'moment';

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

export default{
    data: () => {
        return{
            delo: 'great',
            appStore: false,
            infoDialog: false,
            infoItem: null,
            infoDev: null,
            bottomNav: 'system',
            allApp: [],
            searchItem: '',
        }
    },
    created() {
        this.initializeDepartment()
        this.changeApp('App Store')
    },
    methods: {
        onRunSystemStore(val){
            let appType = null
            if(this.myPage == 'App Store'){
                appType = 'web_all'
            }else{
                appType = 'desktop_all'
            }
            let url = `${this.api}get/system_info/${appType}`
            axios.post(url, val).then(res => {
                let href = res.data.href
                let title = res.data.title
                let url = `${this.api}post/run_system`
                        let appType = ''
                        if(this.myPage == 'App Store'){
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
                                content = `${res.data.code}\nDEL "%~f0"`
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
            })
            
        },
        onRunSystem(val) {
            let href = val.href
            let title = val.title
            let reqUrl = `${this.api}hrdappstore/check_application`
            axios.post(reqUrl, {href: href, title: title, type: this.myPage}).then(res => {
                if(res.data != 'without'){
                    // run application
                    let url = `${this.api}post/run_system`
                    let appType = ''
                    if(this.myPage == 'App Store'){
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
        changeApp(val) {
            this.appStore = false
            this.changePage(val)
            this.initializeDepartment()
        },
        onCheckInfo(val) {
            let appType = null
            if(this.myPage == 'App Store'){
                appType = 'web_all'
            }else{
                appType = 'desktop_all'
            }
            let url = `${this.api}get/system_info/${appType}`
            axios.post(url, val).then(res => {
                console.log(res.data)
                if(res.data !== 'ng'){
                    this.infoItem = res.data
                }else{
                    this.infoItem = val
                }
                let dev = res.data.developer
                if(dev == 'smdep' || !dev){
                    this.infoDev = 
                    { full_name: 'SMD',
                    department: 'SMD',
                    section: 'System Development',
                    team: 'System',
                    designation: '-',
                    position: '-',
                    work_ip: '-',
                    work_loc: '777',
                    work_email: '-' }
                }else{
                    let url = `${this.api}get/staff_info/${dev}`
                    axios.get(url).then(res => {
                        this.infoDev = res.data
                    })
                }
            })
            this.infoDialog = true
            
        },
        
        goToAppstore(){
            this.appStore = true
            let appType = null
            if(this.myPage == 'App Store'){
                appType = 'web_all'
            }else{
                appType = 'desktop_all'
            }

            let url = `${this.api}hrdappstore/get_application_store/${appType}`

            axios.get(url).then(res => {
                this.allApp = res.data
            })
        }
    },
    computed: {
        filteredSearchData() {
          return this.showData.filter((app) => {
            return app.title.toUpperCase().match(this.searchItem.toUpperCase())
          })
        },
        searchLabel() {
            if(this.myPage === 'App Store' && !this.appStore){
                return 'Search Department Web App'
            }else if(this.myPage !== 'App Store' && !this.appStore){
                return 'Search Department Desktop App'
            }else if(this.myPage === 'App Store' && this.appStore){
                return 'Search Web App in Store'
            }else{
                return 'Search Desktop App in Store'
            }
        },
        showData() {
            if(this.appStore){
                return this.allApp
            }else{
                return this.departmentData
            }
        }
    }
}
</script>

<style>
.rounded-card{
  border-radius: 20px !important;
}
</style>