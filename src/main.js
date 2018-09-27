import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as util from './utils'
import { XHeader,XButton,XDialog,XInput   } from 'vux'
import  {ToastPlugin,LoadingPlugin,ConfirmPlugin} from 'vux'
import LoadingPageInstall from './views/components/errorLoading/index'
import Page from './views/components/page'

Vue.component('x-dialog', XDialog);
Vue.component('x-header', XHeader);
Vue.component('x-button', XButton);
Vue.component('x-input', XInput );
Vue.component('page',Page);
Vue.use(ToastPlugin);
Vue.use(LoadingPageInstall);
Vue.use(LoadingPlugin);
Vue.use(ConfirmPlugin);

Vue.prototype.$util = util //工具类

window._vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')


export default window._vue
