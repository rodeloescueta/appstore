<template>
    <v-container fluid pa-0>
        <v-layout row wrap>
            <v-flex xs12>
                <v-toolbar elevation="0" color="transparent" dense>
                    <!-- <template v-for="(page, index) in documentPages">
                        <v-btn @click="onSelectDocumentPage(page.value)" elevation="0" color="transparent" :key="index">
                            <span v-if="selectedDocumentPage == page.value" style="color: #5C6BC0;">
                                <template v-if="index == 0">{{userInfo.department}} </template> {{page.name}}
                            </span>
                            <span v-else>
                                <template v-if="index == 0">{{userInfo.department}} </template> {{page.name}}
                            </span>
                        </v-btn>
                    </template> -->
                    <v-btn @click="onSelectDocumentPage('documents')" elevation="0" color="transparent">
                        <span :style="selectedDocumentPage == 'documents'? 'color: #5C6BC0;': 'color: #000000'">
                            <template>{{userInfo.department}} </template> Documents
                        </span>
                    </v-btn>
                    
                    <template v-if="(userInfo.newRights && userInfo.newRights.documentController) || isDhShJa || isDocumentMasterMaintenance">
                         <v-btn @click="onSelectDocumentPage('request')" elevation="0" color="transparent">
                            <span :style="selectedDocumentPage == 'request'? 'color: #5C6BC0;': 'color: #000000'">
                                Request
                            </span>
                        </v-btn>

                        <v-btn @click="onSelectDocumentPage('history')" elevation="0" color="transparent">
                            <span :style="selectedDocumentPage == 'history'? 'color: #5C6BC0;': 'color: #000000'">
                                History
                            </span>
                        </v-btn>
                    </template>
                    <v-spacer></v-spacer>
                    <template v-if="isDocumentMasterMaintenance">
                        <v-btn @click="onSelectDocumentPage('stamping')" elevation="0" color="transparent">
                            <span :style="selectedDocumentPage == 'stamping'? 'color: #5C6BC0;': 'color: #000000'">
                                Stamping
                            </span>
                        </v-btn>
                    </template>
                    <!-- <v-btn @click="onSelectDocumentPage('reports')" elevation="0" color="transparent">
                        <span :style="selectedDocumentPage == 'reports'? 'color: #5C6BC0;': 'color: #000000'">
                             Reports
                        </span>
                    </v-btn> -->
                   
                </v-toolbar>
                <v-divider></v-divider>
                <v-container fluid pt-0 pl-2>
                    <official-docs v-if="selectedDocumentPage == 'documents'"/>
                    <request-docs v-if="selectedDocumentPage == 'request'"/>
                    <stamping-docs v-if="selectedDocumentPage == 'stamping'"/>
                    <history-docs v-if="selectedDocumentPage == 'history'"/>
                    <reports-docs v-if="selectedDocumentPage == 'reports'"/>
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import OfficialDocs from '@/components/OfficialDocs.vue'
import RequestDocs from '@/components/RequestDocs.vue'
import HistoryDocs from '@/components/HistoryDocs.vue'
import StampingDocs from '@/components/StampingDocs.vue'
// import ReportsDocs from '@/views/HrdDocsReport.vue'

export default{
    data() {
        return{
            test: 'hi',
            selectedDocumentPage: 'documents',
            documentPages: [
                {name: 'Documents', value: 'documents'},
                {name: 'Request', value: 'request'},
                {name: 'History', value: 'history'},
                {name: 'Reports', value: 'reports'}
            ]
        }
    },
    components: {
        OfficialDocs,
        RequestDocs,
        HistoryDocs,
        StampingDocs,
        // ReportsDocs
    },
    methods: {
        onSelectDocumentPage(val) {
            this.selectedDocumentPage = val
        }
    }
}

</script>

<style>

</style>
