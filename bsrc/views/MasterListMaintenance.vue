<template>
    <v-container fluid pa-0>
        <!-- <v-toolbar dense flat>
            <v-btn outlined rounded
            :color="activeGroupPage == 'users' ? 'indigo lighten-1': 'black'" 
            @click="onChooseGroupPage('users')">
                Users
            </v-btn>
            <v-btn outlined rounded
            :color="activeGroupPage == 'department' ? 'indigo lighten-1': 'black'" 
            @click="onChooseGroupPage('department')">
                HRD Department
            </v-btn>
        </v-toolbar>
        <v-divider></v-divider> -->
        <div v-if="activeGroupPage == 'department'">
            <department-design :depPage="onChooseUsers"/>
        </div>
        <div v-if="activeGroupPage == 'users'">
            <users-design :userPage="onChooseDep"/>
        </div>
    </v-container>
</template>

<script>
import DepartmentDesign from '@/components/DepartmentDesign.vue'
import UsersDesign from '@/components/UserDesign.vue'

export default {
    data () {
        return{
            a: 'hi delo',
            activeGroupPage: 'users'
        }
    },
    components: {
        DepartmentDesign,
        UsersDesign
    },
    methods: {
        onChooseDep(){
            this.onChooseGroupPage('department')
        },
        onChooseUsers(){
            this.onChooseGroupPage('users')
        },
        onChooseGroupPage(val) {
            this.activeGroupPage = val
        }
    }
    
}
</script>
