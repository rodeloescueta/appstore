<template>
  <v-app>
   <v-container>
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
        <v-col cols="3 ">
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
        <v-col cols="3 ">
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
        <v-col cols="3 ">
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

 <v-card>
    <v-card-title> 
     Systems
         <v-spacer></v-spacer>   

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
                    &nbsp;&nbsp;&nbsp;
            <v-btn color="primary" @click="DialogAdd=true"><v-icon>mdi-file-document-box-plus</v-icon> NEW </v-btn>
    </v-card-title>  
    <v-subheader>
      <h3>Legends:</h3> 
      <v-icon color="success">mdi-stop</v-icon> Finished
      <v-icon color ="red lighten-1">mdi-pause</v-icon> On-going
      <v-icon color="cyan">mdi-play</v-icon> Pending
    </v-subheader>
     <v-data-table
      fixed-header
      :headers="headers"
      :items="systems"
      :search="search"
      item-key="rcode"
      class="elevation-1"   
    >  
  <template v-slot:item.assignedstaff="{item}">
      <td>
        <span v-for="(staff,i) in item.assignedstaff" :key="i+'a'">
          <template v-if="i !== 0">,</template>
          {{staff}}
        </span>
      </td>
    </template>
    <template v-slot:item.action="{ item }">
                            <td>
                              <v-icon v-if="isAssigned(item.assignedstaff)" color="gray" icon @click="editItem(item)">
                              mdi-square-edit-outline
                              </v-icon>
                              <v-icon v-else>
                                mdi-pencil-off-outline
                              </v-icon>
                            </td>
    </template>
          <template v-slot:item.status="{item}">
        <v-icon v-if="item.status =='Finished'" color="green">mdi-stop</v-icon>
        <v-icon v-else-if="item.status =='On-going'" color="red lighten-1">mdi-pause</v-icon>
        <v-icon v-else color="cyan">mdi-play</v-icon>
      </template>
    </v-data-table>
 </v-card>
    </v-container>

<!-- Add New System -->
<v-dialog v-model="DialogAdd">
    <v-card>
    <v-toolbar dense dark>
        <v-toolbar-title> <v-icon> mdi-pencil-plus</v-icon>Add New System </v-toolbar-title>
    </v-toolbar>
    <v-layout pa-4>
        <v-row>
            <v-col cols=3>
                <v-text-field label="System Name" v-model="addSystemData[0].sname"></v-text-field>
                  <v-progress-linear
                    v-model="addSystemData[0].percentage"
                    color="black"
                    height="40"
                    reactive
                    dark
                  >
                  <template v-slot="{ value }">
                    <strong>Percentage: {{ Math.ceil(value) }}%</strong>
                  </template>
            
                </v-progress-linear>
    <v-text-field label="Remarks" v-model="addSystemData[0].remarks"></v-text-field>

            </v-col>
              <v-col cols=3>
                <v-combobox multiple :items="DeptOption" label="Department" v-model="addSystemData[0].department"></v-combobox>
                 <v-menu
                                ref="menusdate"
                                v-model="menusdate"
                                :close-on-content-click="false"
                                :return-value.sync="sdate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="addSystemData[0].sdate"
                                    label="Started Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="addSystemData[0].sdate" no-title scrollable color="cyan accent-4">
                                  <v-spacer></v-spacer>
                                  <v-btn text  @click="menusdate = false">Cancel</v-btn>
                                  <v-btn text  @click="$refs.menusdate.save(addSystemData[0].sdate)">OK</v-btn>
                                </v-date-picker>
                 </v-menu>
            </v-col>
            <v-col cols=3>
                <v-combobox
                :items="statusOption"
                label="Status"
                v-model="addSystemData[0].status"
                clearable>
                </v-combobox>
                          <v-menu
                                ref="menufdate"
                                v-model="menufdate"
                                :close-on-content-click="false"
                                :return-value.sync="addSystemData[0].fdate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="addSystemData[0].fdate"
                                    label="Finished Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="addSystemData[0].fdate" no-title scrollable color="cyan accent-4">
                                  <v-spacer></v-spacer>
                                  <v-btn text  @click="menufdate = false">Cancel</v-btn>
                                  <v-btn text  @click="$refs.menufdate.save(addSystemData[0].fdate)">OK</v-btn>
                                </v-date-picker>
                 </v-menu>
            </v-col>
            <v-col cols=3>
                <v-combobox multiple :items="StaffList" label="Assigned Staff" v-model="addSystemData[0].assignedstaff"></v-combobox>
            </v-col>
        </v-row>
    </v-layout>
     <v-card-actions>
            <v-spacer/>
            <v-btn dark width=120 @click="updateSystem()"> <v-icon right dark>mdi-content-save-move</v-icon> Save</v-btn>
            <v-btn dark width=120 @click="DialogAdd=false"><v-icon right dark>mdi-close</v-icon> Cancel</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

