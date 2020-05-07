<template>
    <v-container fluid pa-0>
        <v-data-table dense
            :headers="headersData"
            :items="data"
            :items-per-page="10"
            class="elevation-1"
        >
            <template v-slot:item.action="{item}">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn @click="stampDocs(item)" v-on="on" icon>
                            <v-icon color="red accent-3">mdi-stamper</v-icon>
                        </v-btn>
                    </template>
                    <span>Stamp</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn @click="showDetails(item.document_control_code)" v-on="on" icon>
                            <v-icon color="blue lighten-3">mdi-file-document-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Details</span>
                </v-tooltip>
                
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            data: [],
            headersData: [
                {text: 'Code', value: 'document_control_code'},
                {text: 'Request Type', value: 'request_type'},
                {text: 'Title', value: 'document_title'},
                {text: 'department', value: 'department'},
                {text: 'Request Date', value: 'request_date'},
                {text: 'Due Date', value: 'due_date'},
                {text: 'Action', value: 'action'}
            ]
        }
    },
    mounted(){
        this.getForStamping()
    },
    methods: {
        getForStamping(){
            let url = `${this.api}stamping/document`
            axios.get(url).then(res => {
                this.data = res.data
            })
        },
        stampDocs(val){
            let url = `${this.api}stamping/document`
            axios.post(url, val).then(res => {
                // this.data = res.data
                console.log(res.data)
            })
            // console.log(`stamp function for ${val}`)
        },
        showDetails(val){
            console.log(`show details function for ${val}`)
        }
    }
}

</script>