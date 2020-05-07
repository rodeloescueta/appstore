<template>
    <v-container fluid pa-2>
        <!-- {{carsReservationData}} -->
        <v-layout row wrap>
            <v-col cols="12">
                <v-card flat width="100%">
                    <v-layout row wrap>
                        <v-col class="pb-1 pt-0" cols="12" v-for="(rec, i) in carsReservationData" :key="i+'a'">
                            <v-card v-if="!rec.SpeOnlyFlag" class="rounded-card" color="red lighten-3">
                                <div class="pl-4 headline mb-1">{{rec.Time}}</div>
                                <template v-for="(r, j) in rec.recs" cols="12">
                                        <v-layout row wrap :key="j+'b'">
                                            <v-row>
                                                <v-col cols="2" class="pt-0 pb-0">
                                                    <v-card-text>
                                                        <p class="caption pt-2">
                                                            {{r.person[0].PlateNo? r.person[0].PlateNo: '---'}}
                                                        </p>
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="2" class="pt-0 pb-0">
                                                    <v-card-text>
                                                        <template v-if="j === 0">
                                                            <p class="subtitle-1">
                                                                Pick-up:
                                                            </p>
                                                        </template>
                                                    </v-card-text>
                                                    
                                                </v-col>
                                                <v-col cols="2" class="pt-0 pb-0">
                                                    <v-card-text>
                                                        <p class="subtitle-1">
                                                            {{r.PointName}}
                                                        </p>
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="6" class="pt-0 pb-0">
                                                    <v-layout row wrap>
                                                        <v-row>
                                                            <v-col class="pt-0" cols="4" v-for="(per, k) in r.person"  :key="k+'c'">
                                                                <v-card-text>
                                                                    <p class="subtitle-1 font-weight-black">
                                                                    {{per.L_Name}} {{per.F_Name}}
                                                                    </p>
                                                                </v-card-text>
                                                            </v-col>
                                                        </v-row>
                                                    </v-layout>
                                                </v-col>
                                            </v-row>
                                        </v-layout>
                                </template>
                            </v-card>

                            <!-- special cars -->
                            <v-card v-else class="rounded-card" color="yellow lighten-3">
                                <div class="pl-4 headline mb-1">
                                    <v-layout>
                                        {{rec.Time}}
                                        <v-spacer></v-spacer>
                                        Purpose: {{rec.remarks}}
                                        <v-spacer></v-spacer>
                                        <span class="pr-2">
                                        Reserved By: {{rec.recs[0].person[0].RL_Name}} {{rec.recs[0].person[0].RF_Name}}
                                        </span>
                                        
                                    </v-layout>
                                    
                                </div>
                                <template v-for="(r, j) in rec.recs" cols="12">
                                        <v-layout row wrap :key="j+'d'">
                                            <v-row>
                                                <v-col cols="2" class="pt-0 pb-0">
                                                <v-card-text>
                                                        <p class="caption pt-2">
                                                            {{r.person[0].PlateNo? r.person[0].PlateNo: '---'}}
                                                        </p>
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="2" class="pt-0 pb-0">
                                                    <v-card-text>
                                                        <template v-if="j === 0">
                                                            <p class="subtitle-1">
                                                                Pick-up:
                                                            </p>
                                                        </template>
                                                    </v-card-text>
                                                    
                                                </v-col>
                                                <v-col cols="2" class="pt-0 pb-0">
                                                    <v-card-text>
                                                        <p class="subtitle-1">
                                                            {{r.PointName}}
                                                        </p>
                                                    </v-card-text>
                                                </v-col>
                                                <v-col cols="6" class="pt-0 pb-0">
                                                    <v-layout row wrap>
                                                        <v-row>
                                                            <v-col class="pt-0" cols="4" v-for="(per, k) in r.person" :key="k+'e'">
                                                                <v-card-text>
                                                                    <p class="subtitle-1 font-weight-black">
                                                                    {{per.L_Name}} {{per.F_Name}}
                                                                    </p>
                                                                </v-card-text>
                                                            </v-col>
                                                        </v-row>
                                                    </v-layout>
                                                </v-col>
                                            </v-row>
                                        </v-layout>
                                </template>
                            </v-card>
                            
                        </v-col>
                    </v-layout>
                </v-card>
            </v-col>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            carsReservationData: []
        }
    },
    created() {
        this.loadCarsData()
        window.setInterval(() => {
          this.loadCarsData()
        }, 30000)
    },
    methods:{
        loadCarsData(){
            axios.get('http://hrdapps48:5041/cars').then(res => {
                this.carsReservationData = res.data
            })
        }
    }
}
</script>
<style>
.rounded-card{
    border-radius: 50px;
}
</style>