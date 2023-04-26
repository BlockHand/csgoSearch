import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import ViewUIPlus from 'view-ui-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './TailwindCSS.css'
import 'element-plus/dist/index.css'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import Cookies from 'js-cookie'
import store from './store'
import router from './router'
import App from './App.vue'
import './app.less'
import axios from './plugins/axios'
import * as Icons from '@element-plus/icons-vue'
import Components from './components'
import JsonViewer from 'vue-json-viewer'

router.beforeEach((route, redirect, next) => {
  // const isLogin = Cookies.get(`X-User-Token-${import.meta.env.VITE_API_ENV}`)
  // if (!isLogin) {
  //   const url = `${import.meta.env.VITE_LOGIN_URL}?redirect_uri=${encodeURIComponent(window.location.href)}`
  //   return (window.location.href = url)
  // }
  Cookies.set('userId','234')
  Cookies.set('__gads','ID=8dd848951ff04510-226de6cdf4de0023:T=1680508268:RT=1680508268:S=ALNI_Ma-yNx7-YcbFLA0LS4G-vlpRHvL-g')
  Cookies.set('JSESSIONID','5BC190CEE93F2CE48CA0ABD5570CEB70')
  Cookies.set('username','yeshen123')
  Cookies.set('__gpi','UID=00000a3dfaee5dc6:T=1680508268:RT=1680508268:S=ALNI_MZh8rb3wAhGdI4IiCA2cLQnWQumgQ')
  Cookies.set('token','29bca43cd95750f91825a100058d4ca9')
  next()
})

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(JsonViewer)
app.use(ViewUIPlus)
app.config.globalProperties.$axios = axios
function transElIconName(iconName) {
  return 'el-icon' + iconName.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
}
// 导入element-plus的Icon库，注册为el-icon-xxx的组件
for (const key in Icons) {
  app.component(transElIconName(key), Icons[key])
}
app.use(Components)
app.mount('#app')