<!-- EditData -->
<v-dialog v-model="DialogEdit">
<v-card>
  <v-toolbar dense dark> <v-toolbar-title> <v-icon> mdi-label-variant </v-icon> Information </v-toolbar-title> </v-toolbar>
<v-layout pa-4>
  <v-row>
    <v-col cols=3>
      <v-text-field label="System Name" v-model="editedItem.sname"></v-text-field>
                  <v-progress-linear
                    v-model="editedItem.percentage"
                    color="black"
                    height="40"
                    reactive
                    dark
                  >
                  <!-- <template v-slot="{ value }"> -->
                    <strong>Percentage: {{ Math.ceil(editedItem.percentage)}}%</strong>
                  <!-- </template> -->
                </v-progress-linear>
                <v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field>
    </v-col>
    <v-col cols=3>
      <v-combobox multiple :items="DeptOption" label="Department" v-model="editedItem.department"></v-combobox>
      <v-menu
                                ref="menusdate"
                                v-model="menusdate"
                                :close-on-content-click="false"
                                :return-value.sync="sdate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="editedItem.sdate"
                                    label="Started Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="editedItem.sdate" no-title scrollable color="cyan accent-4">
                                  <v-spacer></v-spacer>
                                  <v-btn text  @click="menusdate = false">Cancel</v-btn>
                                  <v-btn text  @click="$refs.menusdate.save(editedItem.sdate)">OK</v-btn>
                                </v-date-picker>
     </v-menu>
    </v-col>
    <v-col cols=3>
      <v-combobox  :items="statusOption" label="Status" v-model="editedItem.status"></v-combobox>
      <v-menu
                                ref="menufdate"
                                v-model="menufdate"
                                :close-on-content-click="false"
                                :return-value.sync="addSystemData[0].fdate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="editedItem.fdate"
                                    label="Finished Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="editedItem.fdate" no-title scrollable color="cyan accent-4">
                                  <v-spacer></v-spacer>
                                  <v-btn text  @click="menufdate = false">Cancel</v-btn>
                                  <v-btn text  @click="$refs.menufdate.save(editedItem.fdate)">OK</v-btn>
                                </v-date-picker>
                 </v-menu>
    </v-col>
    <v-col cols=3>
      <v-combobox multiple :items="StaffList" label="AssignedStaff" v-model="editedItem.assignedstaff"></v-combobox>
    </v-col>
  </v-row>
</v-layout>
<v-card-actions>
  <v-spacer/>
  <v-btn dark width=120 @click="updateSystemData()"> <v-icon right dark>mdi-content-save-move</v-icon> Save</v-btn>
            <v-btn dark width=120 @click="cancelEdit()"><v-icon right dark>mdi-close</v-icon> Cancel</v-btn>

</v-card-actions>
</v-card>
</v-dialog>

<!-- Charts -->
<v-dialog v-model="DialogChart" max-width="540">
<v-card>
  <v-card-title>Summary</v-card-title>
<div class="text-center">
   <v-chip
      class="ma-2"
      color="success"
      outlined
    >
      <v-icon left>mdi-alpha-f-circle</v-icon>
      {{Fpercent}}%
    </v-chip>
    <v-chip
      class="ma-2"
      color="red lighten-1"
      outlined
    >
      <v-icon left>mdi-alpha-o-circle</v-icon>
      {{Opercent}}%
    </v-chip>
    <v-chip
      class="ma-2"
      color="cyan"
      outlined
    >
      <v-icon left>mdi-alpha-p-circle</v-icon>
      {{Ppercent}}%
    </v-chip>
 
  <v-layout pa-2>

    <cchart></cchart>

  </v-layout>
   </div>
