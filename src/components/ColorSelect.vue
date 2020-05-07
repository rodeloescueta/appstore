<template>
    <v-container fluid pa-0 >
        <v-row dense>
          <span>
            Select Color
          </span>
        <v-col  cols="12">
        <v-btn
          class="mx-1"
          v-for="(btn, btn_i) in colors"
          :key="btn_i"
          fab
          elevation="0"
          x-small
          :color="btn.color"
          @click="selectedColor(btn)"
        ></v-btn>
        </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
  data: () => ({
    sample: 'red',
      color: 'red',
      colors: [
          {color: 'red'},
          {color: 'blue'},
          {color: 'green'},
          {color: 'pink'},

      ]
  }),

  methods: {
      selectedColor(btn){
        this.$emit('select', btn.color)   
      }
  }
}
</script>
  <style scoped>
    .picker-main {
      width: 55%;
    }
    .header {
      font-size: 14px;
      text-transform: uppercase;
      color: orangered;
      letter-spacing: 0.5px;
      margin: 0 0 6px;
      text-align: left;
    }
    .color-picker {
      display: flex;
      justify-content: space-around;
    }
    .color-picker > .color {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1.5px solid whitesmoke;
      cursor: pointer;
    }
    .mx-1.selected{
      box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.2);
      border: 3px solid rgba(0, 0, 0, 0.4);
    }
    .color.red {
      background: rgb(235, 77, 77);
    }
    .color.blue {
      background: rgb(59, 59, 163);
    }
    .color.orange {
      background: orange;
    }
    .color.green {
      background: rgb(49, 155, 49);
    }
    </style>