<template>
    <v-container pa-0 fluid>
        <v-toolbar flat color="white">
            <v-layout row wrap>
                <v-flex xs4 pl-2>
                    <v-text-field v-model="searchDocRequest" append-icon="search" placeholder="Search Document Request"></v-text-field>
                </v-flex>
                <v-flex xs4 pl-2>
                    <v-select @change="getDocumentRequest()" v-model="statusRequest" :items="statusRequestOptions" label="status"></v-select>
                </v-flex>
            </v-layout>
            <v-spacer></v-spacer>
            <v-btn v-if="userInfo.newRights.documentController || isDocumentMasterMaintenance" @click="documentRequestSheet = true" outlined rounded>new request</v-btn>
        </v-toolbar>
        <v-data-table dense
        :headers="reqDocHeaders"
        :items="requestList"
        class="elevation-1"
        :search="searchDocRequest">
            <template v-slot:body="{items}">
                <tbody>
                    <tr v-for="(item, i) in items" :key="i + 'a'">
                        <td>
                            <template v-if="statusRequest == 'for approval'">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-if="isDhShJa || isDocumentMasterMaintenance" 
                                        v-on="on" 
                                        color="pink accent-2" @click="approveDocs(item)">thumb_up_alt</v-icon>
                                    </template>
                                    <span>approve request</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" slot="activator" @click="editDocsRequest(item)">edit</v-icon>
                                    </template>
                                    <span>preview pdf</span>
                                </v-tooltip>
                            </template>
                        </td>
                        <td class="caption">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon v-on="on"  @click="pdfTabNoStamp(item)" color="red accent-4">picture_as_pdf</v-icon>
                                </template>
                                <span>preview pdf</span>
                            </v-tooltip>
                            {{ item.document_control_code}}
                        </td>
                        <td class="caption">{{ item.section}}</td>
                        <td class="caption">{{ item.team}}</td>
                        <td class="caption">{{ item.document_copy}}</td>
                        <td class="caption">{{ item.request_type}}</td>
                        <!-- <td class="caption">{{ item.document_title}}</td> -->
                        <td class="caption">{{ item.nature_of_request}}</td>
                    </tr>
                </tbody>
            </template>
            <!-- <template v-slot:items="props">
                <td>
                    <template v-if="statusRequest == 'for approval'">
                        <v-tooltip bottom>
                            <v-icon v-if="isDhShJa || isDocumentMasterMaintenance" 
                            slot="activator" 
                            color="pink accent-2" @click="approveDocs(props.item)">thumb_up_alt</v-icon>
                            <span>approve request</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <v-icon slot="activator" @click="editDocsRequest(props.item)">edit</v-icon>
                            <span>preview pdf</span>
                        </v-tooltip>
                    </template>
                </td>
                <td>
                    {{ props.item.document_control_code}}
                    <v-tooltip bottom>
                        <v-icon slot="activator" @click="pdfTabNoStamp(props.item)" color="red accent-4">picture_as_pdf</v-icon>
                        <span>preview pdf</span>
                    </v-tooltip>
                    
                </td>
                <td>{{ props.item.section}}</td>
                <td>{{ props.item.team}}</td>
                <td>{{ props.item.document_copy}}</td>
                <td>{{ props.item.request_type}}</td>
                <td>{{ props.item.document_title}}</td>
                <td>{{ props.item.nature_of_request}}</td>
            </template> -->
        </v-data-table>
        <!-- <span>{{requestList}}</span> -->
        
        <!-- add request sheet -->

        <v-bottom-sheet v-model="documentRequestSheet">
            <v-form
                ref="form"
                v-model="validA"
                lazy-validation
            >
            <v-card height="500">
                
                <v-toolbar flat color="white">
                    <v-subheader>Department: {{userInfo.department}}</v-subheader>
                    <v-spacer></v-spacer>
                    <v-icon @click="documentRequestSheet = false">minimize</v-icon>
                </v-toolbar>
                <v-layout pa-4 row wrap>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toRequest.section" label="Section" :items="selectOption.section_name_options"></v-select>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toRequest.team" label="Team" :items="selectOption.team_name_options"></v-select>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toRequest.document_copy" disabled label="Document Copy" :items="selectOption.document_copy"></v-select>
                    </v-flex>

                    <v-flex pa-2 xs4>
                        <v-select v-model="toRequest.request_type" @change="changeDocCopy('toRequest')" label="Request Type" :rules="[docRules.required]" :items="selectOption.request_type"></v-select>
                    </v-flex>

                    <v-flex pa-2 xs4>
                        <v-text-field 
                        v-model="toRequest.document_control_code" 
                        label="Document Control Code" 
                        @blur="checkDocIsExist(toRequest.document_control_code)"
                        :rules="[docRules.required, docRules.docCode]">
                        </v-text-field>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-text-field 
                        v-model="toRequest.document_title" 
                        label="Document Title"
                        :rules="[docRules.required]">
                        </v-text-field>
                    </v-flex>
                    <v-flex pa-2 xs12>
                        <v-text-field v-model="toRequest.remarks" label="Details or Remarks(if with)"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <input 
                        style="display: none" 
                        type="file" id="files"
                        ref="files" 
                        accept=".xls,.xlsx,.pdf,.ods"
                        multiple
                        v-on:change="handleFilesUpload()"/>
                        <v-btn outlined rounded @click="$refs.files.click()">Browse File</v-btn>
                        <template v-if="file1">{{file1}}</template>
                        <template v-if="file2">and {{file2}}</template>
                        <!-- <v-btn outlined rounded v-on:click="submitFile()">Submit</v-btn> -->
                    </v-flex>
                    <v-btn @click="cancelDocRequest()" color="warning" outlined rounded>cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="submitFiles()" color="primary" outlined rounded>save</v-btn>
                </v-layout>
                <!-- sameCode: {{sameDocCode}}
                <hr>
                {{toRequest}} -->
                
            </v-card>
            </v-form>
        </v-bottom-sheet>

        <v-bottom-sheet v-model="documentEditSheet">
            <v-card height="500">
                
                <v-toolbar flat color="white">
                    <v-subheader>Department: {{userInfo.department}}</v-subheader>
                    <v-spacer></v-spacer>
                    <v-icon @click="documentEditSheet = false">minimize</v-icon>
                </v-toolbar>
                <v-layout pa-4 row wrap>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toEditDocs.section" label="Section" :rules="[docRules.required]" :items="selectOption.section_name_options"></v-select>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toEditDocs.team" label="Team" :rules="[docRules.required]" :items="selectOption.team_name_options"></v-select>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-select v-model="toEditDocs.document_copy" disabled label="Document Copy" :items="selectOption.document_copy"></v-select>
                    </v-flex>

                    <v-flex pa-2 xs4>
                        <v-select v-model="toEditDocs.request_type" @change="changeDocCopy('toEditDocs')" label="Request Type" :rules="[docRules.required]" :items="selectOption.request_type"></v-select>
                    </v-flex>

                    <v-flex pa-2 xs4>
                        <v-text-field 
                        v-model="toEditDocs.document_control_code"
                        disabled 
                        label="Document Control Code" 
                        @blur="checkDocIsExist(toEditDocs.document_control_code)"
                        :rules="[docRules.required]">
                        </v-text-field>
                    </v-flex>
                    <v-flex pa-2 xs4>
                        <v-text-field 
                        v-model="toEditDocs.document_title" 
                        label="Document Title"
                        disabled
                        :rules="[docRules.required]">
                        </v-text-field>
                    </v-flex>
                    <v-flex pa-2 xs12>
                        <v-text-field v-model="toEditDocs.remarks" label="Details or Remarks(if with)"></v-text-field>
                    </v-flex>
                    <!-- <v-flex xs12>
                        <input 
                        style="display: none" 
                        type="file" id="files"
                        ref="files" 
                        accept=".xls,.xlsx,.pdf,.ods"
                        multiple
                        v-on:change="handleFilesUpload()"/>
                        <v-btn outlined rounded @click="$refs.files.click()">Browse File</v-btn>
                    </v-flex> -->
                    <v-btn @click="cancelDocEdit()" color="warning" outlined rounded>cancel</v-btn>
                    <v-btn @click="submitDocEdit()" color="primary" outlined rounded>save</v-btn>
                    <v-spacer></v-spacer>
                    
                    <v-btn @click="deleteDocEdit()" color="error" outlined rounded>delete</v-btn>
                </v-layout>
            </v-card>
        </v-bottom-sheet>
    <!-- {{toRequest}} -->
    </v-container>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'

