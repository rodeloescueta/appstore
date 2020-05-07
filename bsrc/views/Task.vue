<template>
    <v-app>

           <v-card>
                <v-card-title> List of Tasks
                <v-spacer/>
                    <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        outlined
                        dense
                        color="black"
                        hide-details
                    ></v-text-field>
                    <v-badge
                        overlap
                        color="red"
                    >
                        <span slot="badge">{{RequestCount}}</span>
                        <v-btn
                        class="ma-2"
                        dense
                        outlined
                        @click="DialogTask=true"
                        >
                        New Tasks
                        <v-icon right dark>mdi-format-list-checkbox</v-icon>
                        </v-btn>
                    </v-badge>
                </v-card-title>
                <v-data-table
                :headers="headers"
                :items="tasks"
                :search="search"
                dense
                >
                <template v-slot:item.action="{ item }">
                            <td>
                              <v-icon class="mr-2"  color="gray" icon @click="OpenTask(item)" >
                              mdi-square-edit-outline
                              </v-icon>
                            </td>
                        </template>
                </v-data-table>
            </v-card>

     <!-- DialogTask -->
            <v-dialog v-model="DialogTask">
                <v-card>
                    <v-toolbar dark dense>
                        <v-toolbar-title> Received Tasks </v-toolbar-title>
                    </v-toolbar>
                    <v-data-table
                        :headers="headers"
                        :items="request"
                        dense
                        hide-default-footer
                    >
                        <template v-slot:item.action="{ item }">
                            <td>
                              <v-btn text icon @click="AcceptedTask(item)">
                              <v-icon color="black" icon >
                              mdi-checkbox-marked-outline
                              </v-icon>
                              </v-btn>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-dialog>

    <!-- Task Update Dialog -->
            <v-dialog v-model="DialogEdit" max-width="700" persistent>
                <v-card>
                    <v-toolbar dense dark>
                        <v-toolbar-title>Information</v-toolbar-title>
                        <v-spacer/>
                        <v-tooltip top>
                        <template v-slot:activator="{ on }">
                        <v-btn icon @click="viewAttachment()">
                        <v-icon v-on="on">mdi-paperclip</v-icon>
                        </v-btn>
                        </template>
                        <span>View Attachment</span>
                        </v-tooltip>
                    </v-toolbar>
                    <v-layout pa-4>
                        <v-row>
                            <v-col cols=4>
                                <v-text-field v-model="editTask.rcode" label="Request Code" disabled></v-text-field>
                            </v-col>
                            <v-col cols=8>
                                <v-text-field v-model="editTask.sname" label="System Name" disabled></v-text-field>
                            </v-col>
                            <v-col cols=4>
                                <v-combobox v-model="editTask.rtype"  label="Request Type"></v-combobox>
                            </v-col>
                            <v-col cols=4>
                                <v-text-field v-model="editTask.sdate" label="Date Started" disabled></v-text-field>
                            </v-col>
                            <v-col cols=4>
                                <v-text-field v-model="editTask.fdate"  label="Date Finished"></v-text-field>
                            </v-col>
                            <v-col cols=12>
                                <v-textarea v-model="editTask.details"  dense outlined label="Details of Request" disabled></v-textarea>
                            </v-col>
                            <v-col cols=12>
                                <v-textarea v-model="editTask.solution"  dense outlined label="Details of Solution"></v-textarea>
                            </v-col>
                            <v-col cols=6>
                                <v-combobox v-model="editTask.status" :items="StatusOpt"  label="Status"></v-combobox>
                            </v-col>
                            <v-col cols=6>
                                <v-text-field v-model="editTask.rname"  label="Requestor" disabled></v-text-field>
                            </v-col>
                        </v-row>
                    </v-layout>
                    <v-card-actions>
                         <v-spacer/>
                            <v-btn dark width=120 @click="SaveUpdateTask()" > <v-icon right dark >mdi-content-save-move</v-icon> Save </v-btn>
                            <v-btn dark width=120 @click="canceled()"><v-icon right dark>mdi-close</v-icon> Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

    <!-- Dialog for Finished System needed to update used server for the system -->
            <v-dialog v-model="DialogFinished" max-width="700" persistent>
                <v-card>
                    <v-toolbar dense dark>
                        <v-toolbar-title>System Information</v-toolbar-title>
                        <v-spacer/>
                        <v-icon @click="DialogFinished=false">mdi-close</v-icon>
                    </v-toolbar>
                    <v-layout pa-4>
                        <v-row>
                            <v-col cols=4>
                                <v-text-field label="System Name">
                                </v-text-field>
                            </v-col>
                            <v-col cols=4>
                                <v-text-field label="Server Name">
                                </v-text-field>
                            </v-col>
                             <v-col cols=4>
                                <v-text-field label="Database Name">
                                </v-text-field>
                            </v-col>
                            <v-col cols=6>
                                <v-textarea label="Link Databases" dense>
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-layout>   
                </v-card>
            </v-dialog>
    <!-- Notifications -->
            <div>
                <v-snackbar
                v-model="AcceptAlert.snackbar"
                :timeout="AcceptAlert.timeout"
                color="rgba(0, 153, 0,0.7)"
                dark
                right
                bottom
                >
                Task has been accepted!
                <v-icon
                color="white"
                > mdi-check-circle-outline
                </v-icon>
               </v-snackbar>
            </div>
            <div>
                <v-snackbar
                v-model="UpdateAlert.snackbar"
                :timeout="UpdateAlert.timeout"
                color="rgba(0, 153, 0,0.7)"
                dark
                right
                bottom
                >
                Task has been updated!  
                <v-icon
                color="white"
                > mdi-check-circle-outline
                </v-icon>
               </v-snackbar>
            </div>
    </v-app>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
