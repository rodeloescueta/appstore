<template>
    <v-container fluid pa-0 >
    <v-row dense>
       <v-col class="pa-0" cols="6">
        <v-card  elevation="1" :height="screenHeight * .75" >
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
            <v-sheet :height="screenHeight * .66">
                <v-calendar 
                class="calendar"
                ref="calendar"
                v-model="focus"
                :events="schedules"
                :event-overlap-mode="mode"
                :event-overlap-threshold="30"
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
     <v-col class="pa-0" cols="6">
       <v-container fluid pa-0>
       <v-card elevation="1" flat class="scroll" :height="screenHeight * .75">
       <template v-for="(sched, i) in filteredSchedules">
       <v-card :key="i + 'a'" tile  max-height="400">
         <v-list-item>
           <v-list-item-content>
             <v-row dense>
             <v-col cols="3" >
               <span class="font-weight-black body-2" >Title: </span> <span class="font-weight-medium body-2" :style="`color:${sched.sectionColor}`">{{sched.name}}</span>
                <br>
                <span class="overline">Date: <span class="font-weight-black">{{sched.start}}</span></span>
                <br>
                <span class="overline">From: <span class="font-weight-black">{{sched.timeFrom}}</span></span>
                <br>
                <span class="overline">To:  <span class="font-weight-black">{{sched.timeTo}}</span></span>
                <br>
                <span class="overline font-weight-black ">Venue:  {{sched.venue}}</span>
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
                 
                <template v-if="sched.reservedBy === userInfo.fullName && sched.start >= date">
                  <v-btn
                    @click="editEvent(sched)" 
                    icon
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn @click="deleteEvent(sched, i)" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
             <br>
             <br>

             <v-btn 
              v-show="sched.start >= date"
              class="pl-1" 
              outlined 
              small 
              :disabled="sched.requestingName.includes(userInfo.fullName) || sched.selectedName.includes(userInfo.fullName)" 
              max-width="100px" color="success" 
              @click="joinSched(sched, i)"

            >
              <v-icon 
                v-text="'mdi-account-plus-outline'"
              />
              
              <template v-if="sched.requestingName.includes(userInfo.fullName) || sched.selectedName.includes(userInfo.fullName)">
                Joined
              </template>
              <template v-else>
                Join 
              </template>
              
            </v-btn>

           
            <!-- <template v-if="sched.requestingName.indexOf(userInfo.fullName) !== -1">
              <v-btn class="pl-1" outlined small disabled max-width="100px" color="success" @click="joinSched(sched, i)"> <v-icon>mdi-account-plus-outline</v-icon>Joined</v-btn>
            </template>
            <template v-else>
              <v-btn  class="pl-1" outlined small  color="success" @click="joinSched(sched, i)"> <v-icon>mdi-account-plus-outline</v-icon>Join</v-btn>
            </template> -->
            <!-- <template v-else>
              <v-btn class="pl-1" outlined small  max-width="100px" color="success" @click="joinSched(sched, i)"> <v-icon>mdi-account-plus-outline</v-icon>Joined!</v-btn>
            </template> -->
             
             <br>
             <br>
             <template v-if="sched.requestingName.indexOf(userInfo.fullName) !== -1">
             <v-btn class="pl-1" outlined small  color="red" @click="cancelSched(sched, i)"> <v-icon>mdi-account-remove-outline</v-icon> <span class="overline">Cancel</span> </v-btn>
             </template>
             </v-col>
             </v-row>
           </v-list-item-action>
         </v-list-item>
       </v-card>
       </template>
       </v-card>
       </v-container>
