<template>
    <v-container pa-0 fluid>
        <v-toolbar dense flat color="white">
                <v-flex pt-2 pr-2 xs2>
                    <v-text-field v-model="searchOfficialDocument" append-icon="search" placeholder="Search Document"></v-text-field>
                </v-flex>
                <v-flex pt-2 pr-2 xs2>
                    <v-select
                    v-model="selectedDocumentType"
                    :items="requestTypeOptions"
                    label="Document Type"
                    ></v-select>
                </v-flex>
                <v-flex pt-2 pr-2 xs2>
                    <v-select
                    @change="onChangeDocumentDepartmentDocument()"
                    v-model="selectedDocumentDepartment"
                    :items="departmentOptions"
                    label="Department"
                    ></v-select>
                </v-flex>
                <v-flex pt-2 pr-2 xs2>
                    <v-text-field v-model="sectionDocs" append-icon="search" placeholder="Search Section"></v-text-field>
                    <!-- <v-select :items="sectionOptions" v-model="sectionDocs" label="Section"> -->

                    <!-- </v-select> -->
                </v-flex>
                <v-flex pt-2 pr-2 xs2>
                    <v-text-field v-model="teamDocs" append-icon="search" placeholder="Search Team"></v-text-field>
                    <!-- <v-select :items="teamOptions" v-model="teamDocs" label="Team"> -->

                    <!-- </v-select> -->
                </v-flex>
                <v-spacer></v-spacer>
                <!-- <v-btn @click="test">test</v-btn> -->
                    <download-excel  class="pt-2"
                        :data="filteredDocumentType">
                        <v-icon @click="alert('download complete')">cloud_download</v-icon>
                    </download-excel>
        </v-toolbar>
        <v-data-table dense
        :headers="officialDocumentHeaders"
        :items="filteredDocumentType"
        :search="searchOfficialDocument">
            <template v-slot:body="{ items }">
                <tbody>
                    <tr v-for="(item, i) in items" :key="i+'a'">
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn small @click="onViewDocumentInformation(item)" v-on="on" icon>
                                        <v-icon right color="indigo lighten-1">mdi-card-search</v-icon>
                                    <v-icon color="secondary"></v-icon>
                                    </v-btn>
                                </template>
                                
                                <span>View document</span>
                            </v-tooltip>
                            <template v-if="userInfo.newRights.documentController || isDocumentMasterMaintenance || isNoStamp(item.request_type)">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" slot="activator" @click="pdfTab(item)" color="pink accent-2">print</v-icon>
                                    </template>
                                    <span>Print or download</span>
                                </v-tooltip>
                            </template>
                        </td>
                        <td class="caption">{{item.document_control_code}}</td>
                        <td class="caption">{{item.document_title}}</td>
                        <td class="caption">{{item.section}}</td>
                        <td class="caption">{{item.team}}</td>
                        <!-- <td>{{item.request_type}}</td> -->
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogViewDocumentInfo" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-if="dialogViewDocumentInfo">
                <view-document-detail :closeDialog="onCloseDialogViewDocumentInfo"/>
            </template>
        </v-dialog>
    </v-container>
</template>

<script>
import ViewDocumentDetail from '@/components/ViewDocumentDetail.vue'
import axios from 'axios'

export default{
    data () {
        return{
            latestDocument: [],
            selectedDocumentDepartment: '',
            sectionDocs: '',
            teamDocs: '',
            departmentOptions: [],
            searchOfficialDocument: '',
            selectedDocumentType: 'Work Instruction',
            officialDocumentHeaders: [
                { text: 'Action', value: 'documents', sortable: false,},
                { 
                    text: 'Document Code', 
                    value: 'document_control_code'
                },
                { text: 'Document title', value: 'document_title' },
                { text: 'Section', value: 'section' },
                { text: 'Team', value: 'team' },
                // { text: 'Request type', value: 'request_type' },
                
            ],
            dialogViewDocumentInfo: false
            
        }
    },
    components: {
        ViewDocumentDetail
    },
    computed: {
        requestTypeOptions() {
            let myArray =  this.latestDocument.map(item => {
                return item.request_type
            })
            return [...new Set(myArray)];
        },
        filteredDocumentType() {
            return this.latestDocument.filter(item => {
                return item.request_type == this.selectedDocumentType &&
                item.section.toLowerCase().includes(this.sectionDocs.toLowerCase()) &&
                item.team.toLowerCase().includes(this.teamDocs.toLowerCase())
            })
        }
    },
    methods: {
        onCloseDialogViewDocumentInfo(){
            this.dialogViewDocumentInfo = false
        },
        isNoStamp(val) {
            // return this.noStamp.includes(val)
            if(val === 'Minutes of the Meeting'){
                return true
            }else{
                return false
            }
        },
        onViewDocumentInformation(val) {
            console.log(val)
            this.dialogViewDocumentInfo = true
            this.onChangeDocumentView(val)
        },
        onChangeDocumentDepartmentDocument() {
            this.getDepartmentLatestDocument(this.selectedDocumentDepartment)
        },
        getDepartmentLatestDocument(val) {
            let url = `${this.api}get/document/latest/${val}`
            axios.get(url).then(res => {
                this.latestDocument = res.data
            })
        },
        getDepartmentOptions() {
            let url2 = `${this.api}get/department/options`
            axios.get(url2).then(res => {
                let data = []
                if(this.isDocumentMasterMaintenance){
                    data = res.data.map(rec => rec.name)
                }else{
                    data = res.data.filter(rec =>{
                        return rec.group != 'SUPPORT' && rec.group != 'X'
                    }).map(rec => rec.name)
                    
                }
                
                this.departmentOptions = data
            })
        }
    },
    created() {
        this.selectedDocumentDepartment = this.userInfo.department
        this.getDepartmentLatestDocument(this.userInfo.department)
        this.getDepartmentOptions()
        
    }
    
}
</script>