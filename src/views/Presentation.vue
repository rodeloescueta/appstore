<template>
    <v-app>
        <v-card>
            <v-card-title>Presentation
                <v-spacer/>
                <v-btn outlined @click="DialogSystems=true"> 
                    <v-icon>mdi-file-document-edit-outline</v-icon>
                    Edit
                </v-btn>
            </v-card-title>
            <v-divider/>
            <v-container fluid pa-2>
            <v-simple-table fixed-header dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Status</th>
                            <th class="text-left">Total</th>
                            <th class="text-left">0%-40%</th>
                            <th class="text-left">41%-80%</th>
                            <th class="text-left">81%-100%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Finished</td>
                            <td>{{TotalFinished}}</td>
                            <td>{{TotalFortyF}}</td>
                            <td>{{TotalEightyF}}</td>
                            <td>{{TotalHundredF}}</td>
                        </tr>
                        <tr>
                            <td>On-going</td>
                            <td>{{TotalOngoing}}</td>
                            <td>{{TotalFortyO}}</td>
                            <td>{{TotalEightyO}}</td>
                            <td>{{TotalHundredO}}</td>
                        </tr>
                        <tr>
                            <td>Pending</td>
                            <td>{{TotalPending}}</td>
                            <td>{{TotalFortyP}}</td>
                            <td>{{TotalEightyP}}</td>
                            <td>{{TotalHundredP}}</td>
                        </tr>
                        <tr>
                            <td>Testing/Confirmation</td>
                            <td>{{TotalTests}}</td>
                            <td>{{TotalFortyT}}</td>
                            <td>{{TotalEightyT}}</td>
                            <td>{{TotalHundredT}}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{{Total}}</td>
                            <td>{{TotalForty}}</td>
                            <td>{{TotalEighty}}</td>
                            <td>{{TotalHundred}}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
            </v-container>
    <v-card-title>Projects for Presentations
        <v-spacer/>
         <v-combobox clearable v-model="TeamSelected" dense color="black"  label="Team" :items="TeamOption"></v-combobox>
    </v-card-title>
    <v-subheader>
            <h3>Legends:</h3> 
            <v-icon color="success">mdi-stop</v-icon> Finished
            <v-icon color="primary">mdi-play-pause</v-icon> Testing/Confirmation
            <v-icon color ="red lighten-1">mdi-play</v-icon> On-going
            <v-icon color="cyan">mdi-pause</v-icon> Pending
           
            
         </v-subheader>

    <v-simple-table fixed-header dense>
        <thead>
            <tr>
                <th>System Name</th>
                <th>PL</th>
                <th>Status</th>
                <th>Target</th>
                <th>(%)</th>
                <th>Requester</th>
                <th>Users</th>
                <th>Details of System Request</th>
                <th>In-charge</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in searchTeam" :key="item.sname">
                <td>{{item.sname}}</td>
                <td>{{item.pl}}</td>
                <!-- <td>{{item.status}}</td> -->
                <td>
                <v-icon v-if="item.status =='Finished'" color="green">mdi-stop</v-icon>
                <v-icon v-else-if="item.status =='Testing/Confirmation'" color="primary">mdi-play-pause</v-icon>
                <v-icon v-else-if="item.status =='Ongoing'" color="red lighten-1">mdi-play</v-icon>
                <v-icon v-else color="cyan"> mdi-pause</v-icon>
                </td>
                <td>{{item.tdate}}</td>
                <td>{{item.percentage}}</td>
                <td>{{item.requester}}</td>
                <td>{{item.users}}</td>
                <td>{{item.details}}</td>
                <!-- <td>{{item.incharge}}</td> -->
                <!-- <td>{{item.assignedstaff}}</td> -->
                <td>
                    
                <v-row no-gutters>
                <v-col v-for="(staff,i) in item.incharge" :key="i+'a'">
                    <v-avatar size="36px"><img :src="avatarUrl(staff.value)"></v-avatar> 
                </v-col>
                </v-row>
                </td>
            </tr>
        </tbody>

    </v-simple-table>
        </v-card>

    <!-- Manage Presentation -->
    <v-dialog v-model="DialogSystems" persistent>
        <v-card>
            <v-toolbar dense dark>
                <v-toolbar-title>
                    <v-spacer/>
                    <v-icon @click="CloseDialog"> mdi-close  </v-icon>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-title>
                For Presentation 
                <v-spacer/>
                <v-text-field append-icon="search" dense outlined label="Search" v-model="search">
                    
                </v-text-field>
            </v-card-title>
            <v-data-table
            :headers="header"
            :items="systems"
            item-key="sname"
            :search="search"
            dense
            >
            
                <template v-slot:item.isPresent="{ item }">
                    <td>
                        <v-checkbox color="blue" @change="UpdateForPresentation(item)" v-model="item.isPresent">
                        </v-checkbox>
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </v-dialog>
    </v-app>
