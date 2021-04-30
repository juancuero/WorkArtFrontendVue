import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Swal from 'sweetalert2'

Vue.config.productionTip = false

window.Swal = Swal;
 
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

window.Toast = Toast;


//Import v-from
import { Form, HasError, AlertError } from 'vform'
window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
