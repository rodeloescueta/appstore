<template>
  <v-app>
 <v-card>
   <v-card-title>
          List of Requests
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

          <v-btn
            class="ma-1"
            @click="openDialog()"
            dense
            outlined
          >
      New
      <v-icon right dark>mdi-file-document-box-plus</v-icon>
    </v-btn>
    <template v-if="isLeader && userInfo.designation=='Japanese Advisor'">
      <v-badge
        overlap
        color="red"
      >
        <span slot="badge">{{RequestCounter}}</span>
        <v-btn
        class="ma-1"
          dense
          outlined
          @click="DialogRequest=true"
        >
          Received Requests
          <v-icon right dark>mdi-format-list-checkbox</v-icon>
        </v-btn>
      </v-badge>
      </template>
      <template v-if="isLeader && userInfo.designation=='Section Head Trainee'">
      <v-badge
        overlap
        color="red"
      >
        <span slot="badge">{{ConfirmCounter}}</span>
        <v-btn
        class="ma-1"
          dense
          outlined
          @click="DialogRequest=true"
        >
          Confirmed Requests
          <v-icon right dark>mdi-format-list-checkbox</v-icon>
        </v-btn>
      </v-badge>
      </template>
 </v-card-title>
     <v-data-table
      fixed-header
      :headers="headers"
      :items="systems"
      :search="search"
      item-key="no"
      class="elevation-1" 
      dense  
    >
    <template v-slot:item.department="{item}">
      <td>
        <span v-for="(dep,i) in item.department" :key="i+'a'">
          <template v-if="i !== 0">,</template>
          {{dep}}
        </span>
      </td>
    </template>
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
                              <v-icon color="gray" icon @click="viewItem(item)" >
                              mdi-information
                              </v-icon>
                            </td>
    </template>
    <!-- <template v-slot:item.status="{ item }">
      <v-chip >{{ item.status }}</v-chip>
    </template> -->
    
    </v-data-table>

<!-- <br> -->
 </v-card>
<!-- Add New Request -->
<v-dialog v-model="DialogAdd" max-width="700" persistent>
    <v-card>
    <v-toolbar dense dark>
        <v-toolbar-title> <v-icon> mdi-pencil-plus</v-icon>Add New Request </v-toolbar-title>
    </v-toolbar>
    <v-layout pa-4>
        <v-row>
          <v-col cols=6>
              <v-text-field label="Request Code" disabled v-model="Ccode"></v-text-field>
          </v-col>
          <v-col cols=6>
              <v-combobox :items="RequestOption" label="Request Type" v-model="addSystemData[0].rtype"></v-combobox>
          </v-col>
          <v-col cols=12>
               <v-combobox  :items="SnameOption" label="System Name"  v-model="addSystemData[0].sname"></v-combobox>
          </v-col>
         <v-col cols=6>
              <v-menu
                                ref="menurdate"
                                v-model="menurdate"
                                :close-on-content-click="false"
                                :return-value.sync="rdate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="addSystemData[0].rdate"
                                    label="Received Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="addSystemData[0].rdate" no-title scrollable color="cyan accent-4">
                                  <v-spacer></v-spacer>
                                  <!-- <v-btn text  @click="menurdate = false">Cancel</v-btn>
                                  <v-btn text  @click="$refs.menurdate.save(addSystemData[0].rdate)">OK</v-btn> -->
                                </v-date-picker>
                 </v-menu>
          </v-col>

          <v-col cols=6>
            <v-menu
                                ref="menuedate"
                                v-model="menuedate"
                                :close-on-content-click="false"
                                :return-value.sync="edate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="addSystemData[0].edate"
                                    label="Expected Release Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="addSystemData[0].edate" no-title scrollable color="cyan accent-4">
                                  <v-spacer></v-spacer>
                                </v-date-picker>
                 </v-menu>
          </v-col>
        <v-col cols=12>
        <v-textarea
          name="input-7-1"
          label="Details of Request"
          v-model="addSystemData[0].details"
          hint="If request type is New System, please indicate no. of users."
        ></v-textarea>
    </v-col>
    <v-col cols=12>
        <v-textarea v-model="addSystemData[0].cstatus" label="Current Status"> </v-textarea>
    </v-col>
    <v-col cols=12>
         <v-file-input
            v-model="files"
            counter
            label="Attachment"
            multiple
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            :show-size="1000"
            dense
            @change="onFileChange()"
            >
            <template v-slot:selection="{ index, text }">
                <v-chip
                v-if="index < 2"
                color="cyan accent-4"
                dark
                label
                small
                >
                {{ text }}
                </v-chip>

                <span
                v-else-if="index === 2"
                class="overline grey--text text--darken-3 mx-2"
                >
                {{ addSystemData[0].files.length - 2 }} File(s)
                </span>
            </template>
            </v-file-input>
    </v-col>
        </v-row>
    </v-layout>
     <v-card-actions>
            <v-spacer/>
            <v-btn dark width=120 @click="addNewRequest()"> <v-icon right dark>mdi-content-save-move</v-icon> Save</v-btn>
            <v-btn dark width=120 @click="DialogAdd=false"><v-icon right dark>mdi-close</v-icon> Cancel</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>


