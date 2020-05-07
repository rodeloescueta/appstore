<template>
    <v-container fluid pa-0 v-visibility-change="visibilityChange">
        <!-- msgToArr: {{msgToArr}}<hr>
        msgData: {{msgData}} -->
        <v-row dense>
            <v-col class="pr-2" cols="4">
                <v-btn v-if="isLeader" @click="switchMsgViewDialog = true"
                    absolute
                    dark
                    fab
                    bottom
                    left
                    small
                    color="pink"
                    >
                    <v-icon>mdi-account-switch</v-icon>
                </v-btn>
                <v-card :height="screenHeight * .76" class="scroll">
                    
                    <v-container pt-0>
                        <v-row no-gutter>
                            <template v-if="showContacts">
                                <v-col cols="4">
                                    <v-select outlined dense
                                        :items="departmentOptions"
                                        label="Department"
                                        v-model="activeDepartment"
                                        class="overline"
                                        color="teal"
                                    ></v-select>
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field outlined dense
                                    color="teal"
                                    @keyup.enter="onSearchContacts()" 
                                    hint="Enter to Search" 
                                    class="overline"
                                    v-model="searchName" label="Name"></v-text-field>
                                </v-col>
                            </template>
                            <template v-else>
                                <v-col cols="9">
                                    <!-- <span class="text-center title"></span> -->
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" @click="getRecentMessages()" outlined color="indigo">Recent Conversation <v-icon>mdi-refresh</v-icon></v-btn>
                                        </template>
                                        <span>Reload Messages</span>
                                    </v-tooltip>
                                </v-col>
                            </template>
                            <v-col cols="3">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn 
                                        @click="switchSource()" 
                                        v-on="on" 
                                        fab small 
                                        :color="showContacts? 'green':'blue'">
                                            <v-icon color="white">
                                                {{showContacts? 'mdi-message-text-clock-outline':'mdi-tooltip-account'}}</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{showContacts? 'Recent Messages':'Search Contacts'}}</span>
                                </v-tooltip>
                                <v-badge right v-if="unRead>0"
                                    overlap color="myRed"
                                >
                                    <template v-slot:badge>
                                    <span>{{unRead}}</span>
                                    </template>
                                    <v-icon
                                    color="accent"
                                    >
                                    mdi-message
                                    </v-icon>
                                </v-badge>
                            </v-col>
                            <v-col cols="12">
                                <v-container fluid pa-0>
                                    <v-row dense>
<!-- contacts ***************************************************************** -->
                                        <template v-if="showContacts">
                                            <template v-if="contacts.length > 0">
                                                <v-spacer></v-spacer>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon class="pr-4" color="red" v-on="on" @click="removeContacts()">mdi-close</v-icon>
                                                    </template>
                                                    <span>Close Contact List</span>
                                                </v-tooltip>
                                                
                                            </template>
                                            
                                            <template v-for="(staff, i) in contacts">
                                                <!-- @click="loadMsgData(staff.employee_code)" -->
                                                
                                                <v-list-item :key="i + 'a3'" dense>
                                                    <v-list-item-avatar>
                                                        <img
                                                            :src="msgAvatar(staff.employee_code)"
                                                            :alt="staff.employee_code"
                                                            
                                                        >
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>{{staff.fullName | shorthentwent}}</v-list-item-title>
                                                    </v-list-item-content>
                                                    <v-list-item-action>
                                                        <v-checkbox @change="pushMsgTo(staff)" v-model="staff.checkbox"></v-checkbox>
                                                    </v-list-item-action>
                                                </v-list-item>
                                            </template>
                                                <v-subheader>
                                                    ***Message Send To***
                                                    <v-icon>mdi-information-outline</v-icon>
                                                </v-subheader>
                                            <template v-for="(staff, i) in msgToArr">
                                                <v-list-item :key="i + 'a1'" @contextmenu.prevent="removeMsgToArr(i)" @click="loadMsgData(staff.employee_code)" dense>
                                                    <v-list-item-avatar>
                                                        <img
                                                            :src="msgAvatar(staff.employee_code)"
                                                            :alt="staff.employee_code"
                                                            onError="this.onerror=null;this.src='http://hrdapps48:3001/ftp/employee_pictures/no-image.png';"
                                                        >
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>{{staff.fullName | shorthentwent}}</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </template>
                                        </template>

