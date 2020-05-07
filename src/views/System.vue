<template>
<v-app>
<!-- <v-container>
    <v-row dense>
        <v-col cols="3">
          <v-card
           color="blue darken-2"
            dark
          >
            <v-card-title class="headline">Total</v-card-title>
            <v-card-actions>
              <v-btn text @click="openSummary()">
                <v-icon x-large>mdi-poll-box-outline</v-icon> 
                <h2>{{totalSystem}}</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-card
           color="success"
            dark
          >
            <v-card-title class="headline">Finished</v-card-title>
            <v-card-actions>
              <v-btn text @click="DialogFinished=true">
                <v-icon x-large>mdi-poll-box-outline</v-icon> 
                <h2>{{finishedSystem}}</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card
           color="primary"
            dark
          >
            <v-card-title class="headline">Testing/Confirmation</v-card-title>
            <v-card-actions>
              <v-btn text @click="DialogFinished=true">
                <v-icon x-large>mdi-poll-box-outline</v-icon> 
                <h2>{{testingSystem}}</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-card
            color="red lighten-1"
            dark
          >
            <v-card-title class="headline">On-going</v-card-title>
            <v-card-actions>
              <v-btn text @click="DialogOngoing=true">
                <v-icon x-large>mdi-poll-box-outline</v-icon> 
                <h2>{{OngoingSystem}}</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-card
            color="cyan"
            dark
          >
            <v-card-title class="headline">Pending</v-card-title>
            <v-card-actions>
              <v-btn text @click="DialogPending=true">
                <v-icon x-large>mdi-poll-box-outline</v-icon> 
                <h2>{{pendingSystem}}</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
 </v-row>
