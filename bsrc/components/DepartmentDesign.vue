<template>
    <v-container fluid pa-0>
        <v-toolbar dense color="white" flat>
            <v-toolbar-title>HRD Department List</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="addDepartmentDialog = true" v-if="isMasterMaintenance" outlined rounded>New Department</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="depPage()" outlined rounded>
                Master User
                <v-icon>mdi-subdirectory-arrow-left</v-icon>
            </v-btn>
            
        </v-toolbar>
        <v-toolbar flat dense color="white">
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchDep" append-icon="search" placeholder="search"></v-text-field>
        </v-toolbar>
        <v-data-table dense
        :search="searchDep"
        :headers="departmentHeaders"
        :items="allDepartmentData"
        class="elevation-1">
            <template v-slot:body="{ items }">
                <tbody>
                    <tr v-for="(item, i) in items" :key="i+'x'">
                        <td class="caption">{{ item.name }}</td>
                        <td class="caption">{{ item.initial }}</td>
                        <td class="caption">{{ item.group }}</td>
                        <td class="caption">{{ item.inCharge }}</td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn small @click="editDepartment(item)" v-on="on" icon>
                                    <v-icon color="secondary">mdi-wrench</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit department structure</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <!-- {{allDepartmentData}} -->
        <v-dialog v-model="departmentInfoDialog" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar flat>
                    <v-icon @click="closeDepartmentInfoDialog()">close</v-icon>
                    <v-toolbar-title>
                        Modify Department Information
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn  v-if="isMasterMaintenance" :disabled="!valid" outlined rounded @click="saveDepartmentInfo()">save</v-btn>
                    <v-btn v-else @click="alert('You are not allow to make changes')" outlined rounded>save</v-btn>
                </v-toolbar>
                <!-- balik mamaya  -->
                <v-divider></v-divider>
                <v-card-title primary-title>
                    <div>
                    <div class="headline">Department Information</div>
                    </div>
                </v-card-title>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                <v-layout row wrap>
                    <v-flex offset-xs1 xs9>
                        <v-text-field outlined label="Department name:" :rules="[departmentDesignRules.upperCase]" v-model="departmentInfo[0].name"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-layout pt-3>
                            <v-icon @click="alert(departmentInfo[0].id)">info</v-icon>
                        </v-layout>
                    </v-flex>
                    <v-flex offset-xs1 xs3>
                        <v-text-field outlined label="Group" v-model="departmentInfo[0].group"></v-text-field>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field outlined label="In-charge" :rules="[departmentDesignRules.patternID, departmentDesignRules.required]" v-model="departmentInfo[0].inCharge"></v-text-field>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field outlined label="Initial" v-model="departmentInfo[0].initial"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-card-title primary-title>
                    <div>
                        <div class="headline"><span style="color: grey;">{{departmentInfo[0].name}}</span> 
                            Sections Information
                            <v-btn rounded outlined @click="addSection()">add<v-icon>add</v-icon></v-btn>
                        </div>
                        
                    </div>
                </v-card-title>
                    <v-layout v-if="departmentInfo[0].children" row wrap>
                        <template v-for="(item, i) in departmentInfo[0].children" >
                            <v-flex xs7 offset-xs1 :key="'a' + i">
                                <v-text-field outlined label="Section Name" :rules="[departmentDesignRules.upperCase]" v-model="item.name"></v-text-field>
                            </v-flex>
                            <v-flex xs2 :key="'b' + i">
                                <v-text-field outlined label="In-charge" :rules="[departmentDesignRules.patternID, departmentDesignRules.required]" v-model="item.inCharge"></v-text-field>
                            </v-flex>
                            <v-flex xs2 :key="'c' + i">
                                <v-spacer></v-spacer>
                                <v-btn outlined rounded color="light-blue lighten-3" v-if="teamIndex == i">&nbsp;&nbsp;&nbsp; active &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</v-btn>
                                <v-btn outlined rounded v-else @click="viewTeam(i)">View Teams</v-btn>
                                <v-icon @click="alert(item.id)">info</v-icon>
                            </v-flex>
                        </template>
                    </v-layout>
                <v-divider></v-divider>
                    
                    <v-layout v-if="teamIndex != -1" row wrap>
                        <v-flex xs12>
                            <v-card-title primary-title>
                                <div>
                                    <div class="headline">
                                        <span style="color: grey;">{{departmentInfo[0].children[teamIndex].name}}</span>
                                        Teams Information
                                        <v-btn rounded outlined @click="addTeam()">add<v-icon>add</v-icon></v-btn>
                                    </div>
                                </div>
                            </v-card-title>
                        </v-flex>
                        <template v-for="(item, i) in departmentInfo[0].children[teamIndex].children" >
                            <v-flex xs7 offset-xs1 :key="'e' + i">
                                <v-text-field outlined label="Team Name" :rules="[departmentDesignRules.upperCase, departmentDesignRules.required]" v-model="item.name"></v-text-field>
                            </v-flex>
                            <v-flex xs2 :key="'f' + i">
                                <v-text-field outlined label="In-charge" :rules="[departmentDesignRules.patternID, departmentDesignRules.required]" v-model="item.inCharge"></v-text-field>
                            </v-flex>
                            <v-flex xs2 :key="'g' + i"></v-flex>
                        </template>
                    </v-layout>
                </v-form>
                <br><br><br><br>
                <!-- db:{{departmentInfo}} -->
            </v-card>
        </v-dialog>
        <v-dialog v-model="addDepartmentDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span>Add Department</span>
                </v-card-title>
                <v-form
                ref="form"
                v-model="validationDepartment"
                lazy-validation
                >
                    <v-card-text>
                        <v-text-field outlined label="Department Name" 
                            :rules="[departmentDesignRules.upperCase, departmentDesignRules.required]" 
                            v-model="departmentDefaultToAdd.name">
                        </v-text-field>

                        <v-text-field outlined label="Department In Charge" 
                            :rules="[departmentDesignRules.patternID, departmentDesignRules.required]" 
                            v-model="departmentDefaultToAdd.inCharge">
                        </v-text-field>

                        <v-text-field outlined label="Department Group" 
                            :rules="[departmentDesignRules.upperCase, departmentDesignRules.required]" 
                            v-model="departmentDefaultToAdd.group">
                        </v-text-field>

                        <v-text-field outlined label="Department Initial" 
                            :rules="[departmentDesignRules.upperCase, departmentDesignRules.required]" 
                            v-model="departmentDefaultToAdd.initial">
                        </v-text-field>
                        <!-- <hr> -->
                        <!-- {{departmentDefaultToAdd}} -->
                    </v-card-text>
                </v-form>
                
                <v-card-actions>
                    <v-btn @click="addDepartmentDialog = !addDepartmentDialog">cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="onAddDepartment" :disabled="!validationDepartment">submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import shortid from 'shortid'

