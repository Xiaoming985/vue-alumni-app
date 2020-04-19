import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import { get, post} from './util/http'
import qs from 'qs'

Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$qs = qs;

// 富文本编辑器
import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
let options = {
  modules: {
    toolbar: [
      // [{ 'size': ['small', false, 'large'] }],
      // ['bold', 'italic'],
      // [{ 'header': 1 }, { 'header': 2 }],
      // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      // [{ 'color': [] }, { 'background': [] }],
      // [{ 'align': [] }],
      // ['link','image'],
      [{'size': ['small', false, 'large']}],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'color': []}, {'background': []}],
      [{'align': []}],
      ['link', 'image']
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
  }
}
Vue.use(QuillEditor, options)

// router.beforeEach((to, from, next) => {
//   //console.log(store.state, "store.state")
//   if (store.state.account || to.path ==="/"){
//     next();
//   }else {
//     next({name: 'Login'});
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
