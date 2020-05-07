import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#3f51b5',
        secondary: '#00000',
        accent: '#66ff66',
        error: '#b71c1c',
        myRed: '#ff4d4d'
      },
    },
  },
});
