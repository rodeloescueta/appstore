<template>
  <div id="app" style="height:100%">
    <div id="overlay">
      <div id="text">Master Copy. Do not reproduce.</div>
    </div>
    <!-- {{scale}} -->
    <!-- :src.sync="src" -->
    <PDFView
      :src.sync="src"
      ref="pdfView"
      fileName="order"
      :sidebarFeatureVisible="false"
      :downloadFeatureVisible="false"
      :toolbarVisible="true"
      :scale.sync="scale"
    > 
        <template slot="right-toolbox">
          <v-btn @click="closeDialog()" color="red" elevation="0">Close here! <v-icon>close</v-icon></v-btn>
        </template> <!-- Add more buttons/features on the right side of the toolbar -->
        <template slot="left-toolbox">
          
          &nbsp;&nbsp;&nbsp;
          <v-icon color="light-blue accent-3">remove_red_eye</v-icon>
          &nbsp;&nbsp;&nbsp;View Mode : {{documentViewInformation.document_control_code}}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-btn fab icon small @click="zoomIn"><v-icon color="white">zoom_in</v-icon></v-btn>
          <v-btn fab icon small @click="zoomOut"><v-icon color="white">zoom_out</v-icon></v-btn>

        </template> <!-- Add more buttons/features on the left side of the toolbar -->
        <template slot="error"></template> <!-- Change the error message design -->
        <template slot="loading"></template> <!-- Change the pdf loader design -->
    </PDFView>
  </div>
</template>
<script>
import {PDFView} from 'vue_pdfjs_viewer';

export default {
  props: {
      closeDialog: Function
  },
  components:{
  // ...
    PDFView
  },
  data(){
    return {
      sidePage: false,
      scale: "auto",
      src: ''
    }
  },
  created(){
    console.log(this.documentViewInformation)
    if(this.noStamp.includes(this.documentViewInformation.request_type)  && this.documentViewInformation.version){
      this.src = `http://hrdapps48:3001/ftp/test/doc/pdf/src/${this.documentViewInformation.department}/${this.documentViewInformation.document_control_code}${this.documentViewInformation.document_title}.pdf`
    }else{
       this.src = `http://hrdapps48:3001/ftp/test/doc/${this.documentViewInformation.department}/${this.documentViewInformation.document_control_code}${this.documentViewInformation.document_title}.pdf`
    }
  },
  methods: {
    zoomIn(){
      if(this.scale == 'auto'){
        this.scale = '1'
      }
      let num = parseInt(this.scale)
      let b = String(num + 1)
      this.scale = b
    },
    zoomOut(){
      if(this.scale != '1'){
        let num = parseInt(this.scale)
        let b = String(num - 1)
        this.scale = b
      }
    }
  }
}
</script>

<style>
/* body { visibility: hidden; display: none } */
@media only print {
    #app { display:none !important; }
}
#overlay {
  position: absolute;
  display: block;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  z-index: 102;
  width:500px;
  height:100px;
  margin-left:-250px;
  margin-top:-50px;
  cursor: not-allowed;
}

#text{
  position: fixed;
  top: 50%;
  left: 50%;
  font-size: 45px;
  color: #ff0000;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-150%,-150%);
}

</style>