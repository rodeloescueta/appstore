<template>
    <v-container fluid pa-0 >
    <v-row dense>
       <v-col cols="6">
        <v-card  elevation="1" :height="screenHeight * .76" >
          <v-toolbar elevation-1 flat color="primary" width="auto" >
            <v-btn fab text small dark @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small dark @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn outlined dark class="mr-4" x-small @click="setToday({date})">
              Today
            </v-btn>
          <v-toolbar-title><span class="font-weight-medium" style="color:white">{{ title }}</span></v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-spacer></v-spacer>
          <v-switch class="mr-0 pt-6" @change="getFilteredEvent()" dark v-model="switch1" inset :label="`HISTORY`"></v-switch>
           <!-- <v-menu bottom right>
          <template v-slot:activator="{ on }">
              <v-btn
                outlined
                 dark
                 @change="updateRange"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
            </v-menu> -->
        </v-toolbar>
            <v-sheet height="500">
                <v-calendar 
                ref="calendar" 
                v-model="focus"
                :events="schedules"
                :event-color="getEventColor"
                :event-margin-bottom="3"  
                :type="type"
                @click:event="viewDay"
                @click:more="viewDay"
                @change="updateRange" 
                @click:day="viewDay" 
                @click:date="addSched" 
                color="primary"
                >
                </v-calendar>
                <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
                >
                <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
                >
                <v-toolbar
                :color="selectedEvent.color"
                dark 
                flat
                dense
                >
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                </v-toolbar>
                <v-card-text>
                  <span v-html="selectedEvent.info"></span>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen=false"
                  >
                  Cancel
                  </v-btn>
                </v-card-actions>
                </v-card>
                </v-menu>
            </v-sheet>
        </v-card>
      </v-col>  
     <v-col cols="6">
       <v-container fluid pa-0>
       <v-card elevation="1" class="scroll" :height="screenHeight * .77">
       <template v-for="(sched, i) in filteredSchedules">
       <v-card :key="i + 'a'" tile  max-height="400">
         <v-list-item>
           <v-list-item-content>
             <v-row dense>
             <v-col cols="3" >
               <span class="font-weight-black body-2" >Title: </span> <span class="font-weight-medium body-2" :style="`color:${sched.color}`">{{sched.name}}</span>
                <br>
                <span class="overline">Date: {{sched.start}}</span>
                <br>
                <span class="overline">From: {{sched.timeFrom}}</span>
                <br>
                <span class="overline">To: {{sched.timeTo}}</span>
                 <br>
                 <br>
                  <span class="caption">{{sched.employee_code}}</span>
                <br>
                <span class="caption ">Reserved by: <br> {{sched.reservedBy}}</span>
                </v-col>
                <v-divider class="mx-4" vertical></v-divider>
                <v-col cols="4">
               
                 <span class="caption">Attendees:</span>  
                <span v-for="(item, i) in sched.selectedName" class="caption" :key="i+'a'"><br>{{item}}</span>
                <br>
                <v-divider></v-divider>
                <span class="caption">Requesting to join:</span>  
                <span v-for="(item, i) in sched.requestingName" class="caption" :key="i +'b'"><br>{{item}}</span>
                </v-col>
                <v-col cols="3">
                <span class="caption">Description: <br>{{sched.info}}</span>
                </v-col>
           </v-row>
           </v-list-item-content>
           <v-list-item-action>
             <v-row dense>
               <v-col cols="12">
             <v-btn @click="editEvent(sched)" icon>
               <v-icon>mdi-pencil</v-icon>
             </v-btn>
             <v-btn @click="deleteEvent(sched, i)" icon>
               <v-icon>mdi-delete</v-icon>
             </v-btn>
             <br>
             <br>
             <v-btn class="pl-1" outlined small color="success" @click="joinSched(sched, i)"> <v-icon>mdi-account-plus-outline</v-icon>Join</v-btn>
             </v-col>
             </v-row>
           </v-list-item-action>
         </v-list-item>
       </v-card>
       </template>
       </v-card>
       </v-container>
