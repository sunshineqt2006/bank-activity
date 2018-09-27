import LoadingPage from './index.vue'
let $vm

export default {
  install(vue, options) {
     
    const Loading = vue.extend(LoadingPage)

    if (!$vm) {
      $vm = new Loading({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    const loading = {
      show() {
        $vm.refresh()
        $vm.show = true
      },
      hide() {
        $vm.show = false
      }
    }

    vue.$loadingPage = loading
    vue.mixin({
      created: function () {
        this.$loadingPage = vue.$loadingPage
      }
    })
  }
}