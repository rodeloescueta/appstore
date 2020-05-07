<template>
    <v-container pa-0>
        <!-- {{msg}} -->
        <!-- <v-text-field 
            append-icon="mdi-message-text" 
            dense outlined prepend-icon="mdi-upload" @click:prepend="childShowAtt()"
            @keyup.enter="childOnAddMsg()" label="Send a message" v-model="model">
        </v-text-field> -->
        
        <v-toolbar dense flat>
            <v-btn v-if="isAllowToMessage" @click="onMakeMsg()" rounded outlined><v-icon>mdi-plus</v-icon> compose</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="isAllowToMessage" @click="childOnAddMsg()" icon small><v-icon>mdi-email-send-outline</v-icon></v-btn>
            <v-btn @click="onCloseMsg()" icon small><v-icon>mdi-close</v-icon></v-btn>
            
        </v-toolbar>
        <!-- <template v-if="msgDialog"> -->
            <div :hidden="!msgDialog" id="froala-editor">
                <froala :tag="'textarea'" :config="config" v-model="msgToSend" :model.sync="msgToSend"></froala>
            </div>
            
            <!-- {{msgToSend}} -->
            
        <!-- </template> -->
        <!-- <froala :tag="'textarea'" :config="config" v-model="msgToSend"></froala> -->
    </v-container>
</template>
<script>
// import VueFroala from 'vue-froala-wysiwyg'
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';

export default {
    props: [],
    data() {
        return {
            msgDialog: false,
            msgToSend: '',
            config: {
                attribution: false,
                placeholderText: 'Type Your Message Here!',
                heightMin: 180,
                toolbarButtons: {
      'moreText': {
        'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
      },
      'moreParagraph': {
        'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
      },
      'moreRich': {
        'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
      }
    },
            //     toolbarButtons: {
            //         'moreText': {
            //         'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
            //         },
            //         'moreParagraph': {
            //         'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            //         },
            //         // 'moreRich': {
            //         // 'buttons': ['insertLink', 'insertImage', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
            //         // },
            //         'moreMisc': {
            //         'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'help']
            //         },
            // //   quickInsertTags: [''],
            //     },
                pluginsEnabled: ['image'],
                events: {
                    // 'image.uploaded':function(response){
								
                    //     // var linkURL = editor.opts.imageUploadParams
                    //     console.log(response)
                    //     var results = JSON.parse(response)
                    //     var imageTemp = 'http://hrdapps48:5040' + results.link.substr(14)
                    //     this.image.insert(imageTemp, false, null, this.image.get(), response)
                    //     return false
                    // },
                    initialized: function () {
                        console.log('initialized')
                    },
                    'image.uploaded':function(response){
                        var results = JSON.parse(response)
                        var imageTemp = 'http://hrdapps48:5040' + results.link.substr(14) //***************************************** */
                        this.image.insert(imageTemp, false, null, this.image.get(), response)
                        console.log(imageTemp)
                        return false
                    },
                },
                imageUploadMethod: 'POST',
                // videoUploadMethod: 'POST',
            },
            paramID: 'froala_image',
            api1: 'http://hrdapps48:5041', //***************************************** */
            api2: 'http://hrdapps48:5040' //***************************************** */
            // api1: 'http://localhost:5000', //***************************************** */
            // api2: 'http://localhost:9000' //***************************************** */
            // model: 'Edit Your Content Here!'
        }
    },
    created(){
        // let api1 = `http://hrdapps48:5041`
        // let api2 = `http://hrdapps48:5040`
        // let api1 = `http://localhost:5000`
        // let api2 = `http://localhost:9000`
        this.config.imageUploadParams = {"link1": this.api2,"link2":this.api1}
        this.config.imageUploadURL = this.api1 + '/upload_image/' + this.paramID
    },
    methods:{
        onCloseMsg(){
            this.$emit('closeMsg')
            this.msgDialog = false
            this.$emit('reSize', this.msgDialog);
        },
        onMakeMsg(){
            this.msgDialog = true
            this.$emit('reSize', this.msgDialog);
        },
        childOnAddMsg(){
            this.$emit('onAddMsg', this.msgToSend);
            
            this.msgDialog = false
            this.$emit('reSize', this.msgDialog);
            this.msgToSend = ''
        },
        childShowAtt(){
            this.$emit('showAtt')
        }
    },
    computed: {
        isAllowToMessage() {
            if(this.userInfo.department === 'QA' || this.checkIsLeader(this.userInfo.designation)){
                return true
            }else{
                return false
            }
        }
    }
}
</script>