</v-card>
</v-dialog>
      <div>
          <v-snackbar
          v-model="addAlert.snackbar"
          :timeout="addAlert.timeout"
          color="rgba(0, 153, 0,0.7)"
          dark
          left
          bottom
          >
            Data has been added!
              <v-icon
            color="white"
             > mdi-check-circle-outline
            </v-icon>
          </v-snackbar>
         </div>
         <div>
          <v-snackbar
          v-model="editAlert.snackbar"
          :timeout="editAlert.timeout"
          color="rgba(0, 153, 0,0.7)"
          dark
          right
          bottom
          >
            Data has been updated!
              <v-icon
            color="white"
             > mdi-check-circle-outline
            </v-icon>
          </v-snackbar>
         </div>

        <!-- DialogFinished -->

        <v-dialog v-model="DialogFinished" max-width=600>
          <v-card>
            <v-card-title>List</v-card-title>
            <v-list v-for="item in FinishedData" :key="item.sname">
                <v-list-item>
                <v-list-item-action>
                <v-icon color="secondary">mdi-stop</v-icon>
                </v-list-item-action>
                <v-list-item-content>
              <v-list-item-title>
                     {{ item.sname}}
                  </v-list-item-title>
               </v-list-item-content>      
          </v-list-item> 
            </v-list>
          </v-card>
        </v-dialog>

        <!-- DialogOngoing -->
           <v-dialog v-model="DialogOngoing" max-width=600>
          <v-card>
            <v-card-title>List</v-card-title>
            <v-list v-for="item in OngoingData" :key="item.sname">
                <v-list-item>
                <v-list-item-action>
                <v-icon color="secondary">mdi-stop</v-icon>
                </v-list-item-action>
                <v-list-item-content>
              <v-list-item-title>
                  {{ item.sname}}
                  </v-list-item-title>
               </v-list-item-content>      
          </v-list-item> 
            </v-list>
          </v-card>
        </v-dialog>

         <!-- DialogPending -->
           <v-dialog v-model="DialogPending" max-width=600>
          <v-card>
            <v-card-title>List</v-card-title>
            <v-list v-for="item in PendingData" :key="item.sname">
                <v-list-item >
                <v-list-item-action>
                <v-icon color="secondary">mdi-stop</v-icon>
                </v-list-item-action>
                <v-list-item-content>
              <v-list-item-title>
                  {{ item.sname}}
                  </v-list-item-title>
               </v-list-item-content>      
          </v-list-item> 
            </v-list>
          </v-card>
        </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
