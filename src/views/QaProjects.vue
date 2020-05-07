<template>
    <v-container fluid pa-0>
        ongoing
    </v-container>
</template>

<script>
// import axios from 'axios'

export default {
    data() {
        return {
            qaProjectsData: [],
            qaProjectsDataHeaders: [

            ]
        }
    },
    mounted() {
        // let url = `${this.api}qa_projects/list`
        // axios.get(url).then(res => {
        //     this.qaProjectsData = res.data
        // })
    }
}
</script>