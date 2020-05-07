<template>
    <v-container pa-0 fluid>
        <v-toolbar flat color="white">
            <v-layout row wrap>
                <v-flex pt-4 pr-2 xs2>
                    <v-text-field v-model="searchOfficialDocument" append-icon="search" placeholder="Search Document"></v-text-field>
                </v-flex>
                <v-flex pt-4 pr-2 xs2>
                    <v-select
                    v-model="selectedDocumentType"
                    :items="requestTypeOptions"
                    label="Document Type"
                    ></v-select>
                </v-flex>
                <v-flex v-if="isDocumentMasterMaintenance" pt-4 pr-2 xs2>
                    <v-select
                    @change="onChangeDocumentDepartmentDocument()"
                    v-model="selectedDocumentDepartment"
                    :items="departmentOptions"
                    label="Department"
                    ></v-select>
                </v-flex>
                <v-flex pt-4 pr-2 xs2>
                    <v-text-field v-model="sectionDocs" append-icon="search" placeholder="Search Section"></v-text-field>                   
                </v-flex>
                <v-flex pt-4 pr-2 xs2>
                    <v-text-field v-model="teamDocs" append-icon="search" placeholder="Search Team"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                    <download-excel  class="pt-4"
                        :data="filteredDocumentType">
                        <v-icon @click="alert('download complete')">cloud_download</v-icon>
                    </download-excel>
            </v-layout>
        </v-toolbar>
        <v-data-table dense
        :headers="officialDocumentHeaders"
        :items="filteredDocumentType"
        :search="searchOfficialDocument">
            <template v-slot:body="{items}">
                <tbody>
                    <tr v-for="(item, i) in items" :key="i+'a'">
                        <td>
                            <v-icon @click="onUpdateRequestSheet(item , i)" color="indigo lighten-1">settings</v-icon>
                        </td>
                        <td class="caption">{{item.docnumber}}</td>
                        <td class="caption">{{item.revnumber}}</td>
                        <td class="caption">{{item.islatest}}</td>
                        <!-- <td>{{item.document_title}}</td> -->
                        <td class="caption">{{item.section}}</td>
                        <td class="caption">{{item.team}}</td>
                        <td class="caption">{{item.request_type}}</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <v-bottom-sheet v-model="updateRequestSheet">
            <v-card height="700">
                
                <v-toolbar flat color="white">
                    <v-toolbar-title>Department: {{toRequest.department}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-icon 
                    @click="toNotLatest()" 
                    v-if="isDocumentMasterMaintenance && toRequest.islatest === 'LATEST'">report_off
                    </v-icon>
                    <v-icon 
                    @click="isDisabledDocsDetail = !isDisabledDocsDetail" 
                    v-if="isDocumentMasterMaintenance || userInfo.newRights.documentController">edit
                    </v-icon>
                    <v-icon @click="closeUpdateRequestSheet()">close</v-icon>
                </v-toolbar>
                <v-layout pa-4 row wrap>
                    <v-flex pa-2 xs4>
                        <v-select :disabled="isDisabledDocsDetail" v-model="toRequest.section" label="Section" :items="selectOption.section_name_options"></v-select>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-select :disabled="isDisabledDocsDetail" v-model="toRequest.team" label="Team" :items="selectOption.team_name_options"></v-select>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toRequest.document_copy" disabled label="Document Copy" :items="selectOption.document_copy"></v-select>
                    </v-flex>

                    <v-flex pa-2 xs4>
                        <v-select v-model="toRequest.request_type" disabled label="Request Type" :rules="[docRules.required]" :items="selectOption.request_type"></v-select>
                    </v-flex>

                    <v-flex pa-2 xs4><!-- ongoing -->
                        <v-text-field disabled
                        v-model="toRequest.document_control_code" 
                        label="Document Control Code" 
                        @blur="checkDocIsExist(toRequest.document_control_code)"
                        :rules="[docRules.required, docRules.docCode]">
                        </v-text-field>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-text-field :disabled="isDisabledDocsDetail"
                        v-model="toRequest.document_title" 
                        label="Document Title"
                        :rules="[docRules.required]">
                        </v-text-field>
                    </v-flex>
                    <v-flex pa-2 xs12>
                        <v-text-field :disabled="isDisabledDocsDetail" v-model="toRequest.remarks" label="Details or Remarks(if with)"></v-text-field>
                    </v-flex>
                    
                    
                    <template v-if="unHideDetails">
                        <v-flex pa-2 xs3>
                            <v-select  v-model="toRequest.islatest" label="Is Latest" :disabled="isDisabledDocsDetail" :items="isLatestSelect"></v-select>
                        </v-flex>
                        <v-flex pa-2 xs3>
                            <v-text-field disabled
                            v-model="toRequest.fullname" 
                            label="Requestor">
                            </v-text-field>
                        </v-flex>
                        <v-flex pa-2 xs3>
                            <v-text-field disabled
                            v-model="toRequest.request_date" 
                            label="Requested date">
                            </v-text-field>
                        </v-flex>
                        <v-flex pa-2 xs3>
                            <v-text-field disabled
                            v-model="toRequest.s_date" 
                            label="Stamp date">
                            </v-text-field>
                        </v-flex>
                    </template>
                    

                    <template v-if="actionTitle != ''">
                        <v-layout row wrap>
                            <v-flex xs4 offset-xs4>
                                <h1>{{actionTitle}}</h1>
                            </v-flex>
                        </v-layout>
                    </template>

                    <v-flex xs12 v-if="needNewAttachment">
                        <input 
                        style="display: none" 
                        type="file" id="files"
                        ref="files" 
                        accept=".xls,.xlsx,.pdf,.ods"
                        multiple
                        v-on:change="handleFilesUpload()"/>
                        <v-btn outline round @click="$refs.files.click()">Browse File</v-btn>
                        <template v-if="file1">{{file1}} <span v-if="file2">and</span> {{file2}}</template>
                    </v-flex>
                    

                    <!-- ongoing -->
                    
                    <template v-if="userInfo.newRights.documentController || isDocumentMasterMaintenance">
                        <v-btn v-if="!isOnAction" @click="pdfTab(toRequest)">official pdf</v-btn>
                        <v-btn v-if="!isOnAction" @click="pdfTabNoStamp(toRequest)">original pdf</v-btn>
                        <v-btn v-if="!isOnAction" @click="xlsDownload(toRequest)">download xls</v-btn>
                        <v-btn v-if="toRequest.islatest == 'LATEST' && !isOnAction" @click="onRevise()">revise</v-btn>
                        <v-btn v-if="toRequest.islatest == 'LATEST' && !isOnAction" @click="onObsolete()">obsolete</v-btn>
                    </template>
                    
                    <v-spacer></v-spacer>
                    <v-btn  color="primary" v-if="userInfo.newRights.documentController || isDocumentMasterMaintenance" @click="needNewAttachment? submitFiles():submit()">save</v-btn>
                    <v-btn color="warning" @click="closeUpdateRequestSheet()">cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn  color="error" v-if="isDocumentMasterMaintenance" @click="deleteDocument(toRequest)">delete</v-btn>
                </v-layout>
                
            </v-card>
        </v-bottom-sheet>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data() {
        return{
            allDocs: [],
            sectionDocs: '',
            teamDocs: '',
            isDisabledDocsDetail: true,
            isTitleDisabled: true,
            updateRequestSheet: false,
            needNewAttachment: false,
            unHideDetails: true,
            isOnAction: false,
            toRequest: {},
            docIndex: -1,
            files: '',
            file1: '',
            file2: '',
            actionTitle: '',
            selectedDocumentDepartment: '',
            departmentOptions: [],
            isLatestSelect: ['LATEST', 'NOT LATEST'],
            searchOfficialDocument: '',
            selectedDocumentType: 'Work Instruction',
            noStamp: ['Form', 'Checklist', 'Circular Notice', 'Risk Registry', 'Minutes of the Meeting'],
            controlledCopy: ['Work Guide', 'Reference', 'Job Description', 'Department Manual', 'Quality Manual', 'Quality Policy', 'Quality Plan'],
            officialDocumentHeaders: [
                { text: 'Action', value: 'documents'},
                { 
                    text: 'Document Number', 
                    value: 'docnumber',
                },
                { 
                    text: 'Rev #', 
                    value: 'revnumber',
                },
                { 
                    text: 'Is Latest', 
                    value: 'islatest',
                },
                // { text: 'Document title', value: 'document_title' },
                { text: 'Section', value: 'section' },
                { text: 'Team', value: 'team' },
                { text: 'Request type', value: 'request_type' },
                
            ],
            docRules: {
                required: value => !!value || 'Required.', // field is required
                docCode: val => /^[A-Z0-9]{3,4}-[A-Z]{1}[0-9]{3}-[0-9]{2}$/.test(val)  || 'Pattern must be = AAAA-TNNN-00 or AAA-TNNN-00 (*A = text or number, T = text, N = number)'
            },
        }
    },
    created() {
        this.selectedDocumentDepartment = this.userInfo.department
        this.getDepartmentAllDocument(this.selectedDocumentDepartment)
        this.getDepartmentOptions()
        this.getSection(this.selectedDocumentDepartment)
        this.getThisOptions('document_copy')
        this.getThisOptions('request_type')
    },
    watch: {
        'toRequest.section'(newVal){
            this.getTeam(this.selectedDocumentDepartment, newVal)
        },
        updateRequestSheet(val){
            if(val == false){
                this.closeUpdateRequestSheet()
            }
        }
    },
    computed: {
        requestTypeOptions() {
            let myArray =  this.allDocs.map(item => {
                return item.request_type
            })
            return [...new Set(myArray)];
        },
        filteredDocumentType() {
            return this.allDocs.filter(item => {
                return item.request_type == this.selectedDocumentType &&
                item.section.toLowerCase().includes(this.sectionDocs.toLowerCase()) &&
                item.team.toLowerCase().includes(this.teamDocs.toLowerCase())
                
            })
        }
    },
    methods:{
        toNotLatest() {
            let url = `${this.api}document/notlatest`
            axios.post(url, {id: this.toRequest._id}).then(res => {
                this.toRequest.islatest = 'NOT LATEST'
                console.log(res.data)
                this.closeUpdateRequestSheet()
            })
        },
        getDepartmentAllDocument(val) {
            let url = `${this.api}get/document/history/${val}`
            axios.get(url).then(res => {
                this.allDocs = res.data
            })
        },
        onChangeDocumentDepartmentDocument() {
            this.getDepartmentAllDocument(this.selectedDocumentDepartment)
        },
        onUpdateRequestSheet(val, i){
            this.docIndex = i
            this.toRequest = val
            this.updateRequestSheet = true
        },
        closeUpdateRequestSheet() {
            this.updateRequestSheet = false
            this.toRequest = {}
            this.docIndex = -1
            this.needNewAttachment = false
            this.isDisabledDocsDetail = true
            this.isTitleDisabled = true
            this.isOnAction = false
            this.actionTitle = ''
            this.files = ''
            this.file1 = ''
            this.file2 = ''
        },
        // ongoing******************
        onObsolete() {
            this.actionTitle = 'Obsoletion'
            this.isOnAction = true
            this.unHideDetails = false
            this.toRequest.prev_id = this.toRequest._id
            this.toRequest.status = 'for approval'
            this.toRequest.docnumber = this.toRequest.document_control_code.replace(/-[^/-]+$/, "")
            this.toRequest.revnumber = this.toRequest.document_control_code.split('-').pop()
            this.toRequest.request_date = moment().format("YYYY/MM/DD");
            this.toRequest.nature_of_request = 'Obsoletion'
            this.toRequest.version = 2
            delete this.toRequest._id
            delete this.toRequest._rev
            this.isDisabledDocsDetail = false
            // this.isTitleDisabled = false
            this.needNewAttachment = true
            // let r = confirm(`Are you sure you want to obsolete this ${this.toRequest.document_control_code} document?`);
            // if(r == true){
            //     this.toRequest.prev_id = this.toRequest._id
            //     this.toRequest.status = 'for approval'
            //     this.toRequest.request_date = moment().format("YYYY/MM/DD");
            //     this.toRequest.id_number = this.userInfo.employeeCode
            //     this.toRequest.fullname = this.userInfo.fullName
            //     this.toRequest.version = 2
            //     this.toRequest.nature_of_request = 'Obsoletion'
            //     delete this.toRequest._id
            //     delete this.toRequest._rev
            //     this.needNewAttachment = true
            //     // this.submit()
            // }
            
        },
        onRevise() {//ongoing
            this.actionTitle = 'Revision'
            this.isOnAction = true
            this.unHideDetails = false
            this.toRequest.prev_id = this.toRequest._id
            this.toRequest.status = 'for approval'
            if(!this.toRequest.request_type){
                this.toRequest.document_copy = ''
            }else if(this.controlledCopy.includes(this.toRequest.request_type)){
                this.toRequest.document_copy = 'Controlled'
            }else if(this.noStamp.includes(this.toRequest.request_type)){
                this.toRequest.document_copy = ''
            }else{
                this.toRequest.document_copy = 'Uncontrolled'
            }
            let separator = ''
            if((parseInt(this.toRequest.document_control_code.split('-').pop()) + 1) < 10){
                separator = '-0'
            }else{
                separator = '-'
            }
            //-${parseInt(this.toRequest.document_control_code.split('-').pop()) + 1}
            this.toRequest.document_control_code = `${this.toRequest.document_control_code.replace(/-[^/-]+$/, "")}${separator}${parseInt(this.toRequest.document_control_code.split('-').pop()) + 1}`
            this.toRequest.docnumber = this.toRequest.document_control_code.replace(/-[^/-]+$/, "")
            this.toRequest.revnumber = this.toRequest.document_control_code.split('-').pop()
            this.toRequest.request_date = moment().format("YYYY/MM/DD");
            this.toRequest.nature_of_request = 'Revision'
            this.toRequest.version = 2
            delete this.toRequest._id
            delete this.toRequest._rev
            this.isDisabledDocsDetail = false
            this.isTitleDisabled = false
            this.needNewAttachment = true
        },
        handleFilesUpload(){
            if(this.actionTitle === 'Obsoletion'){
                if(this.$refs.files.files.length === 1){
                    this.files = this.$refs.files.files;
                    this.file1 = this.files[0].name
                }else{
                    alert('You must upload 1 file pdf.')
                }
            }else{
                if(
                    this.$refs.files.files.length === 2 && 
                    (this.$refs.files.files[0].name.split('.').pop() === 'pdf' || this.$refs.files.files[1].name.split('.').pop() === 'pdf') &&
                    (
                        (this.$refs.files.files[1].name.split('.').pop() === 'xls' || this.$refs.files.files[1].name.split('.').pop() === 'xlsx') 
                        || (this.$refs.files.files[0].name.split('.').pop() === 'xls' || this.$refs.files.files[0].name.split('.').pop() === 'xlsx')
                    )
                ){
                    this.files = this.$refs.files.files;
                    this.file1 = this.files[0].name
                    this.file2 =this.files[1].name
                }else{
                    alert('You must upload 2 files. \n1 pdf file and 1 xls/ods/xlsx file')
                }
            }
            
        },
        submit() {
            let r = confirm(`Are you sure you want to save changes for ${this.toRequest.document_control_code} document?`);
            if(r == true){
                let url =  `${this.api}update/doc/record`
                axios.post(url, this.toRequest).then(res => {
                    if(this.toRequest._id){
                        this.toRequest._id = res.data.id
                        this.toRequest._rev = res.data.rev

                        this.filteredDocumentType.splice(this.docIndex, 1, this.toRequest)
                    }
                    alert('Saved successfullytest!')
                    this.closeUpdateRequestSheet()
                })
            }
        },
        submitFiles(){
            if(this.toRequest.document_control_code
                && this.toRequest.document_title
                && this.toRequest.nature_of_request
                ){
                    // if(this.files.length == 2){
                        let formData = new FormData();
                        let url = `${this.api}add/request/document`
                        this.toRequest.id_number = this.userInfo.employeeCode
                        this.toRequest.fullname = this.userInfo.fullName
                        if(this.toRequest.request_type === 'Minutes of the Meeting'){
                            // console.log('here')
                            this.toRequest.status = 'ok'
                            this.toRequest.s_date = moment().format("YYYY/MM/DD");
                        }else{
                            // console.log('else')
                            for( var i = 0; i < this.files.length; i++ ){
                                let file = this.files[i];
                                if(file.name.split('.').pop() != 'pdf'){
                                    this.toRequest.filename = file.name
                                }
                            }
                        }
                        formData.append('toRequest', JSON.stringify(this.toRequest))
                        for( var j = 0; j < this.files.length; j++ ){
                            let file = this.files[j];
                            formData.append('files[]', file);
                        }
                        
                        axios.post(url, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                dataType: 'json',
                            }
                        }).then((res) => {
                            let failed = 'Saving Faled! \n Document code already exist.'
                            let succeed = 'Successfully Saved!'
                            
                            if(res.data != 'failed'){
                                alert(succeed)
                                this.toRequest = {}
                                this.docIndex = -1
                                this.closeUpdateRequestSheet()
                                this.toRequest._rev = res.data.rev
                                this.filteredDocumentType.splice(this.docIndex, 1, this.toRequest)
                            }else{
                                alert(failed)
                            }
                        }).catch((err) => {
                            console.log(err.message)
                        })
                    // }else{
                    //     alert('Upload 1 pdf file and 1 ods or xls or xls or xlsx')
                    // }
                }else{
                    alert('Please complete the required fields.')
                }
        },
        deleteDocument(val) {
            let r = confirm(`Are you sure you want to save changes for ${val.document_control_code} document?`);
            if(r == true){
                let url = `${this.api}delete/document`
                axios.post(url, val).then(res => {
                    alert(res.data)
                    this.selectedDocumentType = 'Work Instruction'
                    this.filteredDocumentType.splice(this.docIndex, 1)
                    this.closeUpdateRequestSheet()
                })
            }
            
        }
    }
}
</script>