export default{
    props: {
      depPage: Function
    },
    data() {
        return{
            searchDep: '',
            valid: true,
            validationDepartment: true,
            departmentInfoDialog: false,
            addDepartmentDialog: false,
            allDepartmentData: [],
            departmentInfo: [{
                name: '',
                id: '',
                initial: '',
                group: '',
                inCharge: '',
                children: []
            }],
            departmentDefaultToAdd:
                {
                    name: '', 
                    inCharge: '',
                    group: '',
                    initial: '',
                    id: shortid(), 
                    children: 
                    [
                        {
                            name: '', 
                            inCharge: '', 
                            id: shortid(),
                            children: [{name: '', inCharge: '', id: shortid()}]
                        }
                    ]
                },
            // childrenContainer: [{name: 'test', inCharge: 'asdf'}],
            teamIndex: -1,
            // roleView: '',
            departmentHeaders: [
                { text: 'Name', value: 'name' },
                { text: 'Initial', value: 'initial' },
                { text: 'Group', value: 'group' },
                { text: 'In-Charge', value: 'inCharge' },
                { text: 'Action', value: '-' },
            ],

            // rules ************************************************
            departmentDesignRules: {
                required: value => !!value || 'Required.', // field is required
                patternID: val => /^[0-9]{5}$/.test(val)  || '5 Digit I.D. Number', //field must be 5 character numbers
                // upperCase: vale => /^[^a-z!@#$&()]+$/.test(vale)  || 'Upper Case only and except \'!@#$&\'' // and except characters
                upperCase: value => !!value || 'Uppercase.'
            },
            // emailRules: [
            //     v => !!v || 'E-mail is required',
            //     v => /.+@.+/.test(v) || 'E-mail must be valid'
            // ]
        }
    },
    mounted() {
        let url = `${this.api}get/department/`
        axios.get(url).then(res => {
            this.allDepartmentData = res.data
            // this.roleview = 'Company'
        })
        // for(let i =0; i<10; i++){
        //     console.log(shortid())
        // }
    },
    watch: {
      departmentInfoDialog (val) {
        val || this.closeDepartmentInfoDialog()
      }
    },
    methods: {
      onAddDepartment() {
          let url = `${this.api}post/add/department`
          axios.post(url, this.departmentDefaultToAdd).then(res => {
              alert(res.data)
          })
          this.addDepartmentDialog = false
        //   console.log(this.departmentDefaultToAdd)
      },
      editDepartment (item) {
          let id = item.id
          let url = `${this.api}get/department/${id}`
          axios.get(url).then(res => {
              this.departmentInfo = res.data
          })
          this.departmentInfoDialog = true
        
      },
      closeDepartmentInfoDialog() {
          this.departmentInfoDialog = false
          setTimeout(() => {
              this.departmentInfo = [{
                name: '',
                id: '',
                initial: '',
                group: '',
                inCharge: '',
                children: []
            }]
            this.teamIndex = -1
          }, 300)
      },
      viewTeam(val){
          this.teamIndex = val
      },
      addSection(){
        this.departmentInfo[0].children.push({name: '', inCharge: '', id: shortid(), children: [{name: '', inCharge: '', id: shortid()}]})
      },
      addTeam(){
        this.departmentInfo[0].children[this.teamIndex].children.push({name: '', inCharge: '', id: shortid()})
      },
      saveDepartmentInfo() {
          let url = `${this.api}post/modify_department`
          axios.post(url,this.departmentInfo[0]).then(res => {
              console.log(res.data)
          })
        //   console.log(this.departmentInfo[0])
          this.closeDepartmentInfoDialog()
      }
    }
}
</script>