// import io from 'socket.io-client'
// let socket = io('http://10.169.140.132:5000/test')
export default {
    data(){
        return{
            headers:[
                { text: 'Request Code', value: 'rcode', align:'left', sortable:false},
                { text: 'Request Type', value: 'rtype' },
                { text: 'System', value: 'sname' },
                { text: 'In Charge', value: 'assignedstaff' },
                { text: 'Date Received', value: 'rdate' },
                { text: 'Date Finished', value: 'fdate' },
                { text: 'Current Status', value: 'status' },
                { text: 'Action', value: 'action' },
            ],
            tasks:[],
            request:[],
            search:'',
            countRequest:0,
            DialogTask:false,
            DialogEdit:false,
            DialogFinished:false,
            acceptTask:{},
            acceptIndex:-1,
            editTask:{},
            defaultTask:{},
            editIndex:-1,
            AcceptAlert: {snackbar:false, timeout:2000},
            UpdateAlert: {snackbar:false, timeout:2000},
            StatusOpt:['Finished','On-going','Pending'],
            rndNum:[],
        }
    },
   created(){
       axios.get(`${this.api}tasksformembers/${this.userInfo.fullName}`).then(res=>{
           this.tasks = res.data
       })
       this.GenerateRequest()
       console.log(this.userInfo)
    
   },
    mounted () {
     setInterval(() => {
    this.GenerateRequest()
  }, 5000)
},
   methods:{
       GenerateRequest(){
           axios.get(`${this.api}tasksformembers/notyetaccepted/${this.userInfo.fullName}`).then(res=>{
            this.request = res.data
           })
       },
       AcceptedTask(data){
            this.acceptIndex = this.request.indexOf(data)
            this.acceptTask = Object.assign({},data)
            this.acceptTask.isAccept = 1
            //console.log(this.acceptIndex)
            this.acceptTask.sdate = moment().format('YYYY-MM-DD')
            axios.post(`${this.api}updatedata`,this.acceptTask).then(res=>{
            console.log(res.data)
            this.acceptTask._id = res.data.id
            this.acceptTask._rev = res.data.rev
            this.request.splice(this.acceptIndex,1)
            this.tasks.push(this.acceptTask)
            this.acceptTask = {}
            this.DialogTask = false
            this.AcceptAlert.snackbar = true
            })
       },
       OpenTask(data){
           this.DialogEdit = true
           this.editIndex = this.tasks.indexOf(data)
           this.editTask = Object.assign({},data)
           this.defaultTask = Object.assign({},data)
           
       },
       SaveUpdateTask(){
           if(this.editTask.solution != this.defaultTask.solution || this.editTask.fdate != this.editTask.fdate
           || this.editTask.status != this.defaultTask.status)
        {
        if(this.editTask.status == 'Finished'){
            this.editTask.percentage = 100
        }
          axios.post(`${this.api}updatedata`,this.editTask).then(res=>{
            console.log(res.data)
            this.editTask._id = res.data.id
            this.editTask._rev = res.data.rev
            Object.assign(this.tasks[this.editIndex], this.editTask)
            this.DialogEdit = false
            this.UpdateAlert.snackbar = true
            if(this.editTask.fdate != '' && this.editTask.status == 'Finished'){
                this.DialogFinished = true
            }
          })
        }
            else{
               alert("No edited information!") 
            }
       },
       canceled(){
           this.DialogEdit = false
           this.editIndex = -1
       },
        viewAttachment(){
          for(var i = 0; i < this.editTask.files.length; i++){
                let file = this.editTask.files[i]
                let baseUrl = 'http://10.169.140.132:9000/'
                let url = `${baseUrl}uploads/uploaded/${file}`
                window.open(url);
            }  
      }
   },
   computed:{
       RequestCount(){
           return this.request.length
       }
   }
    
}
</script>