</v-col>
  <v-col cols="12" >
        <v-toolbar
        dense
        tile
        flat
        >
        <v-toolbar-title class="font-italic font-weight-light subtitle-1">
         Legend:   '  
        </v-toolbar-title>
          <div class="text-center">
              <!-- {{filteredSections}} -->
            <template v-for="(sec, j) in filteredSections">
              <!-- {{sec}} -->
               <!-- :style="`color:${sec.color}`" -->
              <v-btn :key="j+'b'" :color="`${sec.color}`" x-small depressed  class="ma-2 disable-events">{{sec.name}}</v-btn>
            </template>
            
              <!-- <v-btn color="#FF0000" x-small depressed dark class="ma-2 disable-events">SD 2</v-btn>
              <v-btn color="#008080" x-small depressed dark class="ma-2 disable-events">SD 3</v-btn>
              <v-btn color="#00FF00" x-small depressed class="ma-2 disable-events">QM</v-btn>
              <v-btn color="#FFFF00" x-small depressed class="ma-2 disable-events">TM</v-btn>
              <v-btn color="#2e8b57" x-small depressed class="ma-2 disable-events">TECH</v-btn>
              <v-btn color="#FFC0CB" x-small depressed class="ma-2 disable-events">PM</v-btn>
              <v-btn color="#ff77ff" x-small depressed class="ma-2 disable-events">SUPP</v-btn> -->
              <v-btn color="#795548FF" x-small depressed class="ma-2 disable-events">DH</v-btn>
              <v-btn color="#795548FF" x-small depressed class="ma-2 disable-events">JA</v-btn>
              
          </div>    
          <v-spacer></v-spacer>
          <!-- <template v-if="this.userInfo.position == 'Team Leader'"> -->
              <v-btn
              class="mt-2"
              color="primary"
              fab
              dark
              @click="openSettingsDialog()" 
              >
              <v-icon>mdi-cogs</v-icon>
              </v-btn>
          <!-- </template> -->
        </v-toolbar>
      </v-col>
    </v-row>
        <v-row class="justify-center" >
            <v-dialog v-model="dialog" max-width="700px" persistent>
              <v-card>
                  <v-toolbar color="primary" flat dense dark>
                      <v-toolbar-title class="headline font-weight-light">{{titleName}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn 
                      fab 
                      outlined 
                      x-small 
                      dark
                       
                      class="mr-3"
                      > 
                      <v-icon>mdi-cogs</v-icon>
                      </v-btn>
                      <v-btn 
                      @click="closeDialog()" 
                      fab 
                      outlined 
                      x-small 
                      dark 
                      >
                          <v-icon>mdi-close</v-icon>
                      </v-btn>
                  </v-toolbar>
                    <v-card-text>
                      <v-form ref="form" v-model="valid" lazy-validation>
                        <v-container pa-0>
                            <v-row >
                                <v-col cols="12" sm="8" md="3">
                                     <v-text-field v-model="toAdd.name" :rules="nameRules" label="Event Title" required></v-text-field>
                                </v-col>
                                  <v-col cols="12" sm="8" md="5">
                                    <div class="pt-3">
                                      <v-autocomplete 
                                      v-model="toAdd.venue" 
                                      outlined 
                                      dense 
                                      class="font-weight-light caption"
                                      autocomplete="off"
                                      :items="conferenceRooms"
                                      hide-details
                                      label="Venue" 
                                      required>
                                    </v-autocomplete>
                                    </div>
                                       
                                    <!-- <div class="pt-0">
                                     <v-radio-group  :mandatory="false" hide-details row >
                                      <v-radio color="primary" label="Department Only" value="radio-1"></v-radio>
                                      <v-radio color="primary" label="Section Only" value="radio-2"></v-radio>
                                    </v-radio-group>
                                    </div>
                                    <color-select 
                                      @select="sample"
                                    ></color-select>
                                    <template v-if="hideTextField !== 1">
                                 <v-text-field v-model="toAdd.color" label="Color" required></v-text-field>
                                 <v-text-field v-model="toAdd.requestingName"></v-text-field>
                                 </template> -->
                                 </v-col>
                                  
                                   
                                <v-spacer></v-spacer>
                                <template v-if="this.editedIndex > -1">
                                <v-col cols="12" sm="8" md="4">
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
                                  <v-col cols="12" sm="4">
                                     <div class="pt-3">
                                        <v-btn
                                        outlined
                                        color="green"
                                        rounded
                                        @click="recurringEvents()"
                                        >
                                        <v-icon color="green" >mdi-autorenew</v-icon>
                                          <span class="font-weight-light"> Repeat</span> 
                                          </v-btn>  
                                        </div>    
                                  </v-col>
                                <!-- <v-col cols="12" sm="8" md="4"> -->
                                  <!-- <span class="mr-7 " >Selected Color</span> -->
                                  <!-- <div class="ml-6 mt-5"> -->
                                    <!-- <v-btn class="pa-0 overline font-weight-bold"  color="primary"> <v-icon>mdi-cogs</v-icon> Settings</v-btn> -->
                                  <!-- <v-btn depressed  :color="toAdd.color" class="disable-events " fab x-small></v-btn> -->
                                  <!-- </div> -->
                                <!-- </v-col> -->
                                </template>

                              <v-dialog v-model="recurringDialog" persistent max-width="670">
                                <v-card outlined >
                                  <v-card-title class="headline">Event Series</v-card-title>
                                  <v-card-text>
                                    <v-container pa-0>
                                      <v-row >
                                        <v-col cols="7">
                                          <v-select
                                          hide-details
                                          label="Repeat"
                                          v-model="occur"
                                          :items="recurringOptions"
                                          >

                                          </v-select>
                                        </v-col>
                                          <template v-if="occur">

                                          <v-col v-if="occur === 'Daily'" cols="5">
                                            <v-text-field
                                            type="number"
                                            hide-details
                                            v-model.number="repeatDay"
                                            label="Repeat every"
                                            suffix="Day(s)"
                                            >
                                            </v-text-field>
                                          
                                          </v-col>
                                          <v-col v-if="occur === 'Weekly'" cols="5">
                                            <v-text-field
                                            type="number"
                                            hide-details
                                            v-model.number="repeatWeek"
                                            label="Repeat every"
                                            suffix="Week(s)"
                                            >
                                            </v-text-field>
                                          
                                          </v-col>
                                          <v-col v-if="occur === 'Monthly'" cols="5">
                                            <v-text-field
                                            type="number"
                                            hide-details
                                            v-model.number="repeatMonth"
                                            label="Repeat every"
                                            suffix="Month(s)"
                                            >
                                            </v-text-field>
                                          
                                          </v-col>
                                          </template>
                                <v-col cols="12" class="py-0">
                                <template v-if="occur !== 'Never'">
                                <v-divider class="mr-1"></v-divider>
                                </template>
                                </v-col>
                                                  <template v-if="occur !== 'Never'">
                                                        <v-col cols="4">
                                                          <v-select
                                                          v-model="endDefaultOps"
                                                          label="End"
                                                          :items="endOptions"
                                                          ></v-select>
                                                        </v-col>
                                                    <v-col cols="8" v-if="endDefaultOps !== 'Count'">
                                                          <v-menu 
                                                            ref="menu" 
                                                            v-model="menu" 
                                                            :return-value.sync="dateUntil" 
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="290px"
                                                            :close-on-content-click="false"
                                                          >
                                                              <template v-slot:activator="{on}">
                                                                <v-text-field v-model="toAdd.end" hide-details v-on="on" append-icon="event"  readonly>
                                                                </v-text-field>
                                                              </template>
                                                              <v-date-picker v-model="toAdd.end" no-title  :min="date" >
                                                                <v-spacer></v-spacer>
                                                                <v-btn text color="primary" @click="menu=false">Cancel</v-btn>
                                                                <v-btn text color="primary" @click="$refs.menu.save(dateUntil)">Ok</v-btn>
                                                              </v-date-picker>
                                                          </v-menu>
                                                      </v-col>
                                                  <v-col cols="4" v-else>
                                                      <v-text-field
                                                    type="number"
                                                    hide-details
                                                    v-model="countNumbers"
                                                    >
                                                    </v-text-field>

                                                  </v-col>
                                                  </template>
                                             <v-col cols="12" class="py-0">
                                              <template v-if="occur !== 'Never'">
                                              <v-divider class="mr-1"></v-divider>
                                              </template>
                                              </v-col>

                                           <v-col cols="12" class="ma-0 pa-0" v-if="occur === 'Weekly'">
                                                <span class="ml-2">Repeat On</span> 
                                              <div class="row ml-0 pa-0" > 
                                              <template  v-for="(item, i) in weekday">
                                                <v-checkbox v-model="weekDayNow" color="primary" multiple class="compact-form space-around" dense hide-details :key="i + 'b'" :label="item.text" :value="item.value"></v-checkbox>
                                              </template>
                                              </div>
                                          </v-col>

                                          <v-col cols="12" class="ma-0 pa-0" v-if="occur === 'Daily'">
                                                <span class="ml-2">Except On</span> 
                                              <div class="row ml-0 pa-0" > 
                                              <template  v-for="(item, i) in weekday">
                                                <v-checkbox v-model="weekDailyNow" color="primary" multiple class="compact-form space-around" dense hide-details :key="i + 'b'" :label="item.text" :value="item.value"></v-checkbox>
                                              </template>
                                              </div>
                                          </v-col>

                                          <template v-if="occur === 'Monthly'">
                                           <v-col cols="4">
                                              <v-select
                                              hide-details
                                              v-model="monthlyOpsDefault"
                                              label="End"
                                              :items="monthlyOps"
                                              :item-text="monthlyOps.text"
                                              :item-value="monthlyOps.value"
                                              ></v-select>
                                            </v-col>
                                            <v-col cols="4">
                                              <v-select
                                              hide-details
                                              v-model="weekDayNow"
                                              label="Repeat On"
                                              :items="weekday"
                                              :item-text="weekday.text"
                                              :item-value="weekday.value"
                                              ></v-select>
                                            </v-col>
                                           </template> 
                                          <!-- <v-flex xs1> -->
                                            <!-- <div v-if="occur === 'Weekly'"> -->
                                             
                                              <!-- </div> -->
                                          <!-- </v-flex>     -->
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      @click="recurringDialog = false"
                                    >
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      v-if="occur === 'Daily'"
                                      @click="dailyRepeat(toAdd.start,toAdd.end, weekDailyNow,repeatDay, countNumbers)"
                                    >
                                      Save
                                    </v-btn>
                                    <v-btn
                                      color="red"
                                      text
                                      v-if="occur === 'Weekly'"
                                      @click="weeklyRepeat(toAdd.start,toAdd.end, repeatDay, weekDayNow, countNumbers)"
                                    >
                                      Save
                                    </v-btn>
                                    <v-btn
                                      color="primary"
                                      text
                                      v-if="occur === 'Monthly'"
                                      @click="monthlyRepeat(toAdd.start,toAdd.end, monthlyOpsDefault, repeatDay, weekDayNow, countNumbers)"
                                    >
                                      Save
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>

                                  <!-- <v-col cols="11" sm="12" md="4">
                                    <v-autocomplete 
                                      v-model="toAdd.venue" 
                                      outlined 
                                      dense 
                                      class="font-weight-light caption"
                                      autocomplete="off"
                                      :items="conferenceRooms"
                                      hide-details
                                      label="Venue" 
                                      required>
                                    </v-autocomplete>
                                  </v-col> -->
                                <v-col cols="6">
                                    <v-autocomplete  outlined dense class="font-weight-light caption"
                                      v-model="toAdd.selectedDepartment"
                                      :items="departmentOptions"
                                      hide-details
                                      @change="getSections()"
                                      label="Department"
                                      autocomplete="off"
                                     ></v-autocomplete>
                                </v-col>
                                <v-col cols="6">
                                    <v-autocomplete  outlined dense class="font-weight-light caption"
                                      v-model="toAdd.selectedSection"
                                      :items="sectionOptions"
                                      hide-details
                                      @change="getEmpNames()"
                                      item-text="fullName"
                                      item-value="fullName"
                                      label="Section"
                                      autocomplete="off"
                                     ></v-autocomplete>
                                </v-col>
                                <v-col cols="12">
                                <v-combobox
                                      class="font-weight-light caption"
                                      v-model="toAdd.selectedName"
                                      :items="attendees"
                                      autocomplete="off"
                                      outlined
                                      dense
                                      hide-details
                                      clearable
                                      chips
                                      small-chips
                                      item-text="fullName"
                                      item-value="employeeCode"
                                      label="Attendees"
                                      multiple
                                    ></v-combobox>
                                   
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea  outlined v-model="toAdd.info" :counter="100" :rules="infoRules" class="pa-0 font-weight-light caption" auto-grow rows="3" row-height="20"  label="Information"></v-textarea>
                                </v-col>
                                 <v-col cols="11" sm="5">
                                       <v-text-field type="time"  required v-model="toAdd.timeFrom" :rules="timeRules"  label="From" prepend-icon="access_time" hint="( HH : MM :AM/PM)" persistent-hint >
                                       </v-text-field>
                                </v-col>
                                <v-spacer></v-spacer>
                               <v-col cols="12" sm="5">
                                       <v-text-field type="time"  required v-model="toAdd.timeTo"  :rules="timeRules" label="To" prepend-icon="access_time" hint="( HH : MM :AM/PM)" persistent-hint >
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
            <v-dialog v-model="settingsDialog" persistent max-width="500">
               <v-card outlined >
                <v-card-title class="headline">Settings</v-card-title>
                <v-card-text>
                  <v-container pa-0>
                    <v-row >
                      <v-col cols="12">
                        <span class="body-1 font-weight-light"> Change Section Color: </span>
                            <v-text-field  v-model="listSectionColor" flat hide-details class="ma-0 pa-0" solo>
                              <template v-slot:append>
                                <v-menu v-model="colorMenu"  top nudge-bottom="220" nudge-left="16" :close-on-click="false" :close-on-content-click="false">
                                  <template v-slot:activator="{ on }">
                                    <div :style="swatchStyle" v-on="on" />
                                  </template>
                                  <v-card >
                                    <v-card-text class="pa-0">
                                      <v-color-picker v-model="listSectionColor"  disabled  hide-canvas hide-inputs hide-mode-switch show-swatches flat />
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn  
                                      @click="cancelSettings()"
                                      text
                                      >CANCEL
                                      </v-btn>
                                      <v-btn  
                                      @click="saveSettings(listSectionColor)"
                                      text
                                      >SAVE
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-menu>
                              </template>
                            </v-text-field>
                      </v-col>
                      <!-- <v-col cols="6">
                          <v-select>
                          </v-select>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="settingsDialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="saveColor()"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </v-row>
   </v-container>
</template>
<script>
// developer = obet
import moment from 'moment'
import axios from 'axios'
import {RRule} from 'rrule'
import vue from 'vue'
export default {
  
  components: {
    // 'ColorSelect': () => import('../components/ColorSelect')
  },
    data() {
        return {
          dailyDates: null,
          yearNow: null,
          monthNow: null,
          monthlyOpsDefault: null,
          monthlyOps: [
            {text: 'First', value: 1},
            {text: 'Second', value: 2},
            {text: 'Third', value: 3},
            {text: 'Fourth', value: 4},
            {text: 'Last', value: 5},
          ],
          todayNow: null,
          weekDayNow: null,
          weekDailyNow: [0,1,2,3,4,5,6],
          endDefaultOps: 'Until',
          endOptions: ['Until', 'Count'],
          dateUntil: moment().format('YYYY-MM-DD'),
          repeatDay: 1,
          repeatWeek: 1,
          repeatMonth: 1,
          countNumbers: 30,
          occur: 'Never',
          recurringOptions: ['Never','Daily','Weekly','Monthly'],
          weekday: [
            {text: 'Sunday', value: 6},
            {text: 'Monday', value: 0},
            {text: 'Tuesday', value: 1},
            {text: 'Wednesday', value: 2},
            {text: 'Thursday', value: 3},
            {text: 'Friday', value: 4},
            {text: 'Saturday', value: 5}
          ],
          mode: 'column',
          // weekdays: [],
          recurringDialog: false,
          menu: false,
            colorSection: '#1976D2FF',
            colorMenu: false,
            switch1: true,
            settingsDialog: false,
            titleName: '',
            btnName: '',
            screenHeight: 0,
            selectedSection: '',
            sectionOptions: [],
            sectionProp: [],
            selectedDepartment: '',
            departmentOptions: [],
            hideTextField: 1,
            selectedName: [],
            requestingName: [],
            attendees: [],
            editedIndex: -1,
            dialog: false,
            showBtn: true,
            timeFrom: null,
            timeTo: null,     
            modal: false,
            timeMin: moment().format('07:00'),
            timeMax: moment().format('16:00'),
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
            conferenceRooms: [
              '1ST FACTORY: 3F MEETING ROOM 1',
              '1ST FACTORY: 3F MEETING ROOM 2',
              '1ST FACTORY: 3F MEETING ROOM 3',
              '1ST FACTORY: 3F MEETING ROOM 4',
              '2ND FACTORY: 3F VISITORS',
              '2ND FACTORY: 3F VIP ROOM',
              '2ND FACTORY: 3F MEETING ROOM 1',
              '2ND FACTORY: 3F MEETING ROOM 2',
              '2ND FACTORY: 3F MEETING ROOM 3',
              '2ND FACTORY: 3F MEETING ROOM 4',
              '2ND FACTORY: 3F MEETING ROOM 5',
              '2ND FACTORY: 2F VIP ROOM 8',
              '2ND FACTORY: 2F MEETING ROOM 1',
              '2ND FACTORY: 2F MEETING ROOM 2',
              '2ND FACTORY: 2F MEETING ROOM 3',
              '2ND FACTORY: 2F MEETING ROOM 4',
              '2ND FACTORY: 2F MEETING ROOM 5',
              '2ND FACTORY: 2F MEETING ROOM 6',
              '2ND FACTORY: 2F MEETING ROOM 7',
              '2ND FACTORY: 1F CONF ROOM 4',
              '2ND FACTORY: 1F CONF ROOM 5',
              '2ND FACTORY: 1F WEB MEETING ROOM',
            ],
            selectedDate: moment().format('YYYY-MM-DD'),
            valid: true,
            name: null,
            nameRules: [
                          v => !!v || 'Title is required',
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
        //    #############CALENDAR###############
//================= O B E T ================== //
            schedules: [],
            listSectionColor: '',
            sectionColor: ''
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
    watch: {
     timeRules: 'saveTest'
    },
    computed: {
       swatchStyle() {
      const { listSectionColor, colorMenu } = this
      return {
        backgroundColor: listSectionColor,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: colorMenu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
      }
    },
      isAlreadyJoined(){
        if (this.sched.requestingName.indexOf(this.userInfo.fullName) > -1){
          return true
        }else if (this.sched.selectedName.indexOf(this.userInfo.fullname) > -1){
          return true
        }else{
          return false
        }
      },

      timeRules() {
        const timeRules = []
        if(this.timeMin){
          const rule = v => {
            const format = 'hh:mm'
            let time = moment(v, format),
              beforeTime = moment('05:59:00', format),
              afterTime = moment('16:01:00', format);
            if (!time.isBetween(beforeTime, afterTime)) {
              return 'Around 6:00AM to 4:00PM only.'
            } 
            else {
              return true
            }
          }
          timeRules.push(rule)
        }
        return timeRules
      },
      filteredSections(){
        // let arr = ['A','B','C','D'];
        let sec = this.sectionProp.map(rec => {
          return{
            name: rec.name,
            color: rec.color
          }
        })
        // console.log(sec[])
        for(let i = 0 ; i < sec.length; i++) {
          if(sec[i].color == undefined) {
            
            // Object.assign(sec, {color: '#696969'})
            // sec[i].color = '#696969'
            // this.listSectionColor = '#696969'
          } 
          // else if(sec[i].color && sec[i].name == this.userInfo.section){ 
          //   console.log('SAMPLE@#!OP')
          //   this.listSectionColor = sec[i].color
          //   this.toAdd.sectionColor = this.listSectionColor
          // }
          let str2 = sec[i].name.split(' ').pop()
          let indexLength = sec[i].name.split(' ').pop().length
          let index = sec[i].name.split(' ').map(n => n[0]).join('')
          let indexName = sec[i].name.split(' ')[0]
          let length3 = sec[i].name.split(' ').map(n => n[0]).length
          // console.log(sec[i].name.split(' ').map(n => n[0]).length)
          // console.log(indexName)
          if(index.length == 1){
            let a = sec[i].name.slice(0,4)
            sec[i].name = a
            // arr.push(a)
          } else { 
              if(indexLength < 3 && length3 > 2){
                let str1 = index.slice(0,2)
                let res = str1.concat(str2)
                sec[i].name = res
              } else if (indexLength > 10){
                // console.log(index)
                sec[i].name = index
              } else if(str2 === 'HIROI'){
                let str5 = indexName.slice(0,5)
                let final = str5.concat(' ').concat(str2)
                //  console.log(index)
                sec[i].name = final
              } else if(indexLength > 3) {
                // console.log('try')
                let str3 = index.slice(0,1)
                let str4 = str2.slice(0,1)
                let output = str3.concat(str4)
                sec[i].name = output  
              } 
            // arr.push(index)
              // sec[i].name = index
          }
          //  let getIndex = index.split
        }
        return sec
      },
      filteredSchedules(){
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

       

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth}  ${startYear} - ${suffixMonth}  ${suffixYear}`
          case 'day':
            return `${startMonth} ${startYear}`
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
      this.getFilteredEvent()
      this.getDepartments()
      this.getSections()
    },
    methods: {
      dailyRepeat(startDate, endDate, wkdaily, interval, count){
        const rule = new RRule({
          freq: RRule.DAILY,
          interval: interval,
          count: count,
          byweekday: wkdaily,
          dtstart: new Date(startDate),
          until:  new Date(endDate)
        })
        // let today = moment()
        let dailyDatesMoment = rule.all().map(rec => {
          return rec.toISOString().split('T')[0]
        });
        this.dailyDates = dailyDatesMoment
        console.log(this.dailyDates.length)
        this.recurringDialog = false
        // let tommorrow = moment(startDate).clone().add(1, 'day')
        // console.log(tommorrow)
        // let getStartDate = parseInt(startDate)
        // let toDate = moment(startDate, 'YYYY-MM-DD')
        // let a = moment(startDate);
        // let b = a.clone().add(1, 'd');
        // console.log(b.format('YYYY-MM-DD'))
        // console.log(typeof startDate)
        // let getStartDate = startDate.split('-')
        // let getEndDate = endDate.split('-')
        // let inbetweenDates = ''
        // let listDates = []
        // // console.log(getEndDate[2])
        // let int2String = parseInt(getStartDate[2], 10)
        // console.log(int2String)
        // for(let i = 0 ; i < getEndDate[2]; i++){
        //   if(inbetweenDates != endDate) {
        //     // console.log(startDate)
        //     // let incrementDate = moment(moment(startDate).add(1, 'd'))
        //     let rangeDate = moment(startDate).clone().add(i, 'd').format('YYYY-MM-DD')
        //     console.log(rangeDate)
        //     inbetweenDates = rangeDate
        //     listDates.unshift(rangeDate)
        //     // console.log(toDate.setDate(toDate.getDate() + 1))
        //     // console.log(moment(startDate).add(1,'d'))
        //   }
        // }
        //     console.log(listDates)
      },
      weeklyRepeat(startDate, endDate, interval, wkdy, count){
          const rule = new RRule({
          freq: RRule.WEEKLY,
          interval: interval,
          count: count,
          byweekday: wkdy,
          dtstart: new Date(startDate),
          until:  new Date(endDate)
        })
        // let today = moment()
        let dailyDatesMoment = rule.all().map(rec => {
          return rec.toISOString().split('T')[0]
        });
        this.dailyDates = dailyDatesMoment
        console.log(this.dailyDates)
        this.recurringDialog = false

      },
      monthlyRepeat(startDate, endDate, weekNum ,interval, wkdy, count){
        const rule = new RRule({
          freq: RRule.MONTHLY,
          interval: interval,
          count: count,
          byweekday: wkdy,
          bysetpos: weekNum,
          dtstart: new Date(startDate),
          until:  new Date(endDate)
        })
        // let today = moment()
        let dailyDatesMoment = rule.all().map(rec => {
          return rec.toISOString().split('T')[0]
        });
        this.dailyDates = dailyDatesMoment
        console.log(this.dailyDates)
        this.recurringDialog = false

      },
     getWeekOfMonth(dateToday, dayToday) {
    // let adjustedDate = dateToday + dayToday
    // let prefixes = ['0','1', '2', '3', '4', '5'];
    // return (Math.floor(prefixes[0 | adjustedDate / 7])+1);
    return (Math.ceil((dateToday + 6 - dayToday)/7));
},
      recurringEvents(){
        this.recurringDialog = true
      },
      cancelSettings(){
         this.getSections().then( res => {
            console.debug(res)
            this.toAdd.sectionColor = this.listSectionColor 
            });
        this.colorMenu = false
      },
      openSettingsDialog(){
        this.settingsDialog = true
      },  
        cancelSched(rec,i){
          this.toAdd = Object.assign({},rec)
          this.toAdd.requestingName = rec.requestingName
          console.log(this.filteredSchedules[i].requestingName)
          if(this.filteredSchedules[i].requestingName.indexOf(this.userInfo.fullName) !==-1){
            const index = this.filteredSchedules[i].requestingName.indexOf(this.userInfo.fullName)
            console.log()
            this.toAdd.requestingName.splice(index,1)
            // console.log(this.toAdd.requestingName)
            this.filteredSchedules[i].requestingName = this.toAdd.requestingName
            let url3 = `${this.api}cancelJoining`
            axios.post(url3,this.toAdd).then(res =>{
              console.log(res.data)
              alert('Cancelled!')
               this.filteredSchedules[i]._rev = res.data.rev
            })
          }setTimeout(()=>{
       
           this.showBtn = true
          }, 300)
        },
        joinSched(rec, i){
          if(rec.start < this.date)
          {
            alert('Past date cannot join.')
          }
          else{
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
              alert('Successfully Joined!')
              this.filteredSchedules[i]._rev = res.data.rev
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
              let url = `${this.api}updateRec`
              axios.post(url, this.toAdd).then(res => {
              console.log(res.data)
              alert('Successfully Joined!')
              this.filteredSchedules[i]._rev = res.data.rev
            })  
            }
            else{
              alert('INCLUDED')
            }
              setTimeout(()=>{
            this.toAdd = {}
            this.editedIndex = -1
            this.showBtn = false
          }, 300)
          }
        },
       removeAttendeesList(){
         this.attendees = []
       },       
      getEmpNames() {
              let url = `${this.api}getAttendees/${this.toAdd.selectedDepartment}/section/${this.toAdd.selectedSection}`
              axios.get(url).then(res=> {
                this.attendees = res.data.map(rec => rec.fullName)
              })
      },
      getDefaultGroups() {
        this.selectedDepartment = this.userInfo.department
      },
      getReserver() {
        this.toAdd.selectedName = []
        this.toAdd.selectedName.push(this.userInfo.fullName)
        // console.log(this.selectedName)
      },
      sample(color){  
        
        vue.set(this.toAdd, 'color', color)
        // console.log(this.toAdd)
        // console.log('!!!!!!!!!!!!!!!!!!!')
        // console.log(this.toAdd.color)
      },

        getDepartments(){
          // return new Promise( (resolve, reject) => {
            axios.get(`http://hrdapps48:5031/get/department/${this.selectedDepartment}`).then(res => {
                this.departmentOptions = res.data.map(rec => rec.name)
           
          //  }).catch(err => {
          //   reject(err)
          // })
          })
        },
        saveColor(){
          console.log(this.listSectionColor)
          this.getSections().then(res => {
            this.toAdd.sectionColor = this.listSectionColor
            console.debug(res)
          })
          this.getSchedule()
          this.settingsDialog = false
        },
        saveSettings(colorSec){ 
          // this.toAdd.sectionColor = colorSec
          //  Object.assign(this.schedules[this.editedIndex], this.toAdd)
              // window.location.reload();
          this.colorMenu = false
          return new Promise( (resolve,reject) => {
            axios.all([
              axios.post(`${this.api}post/modify/${this.userInfo.department}/section_color/${this.userInfo.section}`,{color: colorSec}),
              axios.post(`${this.api}post/updateBulkDocs/bySection/${this.userInfo.section}`, {sectionColor:colorSec})
            ]).then(axios.spread( (secRes, updateRes) => {
                  
              resolve(secRes, updateRes)
            })).catch( (secErr, updateErr) => {
              reject(secErr, updateErr)
            })
            // 1. filter need same same section and not same color
            // 2. change section color property
            // 3. update all documents using bulk function
            
            // axios.post(`${this.api}post/modify/${this.userInfo.department}/section_color/${this.userInfo.section}`, {color: colorSec})
            // .then(res=> {
            //   resolve(res)
            //   // console.debug(res)
            // })
            // .catch(err => {
            //   reject(err)
            // })
          })
              
            
        },
        getSections(){
          return new Promise( (resolve, reject) => {
            axios.get(`${this.api}get/department/${this.userInfo.department}/section_option`).then(res => {
              // console.log(this.filteredSchedules)
              console.log(res.data)
              this.sectionOptions = res.data.map(rec => rec.name)
              this.sectionProp = res.data.map(rec => rec)
              // console.log(this.sectionProp)
              for(let i = 0 ; i < res.data.length; i++){
                if(this.userInfo.section == res.data[i].name){
                  if(res.data[i].color == undefined){
                  this.listSectionColor = '#000000'
                  }
                  // this.listSectionColor[res.data[i].name] = res.data[i].color
                  this.listSectionColor = res.data[i].color
                  // break;
                } else if (this.userInfo.department && this.userInfo.designation  && this.userInfo.section == '-' || this.userInfo.section == ''){
                  this.listSectionColor = '#795548FF'
                } 
                else if (!this.userInfo.designation && !this.userInfo.department) {
                  this.listSectionColor = '#696969'
                  break;
                }
              }
              // console.log(this.listSectionColor)
              resolve(true)
            }).catch( err => {
              reject(err)
            })
          })
            
        },
        getFilteredEvent(){
          if(this.switch1 === true){
             this.getSchedule()
             
          }
          else {
            let dep = this.userInfo.department
              let url = `${this.api}scheduler/filterByDepartment/${dep}`;
              axios.get(url).then(res => {
              this.schedules  = res.data
          })
          }
        },
        getSchedule() {
          return new Promise( (resolve, reject) => {
          let dep = this.userInfo.department
          let url = `${this.api}scheduler/viewByDepartment/${dep}`
          axios.get(url).then(res=>{
            this.schedules = res.data
            // console.log(this.schedules)  
          })
              
           .catch(err => {
            reject(err)
          })
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
              this.toAdd.sectionColor = this.listSectionColor
              // console.log(this.toAdd)
              // console.log(this.userInfo)
              console.log(this.dailyDates)
                  if(this.dailyDates !== null){
                      for(let i = 0; i < this.dailyDates.length ; i++){
                        let test = this.dailyDates[i]
                        let toAdd = {}
                        toAdd = Object.assign(toAdd, this.toAdd);
                        toAdd.start = test
                        toAdd.end = test
                        this.schedules.unshift(toAdd)
                        this.schedules.sort((a, b) => 
                        a.start.localeCompare(b.start))
                          let url = `${this.api}saveTest`
                          axios.post(url, toAdd).then(res => {
                          console.log(res.data)
                          // alert(res.data)
                          })
                          //  this.getSchedule()
             this.getSchedule()


                        }
                    } else { 
                      delete this.toAdd.end
                      this.schedules.unshift(this.toAdd)
                      this.schedules.sort((a, b) => 
                      a.start.localeCompare(b.start))
                        let url = `${this.api}saveTest`
                        axios.post(url, this.toAdd).then(res => {
                        console.log(res.data)
                        // alert(res.data)
                        })
                        for(let j = 0; j < 10; j++) {
                              this.getSchedule()
                        }
          
                     
                    }
                             
              }else {
                Object.assign(this.schedules[this.editedIndex], this.toAdd)
                let url1 = `${this.api}updateRec`
                axios.post(url1, this.toAdd).then(res => {
                  console.log(res.data)
                  alert(res.data)
                })

              }
            
            this.closeDialog()
            this.$refs.form.resetValidation()
              //  this.getSchedule().then(res => {
              //                  console.debug(res)
              //                })
          }
         
        },
        editEvent(rec){
          if(rec.start < this.date)
          {
            alert('Past date cannot edit.')
          }
          else{
          this.toAdd.reservedBy = rec.reservedBy
          if(this.toAdd.reservedBy === this.userInfo.fullName){
            this.editedIndex = this.schedules.indexOf(rec)
            this.toAdd = Object.assign({}, rec)
             this.titleName = 'Edit Event'
              this.btnName = 'Update'
             this.toAdd.selectedDepartment = rec.selectedDepartment
            this.toAdd.selectedSection = rec.selectedSection
             this.getSections().then(res => {
               console.log(res.data)
               this.toAdd.colorSection = this.listSectionColor
             })
             this.getEmpNames()
            //  this.toAdd.selectedName = this.userInfo.fullName
            this.dialog = true
            }
            else{
              alert('Only the reserver can edit')
            }
          }
        },
        deleteEvent(rec){
           if(rec.start < this.date)
          {
            alert('Past date cannot delete.')
          }
          else{
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
          } 
        },
        // *********************************************
        addSched({date, year, month, day, weekday}){
        this.todayNow = day
        this.yearNow = year;
        this.monthNow = month;
        this.weekDayNow = weekday;
        this.monthlyOpsDefault = this.getWeekOfMonth(day, weekday)
        // console.log(this.start)
            if(this.date <= date)
            {
            this.toAdd.end = this.end.date
            this.toAdd.start = date
            this.dialog = true
            this.titleName = 'New Event'
            this.btnName = 'Save'
            this.toAdd.selectedDepartment = this.userInfo.department
            this.toAdd.selectedSection = this.userInfo.section.toUpperCase()
            this.toAdd.venue = this.conferenceRooms[this.conferenceRooms.length-3]
            this.sample('red')
          
            this.getEmpNames()
            this.getReserver()
            this.getSections().then( res => {
            console.debug(res)
            this.toAdd.sectionColor = this.listSectionColor 
            });
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
        // console.log(event)
        return event.sectionColor
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
      //  showEvent ({ nativeEvent, event }) {
      //   const open = () => {
      //     this.selectedEvent = event
      //     this.selectedElement = nativeEvent.target
      //     setTimeout(() => this.selectedOpen = true, 10)
      //   }
      //   if (this.selectedOpen) {
      //     this.selectedOpen = false
      //     setTimeout(open, 10)
      //   } else {
      //     open()
      //   }
      //   nativeEvent.stopPropagation()
      // },
       updateRange ({ start, end }) {
         if(!this.month){
         this.$refs.calendar.scrollToTime('06:58')
         }
        this.start = start
        this.end = end
      
      },
    },
  }
</script>
<style >
.compact-form {
    transform: scale(0.800);
}
.disable-events{
  pointer-events: none
}
.tile {
    margin: 5px;
    border-radius: 4px;
  }
  .tile:hover {
    background: green;
  }
  .tile:active {
    background: yellow;
  }
  div.v-select-list div[role=list] div[role=listitem]:hover {
    background-color:#00857A;
  }

</style>