<!-- RequestDialog -->

<v-dialog v-model="DialogRequest">
  <v-card>
    <v-toolbar dense dark>
      <v-toolbar-title> List of Requests </v-toolbar-title>
    </v-toolbar>
    <v-container fluid pa-1>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="DatatoTable"
      item-key="no"
      class="elevation-1" 
      dense  
    >
    <template v-slot:item.department="{item}">
      <td>
        <span v-for="(dep,i) in item.department" :key="i+'a'">
          <template v-if="i !== 0">,</template>
          {{dep}}
        </span>
      </td>
    </template>
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
                              <v-icon color="black" icon @click="editItem(item)" >
                              mdi-square-edit-outline
                              </v-icon>
                            </td>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
    </template>
    
    </v-data-table>
    </v-container>
  
  </v-card>
</v-dialog>




<!-- InfoData -->
<v-dialog v-model="DialogEdit" max-width="700">
 <v-card>
    <v-toolbar dense dark>
        <v-toolbar-title> <v-icon> mdi-information</v-icon> Information </v-toolbar-title>
    </v-toolbar>
    <v-layout pa-4>
        <v-row>
          <v-col cols=6>
              <v-text-field disabled label="Request Code" v-model="editedItem.rcode"></v-text-field>
          </v-col>
          <v-col cols=6>
              <v-combobox  disabled :items="RequestOption" label="Request Type" v-model="editedItem.rtype"></v-combobox>
          </v-col>
          <v-col cols=12>
               <v-combobox disabled :items="SnameOption" label="System Name"  v-model="editedItem.sname"></v-combobox>
          </v-col>
         <v-col cols=6>
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    disabled
                                    v-model="editedItem.rdate"
                                    label="Received Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
          </v-col>

          <v-col cols=6>
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                     disabled
                                    v-model="editedItem.edate"
                                    label="Expected Release Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
          </v-col>
        <v-col cols=12>
        <v-textarea
          disabled
          name="input-7-1"
          label="Details of Request"
          v-model="editedItem.details"
          hint="If request type is New System, please indicate no. of users."
        ></v-textarea>
    </v-col>
    <v-col cols=12>
        <v-textarea v-model="editedItem.cstatus" disabled label="Current Status"> </v-textarea>
    </v-col>
    <v-col cols=6>
        <v-textarea disabled label="In Charge" v-model="editedItem.assignedstaff"></v-textarea>
    </v-col>
     <v-col cols=6>
        <v-text-field disabled label="Status" v-model="editedItem.status"></v-text-field>
    </v-col>
        </v-row>
    </v-layout>
 
    </v-card>
</v-dialog>

