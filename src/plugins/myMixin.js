import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'
import axios from 'axios'
// import moment from 'moment'

const myPlugin = {
    install(Vue){


        Vue.mixin({
          data:()=>({
            api: process.env.VUE_APP_URL,
            departmentData: [],
            myPagination: {
              page: 10,
              rowsPerPageItems: [5, 10, 50, 200, {"text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1}],
              rowsPerPage: 10
            },
            selectOption:
                {
                gender: [],
                civilStatus: [],
                attainment: [],
                department_name_options: [],
                section_name_options: [],
                team_name_options: [],
                designation_options: [],
                request_type: [],
                course_option: [],
                position_options: [],
                status: [],
                employment_status: [],
                document_copy: [],
                eStatus: []
            },
            noStamp: [
              "Form",
              "Checklist",
              "Circular Notice",
              "Risk Registry",
              "Minutes of the Meeting"
          ],
          recentMessages: [],
          
          // dialogViewDocumentInfo: false,
          }),
          
          computed: {
            ...mapState([
              'userInfo',
              // 'recentMessages',
              'myPage',
              'documentViewInformation',
              // 'dialogViewDocumentInfo',
              'dialogPersonalInfo',
              'myPersonalInfo',
              'todos',
              'myWeb',
              'myDesk'
              ]),
            isDhShJa(){
              let leader = [
                'Japanese Advisor',
                'Department In-Charge',
                'Department Head Trainee',
                'Department Head',
                'Section In-Charge',
                'Section Head Trainee',
                'Section Head' ]
              if(leader.includes(this.userInfo.designation)){
                return true
              }else{
                return false
              }
            },
            isAppstoreMaster(){
              let masterApp = ['01438', '19178', '16761', '34779', '36822', '34779']
              if(masterApp.includes(this.userInfo.employeeCode)){
                return true
              }else{
                return false
              }
            },
            isSyscomQa() {
              if(this.userInfo.department == 'QA'){
                return true
              }else if(this.userInfo.newRights){
                if(this.userInfo.newRights.systemCommittee){
                  return true
                }else{
                  return false
                }
              }else{
                return false
              }
            },
            isLeader() {
                let leader = [
                'Japanese Advisor',
                'Team In-Charge',
                'Team Head Trainee',
                'Team Head',
                'Department In-Charge',
                'Department Head Trainee',
                'Department Head',
                'Section In-Charge',
                'Section Head Trainee',
                'Section Head' ]
              if(leader.includes(this.userInfo.designation)){
                return true
              }else{
                return false
              }
            },
            isDocumentMasterMaintenance() {
              let withRights = [
                '01438',
                '19178',
                '16828',
                '22860',
                '29972',
                '32988'
              ]
              if(withRights.includes(this.userInfo.employeeCode)){
                return true
              }else{
                return false
              }
            },
            isMasterMaintenance() {
              let withRights = [
                '19178',
                '01438',
              ]
              if(withRights.includes(this.userInfo.employeeCode)){
                return true
              }else{
                return false
              }
            },
            application() {
              if(this.myPage == 'App Store'){
                  return 'default_team_web'
              }else {
                  return 'default_team_desktop'
              }
            },
            toUnique() {
                if(this.myPage == 'App Store'){
                    return '_'
                }else {
                    return '_desktop'
                }
            }
          },
          methods: {
            alert(val) {
              alert(val)
            },
            onEmptyProfile(){
              this.profile = `http://hrdapps30/st_public/image/employee_pictures/no-image.png`
            },
            getDepartmentOptions() {
              let url2 = `${this.api}get/department/options`
              axios.get(url2).then(res => {
                  let data = res.data.map(rec => rec.name)
                  this.departmentOptions = data
              })
            },
            ...mapMutations([
                'ADD_INFO',
                // 'CHANGE_RECENT_MESSAGES',
                'CHANGE_PAGE',
                'CHANGE_DOCUMENT_VIEW',
                // 'CHANGE_DIALOG_VIEW_DOCUMENT_INFO',
                'CHANGE_DIALOG_PERSONAL_INFO',
                'CHANGE_PERSONAL_INFO',
                'CHANGE_TODOS',
                'CHANGE_MYWEB',
                'CHANGE_MYDESK'
              ]),
            updateMyProfile(val) {
              let url = `${this.api}get/staff_info_all/${val}`
              axios.get(url).then(res => {
                console.log(res.data)
                this.CHANGE_PERSONAL_INFO(res.data)
                // location.reload()
                this.onChangeDialogView_PersonalInfo(true)
              })
            },
            // onChangeDialogView_DocumentInfo(val) {
            //   this.dialogViewDocumentInfo = val
            //   // this.CHANGE_DIALOG_VIEW_DOCUMENT_INFO(val)
            //   // alert(val)
            // },
            onChangeDialogView_PersonalInfo(val) {
              this.CHANGE_DIALOG_PERSONAL_INFO(val)
              // alert(val)
            },
            onChangeDocumentView(val) {
              this.CHANGE_DOCUMENT_VIEW(val)
            },
            changePage: function(val) {
              this.CHANGE_PAGE(val)
            },
            pdfTab(val) {
              let url
              if(val.request_type === 'Minutes of the Meeting' ||
              val.request_type === 'Form' ||
              val.request_type === 'Checklist' ||
              val.request_type === 'Circular Notice' ||
              val.request_type === 'Risk Registry' ){
                url = `http://hrdapps48:3001/ftp/test/doc/pdf/src/${val.department}/${val.document_control_code}${val.document_title}.pdf`
              }else{
                url = `http://hrdapps48:3001/ftp/test/doc/${val.department}/${val.document_control_code}${val.document_title}.pdf`
              }
              var win = window.open(url, '_blank');
              win.focus();
            },
            pdfTabNoStamp(val) {
              let url = `http://hrdapps48:3001/ftp/test/doc/pdf/src/${val.department}/${val.document_control_code}${val.document_title}.pdf`
              var win = window.open(url, '_blank');
              win.focus();
            },
            xlsDownload(val) {
              let url = `http://hrdapps48:3001/ftp/test/doc/pdf/src/${val.department}/${val.document_control_code}${val.document_title}.${val.filename.split('.').pop()}`
              var win = window.open(url, '_self');
              win.focus();
              console.log(val.filename)
            },
            getThisOptions(val) {
              let url = `${this.api}get/available_options/${val}`
              axios.get(url).then(res => {
                  this.selectOption[val] = res.data
              })
            },
            
            backHome(){
              this.$router.push('/')
            },
            initializeDepartment() {
              // console.log(this.application)
              let url = `${this.api}hrdappstore/get_application/${this.application}/${this.userInfo.department}${this.toUnique}`
              if(this.userInfo.department){
              axios.get(url)
                  .then(res => {
                  this.departmentData = res.data
                  })
              }
            },
            removeItem(val) {
              let confirmMessage = confirm("Sure to remove this from the list?")
              if(confirmMessage){
                let url = `${this.api}remove/department_list/${this.userInfo.department}${this.toUnique}`
                axios.post(url, val).then(res => {
                  console.log(res.data)
                  location.reload();
                })
              }
            },
            addItem(val) {
              let url = `${this.api}add/department_list/${this.userInfo.department}${this.toUnique}`
              axios.post(url, val).then(res => {
                if(res.data == 'not ok'){
                  alert('This application already exist in department list!')
                }else{
                  location.reload();
                }
              })
            },
            checkIsLeader(val){
              let leader = [
                'Japanese Advisor',
                'Team In-Charge',
                'Team Head Trainee',
                'Team Head',
                'Department In-Charge',
                'Department Head Trainee',
                'Department Head',
                'Section In-Charge',
                'Section Head Trainee',
                'Section Head' ]
              if(leader.includes(val)){
                return true
              }else{
                return false
              }
            },
            // get Team
            getTeam(dVal, sVal) {
              if(sVal){
                  let urlTeamOption = `${this.api}get/department/${dVal}/section/${sVal}/team_option`
                  axios.get(urlTeamOption).then(res => {
                      this.selectOption.team_name_options = res.data.map(a => a.name)
                  })
              }else{
                  this.selectOption.team_name_options = ['No Option']
              }
            },

            // get Section
            getSection(newVal) {
                let urlSectionOption = `${this.api}get/department/${newVal}/section_option`
                axios.get(urlSectionOption).then(res => {
                    this.selectOption.section_name_options = res.data.map(a => a.name)
                })
            },
            shorthen: function(val) {
              return _.truncate(val, {
                'length': 30,
                'separator': ' '
              })
            },

            // get Department option
            getDepartmentOtion(){
                let urlDepartmentOption = `${this.api}get/department/options`
                axios.get(urlDepartmentOption).then(res => {
                    this.department_options = res.data
                    this.selectOption.department_name_options = res.data.map(a => a.name)
                })
            }
          },
          filters: {
            shorthen: function(val) {
              return _.truncate(val, {
                'length': 30,
                'separator': ' '
              })
            },
            shorthentwent: function(val) {
              return _.truncate(val, {
                'length': 25,
                'separator': ' '
              })
            },
            shorthenforth: function(val) {
              return _.truncate(val, {
                'length': 50,
                'separator': ' '
              })
            },
            shorthenten: function(val) {
              return _.truncate(val, {
                'length': 13,
                'separator': ' '
              })
            }
          }
        })
    }
}

export default myPlugin