<!-- recent messages ************************************************************ -->

                                        <template v-else>
                                            <!-- TODO TWO LINES NAMES AND DATE -->
                                            <!-- {{recentMessages[0]}} -->
                                            <v-alert type="warning">
                                                Please do not used this in not work related!
                                                <br>
                                                All leaders in department have accessed to view members conversation.
                                            </v-alert>
                                            
                                            <template v-for="(staff, i) in recentMessages">
                                                
                                                <v-list width="350" :color="msgToArr.length > 0 && staff.empId === msgToArr[0].employee_code? 'blue lighten-5':''" two-line :key="i + 'a4'">
                                                    <v-list-item @click="selectMsgTo(staff, i)"  :key="i + 'a2'" dense>
                                                        <v-list-item-avatar>
                                                            <img
                                                                :src="msgAvatar(staff.empId)"
                                                                :alt="staff.empId"
                                                                onError="this.onerror=null;this.src='http://hrdapps48:3001/ftp/employee_pictures/no-image.png';"
                                                            >
                                                        </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title>
                                                                    {{staff.empfullName | shorthenten}} &nbsp;&nbsp;&nbsp;
                                                                    <span class="caption font-italic font-weight-light">{{fromNow(staff.date)}} </span>
                                                                </v-list-item-title>
                                                                <v-list-item-subtitle>
                                                                    <v-icon :color="staff.read? 
                                                                    'light-blue darken-1': ''" 
                                                                    small style="float: right;">{{staff.dest === 'to'? 'mdi-check-all': 'mdi-android-messages'}}</v-icon>
                                                                    <froalaView :value="froalaShorten(staff.content)"></froalaView>
                                                                    <!-- {{staff.content | shorthen}} -->
                                                                </v-list-item-subtitle>
                                                            </v-list-item-content>
                                                        <v-list-item-action>
                                                        </v-list-item-action>
                                                    </v-list-item>
                                                </v-list>
                                            </template>
                                        </template>
                                    </v-row>
                                </v-container>
                            </v-col>
                        </v-row>
                        
                    </v-container>
                </v-card>
            </v-col>

<!-- messages content *********************************************************** -->
            <template v-if="messaging">
                <v-col cols="8">
                    <v-card>
                        <!-- <v-container>
                            <v-layout row wrap>
                                <v-col cols=""
                            </v-layout>
                        </v-container> -->
                        <v-card :height="screenHeight * msgToSendHeight" class="scroll">
                            <input-message id="froala" @showAtt="showAtt()" @reSize="reSize" @closeMsg="closeMsg" @onAddMsg="onAddMsg"></input-message>

                            <!-- <v-text-field v-if="showAttachmentInput"
                                append-icon="mdi-attachment" 
                                dense outlined
                                @keyup.enter="alert('Attachment Add')" label="Paste attachment from Department Files (not yet functioning)" v-model="attachmentMd5">
                            </v-text-field> -->
                        </v-card>
                        
                        <v-card :height="screenHeight * msgRcvHeight" class="scroll">
                            <v-container fluid>
                            <v-row dense v-for="(item, i) in msgData" :key="i">
                                <v-col v-if="item.from !== userInfo.employeeCode" cols="1">
                                    <v-avatar>
                                        <img
                                            :src="msgAvatar(item.from)"
                                            :alt="item.from"
                                            onError="this.onerror=null;this.src='http://hrdapps48:3001/ftp/employee_pictures/no-image.png';"
                                        >
                                    </v-avatar>
                                </v-col>
                                <v-col cols="10" :offset="item.from === userInfo.employeeCode? '1':''">
                                    <v-card class="rounded-card" :elevation="item.from === userInfo.employeeCode? 6:1" :color="item.from === userInfo.employeeCode? 'light-blue lighten-1':'red lighten-4'" >
                                        <v-card-text>
                                            <froalaView v-model="item.content"></froalaView>
                                            <!-- {{}}  -->
                                            <v-spacer></v-spacer> 
                                            <span style="float: right;" class="pt-4">{{fromNow(item.date)}}</span>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="1" v-if="item.from !== userInfo.employeeCode"></v-col>
                                <v-col v-if="item.from === userInfo.employeeCode" cols="1">
                                    <v-avatar>
                                        <img
                                            :src="msgAvatar(item.from)"
                                            :alt="item.from"
                                            onError="this.onerror=null;this.src='http://hrdapps48:3001/ftp/employee_pictures/no-image.png';"
                                        >
                                    </v-avatar>
                                </v-col>
                            </v-row>
                            
                            </v-container>
                        </v-card>
                    </v-card>
                    
                </v-col>
            </template>
            <template v-else>
                <v-col cols="8">
                    <my-page/>
                </v-col>
            </template>
            
        </v-row>