</v-container> -->
<v-card>
    <v-card-title> Systems 
        <v-spacer></v-spacer>
        <v-combobox :items="OptionSection"
            v-model="filterSection"
            label="Section"
            clearable>
        </v-combobox> &nbsp;&nbsp;
        <v-text-field outlined 
            v-model="search" 
            append-icon="search"
            label="Search" 
            single-line
            hide-details
            dense>
        </v-text-field>
        &nbsp;&nbsp;
        <v-btn dense @click="Open('',0)">
            <v-icon>mdi-file-document-box-plus</v-icon>
            NEW
        </v-btn>
    </v-card-title>
     <v-subheader>
            <h3>Legends:</h3> 
            <v-icon color="success">mdi-stop</v-icon> Finished
            <v-icon color="primary">mdi-play-pause</v-icon> Testing/Confirmation
            <v-icon color ="red lighten-1">mdi-play</v-icon> On-going
            <v-icon color="cyan">mdi-pause</v-icon> Pending
           
            
         </v-subheader>
        <v-data-table
        :headers="headers"
        :items="Records"
        :search="search"
        dense
        >   
        
        <!-- <template v-slot:item.details="{item}">
            sadf {{item.details | shorthentwent}}
        </template> -->
            <template v-slot:item.status="{item}">
                <v-icon v-if="item.status =='Finished'" color="green">mdi-stop</v-icon>
                <v-icon v-else-if="item.status =='Testing/Confirmation'" color="primary">mdi-play-pause</v-icon>
                <v-icon v-else-if="item.status =='Ongoing'" color="red lighten-1">mdi-play</v-icon>
                <v-icon v-else color="cyan"> mdi-pause</v-icon>
            </template>
            <template v-slot:item.action="{ item }">
                <td>
                    <v-icon  color="gray" icon @click="Open(item,1)">
                    mdi-square-edit-outline
                    </v-icon>
                </td>   
            </template>
        <template v-slot:item.incharge="{item}">
                <v-row no-gutters>
                <v-col v-for="(staff,i) in item.incharge" :key="i+'a'">
                    <v-avatar size="36px"><img :src="avatarUrl(staff.value)"></v-avatar> 
                </v-col>
                </v-row>
         </template>
        <template v-slot:item.action="{ item }">
            <td>
                <v-icon color="gray" icon @click="Open(item,1)">
                mdi-square-edit-outline
                </v-icon>
                <!-- <v-icon v-else>
                mdi-pencil-off-outline
                </v-icon> -->
            </td>
        </template>
        </v-data-table>
    
    <!-- Dialog for New and Edit -->
    <v-dialog v-model="Dialog" max-width="900" persistent>
        <v-card>
            <v-toolbar dark dense>
            <v-toolbar-title> 
                <v-icon>mdi-information-outline</v-icon> &nbsp;
                <span class="headline">{{editIndex === -1? 'Add System': 'Update System'}}</span>
            </v-toolbar-title>
            </v-toolbar>
            <v-container>
                <v-row>
                    <v-col cols="8">
                        <v-text-field
                        v-model="addSystem.sname"
                        label="System Name">
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field 
                        label="Programming Language"
                        v-model="addSystem.pl"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-combobox 
                        :items="OptionStatus" 
                        label="Status"
                        v-model="addSystem.status"
                        ></v-combobox>
                    </v-col>
                    <v-col cols="4">
                        <v-progress-linear
                        color="black"
                        height="30"
                        reactive
                        dark
                        v-model="addSystem.percentage"
                        >
                            <template v-slot="{ value }">
                                <strong>Percentage: {{ Math.ceil(value) }}%</strong>
                            </template>
                        </v-progress-linear>
                    </v-col>
                     <v-col cols="4">
                                  <v-text-field
                                    v-model="addSystem.tdate"
                                    label="Target Date"
                                    prepend-icon="mdi-calendar"
                                    clearable
                                  ></v-text-field>
                               
                    </v-col>
                    <v-col cols="6">
                        <v-text-field 
                        v-model="addSystem.requester"
                        label="Requester"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field 
                        label="Users"
                        v-model="addSystem.users"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea 
                        label="Details of Request"
                        v-model="addSystem.details"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                       <v-textarea 
                        label="Remarks"
                        v-model="addSystem.remarks"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="6">
                        <v-combobox 
                        :items="OptionSection"
                        v-model="addSystem.section"
                        @input="filterTeam"
                        label="Section">
                        </v-combobox>
                    </v-col>
                    <v-col cols="6">
                        <v-combobox 
                        :items="OptionTeam"
                        v-model="addSystem.team"
                        label="Team"
                        @input="filterStaff"
                        :disabled="!addSystem.section? true:false"
                        >
                        </v-combobox>
                    </v-col>
                    <v-col cols="12">
                        <v-combobox label="In-Charge"
                        multiple
                        :items="Staffs"
                        v-model="addSystem.incharge"
                        :disabled="!addSystem.team? true:false"
                        @click="filterStaff"
                        ></v-combobox>
                    </v-col>
                    
                </v-row>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn width="100" @click="Save()"
                    >
                        <v-icon>mdi-content-save</v-icon> Save 
                    </v-btn>
                    <v-btn width="100" @click="Cancel()"><v-icon>mdi-close</v-icon>Cancel</v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</v-card>