<!-- AssignedTask -->
<v-dialog v-model="DialogTask" max-width="700">
 <v-card>
    <v-toolbar dense dark>
        <v-toolbar-title> <v-icon> mdi-information</v-icon> {{editedItem.rcode}} </v-toolbar-title>
        <v-spacer/>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
            <v-btn @click="viewAttachment()" icon>
            <v-icon v-on="on" >mdi-paperclip</v-icon>
            </v-btn>
            </template>
            <span>View Attachment</span>
          </v-tooltip>
    </v-toolbar>
    <v-layout pa-4>
        <v-row>
          <v-col cols=6>
              <v-combobox  disabled :items="RequestOption" label="Request Type" v-model="editedItem.rtype"></v-combobox>
          </v-col>
           <v-col cols=6>
        <v-text-field disabled label="Status" v-model="editedItem.status"></v-text-field>
            </v-col>
          
          <v-col cols=12>
               <v-combobox disabled :items="SnameOption" label="System Name"  v-model="editedItem.sname"></v-combobox>
          </v-col>
         <v-col cols=6>
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    disabled
                                    v-model="editedItem.rdate"
                                    label="Received Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
          </v-col>
          <v-col cols=6>
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                     disabled
                                    v-model="editedItem.edate"
                                    label="Expected Release Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    clearable
                                  ></v-text-field>
                                </template>
          </v-col>
        <v-col cols=12>
        <v-textarea
          disabled
          name="input-7-1"
          label="Details of Request"
          v-model="editedItem.details"
          hint="If request type is New System, please indicate no. of users."
        ></v-textarea>
    </v-col>
    <v-col cols=12>
        <v-textarea v-model="editedItem.cstatus" disabled label="Current Status"> </v-textarea>
    </v-col>
    <v-col cols=6>
              <v-combobox  clearable  :items="sectionOpt" label="Section" v-model="editedItem.section"></v-combobox>
    </v-col>
   
    <v-col cols=6>
        <v-combobox :items="plOption" label="PL" v-model="editedItem.PL"></v-combobox>
    </v-col>
     <v-col cols=6>
              <v-combobox @input="getAssignedStaff()" clearable @click:clear="StaffList=[]" :disabled="userInfo.designation=='Japanese Advisor'"  :items="TeamList"  label="Team" v-model="editedItem.team"></v-combobox>
    </v-col>
     <v-col cols=6>
              <v-combobox :disabled="userInfo.designation=='Japanese Advisor'"  :items="StaffList" multiple  label="In Charge" v-model="editedItem.assignedstaff"></v-combobox>
    </v-col>
    <v-col cols=6>
        <v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field>
    </v-col>
        </v-row>
    </v-layout>
    <v-card-actions>
  <v-spacer/>
  <v-btn dark width=150 @click="updateData()"> <v-icon right dark >mdi-account-arrow-right</v-icon> Assign </v-btn>
            <v-btn dark width=150 @click="cancelEdit()"><v-icon right dark>mdi-close</v-icon> Disapproved</v-btn>

</v-card-actions>
 
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
  </v-app>
</template>

