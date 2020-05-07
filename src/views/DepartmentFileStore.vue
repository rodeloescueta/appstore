<template>
  <v-container fluid pa-0>
    <!-- files:{{files}}
    <hr>
    picked{{picked}} -->
    <!-- {{allSelectedFiles}}
    <v-btn @click="downloadAllfile()">dl all</v-btn> -->
    <v-row>
      <v-col cols="10">
        <v-file-input
          v-model="files"
          placeholder="Upload your documents"
          label="File input"
          multiple
          prepend-icon="mdi-paperclip"
          accept=".pdf,.xlsx"
          @change="onFileChange()"
        >
          <template v-slot:selection="{ text, index }">
            <v-chip
              small
              label
              color="primary"
            >
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>
      <v-col cols="2">
        <v-btn @click="uploadFile()">Upload</v-btn>
      </v-col>
      <v-col v-for="(file, i) in files" cols="4" :key="i + 'a'">
        <v-btn :key="i">{{file.name}}<v-icon @click="removeFile(i)">mdi-close</v-icon></v-btn>
      </v-col>
      <v-col cols=12>
        <v-toolbar elevation="0" dense>
          <v-toolbar-title>Records</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field class="pt-4 pr-2" 
            v-model="searchFileRecord" 
            label="Search by file name or content">
          </v-text-field>
          <v-select class="pt-4"
            :items="fileType"
            v-model="fileTypePicked"
            label="Choose File Type"
          ></v-select>
          <v-spacer></v-spacer>
          <template v-if="picked._id">
            <!-- <a href="./uploads/PDF/SEKOU INDICATION INPUTTING - JIKUGUMI.pdf.pdf" target="_blank">aasdf</a> -->
            <!-- {{picked}} -->
            <template v-if="picked.fileType === 'PDF'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <!-- :href=`./public/PDF/${picked.fileName}` './uploads/PDF/' + picked.fileName-->
                  <v-btn :href="openTab" target="_blank" v-on="on" icon fab >
                    <v-icon color="indigo">mdi-file-eye</v-icon>
                  </v-btn>
                </template>
                <span>View file in browser</span>
              </v-tooltip>
            </template>
            

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn :href="downloadFile" :download="picked.fileName" v-on="on" icon fab>
                  <v-icon color="pink">mdi-file-download</v-icon>
                </v-btn>
              </template>
              <span>Download highlighted file</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn 
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                    v-clipboard:copy="tempCopyMsg" v-on="on" icon fab>
                    <v-icon color="cyan">mdi-attachment</v-icon>
                    </v-btn>
                </template>
                <span>Attach for Messaging App</span>
            </v-tooltip>
            <template v-if="allSelectedFiles.length > 1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="downloadAllfile()" v-on="on" icon fab>
                    <v-icon color="amber">mdi-download-multiple</v-icon>
                  </v-btn>
                </template>
                <span>Download all selected files</span>
              </v-tooltip>
              
            </template>
            
          </template>
        </v-toolbar>
      </v-col>
      <!-- :cols="picked._id ? 8: 12" -->
      <!-- table ***************************************************************************************** -->
      <v-col cols="12">
        <v-data-table dense
        :headers="recordFilesHeaders"
        :items="recordFiles"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:body="{ items }">
            <tbody>
                <tr :bgcolor="i === pickedIndex?'#99bbff':''" @click="selectThis(item, i)" v-for="(item, i) in recordFilesFilter" :key="i">
                    <td>{{ item.fileName }}</td>
                    <td>
                      <v-icon 
                        :color="item.fileType === 'EXCEL'?'green':'red'">
                        {{item.fileType === 'EXCEL'?'mdi-file-excel-outline':'mdi-file-pdf'}}
                      </v-icon>
                    </td>
                    <td>{{ item.uploadedBy }}</td>
                    <td>{{ item.uploadedDate }}</td>
                    <td>
                      <v-checkbox v-model="item.selected"></v-checkbox>
                    </td>
                </tr>
            </tbody>   
        </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
  data() {
    return {
        tempCopyMsg: '[{name: "file1.pdf", url: "http://hrdapps48:5031/attch/department/file1.pdf"},{name: "file2.xlxs", url: "http://hrdapps48:5031/attch/department/file1.xlxs"}]',
        files: [],
        recordFiles: [],
        pickedIndex: -1,
        picked: {},
        searchFileRecord: '',
        fileType: ['PDF', 'EXCEL'],
        fileTypePicked: '',
        recordFilesHeaders: [
            { text: 'File', value: 'fileName' },
            { text: 'Type', value: 'fileType' },
            { text: 'Uploader', value: 'uploadedBy' },
            { text: 'Date', value: 'uploadedDate' },
            { text: 'Select', value: 'fileName'}
      ]
    }
  },
  mounted(){
    this.loadAllData()
  },
  computed: {
    allSelectedFiles(){
      return this.recordFilesFilter.filter(rec => {
        return rec.selected === true
      }).map(rec => {
        return {
          url: `http://localhost:9000/uploads/${rec.fileType}/${rec.fileName}`,
          name: rec.fileName
        }
      })
    },
    recordFilesFilter(){
      return this.recordFiles.filter(rec => {
        return (rec.fileName.toUpperCase().includes(this.searchFileRecord.toUpperCase()) ||
        rec.content.toUpperCase().includes(this.searchFileRecord.toUpperCase())) && 
        rec.fileType.includes(this.fileTypePicked)
      })
    },
    downloadFile(){
      let url = `./uploads/${this.picked.fileType}/${this.picked.fileName}`
      return url
    },
    openTab(){
      // './uploads/PDF/' + picked.fileName
      // `./uploads/${this.picked.fileType}/${this.picked.fileName}`
      let url = ''
      if(this.picked.fileType === 'PDF'){
        url = `./uploads/${this.picked.fileType}/${this.picked.fileName}`
      }else{
        url = `./uploads/${this.picked.fileType}/${this.picked.fileName}`
        //url = `https://view.officeapps.live.com/op/view.aspx?src=http://localhost:9000/uploads/${this.picked.fileType}/${this.picked.fileName}`
      }
      return url
    }
  },
  methods:{
    copyFileInformation(){
        alert('ei')
    },
    downloadAllfile(){
      // function downloadAll(urls) {
        let linkUrls = this.allSelectedFiles.map(rec => rec.url)
        let linkNames = this.allSelectedFiles.map(rec => rec.name)
        let link = document.createElement('a');

        
        link.style.display = 'none';

        document.body.appendChild(link);

        for (let i = 0; i < linkUrls.length; i++) {
          link.setAttribute('download', linkNames[i]);
          link.setAttribute('href', linkUrls[i]);
          link.click();
        }

        document.body.removeChild(link);
      // }


    },
    selectThis(val, i){
        this.picked = val
        this.pickedIndex = i
        // alert(val.title)
    },
    getAttPath(i){
      return `./uploads/attachments/${i.fileType}/${i.fileName}` 
    },
    onFileChange(){
      for(let i = 0; i<this.files.length; i++){
        console.log(this.files[i])
      }
    },
    removeFile(i){
      this.files.splice(i, 1)
    },
    loadAllData(){
      let url = `${this.api}file_record`
      axios.get(url).then(res => {
        this.recordFiles = res.data
      })
    },
    uploadFile(){
      let filesRecord = this.recordFiles.map(rec => rec.fileName)
      let filesToUpload = this.files.map(rec => rec.name)
      let checkFile = [...filesRecord, ...filesToUpload]
      let filesNotAllow = filesToUpload.map(rec => {
        return rec.split('.').pop()
      }).filter(rec => {
        return rec !== 'pdf' && rec !== 'xlsx'
      })
      if(filesNotAllow.length > 0){
        alert(`You are trying to upload files that are not allowed for this system \n \n ${filesNotAllow}`)
      }else{
        let sortedCheckFile = checkFile.sort()
        let duplicate = []
        let duplicateItem = []
        for (let i = 0; i < sortedCheckFile.length - 1; i++) {
            if (sortedCheckFile[i + 1] == sortedCheckFile[i]) {
                // console.log()
                duplicateItem.push(this.recordFiles[filesRecord.indexOf(sortedCheckFile[i])])
                duplicate.push(sortedCheckFile[i])
            }
        }
        
        console.log(duplicateItem)
        if(duplicate.length > 0){
          var r = confirm(`Do you want to overwrite duplicate records? \n${duplicate}`);
          if (r == true) {
            
          let formData = new FormData()
          let myData = {
            uploadedBy: this.userInfo.fullName,
            uploadedDate: moment().format('YYYY-MM-DD')
          }
          myData.duplicateItem = duplicateItem
          formData.append('myData', JSON.stringify(myData))
          for( var k = 0; k < this.files.length; k++ ){
              let file = this.files[k];
              formData.append('files[]', file);
          }
          let url = `${this.api}submitform`
          axios.post(url, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  dataType: 'json',
              }
          }).then(res => {
            this.files = []
            console.log(res.data)
          })


          } else {
            alert('Cancel')
          }
        }else{
          let formData = new FormData()
          let myData = {
            uploadedBy: this.userInfo.fullName,
            uploadedDate: moment().format('YYYY-MM-DD')
          }
          // myData.duplicateItem = duplicateItem
          formData.append('myData', JSON.stringify(myData))
          for( var j = 0; j < this.files.length; j++ ){
              let file = this.files[j];
              formData.append('files[]', file);
          }
          let url = `${this.api}submitform`
          axios.post(url, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  dataType: 'json',
              }
          }).then(res => {
            this.files = []
            console.log(res.data)
          })
        }
      }
      
      // let formData = new FormData()
      // let myData = {
      //   uploadedBy: this.userInfo.fullName,
      //   uploadedDate: moment().format('YYYY-MM-DD')
      // }
      // formData.append('myData', JSON.stringify(myData))
      // for( var j = 0; j < this.files.length; j++ ){
      //     let file = this.files[j];
      //     formData.append('files[]', file);
      // }
      // let url = `${this.api}submitform`
      // axios.post(url, formData, {
      //     headers: {
      //         'Content-Type': 'multipart/form-data',
      //         dataType: 'json',
      //     }
      // }).then(res => {
      //   this.files = []
      //   console.log(res.data)
      // })
    },
    onCopy: function (e) {
      alert('You just copied: ' + e.text)
    },
    onError: function (e) {
      alert(e)
    }
  }
};
</script>
