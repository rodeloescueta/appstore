<template>
    <v-container pa-0 fluid>
        <v-toolbar dense flat color="white">
            <v-toolbar-title>{{activeDepartment}} Department Master List</v-toolbar-title>
            <v-select class="pt-7 pl-7"
                :items="activeOptions"
                label="Status"
                v-model="pickedStatus"
            ></v-select>
            <v-spacer></v-spacer>
            <template v-if="isLeader">
                <v-btn @click="addUserDialog = true" v-if="isLeader" outlined rounded>New User</v-btn>
            <download-excel
                :data="filteredDepartmentStaff">
                <v-tooltip bottom>
                    <v-template v-slot:activator="{on}">
                        <v-icon v-on="on" slot="activator" @click="alert('download complete')">mdi-file-download-outline</v-icon>
                    </v-template>
                    <span>Download Excel Data</span>
                </v-tooltip>
                
            </download-excel>
            </template>
            <v-spacer></v-spacer>
            <v-btn @click="userPage" outlined rounded>
                master department
                <v-icon>mdi-subdirectory-arrow-right</v-icon>
            </v-btn>
            
        </v-toolbar>
        <v-divider></v-divider>
        <template v-if="pickedStatus==='Active'">
            <v-toolbar dense flat color="white">
            <v-flex pt-2 pr-2 xs3>
                <v-select 
                @change="onChangeDepartmentName()" 
                :items="departmentNameOptions" 
                v-model="activeDepartment" 
                append-icon="keyboard_arrow_down" 
                placeholder="Change Department"></v-select>
            </v-flex>
            <v-flex pt-2 pr-2 xs3>
                <v-text-field v-model="sectionSearch" append-icon="search" placeholder="Section"></v-text-field>
            </v-flex>
            <v-flex pt-2 pr-2 xs3>
                <v-text-field v-model="teamSearch" append-icon="search" placeholder="Team"></v-text-field>
            </v-flex>
            <v-flex pt-2 pr-2 xs3>
                <v-text-field v-model="searchMasterListUser" append-icon="search" placeholder="All"></v-text-field>
            </v-flex>
        </v-toolbar>
        <v-data-table dense
        :headers="departmentStaffHeaders"
        :items="filteredDepartmentStaff"
        class="elevation-1"
        fixed-header
        sort-by="fullName"
        :search="searchMasterListUser"
        height="350">
            <template v-slot:body="{ items }">
                <tbody>
                    <tr v-for="(item, i) in items" :key="i+'z'">
                        <td class="caption">{{ item.fullName}}</td>
                        <td class="caption">{{ item.section}}</td>
                        <td class="caption">{{ item.team}}</td>
                        <td class="caption">{{ item.designation}}</td>
                        <td class="caption">{{ item.status}}</td>
                        <td>
                            <template  v-if="isAllowedToEdit(item)">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn small @click="modifyStaffRecords(item.employeeCode)" v-on="on" icon>
                                        <v-icon color="secondary">mdi-account-edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>View and Edit Information</span>
                                </v-tooltip>
                            </template>
                            <template v-else>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn small @click.stop="viewAvailableInfo(item.employeeCode)" v-on="on" icon>
                                        <v-icon color="secondary">mdi-card-search</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>View Other Information</span>
                                </v-tooltip>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        </template>
        <template v-else>
            <in-active-staff/>
        </template>


        <v-dialog v-model="additionalInfoDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Other Information allowed to view</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field disabled v-model="staffAdditionalInfo.nick_name" label="Nick Name"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field disabled v-model="staffAdditionalInfo.work_ip" label="I.P. account"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field disabled v-model="staffAdditionalInfo.work_loc" label="Local Number"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field disabled v-model="staffAdditionalInfo.dateHired" label="Date Hired"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-spacer></v-spacer>
                        <v-btn @click="additionalInfoDialog = false">close</v-btn>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        
        <v-dialog
        v-model="addUserDialog"
        width="500"
        persistent
        >
            <v-card>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                <v-layout pa-4 row wrap>
                    <v-flex xs12>
                        <v-card-title primary-title>
                            <h5 class="headline mb-0">Add user</h5>
                        </v-card-title>
                    </v-flex>
                    <v-flex xs6 pa-2>
                        <v-text-field
                        v-model="addUserInfoDefault.employee_code"
                        label="5 DIGIT ID#"
                        :rules="[rules.required, rules.patternID]"
                        >
                        </v-text-field>
                    </v-flex>
                    <v-flex xs6 pa-2>
                        <v-text-field
                        v-model="addUserInfoDefault.nick_name"
                        :rules="[rules.required, rules.upperCase]"
                        label="ALIAS">

                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 pa-2>
                        <v-text-field
                        v-model="addUserInfoDefault.full_name"
                        label="FULL NAME"
                        :rules="[rules.required, rules.upperCase]">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs6 pa-2>
                        <v-select
                        :items="selectOption.section_name_options"
                        v-model="addUserInfoDefault.section"
                        label="Section"
                        :rules="[rules.required]"
                        @change="getTeam(userInfo.department, addUserInfoDefault.section)"
                        ></v-select>
                    </v-flex>
                    <v-flex xs6 pa-2>
                        <v-select
                        :rules="[rules.required]"
                        :items="selectOption.team_name_options"
                        v-model="addUserInfoDefault.team"
                        label="Team"
                        ></v-select>
                    </v-flex>
                        <v-btn @click="onCancelAddUserInfo()">cancel</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn 
                        v-if="valid && addUserInfoDefault.full_name && addUserInfoDefault.section && addUserInfoDefault.team && addUserInfoDefault.employee_code && addUserInfoDefault.nick_name" 
                        @click="onAddUserInfo()">
                            save
                        </v-btn>
                </v-layout>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import md5 from 'md5-hex'