<!-- *********** switch account for leaders dialog*********** -->
        <v-dialog
            v-model="switchMsgViewDialog"
            max-width="290"
            >
            <v-card class="scroll" height="300">
                <v-card-title class="subtitle-2">Check members logs</v-card-title>
                <v-card-text>
                    <v-text-field @keyup.enter="onSwitchMsgViewDialog()" v-model="searchMemberName" label="search name"></v-text-field>
                </v-card-text>
                <template v-for="(staff, i) in searchMemberList">
                    <v-list-item :key="i + 'a3'" dense>
                        <v-list-item-avatar>
                            <img
                                :src="msgAvatar(staff.employee_code)"
                                :alt="staff.employee_code"
                                
                            >
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{staff.fullName | shorthentwent}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-checkbox @change="onMsgAccount(staff.employee_code)" v-model="staff.checkbox"></v-checkbox>
                        </v-list-item-action>
                    </v-list-item>
                </template>
                <!-- <v-list v-for="(m,i) in searchMemberList">
                    {{m}}
                </v-list> -->
            </v-card>
        </v-dialog>
<!-- ***********dialog*********** -->

    </v-container>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import InputMessage from '../components/InputMessage.vue'
import MyPage from '../components/MyPage.vue'

export default {
    components: {
        InputMessage,
        MyPage
    },
    data() {
        return {
            switchMsgViewDialog: false,
            searchMemberName: '',
            searchMemberList: [],
            msgAccount: '',
            showContacts: false, //temporary true -> false
            searchName: '',
            messaging: false,
            screenHeight: 0,
            msgRcvHeight: .67,
            msgToSendHeight: .08,
            msgData: [],
            departmentOptions: [],
            attachmentMd5: '',
            activeDepartment: '',
            toMsg: '',
            msgToArr: [],
            contacts: [],
            departmentContacts: '',
            sectionContacts: '',
            teamContacts: '',
            showAttachmentInput: false,
            recentMessages: [],
            t: null,
            unRead: 0,
        }
    },
    computed: {
        
    },
    beforeDestroy(){
        clearInterval(this.t)
    },
    created(){
        this.msgAccount = this.userInfo.employeeCode
    },
    mounted() {
        // this.autoRefresh()
        this.screenHeight = window.screen.availHeight
        this.getDefaultGroups()
        this.getDepartment()
        this.getRecentMessages()
        this.getMsgInterval()
        
    },
    methods: {
        // ongoing *******************************
        visibilityChange(evt, hidden) {
        // do something
        console.log(hidden);
        if(hidden){
            console.log('aaa')
                clearInterval(this.t)
                this.t = null
            }else{
                console.log('bbb')
                this.getRecentMessages()
                this.getMsgInterval()
            }
        },
        getMsgInterval() {
            if(!this.t){
                this.t = setInterval(() => {
                    this.getRecentMessages()
                }, 1800 * 1000)
            }
        },
        getRecentMessages(){
            console.log(moment().format('hh:mm:ss'))
            console.log(this.t)
            console.log('runnnnnnnnn!!!!!!!!!!!c')
            let url = `${this.api}recent_messages/${this.msgAccount}`
            axios.get(url).then(res => {
                
                if(res.data === 'no data'){
                    this.recentMessages = []
                }else{
                    this.recentMessages = res.data
                    let unRead = res.data.filter(rec => {
                    return rec.dest === 'from' && rec.read === false
                    }).length
                    this.unRead = unRead
                }
            })
        },
        onMsgAccount(val){
            this.msgAccount = val
            this.getRecentMessages()
            this.switchMsgViewDialog = false
            this.searchMemberList = []
            this.searchMemberName = ''
        },
        onSwitchMsgViewDialog(){
            let url = `${this.api}getcontacts/${this.userInfo.department}/${this.searchMemberName}`
            axios.get(url).then(res => {
                this.searchMemberList = res.data
            })
        },
        withUnreadMessage(val){
            if(val === 'messenger' && this.unRead > 0){
            return true
            }else{
            return false
            }
        },
        froalaShorten(str){
            return this.shorthen(str.replace(/<[^>]*>?/gm, ' '))
        },
        switchSource(){
            this.msgToArr = []
            this.showContacts = !this.showContacts
            if(!this.showContacts){
                this.getRecentMessages()
            }
        },
        removeContacts(){
            this.contacts = []
        },
        fromNow(val){
            return moment(val, 'MM-DD-YYYY hh:mm:ss').fromNow()
        },
        pushMsgTo(staff){
            this.messaging = true
            if(staff.checkbox && !this.msgToArr.includes(staff.employee_code)){
                this.msgToArr.push(staff)
            }
            this.loadMsgData(this.msgToArr[this.msgToArr.length - 1].employee_code)
            this.toMsg = this.msgToArr[this.msgToArr.length - 1].employee_code
        },
        onSearchContacts(){
            if(this.searchName.length === 0){
                this.contacts = []
            }else{
                if(this.searchName.length > 2){
                    let url = `${this.api}getcontacts/${this.activeDepartment}/${this.searchName}`
                    axios.get(url).then(res => {
                        console.log(res.data)
                        this.contacts = res.data
                    })
                }else{
                    alert('Please provide atleast 3 letters.')
                }
            }
            
        },
        getDefaultGroups(){
            this.activeDepartment = this.userInfo.department
        },
        getDepartment(){
            axios.get(`http://hrdapps48:5031/get/department/options`).then(res => {
                this.departmentOptions = res.data.map(rec => rec.name)
            })
        },
        selectMsgTo(staff, i){
            console.log(staff)
            this.messaging = true
            this.toMsg = staff.empId
            this.msgToArr = [{
                fullName: staff.empfullName,
                employee_code: staff.empId
            }]
            if(staff.dest === 'from' && staff.read === false){
                this.recentMessages[i].read = true
            }
            this.loadMsgData(staff.empId)
            // this.autoRefresh()
        },
        loadMsgData(to) {
            let url = `${this.api}getmsg/${this.msgAccount}/${to}`
            axios.get(url).then(res => {
                
                this.msgData = res.data.sort((a,b) => (a.date > b.date) ? -1: 1)
                if(this.msgData.length>0){
                    let temp = this.msgData[0]
                    let to = temp.to.filter(rec => {
                        return rec.empId === this.userInfo.employeeCode
                    })
                    
                    if(to.length>0 && temp.from !== this.userInfo.employeeCode && to[0].read === false){
                        temp.to.map(rec => {
                            if(rec.empId === this.userInfo.employeeCode){
                                rec.read = true
                            }
                            return rec
                        })
                        console.log('*!!!!!!*')
                        console.log(temp)
                        let url = `${this.api}read_message`
                        axios.post(url, temp).then(res => {
                            console.log('**********')
                            console.log(res.data)
                            
                            this.unRead = this.unRead -1
                        })
                    }
                }
                

            })
        },
        removeMsgToArr(i){
            this.msgToArr.splice(i,1)
            if(this.msgToArr.length > 0){
                this.loadMsgData(this.msgToArr[this.msgToArr.length - 1].employee_code)
            }
        },
        msgAvatar(id){
            function imageExists(image_url){

                var http = new XMLHttpRequest();

                http.open('HEAD', image_url, false);
                http.send();

                return http.status != 404;

            }
            if(imageExists(`http://hrdapps48:3001/ftp/employee_pictures/0${id}.jpg`)){
                return `http://hrdapps48:3001/ftp/employee_pictures/0${id}.jpg`
            }else{
                return 'http://hrdapps48:3001/ftp/employee_pictures/no-image.png'
            }
            
        },
        showAtt(){
            this.showAttachmentInput = !this.showAttachmentInput
        },
        closeMsg(){
            this.messaging = false
        },
        reSize(val){
            if(val === true){
                this.msgRcvHeight = .30
                this.msgToSendHeight = .45
            }else{
                this.msgRcvHeight = .67
                this.msgToSendHeight = .08
            }
        },
        onAddMsg(val){
            if(val && this.msgToArr.length>0){
                let remThis = '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>'
                let toAdd = {
                    fDep: this.userInfo.department,
                    from: this.userInfo.employeeCode,
                    fromName: this.userInfo.fullName,
                    date: moment().format('MM-DD-YYYY HH:mm:ss'),
                    content: val.replace(remThis, '')
                }
                toAdd.to = this.msgToArr.map(rec => {
                    return {
                        empId: rec.employee_code,
                        empfullName: rec.fullName,
                        read: false
                    }
                })
                let url = `${this.api}addmsg`
                axios.post(url, toAdd).then((res) => {
                    console.log(res.data)
                    if(this.msgToArr.length === 1 && this.msgToArr[0].employee_code === this.toMsg){
                        this.msgData.unshift(toAdd)
                        this.searchName = ''
                        this.showContacts = false
                        this.removeContacts()
                        this.getRecentMessages()
                    }
                })
                
            }else{
                alert('Please provide message and receipient')
            }
        },
    }
}
</script>

<style>
.deloClass a:link, a:visited {
  color: red;
}

.deloClass a:hover, a:active {
  background-color: green;
}
</style>

