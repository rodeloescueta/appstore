import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import JsonExcel from 'vue-json-excel'
import myPlugin from '@/plugins/myMixin'
import VueClipboard from 'vue-clipboard2'

import VueFroala from 'vue-froala-wysiwyg'
 
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/js/plugins/image.min.js';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/themes/dark.min.css';
// require('font-awesome/css/font-awesome.css')
// import 'froala-editor/css/third_party/font_awesome.min.css';
import 'froala-editor/js/third_party/font_awesome.min.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/image.min.js'


import visibility from 'vue-visibility-change';
 
// registry directive
Vue.use(visibility);
 
// global mode
// const handler = visibility.change((evt, hidden) => {
//   // do something
// });
 
// visibility.hidden(); // Return true if page now isn’t visible to user.
 
// // visibility.unbind(handler); // Remove `change` listener by it's handler.
 
// visibility.isSupported(); // Return true if browser support Page Visibility API.

Vue.use(VueClipboard)
Vue.component('downloadExcel', JsonExcel)
Vue.config.productionTip = false
Vue.use(VueFroala)

Vue.use(myPlugin)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