</v-col>
    </v-row>
        <v-row class="justify-center" >
            <v-dialog v-model="dialog" max-width="600px" persistent>
              <v-card>
                  <v-toolbar color="primary" flat dense dark>
                      <v-toolbar-title class="headline">{{titleName}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="closeDialog()" fab outlined x-small dark >
                          <v-icon>mdi-close</v-icon>
                      </v-btn>
                  </v-toolbar>
                    <v-card-text>
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-container pa-0>
                            <v-row >
                                <v-col cols="12" sm="8" md="4">
                                     <v-text-field v-model="toAdd.name" :counter="10" :rules="nameRules" label="Event Title" required></v-text-field>
                                </v-col>
                                  <v-col cols="12" sm="8" md="4">
                                    <color-select 
                                      @select="sample"
                                    ></color-select>
                                    <template v-if="hideTextField !== 1">
                                 <v-text-field v-model="toAdd.color" label="Color" required></v-text-field>
                                 <v-text-field v-model="toAdd.requestingName"></v-text-field>
                                 </template>
                                 </v-col>
                                <v-spacer></v-spacer>
                                <template v-if="this.editedIndex > -1">
                                <v-col cols="12" sm="8" md="3">
                                      <v-dialog ref="dialog" v-model="modal" :return-value.sync="toAdd.date" persistent width="290px">
                                        <template v-slot:activator="{on}">
                                          <v-text-field v-model="toAdd.start" v-on="on" label="Start Date" prepend-icon="event" readonly>
                                          </v-text-field>
                                        </template>
                                        <v-date-picker v-model="toAdd.start"  :min="date" scrollable>
                                          <v-spacer></v-spacer>
                                          <v-btn text color="primary" @click="modal=false">Cancel</v-btn>
                                          <v-btn text color="primary" @click="$refs.dialog.save(toAdd.date)">Ok</v-btn>
                                        </v-date-picker>
                                      </v-dialog>
                                </v-col>
                                </template>
                                <template v-else>
                                <v-col cols="12" sm="8" md="4">
                                  <span class="mr-7 " >Selected Color</span>
                                  <div class="ml-6 mt-1">
                                  <v-btn depressed  :color="toAdd.color" class="disable-events " fab x-small></v-btn>
                                  </div>
                                </v-col>
                                </template>
                                <v-col cols="3">
                                    <v-autocomplete  outlined dense class="font-weight-light caption"
                                      v-model="toAdd.selectedDepartment"
                                      :items="departmentOptions"
                                      @change="getSections()"
                                      label="Department"
                                      autocomplete="off"
                                     ></v-autocomplete>
                                </v-col>
                                <v-col cols="3">
                                    <v-autocomplete  outlined dense class="font-weight-light caption"
                                      v-model="toAdd.selectedSection"
                                      :items="sectionOptions"
                                      @change="getEmpNames()"
                                      item-text="fullName"
                                      item-value="fullName"
                                      label="Section"
                                      autocomplete="off"
                                     ></v-autocomplete>
                                </v-col>
                                <v-col cols="6">
                                <v-autocomplete
                                      class="font-weight-light caption"
                                      v-model="toAdd.selectedName"
                                      :items="attendees"
                                      autocomplete="off"
                                      outlined
                                      dense
                                      clearable
                                      chips
                                      small-chips
                                      item-text="fullName"
                                      item-value="employeeCode"
                                      label="Attendees"
                                      multiple
                                    ></v-autocomplete>
                                   
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea  outlined v-model="toAdd.info" :counter="100" :rules="infoRules" class="pa-0 font-weight-light caption" auto-grow rows="3" row-height="20"  label="Information"></v-textarea>
                                </v-col>
                                 <v-col cols="11" sm="5">
                                       <v-text-field type="time" min="07:00" max="00:00" required v-model="toAdd.timeFrom" :rules="timeFromRules"  label="From" prepend-icon="access_time" hint="( HH : MM :AM/PM)" persistent-hint >
                                       </v-text-field>
                                </v-col>
                                <v-spacer></v-spacer>
                               <v-col cols="12" sm="5">
                                       <v-text-field type="time" value="16:00" required v-model="toAdd.timeTo"  :rules="timeToRules" label="To" prepend-icon="access_time" hint="( HH : MM :AM/PM)" persistent-hint >
                                       </v-text-field>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-card-actions>
                             <v-btn  block color="primary" :disabled="!valid" @click="saveTest()">{{btnName}}</v-btn>
                             </v-card-actions>
                        </v-container>
                        </v-form>
                    </v-card-text>
              </v-card>
            </v-dialog>
        </v-row>
   </v-container>
</template>
<script>
// developer = obet
import moment from 'moment'
import axios from 'axios'
import vue from 'vue'

export default {
  components: {
    'ColorSelect': () => import('../components/ColorSelect')
  },
    data() {
        return {
            switch1: true,
            titleName: '',
            btnName: '',
            screenHeight: 0,
            selectedSection: '',
            sectionOptions: [],
            selectedDepartment: '',
            departmentOptions: [],
            autoTry: ['rgb','lgd','hexa'],
            values: ['lgd'],
            hideTextField: 1,
            selectedName: [],
            requestingName: [],
            attendees: [],
            editedIndex: -1,
            dialog: false,
            dialog1: false,
            dialog2: false,
            timeFrom: null,
            timeFromRules: [v => !!v || 'Input time'],
            timeTo: null,     
            timeToRules: [v => !!v || 'Input time'],     
            modal: false,
            modal1: false,
            date: moment().format('YYYY-MM-DD'),
            toAdd: {},
        //    #############CALENDAR###############
            focus: '',
            type: 'month',
            typeToLabel: {
              month: 'Month',
              week: 'Week',
              day: 'Day',
              '4day': '4 Days',
            },
            selectedDate: moment().format('YYYY-MM-DD'),
            valid: true,
            name: null,
            nameRules: [
                          v => !!v || 'Name is required',
                          v => (v && v.length <= 10) || 'Name must be less than 10 characters',
                        ],
                              info: null,
                                infoRules: [
                          v => !!v || 'Description is required',
                          v => (v && v.length <= 100) || 'Description must be less than 100 characters',
                    
                        ],
            start: null,
            end: null,
            color: null,
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [
               {
                  name: 'Vacation',
                  details: 'Going to the beach!',
                  start: '2018-12-29',
                  end: '2019-01-01',
                  color: 'blue',
                }
            ],
      
        //    #############CALENDAR###############
//================= O B E T ================== //
            schedules: []
        }
    },
      mounted () {
      this.screenHeight = window.screen.availHeight
      this.$refs.calendar.checkChange()
      // this.getDefaultGroups()
      // if(!this.month){
      // this.$refs.calendar.scrollToTime('06:58')
      // }
    },
    computed: {
      filteredSchedules(){
        // if(this.date > this.selectedDate){
        //   console.log('Date Expired')
        //   return 0
        // }
        // else{
          return this.schedules.map(rec=>{
            if(!rec.requestingName){
              rec.requestingName = []
            }
            return rec
          })
          
          .filter(rec => {
            return rec.start.includes(this.selectedDate)
          })
        // }
      },
     title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    created(){
      this.getSchedule()
      this.getDepartments()
    },
    methods: {
        joinSched(rec, i){
            this.toAdd = Object.assign({},rec)
            this.toAdd.selectedName = rec.selectedName  
            this.toAdd.reservedBy = rec.reservedBy
            if(this.toAdd.requestingName.length){
              if(this.toAdd.selectedName.indexOf(this.userInfo.fullName) == -1 && this.filteredSchedules[i].requestingName.indexOf(this.userInfo.fullName) ==-1){
                this.toAdd.requestingName.unshift(this.userInfo.fullName)
              this.filteredSchedules[i].requestingName = this.toAdd.requestingName
              console.log('SELECTED NAME')
              console.log(this.filteredSchedules[i].requestingName)
              let url2 = `${this.api}updateRec`
              axios.post(url2, this.toAdd).then(res => {
              console.log(res.data)
              alert(res.data)
            })  
            }
           
            else {
              alert('Included')
            }
            }
            else if (this.toAdd.selectedName.indexOf(this.userInfo.fullName) == -1){
                this.toAdd.requestingName.unshift(this.userInfo.fullName)
              this.filteredSchedules[i].requestingName = this.toAdd.requestingName
                console.log('SELECTED11111111 NAME')
              console.log(this.filteredSchedules[i].requestingName)
              let url2 = `${this.api}updateRec`
              axios.post(url2, this.toAdd).then(res => {
              console.log(res.data)
              alert(res.data)
            })  
            }
            else{
              alert('INCLUDED')
            }
              setTimeout(()=>{
            this.toAdd = {}
            this.editedIndex = -1
          }, 300)
        },
       removeAttendeesList(){
         this.attendees = []
       },       
      getEmpNames() {
              let url = `${this.api}getAttendees/${this.toAdd.selectedDepartment}/section/${this.toAdd.selectedSection}`
              axios.get(url).then(res=> {
                this.attendees = res.data
              })
      },
      getDefaultGroups() {
        this.selectedDepartment = this.userInfo.department
      },
      getReserver() {
        this.toAdd.selectedName = []
        this.toAdd.selectedName.push(this.userInfo.fullName)
        console.log(this.selectedName)
      },
      closeDialog2(){ 
        this.dialog2 = false
      },
      addAttendeesDialog(){
        this.dialog2 = true
      },
      sample(color){  
        
        vue.set(this.toAdd, 'color', color)
        console.log(this.toAdd)
        console.log('!!!!!!!!!!!!!!!!!!!')
        console.log(this.toAdd.color)
      },
        getDepartments(){
            axios.get(`http://hrdapps48:5031/get/department/${this.selectedDepartment}`).then(res => {
                this.departmentOptions = res.data.map(rec => rec.name)
            })
        },
        getSections(){
            axios.get(`http://hrdapps48:5031/get/department/${this.toAdd.selectedDepartment}/section_option`).then(res => {
                this.sectionOptions = res.data.map(rec => rec.name)
            })
        },
        getFilteredEvent(){
          if(this.switch1 === false){
              let dep = this.userInfo.department
              let url = `${this.api}scheduler/filterByDepartment/${dep}`;
              axios.get(url).then(res => {
              this.schedules  = res.data
          })
          }
          else {
            this.getSchedule()
          }
        },
        getSchedule() {
          let dep = this.userInfo.department
          let url = `${this.api}scheduler/viewByDepartment/${dep}`
          axios.get(url).then(res=>{
            this.schedules = res.data
          })
        },
        //** DONT HAVE FILTER BY DEPARTMENT */
        // getSchedule(){
        //   let empCode = this.userInfo.employeeCode
        //   let url = `${this.api}getSchedule/${empCode}`;
        //   axios.get(url).then(res => {
        //     this.schedules  = res.data
        //   })
        // },
        // get schedule per department
        // getAttendees(){
        //   let empCode = this.userInfo.employeeCode
        //   let url = `${this.api}getAttendees/${dep}`;
        //   axios.get(url).then(res => {
        //     this.attendees  = res.data
        //   })
        // },
        // get schedule per department
      
      //================= OBET ================== //
        saveTest(){
          if (this.$refs.form.validate()) {
           if(this.editedIndex <=-1){
            this.toAdd.reservedBy = this.userInfo.fullName
            this.toAdd.employee_code = this.userInfo.employeeCode
            console.log(this.toAdd.selectedName)
            this.schedules.unshift(this.toAdd)
            this.schedules.sort((a, b) => 
            a.start.localeCompare(b.start))
           
            // console.log(this.toAdd)
            // console.log(this.userInfo)
            let url = `${this.api}saveTest`
            axios.post(url, this.toAdd).then(res => {
              console.log(res.data)
              alert(res.data)
            })
            }
            else{
              Object.assign(this.schedules[this.editedIndex], this.toAdd)
              let url1 = `${this.api}updateRec`
              axios.post(url1, this.toAdd).then(res => {
              console.log(res.data)
              alert(res.data)
            })

            }
            
            this.closeDialog()
            this.$refs.form.resetValidation()
        }
         
        },
        editEvent(rec){
          this.toAdd.reservedBy = rec.reservedBy
          if(this.toAdd.reservedBy === this.userInfo.fullName){
            this.editedIndex = this.schedules.indexOf(rec)
            this.toAdd = Object.assign({}, rec)
             this.titleName = 'Edit Event'
              this.btnName = 'Update'
             this.toAdd.selectedDepartment = rec.selectedDepartment
            this.toAdd.selectedSection = rec.selectedSection
             this.getSections()
             this.getEmpNames()
            //  this.toAdd.selectedName = this.userInfo.fullName
            this.dialog = true
            }
            else{
              alert('Only the reserver can edit')
            }
        },
        deleteEvent(rec){
          this.toAdd.reservedBy = rec.reservedBy
          if(this.toAdd.reservedBy === this.userInfo.fullName){
            const index = this.schedules.indexOf(rec)
            let r = confirm('Are you sure you want to delete this event?')
            if(r === true){
              this.schedules.splice(index,1)
              let url = `${this.api}deleteEvent`
              axios.post(url,rec).then(res =>{
                console.log(res.data)
                alert(res.data)
              })
            }
            else{
              console.log('Canceled')
               console.log(this.toAdd.reservedBy)
            }
            }
           else {
             alert('Only the reserver can delete')
             console.log(this.toAdd.reservedBy)
           } 
        },
        // *********************************************
        addSched({date}){
            if(this.date <= date)
            {
            this.toAdd.start = date
            this.dialog = true
            this.titleName = 'Add Event'
            this.btnName = 'Save'
            this.toAdd.selectedDepartment = this.userInfo.department
            this.toAdd.selectedSection = this.userInfo.section
            this.sample('red')
            this.getSections()
            this.getEmpNames()
            this.getReserver()
            }
            else
            {
              alert('Past Date')
            }
        },
        closeDialog() {
            this.dialog = false
            setTimeout(()=>{
            this.toAdd = {}
            this.$refs.form.resetValidation()
            this.editedIndex = -1
          }, 300)
            
        },
        viewDay ({ date }) {
        // this.focus = date
        // this.type = 'day'
        this.selectedDate = date
      },
      getEventColor (event) {
        return event.color
      },
      setToday ({date}) {
        this.selectedDate = date
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
       showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
       updateRange ({ start, end }) {
         if(!this.month){
         this.$refs.calendar.scrollToTime('06:58')
         }
        this.start = start
        this.end = end
      
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
  }
</script>
<style scoped>
.disable-events{
  pointer-events: none
}
</style>