<template>
    <v-container fluid pa-2>
        <v-data-table
            fixed-header
            :headers="usersHeaders"
            :items="usersData"
            :items-per-page="5"
            class="elevation-1"
        ></v-data-table>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return{
            msg: 'test',
            usersData: [],
            usersHeaders: [
                { text: 'employeeCode', value: 'employeeCode' },
                { text: 'fullName', value: 'fullName' },
                { text: 'department', value: 'department' },
                { text: 'section', value: 'section' },
                { text: 'team', value: 'team' },
                { text: 'designation', value: 'designation' },
            ]
        }
    },
    created(){
        this.loadUsers()
    },
    methods:{
        loadUsers(){
            let url = `http://hrdapps48:5031/get/staff_basic_info/department/QA/section/SOFTWARE%20DEVELOPMENT%202/team/IN-HOUSE%20SYSTEM%20DEVELOPMENT%204`
            axios.get(url).then(res => {
                this.usersData = res.data
            })
        }
    }
}
</script>