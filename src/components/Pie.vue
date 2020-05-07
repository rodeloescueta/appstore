<template>
  <div id="small">
    <pie-chart :chart-data="chartData" :options="chartOptions"></pie-chart>
  </div>
</template>

<script>
import PieChart from "../views/PieChart.js";
import axios from 'axios'
export default {
  name: "App",
  components: {
    PieChart
  },
  data() {
    return {
      chartOptions: {
      borderWidth: "10px",
      hoverBackgroundColor: "red",
      hoverBorderWidth: "10px",
      responsive: true, 
      maintainAspectRatio: false,
      pieceLabel: {
      mode: 'percentage',
      precision: 1
      }
    },
      chartData: {}
    }
  },
  created() {
    this.fillData()
  },
  methods: {
    fillData () {
      axios.get(`${this.api}chartData/Pie`).then(res=>{
      this.chartData = res.data
    })
    
    }
  }
};
</script>

<style>
#small {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 400px;
  margin:  50px;
}
</style>

