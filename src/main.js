// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import '../src/assets/css/base.css'
import '../src/assets/css/common.css'
import FastClick from 'fastclick';
import { LoadingPlugin,ToastPlugin,ConfirmPlugin,AlertPlugin } from 'vux';
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(AlertPlugin);
import utils from './server/globalData'
Vue.prototype.$utils=utils;

//移除移动端点击延迟
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

Vue.use(Mint);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
