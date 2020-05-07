<template>
    <v-container>
        <!-- App.vue dialogPersonalInfo: {{dialogPersonalInfo}} -->
        <v-card>

        
                <v-toolbar dense flat>
                <template v-for="(page, index) in myProfilePages">
                    <v-btn @click="onSelectProfilePage(page.value)" text :key="index">
                        <span v-if="selectedMyProfilePage == page.value" style="color: #5C6BC0;">
                            {{page.name}}
                        </span>
                        <span v-else>
                            {{page.name}}
                        </span>
                    </v-btn>
                </template>
                <v-spacer></v-spacer>
                <template v-if="validationUserInfo">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" left @click="saveInfoToDatabase()">save</v-icon>
                        </template>
                        <span>Save Changes</span>
                    </v-tooltip>
                </template>
                <template v-else>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" left>save</v-icon>
                        </template>
                        <span>Please Complete the information needed.</span>
                        <ul><li v-for="item in requiredFields" :key="item">{{item}}</li></ul>
                    </v-tooltip>
                </template>
                
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on" @click="onChangeDialogView_PersonalInfo(false)">close</v-icon>
                    </template>
                    
                    <span>Close</span>
                </v-tooltip>
                </v-toolbar><br>
                <v-toolbar flat color="white">
                    
                    <!-- <v-spacer></v-spacer> -->
                    <v-checkbox
                    v-model="isEditMode"
                    label="Edit Mode"
                    @change="onEditModeChange(isEditMode)"
                    color="indigo lighten-1"
                    hide-details
                    ></v-checkbox>
                    <v-spacer></v-spacer>
                    <template v-if="myPersonalInfo.employee_code == userInfo.employeeCode">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click="passwordDialog = !passwordDialog">security</v-icon>
                            </template>
                            
                            <span>Change password</span>
                        </v-tooltip>
                    </template>

                    <template v-else>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click="resetPassword()">settings_backup_restore</v-icon>
                            </template>
                            
                            <span>Reset password</span>
                        </v-tooltip>
                    </template>
                    <template v-if="isLeader">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click="changeEstatusDialog = true">account_box</v-icon>
                            </template>
                            
                            <span>Change Employment Status</span>
                        </v-tooltip>
                    </template>

                    
                </v-toolbar>

                <v-layout pa-2 row wrap>
                <v-flex xs8 offset-xs2>
                    <v-form
                    ref="form"
                    v-model="validationUserInfo"
                    lazy-validation
                    >
                    <v-card round>
                    <v-list two-line>
                        <v-list-item v-for="(item, i) in filteredPersonalInfoContent" :key="item.value">

                            <template v-if="item.select">
                            <v-select
                                v-model="myPersonalInfo[item.value]"
                                :items="selectOption[item.select]"
                                :label="item.text"
                                :disabled="item.disableEdit"
                                :rules="computedRules(i)"
                            ></v-select>
                            </template>
                            <template v-else>
                            <v-text-field
                                v-model="myPersonalInfo[item.value]"
                                :label="item.text"
                                :disabled="item.disableEdit"
                                :rules="computedRules(i)"
                            ></v-text-field>
                            </template>
                            

                        <template v-if="item.avatar">
                            <v-avatar :size="50">
                            <img @click="uploadPicture()" @error="onEmptyProfile" :src="profile">
                            </v-avatar>
                        </template>

                        <template v-else>
                            <v-list-item-action>
                                <v-icon @click="alert('You are not allowed to change this field' + userInfo.designation)" v-if="!isLeader && item.leaders">location_disabled</v-icon>
                                <v-icon v-else @click="item.disableEdit = !item.disableEdit">
                                    {{item.disableEdit ? 'edit': 'lock'}}
                                </v-icon>
                            </v-list-item-action>
                        </template>

                        </v-list-item>
                    </v-list>
                    </v-card>
                    </v-form>
                </v-flex>
                </v-layout>
        <v-dialog v-model="changeEstatusDialog" max-width="700px">
            <v-card>
                <v-container fluid>
                    <v-form ref="form" v-model="valid">
                    <v-layout pa-2 row wrap>
                        <v-flex pb-4 xs12>
                            <h2>Employment Information</h2>
                        </v-flex>
                        <v-flex xs6>
                            <v-select
                            :items="selectOption.eStatus"
                            label="Status"
                            v-model="myPersonalInfo.eStatus"
                            ></v-select>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                v-model="myPersonalInfo.resDate"
                                label="Effectivity Date (if not active)"
                                :rules="myPersonalInfo.eStatus == 'Active'? []: [validationRules.date, validationRules.required]"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                v-model="myPersonalInfo.resReason"
                                label="Reason"
                                :rules="myPersonalInfo.eStatus == 'Active'? []: [validationRules.required]"
                            ></v-text-field>
                        </v-flex>
                        
                        <v-btn @click="changeEstatusDialog = false">cancel</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="saveInfoToDatabase()" v-if="valid">save</v-btn>
                    </v-layout>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="passwordDialog" max-width="500px">
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <div class="container">
                        <div class="large-12 medium-12 small-12 cell">
                            <v-text-field 
                            :append-icon="show1 ? 'visibility' : 'visibility_off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            v-model="password1" label="New Password"></v-text-field>

                            <v-text-field v-if="password1"
                            :append-icon="show2 ? 'visibility' : 'visibility_off'"
                            :type="show2 ? 'text' : 'password'"
                            @click:append="show2 = !show2"
                            v-model="password2" label="Confirmed Password"></v-text-field>
                        </div>
                        </div>
                    </v-flex>
                    <v-btn @click="passwordDialog = !passwordDialog" color="error" outline round>cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="onChangePassword()" color="primary" outline round v-if="isMatch && password1">submit</v-btn>
                </v-layout>
                
                
            </v-card>
        </v-dialog>
        <v-dialog v-model="uploadDialog" max-width="500px">
            <v-card>
                <div class="container">
                <div class="large-12 medium-12 small-12 cell">
                    <label>File
                        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
                    </label>
                    <v-btn outline round v-on:click="submitFile()">Submit</v-btn>
                </div>
                </div>
            </v-card>
        </v-dialog>
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios'
import md5 from 'md5-hex'