// const controlledCopy = 

export default{
    data(){
        return{
            validA: true,
            sameDocCode: 0,
            requestList: [],
            statusRequest: 'for approval',
            statusRequestOptions: ['for approval', 'approved ok'],
            file1: '',
            file2: '',
            files: '',
            searchDocRequest: '',
            documentRequestSheet: false,
            documentEditSheet: false,
            toEditDocs: {},
            toEditIndex: -1,
            toRequest: {
                section: '',
                team: '',
                status: 'for approval',
                document_copy: '',
                request_type: '',
                document_control_code: '',
                document_title: '',
                remarks: '',
                nature_of_request: 'Origination',
                monitoring: '2',
                islatest: 'LATEST',
                fullname: '',
                id_number: '',
                version: 2
            },
            reqDocHeaders: [
                {text: 'Action', value: 'document_control_code'},
                {text: 'Document control code', value: 'document_control_code'},
                {text: 'Section', value: 'section'},
                {text: 'Team', value: 'team'},
                {text: 'Document copy', value: 'document_copy'},
                {text: 'Request type', value: 'request_type'},
                // {text: 'Document title', value: 'document_title'},
                {text: 'Nature of request', value: 'nature_of_request'}
            ],
            docRules: {
                required: value => !!value || 'Required.', // field is required
                docCode: val => /^[A-Z0-9]{3,4}-[A-Z]{1}[0-9]{3,4}-[0]{2}$|[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(val)  || 'Pattern must be = AAAA-TNNN-00 or AAA-TNNN-00 (*A = text or number, T = text, N = number)'
            },
            noStamp: ['Form', 'Checklist', 'Circular Notice', 'Risk Registry', 'Minutes of the Meeting'],
            controlledCopy: ['Work Guide', 'Reference', 'Job Description', 'Department Manual', 'Quality Manual', 'Quality Policy', 'Quality Plan']
        }
    },
    computed: {
        // docCopy() {
            
        // }
    },
    watch: {
        'toRequest.section'(newVal){
            this.getTeam(this.userInfo.department, newVal)
        },
        'toEditDocs.section'(newVal){
            this.getTeam(this.userInfo.department, newVal)
        },
        documentRequestSheet(newVal){
            if(newVal === false){
                this.cancelDocRequest()
            }
        }
    },
    created(){
        this.toRequest.department = this.userInfo.department
        this.getDocumentRequest()
        this.getSection(this.userInfo.department)
        this.getThisOptions('document_copy')
        this.getThisOptions('request_type')
    },
    methods: {
        editDocsRequest(val) {
            this.toEditDocs = val
            this.toEditIndex = this.requestList.indexOf(val)
            this.documentEditSheet = true
            // console.log(val)
        },
        submitDocEdit() {
            let r = confirm(`Are you sure you want to delete this ${this.toEditDocs.document_control_code} document?`);
            if(r == true){
                let url = `${this.api}update/doc/record`
                axios.post(url, this.toEditDocs).then(res => {
                    
                    this.toEditDocs._rev = res.data._rev
                    this.requestList.splice(this.toEditIndex, 1, this.toEditDocs)
                    this.cancelDocEdit()
                })
            }
            
        },
        deleteDocEdit() {
            let r = confirm(`Are you sure you want to delete this ${this.toEditDocs.document_control_code} document?`);
            if(r == true){
                let toSend = {_id: this.toEditDocs._id, _rev: this.toEditDocs._rev}
                let url = `${this.api}delete/document`
                axios.post(url, toSend).then(() => {
                    this.requestList.splice(this.toEditIndex, 1)
                    this.cancelDocEdit()
                })
            }
        },
        changeDocCopy(val) {
            let minutesNumber = `${this.userInfo.department} ${moment().format('HH\'\'mm\'ss YYYY-MM-DD')}`
            if(!this[val].request_type){
                this[val].document_copy = ''
            }else if(this.controlledCopy.includes(this.toRequest.request_type)){
                this[val].document_copy = 'Controlled'
            }else if(this.noStamp.includes(this.toRequest.request_type)){
                if(this.toRequest.request_type === 'Minutes of the Meeting'){
                    this.toRequest.document_control_code = minutesNumber
                }
                this[val].document_copy = ''
            }else{
                this[val].document_copy = 'Uncontrolled'
            }
        },
        previewDocs() {
            console.log('todo link to server')
        },
        getDocumentRequest() {
            let url = `${this.api}get/document/status/${this.statusRequest}/department/${this.userInfo.department}`
            axios.get(url).then(res => {
                this.requestList = res.data
            })
        },
        checkDocIsExist(val) {
            // console.log('trigger')
            let url = `${this.api}check/doc_existence/${val}`
            if(val){
                axios.get(url).then(res => {
                this.sameDocCode = res.data.length
                }).catch(err => {
                    console.log(err)
                })
            }
            
        },
        cancelDocEdit() {
            this.toEditDocs = {}
            this.documentEditSheet = false
            this.toEditIndex = -1
        },
        cancelDocRequest() {
            this.toRequest = {
                department: this.userInfo.department,
                section: '',
                team: '',
                status: 'for approval',
                document_copy: '',
                request_type: '',
                document_control_code: '',
                document_title: '',
                remarks: '',
                nature_of_request: 'Origination',
                monitoring: '2',
                islatest: 'LATEST',
                fullname: '',
                id_number: '',
                version: 2
            }
            this.files = ''
            this.file1 = ''
            this.file2 = ''
            this.documentRequestSheet = false
        },
        handleFilesUpload(){
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
                // console.log(this.files[0].name.split('.').pop())
                // console.log(this.files[1].name.split('.').pop())
                // console.log(fileNames)
            }else if(this.toRequest.request_type === 'Minutes of the Meeting' && this.$refs.files.files[0].name.split('.').pop() === 'pdf'){
                this.files = this.$refs.files.files;
                this.file1 = this.files[0].name
            }else{
                alert('You must upload 2 files. \n1 pdf file and 1 xls/ods/xlsx file')
            }
            
        },
        approveDocs(d){
            let url = `${this.api}check/doc_existence/${d.document_control_code}`
            axios.get(url).then(res => {
                let getDoc = res.data.map(rec => {
                    return rec.doc
                })
                let val = getDoc.filter(rec => {
                    return rec.status == 'for approval'
                })[0]

                let r = confirm(`Are you sure you want to approved this ${val.document_control_code} document?`);
                let myDue = null
                if(r == true) {
                    let dueday = moment().add(3,'days').format("dddd");
                    if(dueday == 'Sunday' || dueday == 'Monday' || dueday == 'Tuesday'){
                        myDue = moment().add(4,'days').format("YYYY/MM/DD");
                    }else{
                        myDue = moment().add(3,'days').format("YYYY/MM/DD");
                    }
                    
                    if(this.noStamp.includes(val.request_type)){
                        // to not latest -> val.prev_id
                        val.status = 'ok'
                        val.s_date = moment().format("YYYY/MM/DD");
                    }else{
                        val.status = 'approved ok'
                    }
                    // console.log(val)
                    val.request_date = moment().format("YYYY/MM/DD");
                    val.due_date = myDue
                    let url = `${this.api}update/doc/record`
                    axios.post(url, val).then(() => {
                        alert('Saved successfully!')
                        this.requestList = _.remove(this.requestList, a => {
                            return a._id != val._id
                        })
                    })
                    
                }
            })
        },
        submitFiles(){
            if(
                this.toRequest.document_control_code
                && this.toRequest.document_title
                && this.toRequest.nature_of_request
                && this.validA
                ){
                    if((this.files.length === 2 && this.toRequest.request_type !== 'Minutes of the Meeting')
                    || 
                    (this.toRequest.request_type === 'Minutes of the Meeting' &&
                    this.files[0].name.split('.').pop()==='pdf' &&
                    this.files.length === 1)){
                        let formData = new FormData();
                        let url = `${this.api}add/request/document`
                        this.toRequest.id_number = this.userInfo.employeeCode
                        this.toRequest.fullname = this.userInfo.fullName
                        this.toRequest.department = this.userInfo.department
                        this.toRequest.docnumber = this.toRequest.document_control_code.replace(/-[^/-]+$/, "")
                        this.toRequest.revnumber = this.toRequest.document_control_code.split('-').pop()
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
                        // console.log(this.toRequest)
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
                                this.toRequest._id = res.data.id
                                this.toRequest._rev = res.data.rev
                                if(this.toRequest.request_type != 'Minutes of the Meeting'){
                                    this.requestList.push(this.toRequest)
                                }
                                alert(succeed)
                                this.toRequest.department = this.userInfo.department
                                this.cancelDocRequest()
                            }else{
                                alert(failed)
                            }
                        }).catch((err) => {
                            console.log(err.message)
                        })
                    }else{
                        if(this.toRequest.request_type === 'Minutes of the Meeting'){
                            alert('Upload 1 pdf file only')
                        }else{
                            alert('Upload 1 pdf file and 1 ods or xls or  xlsx')
                        }
                        
                    }
                }else{
                    alert('Please complete the required fields with valid value.')
                }
        },
    }
}
</script>