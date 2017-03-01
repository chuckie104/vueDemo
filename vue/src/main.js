// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from 'vue-resource'
import VueScroll from 'vue-scroll'

import $ from "jquery"
require("./css/style.css");
require("./css/aui-pull-refresh.css");
require("./base.js");


Vue.use(resource)
Vue.use(VueScroll)

// Vue.use(fetch)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  methods:{
   onScroll:function(e, position){
     console.log(123);
     this.position = position;
   }
 }
})