// import bchart from '@/components/sampleChart.vue'
import cchart from '@/components/Pie.vue'
//const api = 'http://localhost:5000/'
  export default {
    components:{
      cchart
    },
    data (){
      return{
          selectedSystem:[],
          DialogAdd:false,
          DialogEdit:false,
          DialogChart:false,
          DialogFinished:false,
          DialogOngoing:false,
          DialogPending:false,
          statusOption:['Finished','On-going','Pending'],
          menusdate:'',
          sdate:'',
          menufdate:'',
          fdate:'',
          addAlert: {snackbar:false, timeout:2000},
          editAlert: {snackbar:false, timeout:2000},
          search:'',
          headers:[
         
          { text: 'System Name  ', value: 'sname'},
          { text: 'Department', value: 'department' },
          { text: 'Status', value: 'status' },
          { text: 'Assigned Staff', value: 'assignedstaff' },
          { text: 'Percentage (%)', value: 'percentage' },
          { text: 'Started Date', value: 'sdate' },
          { text: 'Finished Date', value: 'fdate' },
          { text: 'Remarks', value: 'remarks' },
          { text: 'Action', value: 'action' },
        ],
        systems:[
          
        ],
        addSystemData:[
            {
            sname:'',
            department:'',
            status:'',
            assignedstaff:'',
            percentage:0,
            sdate:'',
            fdate:'',
            remarks:''
        }
        ],
        DeptOption:[],
        StaffList:[],
        editedItem:{
           sname:'',
            department:'',
            status:'',
            assignedstaff:'',
            percentage:0,
            sdate:'',
            fdate:'',
            remarks:''
        },
        defaultItem:{
           sname:'',
            department:'',
            status:'',
            assignedstaff:'',
            percentage:0,
            sdate:'',
            fdate:'',
            remarks:''
        },
        editedIndex:-1,
        finished:[],
        pending:[],
        ongoing:[],
        headerFinished:[{text:'Finished', value:'sname'}],
        headerOngoing:[{text:'On-going', value:'sname'}],
        headerPending:[{text:'Pending', value:'sname'}],
        strAssignedStaff:'',
        FinishedData:[],
        PendingData:[],
        OngoingData:[]
      }
    },
    created(){
      axios.get(`${this.api}allsystems/New System`).then(res=>{
        this.systems = res.data

        this.FinishedData = res.data.filter(rec=>{
          return rec.status=='Finished'
        })

        this.PendingData = res.data.filter(rec=>{
          return rec.status == 'Pending'
        })

        this.OngoingData = res.data.filter(rec=>{
          return rec.status== 'On-going'
        })
        // console.log(this.systems[0].assignedstaff)
        
      })
       axios.get(`${this.api}get/department/options`).then(res=>{
          
          //this.DeptOption= res.data[0].name
          for (let i=0; i<res.data.length;i++){
            this.DeptOption.push(res.data[i].name)
          }
          //console.log(this.DeptOption)
        })

        axios.get(`${this.api}getStaffName/QA`).then(res=>{
           for (let i=0; i<res.data.length;i++){
            this.StaffList.push(res.data[i].fullName)
          }
        })


    },
    methods:{
        isAssigned(arr) {
          return arr.includes(this.userInfo.fullName)
        },
        openDialog(){ 
        this.addSystemData[0].sname=''
        this.addSystemData[0].department=''
        this.addSystemData[0].status=''
        this.addSystemData[0].assignedstaff=''
        this.addSystemData[0].percentage=0
        this.addSystemData[0].sdate=''
        this.addSystemData[0].fdate=''
        this.addSystemData[0].remarks=''
        this.DialogAdd= true
        }, 
        openSummary(){
          this.DialogChart = true     
        },
        updateSystem(){
            if(this.addSystemData[0].sname =='' ||this.addSystemData[0].department =='' ||
               this.addSystemData[0].status ==''
               ){
                alert('Please fill up all information needed!')
            }
            else{
            console.log(this.addSystemData[0])
            this.addSystemData[0].percentage = Math.ceil(this.addSystemData[0].percentage)
             axios.post(`${this.api}addsystems`, this.addSystemData[0]).then(res => {
                console.log(res.data)
                this.addSystemData._rev = res.data.rev
                this.DialogAdd= false
                this.addAlert.snackbar=true
                this.systems.push(this.addSystemData[0])
            })
           }
          
        },
        updateSystemData(){
          this.editedItem.percentage = Math.ceil(this.editedItem.percentage)
          axios.post(`${this.api}updatedata`,this.editedItem).then(res=>{
            console.log(res.data)
            this.DialogEdit = false
            this.editAlert.snackbar=true
           Object.assign(this.systems[this.editedIndex], this.editedItem)
          })
        },
   
      getColor (data) {
        if (data == 'Finished') return 'green'
        else if (data == 'Pending') return 'orange'
        else return 'red'
      },
      editItem(data){
        this.selectedDept=[]
        this.DialogEdit = true
        this.editedIndex = this.systems.indexOf(data)
        this.editedItem = Object.assign({},data)
      },
      cancelEdit(){
        this.DialogEdit  = false
        this.editedIndex = -1
        this.editedItem = Object.assign({}, this.defaultItem)
      }

    } ,
    computed: {
      totalSystem(){
        return this.systems.length
      },
      finishedSystem(){
        let data1 =this.systems.filter(res=>{
       return res.status == 'Finished'
       })
       return data1.length
      },
       OngoingSystem(){
        let data1 =this.systems.filter(res=>{
       return res.status == 'On-going'
       })
       return data1.length
      },
       pendingSystem(){
        let data1 =this.systems.filter(res=>{
       return res.status == 'Pending'
       })
       return data1.length
      },
      Fpercent(){
     return Math.round((this.finishedSystem/this.totalSystem) * 100)
      },
       Opercent(){
     return Math.round((this.OngoingSystem/this.totalSystem) * 100)
      },
      Ppercent(){
     return Math.round((this.pendingSystem/this.totalSystem) * 100)
      },
     
      
      // isAssignedStaff(){
      //   for(let i=0; i<this.systems.length; i++){
      //     let str = JSON.stringify(this.systems[i].assignedstaff)
      //     if (str.search(this.userInfo.fullName) >0){
      //       return true
      //     }
      //     else
      //       return false
      //   }
      // }
    }
  }
</script>

<style>
#BGTable{
    background-color: rgb(65, 85, 94);
}

</style>