<script>
import axios from 'axios'
//const api = 'http://localhost:5000/'
  export default {
    components:{
    },
    data (){
      return{
          requests:[],
          isDisabled:false,
          DialogRequest:false,
          DialogTask:false,
          DialogAdd:false,
          DialogEdit:false,
          DialogChart:false,
          SnameOption:[],
          sectionOpt:[],
          statusOption:['Finished','On-going','Pending'],
          plOption:['Javascript','XPA'],
          TeamList:[],
          RequestOption:['New System','Modify Function','Add Function','Data Modification','Install Application','System/Data Analysis'],
          menusdate:'',
          sdate:'',
          menufdate:'',
          fdate:'',
          menurdate:'',
          rdate:'',
          menuedate:'',
          edate:'',
          addAlert: {snackbar:false, timeout:2000},
          editAlert: {snackbar:false, timeout:2000},
          search:'',
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
        systems:[],
        addSystemData:[
            {
            rcode:'',
            rtype:'',
            sname:'',
            rdate:'',
            edate:'',
            details:'',
            department:'',
            cstatus:'',
            assignedstaff:'',
            percentage:0,
            sdate:'',
            fdate:'',
            remarks:'',
            files:[]
        }
        ],
        DeptOption:[],
        StaffList:[],
        editedItem:{
        
        },
        defaultItem:{
        },
        editedIndex:-1,
        countAll:'',
        files: [],
        myData: {},
        confirm:[],
        Ccode:'',
        checkSystems:[]

      }
    },
    created(){
      this.generateCode()
      this.requestsCount()
      this.confirmCount()

         axios.get(`${this.api}allsystems/New System`).then(res=>{
        this.checkSystems = res.data
        // console.log(this.systems[0].assignedstaff)
        
      })
      //console.log(this.userInfo)
     
       axios.get(`${this.api}get/departmentsd/QA/section_option`).then(res=>{
          
          for (let i=0; i<res.data.length;i++){
            this.sectionOpt.push(res.data[i].name)
          }
          // console.log(this.sectionOpt)
        })

        console.log(this.userInfo)


    },
    mounted() {
     setInterval(() => {
    this.requestsCount()
  }, 30 * 1000)
},
    methods:{
      getAssignedStaff(){
          // this.StaffList = []
          axios.get(`${this.api}get/staff_basic_info/department/QA/section/${this.editedItem.section}/team/${this.editedItem.team}`).then(res=>{
           for (let i=0; i<res.data.length;i++){
            this.StaffList.push(res.data[i].fullName)
          }
       
        })
      },
       getTeamList(){
          // this.StaffList = []
          axios.get(`${this.api}get/department/QA/section/${this.editedItem.section}/team_option`).then(res=>{
           for (let i=0; i<res.data.length;i++){
            this.TeamList.push(res.data[i].name)
          }
       
        })
      },
      generateCode(){
        if(this.userInfo.designation =='Japnese Advisor'){
       axios.get(`${this.api}allrequests`).then(res=>{
        this.systems = res.data       
      })
      }
      else if(this.isLeader && this.userInfo.department =='QA'){
        axios.get(`${this.api}allrequests/${this.userInfo.section}`).then(res=>{
        this.systems = res.data       
      })
      }
      else{
           axios.get(`${this.api}request/${this.userInfo.employeeCode}`).then(res=>{
        this.systems = res.data       
      })
      }
       axios.get(`${this.api}allsystems/New System`).then(res=>{
       for(let i=0;i<res.data.length;i++){
            this.SnameOption.push(res.data[i].sname)
        }
  
       })
        axios.get(`${this.api}exampleList`).then(res=>{
       this.countAll = res.data
       }) 
          
          let a = this.countAll.length
         console.log(a)
        if(a <= 9){
          this.Ccode = 'SD-0000' + a
          // console.log( this.addSystemData[0].rcode)
        }else if(a <= 99){
           this.Ccode = 'SD-000' + a
          // console.log( this.addSystemData[0].rcode)
        }
        else if(a <= 999){
           this.Ccode = 'SD-00' + a
          // console.log( this.addSystemData[0].rcode)
        }
         else if(a <= 9999){
           this.Ccode = 'SD-0' + a
          // console.log( this.addSystemData[0].rcode)
        }
         else{
           this.Ccode = 'SD-' + a
          // console.log( this.addSystemData[0].rcode)
        }
          
      },
      requestsCount(){
        // if(this.userInfo.designation=='Team In-Charge'){
        axios.get(`${this.api}requests/Pending`).then(res=>{
          this.requests = res.data
         // console.log(res.data)
        })
      //  }
      },
       confirmCount(){
        // if(this.userInfo.designation=='Team In-Charge'){
        axios.get(`${this.api}requests/confirm/Pending/${this.userInfo.section}`).then(res=>{
          this.confirm = res.data
         // console.log(res.data)
        })
      //  }
      },
        openDialog(){ 
        this.Ccode = ''
        this.generateCode()
        this.addSystemData[0].rtype=''   
        this.addSystemData[0].sname=''
        this.addSystemData[0].department=''
        this.addSystemData[0].status=''
        this.addSystemData[0].assignedstaff=''
        this.addSystemData[0].rdate=''
        this.addSystemData[0].edate=''
        this.addSystemData[0].details=''
        this.addSystemData[0].files=[]
        this.addSystemData[0].cstatus =''
        this.DialogAdd= true
       
        }, 
        addNewRequest(){
          // console.log(this.editedItem._rev)
            if(this.addSystemData[0].rtype =='' ||
               this.addSystemData[0].sname =='' || this.addSystemData[0].details =='' ||
               this.addSystemData[0].rdate =='' || this.addSystemData[0].edate =='' ||
               this.addSystemData[0].cstatus == ''
               ){
                alert('Please fill up all information needed!')
            }
            else{
           this.addSystemData[0].department = this.userInfo.department
           this.addSystemData[0].rname = this.userInfo.fullName
           this.addSystemData[0].rID = this.userInfo.employeeCode
           this.addSystemData[0].status = 'Pending'
          this.addSystemData[0].solution =''
          this.addSystemData[0].rcode = this.Ccode
          if(this.addSystemData[0].rtype !='New System'){
            this.addSystemData[0].isConfirmed = 1
           let data = this.checkSystems.filter(rec=>{
             return rec.sname == this.addSystemData[0].sname
           })
          
           this.addSystemData[0].section = data[0].section
          }
          this.addSystemData[0].files = this.myData
          this.addSystemData[0].isPresent = 0
             axios.post(`${this.api}addsystems`, this.addSystemData[0]).then(res => {
              //  console.log(this.addSystemData[0])
                this.addSystemData._rev = res.data.rev
                this.DialogAdd= false
                this.addAlert.snackbar=true
                this.systems.push(this.addSystemData[0])
                this.requestsCount()
                this.onUpload()
                this.generateCode()
            })
           }
        },
      getColor (data) {
        if (data == 'Finished') return 'green'
        else if (data == 'Pending') return 'orange'
        else if(data =='On-going') return 'cyan'
        else return 'red'
      },
      editItem(data){
        this.DialogRequest=false
        this.selectedDept=[]
        this.DialogTask = true
        this.editedIndex = this.systems.indexOf(data)
        this.editedItem = Object.assign({},data)
        // this.getAssignedStaff()
        this.getTeamList()
      },
      viewItem(data){
        this.DialogEdit = true
        this.editedIndex = this.systems.indexOf(data)
        this.editedItem = Object.assign({},data)
      },
      cancelEdit(){
        // this.editedIndex = -1
        this.editedItem.status = 'Disapproved'
        // this.editedItem = Object.assign({}, this.defaultItem)
        axios.post(`${this.api}updatedata`,this.editedItem)
        Object.assign(this.editedIndex,this.editedItem)
        this.requests.splice(this.editedIndex,1)
        this.DialogTask  = false
        this.DialogRequest = true
        this.generateCode()
        
      },
       updateSystemRequest(){
          // this.editedItem.status = 'On-going'
          this.editedItem.isConfirmed = 1
          axios.post(`${this.api}updatedata`,this.editedItem).then(res=>{
            console.log(res.data)
            this.editedItem._id = res.data.id
            this.editedItem._rev = res.data.rev
            this.requests.splice(this.editedIndex-1,1)
            this.DialogTask = false
            this.DialogRequest=true
            this.editedItem = {}
            this.editAlert.snackbar=true
            this.generateCode()   
          })
        },
        updateSystemConfirm(){
          // this.editedItem.status = 'On-going'
          this.editedItem.isConfirmed = 1
          axios.post(`${this.api}updatedata`,this.editedItem).then(res=>{
            console.log(res.data)
            this.editedItem._id = res.data.id
            this.editedItem._rev = res.data.rev
            this.confirm.splice(this.editedIndex+1,1)
            this.DialogTask = false
            this.DialogRequest=true
            this.editedItem = {}
            this.editAlert.snackbar=true
            this.generateCode()   
          })
        },
        onFileChange(){
          console.log(this.files)//ongoing
          for(let i = 0; i<this.files.length; i++){
            console.log(this.files[i].name)
            this.addSystemData[0].files.push(this.addSystemData[0].rcode +"-"+ this.files[i].name)
          }
        },
        onUpload(){
        let formData = new FormData();
            formData.append('myData', this.addSystemData[0].rcode)
            for(var i = 0; i < this.files.length; i++){
                let file = this.files[i]
                formData.append('files[]', file);
            }  
              axios.post(`${this.api}uploadAttachment`, formData
            ).then(res =>  {
                console.log(res.data)
            } ).catch(err => console.log(err.message))
      },
      viewAttachment(){
          for(var i = 0; i < this.editedItem.files.length; i++){
                let file = this.editedItem.files[i]
                let baseUrl = 'http://10.169.140.132:9000/'
                let url = `${baseUrl}uploads/uploaded/${file}`
                window.open(url);
          }  
        },
        updateData(){
        if(this.userInfo.designation == 'Japanese Advisor'){
          return this.updateSystemRequest()
        }
        else
        return this.updateSystemConfirm()
      }   
      } ,
    computed: {
      RequestCounter(){       
        return this.requests.length
      },
      ConfirmCounter(){       
        return this.confirm.length
      },
      DatatoTable(){
        if(this.userInfo.designation == 'Japanese Advisor'){
          return this.requests
        }
        else
        return this.confirm
      }
    }
  }
</script>

<style>
#BGTable{
    background-color: rgb(48, 101, 128);
}

</style>