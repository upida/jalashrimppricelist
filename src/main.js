import Vue from 'vue'

import Chakra, { CReset, CThemeProvider } from '@chakra-ui/vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import {ServerTable, ClientTable, Event} from 'vue-tables-2-premium';
import { Bar as VChartBar } from 'vue-chartjs'
import { Line as VChartLine } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler } from 'chart.js'
import VSelect from "vue-select";
import DatePicker from 'vue2-datepicker';
import App from './App.vue'
import router from './router'
import axios from 'axios'
import infiniteScroll from 'vue-infinite-scroll'

import $ from 'jquery'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-select/dist/vue-select.css'
import 'vue2-datepicker/index.css';
import './assets/main.css'

Vue.prototype.http = axios

Vue.use(Chakra)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ClientTable, {}, false, 'bootstrap4')
// Vue.use(infiniteScroll)

Vue.directive('infinite-scroll', {
  bind: function (el, binding, vnode) {
    const wrapper = el.getElementsByClassName('VueTables__wrapper')[0];
    wrapper.addEventListener('scroll', function () {
      vnode.context[binding.expression](wrapper);
    });
  }
});

Vue.component("v-select", VSelect)
Vue.component("v-chart-bar", VChartBar)
Vue.component("v-chart-line", VChartLine)
Vue.component("v-datepicker", DatePicker)

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler )

new Vue({
  router,
  render: (h) => h(CThemeProvider, [h(CReset), h(App)])
}).$mount('#app')
