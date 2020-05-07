<template>
  <v-container fluid pa-0>
    <!-- {{ summary }} -->
    <v-card>
      <template v-for="(rec, i) in summary">
        <v-chip small class="ma-1" color="grey" text-color="white" :key="i">
          {{ Object.keys(rec)[0] }}
          <v-avatar right class="blue-grey darken-2">
            <span class="overline">{{ rec[Object.keys(rec)[0]] }}</span>
          </v-avatar>
        </v-chip>
      </template>
    </v-card>
    <v-divider></v-divider>
    <v-data-table
      dense
      :headers="headers"
      :items="data"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Department Logs</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-select
            label="Select Department"
            class="pt-4 pr-4"
            :items="depList"
            v-model="pickedDep"
          ></v-select>

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="pt-4"
                v-model="date"
                label="Select Date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="allowedDates"
              v-model="date"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
          <v-btn
            color="blue-grey lighten-1"
            fab
            outlined
            small
            @click="getData()"
          >
            <v-icon>mdi-database-search</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            class="pt-4"
            v-model="search"
            label="Filter"
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      summary: [],
      depList: [],
      data: [],
      search: "",
      pickedDep: "",
      menu: false,
      date: moment().format("YYYY-MM-DD"),
      headers: [
        { text: "EmployeeName", value: "EmployeeName" },
        { text: "TimeIn", value: "TimeIn" },
        { text: "DepartmentName", value: "DepartmentName" },
        { text: "SectionName", value: "SectionName" },
        { text: "TeamName", value: "TeamName" },
      ],
    };
  },
  mounted() {
    this.getSummary();
    // this.getData();
  },
  methods: {
    allowedDates: (val) =>
      val <= moment().format("YYYY-MM-DD") &&
      val >
        moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD"),
    getSummary() {
      let url = `${this.api}hrd_logs/summary?date=${this.date}`;
      axios.get(url).then((res) => {
        this.summary = res.data;
        this.depList = res.data
          .map((rec) => {
            return Object.keys(rec)[0];
          })
          .sort();
      });
    },
    getData() {
      this.getSummary();
      let url = `${this.api}hrd_logs?date=${this.date}&depName=${
        this.pickedDep
      }`;
      axios.get(url).then((res) => {
        console.log(res.data);
        this.data = res.data.map((rec) => {
          rec.TimeIn = rec.TimeIn.substring(11, 19);
          return rec;
        });
      });
    },
  },
};
</script>