</template>
<script>
import axios from 'axios'
export default {
data(){
    return{
    systems:[],
    TeamOption:[],
    DialogSystems:false,
    search:'',
    selectedSystem:[],
    header:[{text:'Presentation', value:'isPresent', width:'5%'},
                { text: 'System Name', value: 'sname'},
                { text: 'PL  ', value: 'pl'},
                { text: 'Status', value: 'status',width:'8%'  },
                { text: '(%)', value: 'percentage' },
                { text: 'Target', value: 'tdate' },
                { text: 'Requester', value: 'requester' },
                { text: 'Users', value: 'users' },
                { text: 'Details', value: 'details' },
                { text: 'In-Charge', value: 'incharge',width:'10%' },
    ],
    filteredSystem:[],
    TeamSelected:'',
    ToAdd:{}
    }
},
created(){
    this.getAllRecords()   
    this.getTeams()
     
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
    UpdateForPresentation(val){
        this.ToAdd = val
        axios.post(`${this.api}updatedata`,this.ToAdd).then(res=>{
            this.ToAdd._rev = res.data.rev
            this.ToAdd._id = res.data.id
            this.getAllRecords()
            this.ToAdd = {}
        })
        
        
    },
    getTeams(){
            axios.get(`${this.api}get/department/QA/section/${this.userInfo.section}/team_option`).then(res=>{
            for (let i=0; i<res.data.length;i++){
            this.TeamOption.push(res.data[i].name)
          }
       
        })
    },
    getAllRecords(){
        axios.get(`${this.api}getSystems`).then(res=>{
        this.systems = res.data.filter(rec=>{
            return rec.section == this.userInfo.section
        })
        this.selectedSystem = res.data.filter(rec=>{
            return rec.isPresent == true
        })

      })
   
    },
    OpenDialog(){
        this.DialogSystems = true

    },
    CloseDialog(){
        this.DialogSystems = false

    },
    getSelected(){
    
    }

},
filters:{
    

},
computed:{
    TotalFinished(){
        let data = this.systems.filter(rec=>{
            return rec.status =='Finished' 
        })
        return data.length
    },
    TotalOngoing(){
        let data = this.systems.filter(rec=>{
            return rec.status =='Ongoing' 
        })
        return data.length
    },
    TotalPending(){
        let data = this.systems.filter(rec=>{
            return rec.status =='Pending' 
        })
        return data.length
    },
     TotalTests(){
        let data = this.systems.filter(rec=>{
            return rec.status =='Testing/Confirmation'
        })
        return data.length
    },
    Total(){
        let data = this.systems.filter(rec=>{
            return  rec.section == this.userInfo.section
        })
        return data.length
    },
    TotalFortyT(){
        let data = this.systems.filter(rec=>{
            return rec.percentage >=0 && rec.percentage<=40 && rec.status =='Testing/Confirmationn' 
        })
        return data.length
    },
    TotalEightyT(){
        let data = this.systems.filter(rec=>{
            return rec.percentage >=41 && rec.percentage<=80 && rec.status =='Testing/Confirmation' 
        })
        return data.length
    },
     TotalHundredT(){
        let data = this.systems.filter(rec=>{
            console.log
            return rec.percentage >=81 && rec.percentage<=100 && rec.status =='Testing/Confirmation'
        })
        return data.length
    },
    TotalFortyF(){
        let data = this.systems.filter(rec=>{
            return rec.percentage >=0 && rec.percentage<=40 && rec.status =='Finished' 
        })
        return data.length
    },
    TotalEightyF(){
        let data = this.systems.filter(rec=>{
            return rec.percentage >=41 && rec.percentage<=80 && rec.status =='Finished' 
        })
        return data.length
    },
     TotalHundredF(){
        let data = this.systems.filter(rec=>{
            return rec.percentage >=81 && rec.percentage<=100 && rec.status =='Finished'
        })
        return data.length
    },
     TotalFortyO(){
        let data = this.systems.filter(rec=>{
            return (rec.percentage >= 0 && rec.percentage <= 40) && rec.status =='Ongoing' 
        })
        return data.length
    },
    TotalEightyO(){
        let data = this.systems.filter(rec=>{
            return (rec.percentage >=41 && rec.percentage <= 80 ) && rec.status =='Ongoing'})

        return data.length
    },
     TotalHundredO(){
        let data = this.systems.filter(rec=>{
            return (rec.percentage >=81 && rec.percentage <= 100) && rec.status =='Ongoing'
        })
        return data.length
    },
        TotalFortyP(){
        let data = this.systems.filter(rec=>{
            return (rec.percentage >= 0 && rec.percentage <= 40) && rec.status =='Pending'
        })
        return data.length
    },
    TotalEightyP(){
        let data = this.systems.filter(rec=>{
            return (rec.percentage >=41 && rec.percentage <= 80 ) && rec.status =='Pending'
        })
        return data.length
    },
     TotalHundredP(){
        let data = this.systems.filter(rec=>{
            return (rec.percentage >=81 && rec.percentage <= 100) && rec.status =='Pending'
        })
        return data.length
    },
    TotalForty(){
         let data = this.systems.filter(rec=>{
            return (rec.percentage >=0 && rec.percentage <= 40)  
        })
        return data.length
    },
    TotalEighty(){
         let data = this.systems.filter(rec=>{
            return (rec.percentage >=41 && rec.percentage <= 80) 
        })
        return data.length
    },
    TotalHundred(){
         let data = this.systems.filter(rec=>{
            return (rec.percentage >=81 && rec.percentage <= 100) 
        })
        return data.length
    },
    
    searchTeam(){
        let data = this.selectedSystem.filter(rec=>{
            return rec.team == this.TeamSelected
        })
        return data
    }

    
}
    
}
</script>