</v-app>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            fab:true,
            menuTarget:'',
            search:'',
             headers: [
                { text: 'System Name', value: 'sname', width:'15%'},
                // { text: 'PL  ', value: 'pl'},
                { text: 'Status', value: 'status',width:'8%' },
                { text: '(%)', value: 'percentage' },
                { text: 'Target', value: 'tdate' },
                { text: 'Requester', value: 'requester' },
                { text: 'Users', value: 'users' },
                { text: 'Details', value: 'details',width:'30%' },
                { text: 'In-Charge', value: 'incharge',width:'10%' },
                { text: 'Action', value: 'action', width:'8%' },
             ],
             records:[],
             OptionStatus:['Finished','Ongoing','Pending','Testing/Confirmation'],
             OptionSection:['SOFTWARE DEVELOPMENT 1','SOFTWARE DEVELOPMENT 2','SOFTWARE DEVELOPMENT 3'],
             OptionTeam:[],
             Dialog:false ,
             addSystem:{},
             editIndex:-1,
             filterSection:'',
             Staffs:[]
        }  
    },
    created(){
        this.getRecords()
        // console.log(this.userInfo)
    },
    methods:{
          avatarUrl(val){
           let http = new XMLHttpRequest();
                 http.open('HEAD', `http://hrdapps48:3001/ftp/employee_pictures/0${val}.jpg`, false);
                 http.send()
            if(http.status!=404){
                return `http://hrdapps48:3001/ftp/employee_pictures/0${val}.jpg`
           }
           else return 'http://hrdapps48:3001/ftp/employee_pictures/no-image.png'
       },
        isAssigned(arr) {
        for(let i=0;i<arr.length;i++){
          return arr[i].text.includes(this.userInfo.fullName)
          }
        },
        filterStaff(){
             axios.get(`${this.api}get/staffs/nickname`).then(res=>{
                 let data = res.data.filter(rec=>{
                     return rec.section == this.addSystem.section && rec.team == this.addSystem.team
                 })
                 this.Staffs = []
                 for(let i=0; i<data.length;i++){
                     let toPush = {}
                     toPush.text = data[i].full_name
                     toPush.value = data[i].employee_code
                     this.Staffs.push(toPush)
                 } 
                 console.log(this.Staffs)    
        })
        },
        filterTeam(){
            this.OptionTeam = []
            axios.get(`${this.api}get/department/QA/section/${this.addSystem.section}/team_option`)
            .then(res=>{
                for(let i=0;i<res.data.length;i++){
                    this.OptionTeam.push(res.data[i].name)
                }
            })

        },
        getRecords(){
            axios.get(`${this.api}getSystems`).then(res=>{
                this.records = res.data
            })
        },
        Cancel(){
            this.Dialog = false
        },
        Save(){
            if(this.editIndex === -1){
                if(Object.keys(this.addSystem).length != 0 || this.addSystem.constructor != Object){
                if(!this.addSystem.sname){
                    alert('System name is required!')
                }
                else {
                this.addSystem.UpdatedBy = this.userInfo.employeeCode
                this.addSystem.percentage = Math.ceil(this.addSystem.percentage)
                axios.post(`${this.api}addsystems`,this.addSystem).then(res=>{
                     this.addSystem._id = res.data.id
                     this.addSystem._rev = res.data.rev
                     this.records.push(this.addSystem)
                    alert('Successfully Saved!')
                    this.Dialog= false
                })
                }
                }
                else alert('Cannot save null information!')
            }
            else{
                this.addSystem.percentage = Math.ceil(this.addSystem.percentage)
                this.addSystem.UpdatedBy = this.userInfo.employeeCode
                axios.post(`${this.api}updatedata`,this.addSystem).then(res=>{
                    this.addSystem._id = res.data.id
                    this.addSystem._rev = res.data.rev
                    // Object.assign(this.records[this.editedIndex], this.addSystem)
                    this.getRecords()
                    alert('Successfully updated!')
                    this.Dialog= false
                })
            }
            
            
        },
        Open(data,type){
            this.Dialog = true
             if(type==1){
            this.editIndex = this.records.indexOf(data)
            let info = data
            this.addSystem = info
            }
            else{
            this.addSystem = {}
            this.editIndex = -1
            }
        }

    },
    computed:{
        Records(){
            if(!this.filterSection){
                return this.records
            }
            else{
                let data = this.records.filter(rec=>{
                return rec.section == this.filterSection
                })
                return data
            }
        },
        totalSystem(){
        return this.records.length
      },
      finishedSystem(){
        let data1 =this.records.filter(res=>{
       return res.records == 'Finished'
       })
       return data1.length
      },
       OngoingSystem(){
        let data1 =this.records.filter(res=>{
       return res.status == 'Ongoing'
       })
       return data1.length
      },
       pendingSystem(){
        let data1 =this.records.filter(res=>{
       return res.status == 'Pending'
       })
       return data1.length
      },
       testingSystem(){
        let data1 =this.records.filter(res=>{
       return res.status == 'Testing/Confirmation'
       })
       return data1.length
      },
    }
}
</script>