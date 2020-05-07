<template>
    <v-container fluid pa-0>
        <!-- {{inactiveData}} -->
        <v-data-table dense
            :headers="inactiveDataHeaders"
            :items="inactiveData"
            :items-per-page="10"
            :search="searchStaff"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>In Active Staff</v-toolbar-title>
                    <v-text-field class="pl-4 pt-4" v-model="searchStaff" label="Search Staff"></v-text-field>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
                <v-btn v-if="checkIsLeader(userInfo.designation)" small icon @click="edit(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                <v-btn v-else small icon><v-icon small>mdi-sync-off</v-icon></v-btn>
            </template>
        </v-data-table>
        <v-dialog width="500" v-model="editDialog">
            <v-card>
                <v-container fluid pa-2>
                    <v-card-title>
                    <span class="subtitle-1">Edit {{toEdit.full_name}} Status</span>
                </v-card-title>
                <v-select
                :items="statusOptions"
                label="Status"
                v-model="toEdit.eStatus"
                ></v-select>
                <v-btn @click="saveEmployeeStatus()" block>Save</v-btn>
                </v-container>
            </v-card>
            
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'

export default{
    data() {
        return{
            inactiveData: [],
            editDialog: false,
            statusOptions: [],
            searchStaff: '',
            toEdit: {},
            inactiveDataHeaders: [
                {text: 'Full Name', value: 'full_name'},
                {text: 'Section', value: 'section'},
                {text: 'Team', value: 'team'},
                {text: 'Status', value: 'eStatus'},
                {text: 'Edit', value: 'action'}
            ]
        }
    },
    methods: {
        saveEmployeeStatus(){
            axios.post(`${this.api}update/masterlist`, this.toEdit).then(res => {
                console.log(res.data)
            })
        },
        edit(val){
            this.editDialog = true
            this.toEdit = val
            axios.get(`${this.api}get/available_options`).then(res => {
                this.statusOptions = res.data.eStatus
            })
            console.log(val)
        }
    },
    created() {
        let url = `${this.api}get/inActiveStaff/${this.userInfo.department}`
        axios.get(url).then(res => {
            console.log(res.data)
            this.inactiveData = res.data
        })
    }
}
</script>