export default{
    data() {
        return{
            file: '',
            valid: true,
            changeEstatusDialog: false,
            uploadDialog: false,
            isEditMode: false,
            passwordDialog: false,
            show1: false,
            show2: false,
            password1: '',
            password2: '',
            validationUserInfo: true,
            // personal information **************************
            // profile: '',
            selectedMyProfilePage: 'work',
            department_options: [],
            myProfilePages: [
                {name: 'Work', value: 'work'},
                {name: 'Personal', value: 'personal'},
                {name: 'Computer', value: 'computer'}
            ],
            
            personalInfoContent: [
                // personal info
                {text: 'Employee Code',for: 'personal', value: 'employee_code', disableEdit: true, avatar: true},
                {text: 'Full Name',for: 'personal',  value: 'full_name', disableEdit: true },
                {text: 'Gender',for: 'personal',  value: 'gender', disableEdit: true, rules: ['required'], select: 'gender'},
                {text: 'Civil Status',for: 'personal',  value: 'civilStatus', disableEdit: true, select: 'civilStatus' },
                {text: 'Number of Child',for: 'personal',  value: 'noChildren', disableEdit: true , rules: ['required', 'number']},
                {text: 'Birth Date', for: 'personal', value: 'dateBirth', disableEdit: true, rules: ['required', 'date'] },
                {text: 'Contact Number', for: 'personal', value: 'contactNumber', disableEdit: true, rules: ['required'] },
                {text: 'Address', for: 'personal', value: 'address', disableEdit: true, rules: ['required'] },
                {text: 'Contact Person', for: 'personal', value: 'contactPerson', disableEdit: true, rules: ['required'] },
                {text: 'Contact Person\'s number', for: 'personal', value: 'contactPersonNumber', disableEdit: true, rules: ['required'] },
                {text: 'Relation to Contact Person', for: 'personal', value: 'contactPersonRelation', disableEdit: true, rules: ['required'] },
                {text: 'Educational Attainment', for: 'personal', value: 'attainment', disableEdit: true, select: 'attainment', rules: ['required'] },
                {text: 'Course', for: 'personal', value: 'course', disableEdit: true, select: 'course_option', rules: ['required'] },
                {text: 'School', for: 'personal', value: 'school', disableEdit: true, rules: ['required'] },
                
                // work info
                {text: 'Department', for: 'work', value: 'department', disableEdit: true, select: 'department_name_options' },
                {text: 'Section', for: 'work', value: 'section', disableEdit: true, select: 'section_name_options' },
                {text: 'Team', for: 'work', value: 'team', disableEdit: true, select: 'team_name_options' },
                {text: 'Designation', for: 'work', value: 'designation', disableEdit: true, select: 'designation_options', rules: ['required'] },
                {text: 'Position', for: 'work', value: 'position', disableEdit: true, select: 'position_options', rules: ['required'] },
                {text: 'Status', for: 'work', value: 'status', disableEdit: true, select: 'status', rules: ['required'] },
                {text: 'Date Hired', for: 'work', value: 'dateHired', disableEdit: true, rules: ['required', 'date'] },
                {text: 'Date Regular', for: 'work', value: 'dateRegular', disableEdit: true, rules: ['date'] },
                {text: 'Work Email', for: 'work', value: 'work_email', disableEdit: true },
                {text: 'I.p.', for: 'work', value: 'work_ip', disableEdit: true },
                {text: 'Local Number', for: 'work', value: 'work_loc', disableEdit: true },

                // computer info
                {text: 'Computer Number', for: 'computer', value: 'computerNumber', disableEdit: true, rules: ['required'] },
                {text: 'Computer Password', for: 'computer', value: 'computerPassword', disableEdit: true, rules: ['required'] },
                {text: 'Operating System', for: 'computer', value: 'operatingSystem', disableEdit: true, rules: ['required'] },
                {text: 'license1', for: 'computer', value: 'license1', disableEdit: true },
                {text: 'license2', for: 'computer', value: 'license2', disableEdit: true },
                {text: 'license3', for: 'computer', value: 'license3', disableEdit: true },
                {text: 'license4', for: 'computer', value: 'license4', disableEdit: true },
                {text: 'license5', for: 'computer', value: 'license5', disableEdit: true },
                {text: 'license6', for: 'computer', value: 'license6', disableEdit: true },
                {text: 'license7', for: 'computer', value: 'license7', disableEdit: true },
                {text: 'license8', for: 'computer', value: 'license8', disableEdit: true },
                {text: 'license9', for: 'computer', value: 'license9', disableEdit: true }
            ],
            
            
            validationRules: {
                required: value => !!value || 'Required.',
                patternID: val => /^[0-9]{5}$/.test(val)  || '5 Digit I.D. Number',
                number: val => /^[0-9]*$/.test(val) || 'Numbers only',
                date: val => /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}$/.test(val) || 'DD-MM-YYYY if none Pls put 00-00-0000',
            },
            resDateRules: [
                value => !!value || 'Required.',
                val => /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}$/.test(val) || 'DD-MM-YYYY if none Pls put 00-00-0000',
            ],
            requiredFields : [
                'gender',
                'noChildren',
                'dateBirth',
                'contactNumber',
                'address',
                'contactPerson',
                'contactPersonNumber',
                'contactPersonRelation',
                'attainment',
                'course',
                'school',
                'designation',
                'position',
                'status',
                'dateHired',
                'computerNumber',
                'computerPassword',
                'operatingSystem'
            ],
            // personal information **************************
            dialog: false,
        }
    },
    mounted() {
        // this.profile = `http://hrdapps48:3001/ftp/employee_pictures/0${this.myPersonalInfo.employee_code}.jpg`
        
        this.getOptions()

        // get department
        this.getDepartmentOtion()
        // get Section
        this.getSection(this.userInfo.department)
        // get Team
        this.getTeam(this.userInfo.department, this.userInfo.section)

        // get Options
        this.getThisOptions('eStatus')
    },
    computed: {
        profile() {
            return `http://hrdapps48:3001/ftp/employee_pictures/0${this.myPersonalInfo.employee_code}.jpg`
        },
      filteredPersonalInfoContent() {
        return this.personalInfoContent.filter(item => {
          return item.for == this.selectedMyProfilePage
        })
      },
      isMatch() {
          if(this.password1 === this.password2){
              return true
          }else{
              return false
          }
      }
    },
    watch: {
        'myPersonalInfo.department'(newVal){
            this.getSection(newVal)
        },
        'myPersonalInfo.section'(newVal){
            this.getTeam(this.myPersonalInfo.department, newVal)
        }
    },
    methods: {
        getOptions() {
            let urlOption = `${this.api}get/data/by_id/options`
            axios.get(urlOption).then(res2 => {
                this.selectOption.gender = res2.data.selectOption.gender
                this.selectOption.civilStatus = res2.data.selectOption.civilStatus
                this.selectOption.attainment = res2.data.selectOption.attainment
                this.selectOption.position_options = res2.data.selectOption.position_options
                this.selectOption.designation_options = res2.data.selectOption.designation_options
                this.selectOption.course_option = res2.data.selectOption.course_option
                this.selectOption.status = res2.data.selectOption.status
                this.selectOption.employment_status = res2.data.selectOption.employment_status
            })
        },
        submitFile() {
            console.log(this.myPersonalInfo)
        let formData = new FormData();
        let url = `${this.api}post/profile_picture`
        formData.append('employee_code', this.myPersonalInfo.employee_code)
        formData.append('file', this.file);
        axios.post(
          url, 
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(() => {
          console.log('success!')
          this.uploadDialog = false
        }).catch(() => {
          console.log('failed!')
        })
        },
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },
        computedRules(val){
            let myArr = []
            if(this.filteredPersonalInfoContent[val].rules){
            let conRules = this.filteredPersonalInfoContent[val].rules
            conRules.forEach(item => {
                myArr.push(this.validationRules[item])
            })
            }
            return myArr
        },
        onSelectProfilePage(val) {
            this.selectedMyProfilePage = val
        },
        
        onEmptyProfile() {
            this.profile = `http://hrdapps30/st_public/image/employee_pictures/no-image.png`
        },
        saveInfoToDatabase() {
            let url = `${this.api}save/employees_information`
            console.log(this.myPersonalInfo)
            axios.post(url, this.myPersonalInfo).then(res => {
            alert(res.data)
            this.onChangeDialogView_PersonalInfo(false)
            this.CHANGE_PERSONAL_INFO({})
            })
        },
        
        uploadPicture(){
            this.uploadDialog = true
        },

        onChangePassword() {
            let pass = md5(this.password1)
            let url = `${this.api}change/password/${this.myPersonalInfo.employee_code}`
            axios.post(url, {pass: pass}).then(res => {
                alert(res.data)
                this.passwordDialog = false
            })
        },
        resetPassword() {
            let c = confirm("Are you sure you want to restore password to default id number?")
            if( c == true){
                let pass = md5(this.myPersonalInfo.employee_code)
                let url = `${this.api}change/password/${this.myPersonalInfo.employee_code}`
                axios.post(url, {pass: pass}).then(res => {
                    alert(res.data)
                    this.passwordDialog = false
                })
            }else{
                alert('Cancelled!')
            }
        },
        onEditModeChange(val) {
            // alert(val)
            this.personalInfoContent = this.personalInfoContent.map(a => {
                a.disableEdit = !val
                return a
            })
        },

        
    }
}
</script>