import moment from 'moment'
import InActiveStaff from '@/components/InActiveStaff.vue'

export default{
    props: {
      userPage: Function
    },
    components: {
        InActiveStaff
    },
    data() {
        return {
            valid: false,
            searchMasterListUser: '',
            addUserDialog: false,
            activeDepartment: '',
            departmentStaff: [],
            departmentOptions: [],
            sectionSearch: '',
            teamSearch: '',
            departmentStaffHeaders: [
                {text: 'Name', value: 'fullName'},
                {text: 'Section', value: 'section'},
                {text: 'Tteam', value: 'team'},
                {text: 'Designation', value: 'designation'},
                // {text: 'position', value: 'position'},
                {text: 'Status', value: 'status'},
                {text: 'Action', value: 'action'}
            ],
            addUserInfoDefault: {
                eStatus: 'Active',
                newRights: {},
                employee_code: '',
                nick_name: '',
                full_name: '',
                section: '',
                team: '',
                designation: '',
                status: '',
                saved_at: ''
            },
            rules: {
                required: value => !!value || 'Required.',
                patternID: val => /^[0-9]{5}$/.test(val)  || '5 Digit I.D. Number',
                upperCase: vale => /^[^a-z!@#$&()]+$/.test(vale)  || 'Upper Case only and except \'!@#$&\'' // and except characters
            },
            staffAdditionalInfo: {},
            additionalInfoDialog: false,
            activeOptions: ['Active', 'Not Active'],
            pickedStatus: 'Active'
        }
    },
    created() {
        this.getSection(this.userInfo.department)
        this.activeDepartment = this.userInfo.department
        this.getUsersPerDepartment(this.activeDepartment)
        this.getDepartmentOptions()
    },
    computed: {
        departmentNameOptions() {
            return this.departmentOptions.map(item => {
                return item.name
            })
        },
        filteredDepartmentStaff() {
            return this.departmentStaff.filter(staff => {
                return staff.section.toLowerCase().includes(this.sectionSearch.toLowerCase()) &&
                        staff.team.toLowerCase().includes(this.teamSearch.toLowerCase())
            })
        }
    },
    methods: {
        onCancelAddUserInfo() {
            this.addUserInfoDefault = {
                eStatus: 'Active',
                newRights: {},
                employee_code: '',
                nick_name: '',
                full_name: '',
                section: '',
                team: '',
                designation: '',
                status: '',
                saved_at: ''
            }
            this.addUserDialog = false
        },
        onAddUserInfo() {
            let url = `${this.api}add/staff`
            let toSend = this.addUserInfoDefault
            toSend.saved_at = moment().format("YYYY-MM-DD hh:mm:ss")
            toSend.password = md5(toSend.employee_code)
            toSend.department = this.userInfo.department
            console.log(toSend)
            axios.post(url, toSend).then(res =>{
                alert(res.data)
            })
            this.addUserInfoDefault = {
                eStatus: 'Active',
                newRights: {},
                employee_code: '',
                nick_name: '',
                full_name: '',
                section: '',
                team: '',
                designation: '',
                status: '',
                saved_at: ''
            }
            this.addUserDialog = false
            
        },
        getUsersPerDepartment(val) {
            let url = `${this.api}get/staff_basic_info/department/${val}`
            axios.get(url).then(res => {
                this.departmentStaff = res.data
            })
        },
        getDepartmentOptions() {
            let url = `${this.api}get/department`
            axios.get(url).then(res => {
                this.departmentOptions = res.data
            })
        },
        isAllowedToEdit(val){
            if(
                ((
                    this.userInfo.designation == 'Team In-Charge' || 
                    this.userInfo.designation == 'Team Head Trainee' || 
                    this.userInfo.designation == 'Team Head'
                )
                && this.userInfo.department == val.department
                && this.userInfo.section == val.section
                && this.userInfo.team == val.team)
                ||
                ((
                    this.userInfo.designation == 'Section In-Charge' || 
                    this.userInfo.designation == 'Section Head Trainee' || 
                    this.userInfo.designation == 'Section Head'
                )
                && this.userInfo.department == val.department)
                ||
                ((
                    this.userInfo.designation == 'Department In-Charge' || 
                    this.userInfo.designation == 'Department Head Trainee' || 
                    this.userInfo.designation == 'Department Head' ||
                    this.userInfo.designation == 'Japanese Advisor' 
                )
                && this.userInfo.department == val.department)
                || this.userInfo.employeeCode == '19178' 
                || this.userInfo.employeeCode == '01438'
                || this.userInfo.employeeCode == '19701'
            ){
                return true
            }else{
                return false
            }
        },
        onChangeDepartmentName() {
            let val = this.departmentOptions.filter(item => {
                return item.name == this.activeDepartment
            })
            // if(val[0].oldName){
            //     this.getUsersPerDepartment(val[0].oldName)
            //     console.log(val[0].oldName)
            // }else{
            //     this.getUsersPerDepartment(val[0].name)
            //     console.log(val[0].name)
            // }
            this.getUsersPerDepartment(val[0].name)
            
        },
        viewAvailableInfo(val) {
            let url = `${this.api}get/staff_viewable_info/${val}`
            axios.get(url).then(res => {
                // console.log(res.data)
                this.staffAdditionalInfo = res.data
                this.additionalInfoDialog = true
            })
        },
        modifyStaffRecords(val) {
            this.updateMyProfile(val)
        }
    }
}

</script>