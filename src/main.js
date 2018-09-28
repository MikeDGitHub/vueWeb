import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import screenfull from 'screenfull'
import '@/assets/svg-icons'
import '@/components'
import '@/plugin/axios'
import '@/mock/register'
import util from '@/libs/util.js'
import store from '@/store/index'
import pluginOpen from '@/plugin/open'
import App from './App'


// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from './menuConfig'
import { frameInRoutes } from './routerConfig'

import {post,fetch} from '@/libs/http.js'


Vue.use(ElementUI)
Vue.use(pluginOpen)

Vue.config.productionTip = false


Vue.prototype.$env = process.env.NODE_ENV
Vue.prototype.$baseUrl = process.env.BASE_URL

Vue.prototype.oauthService='http://47.75.57.54/oauthservice'
Vue.prototype.waterService='http://47.75.57.54/WaterService.API'
/**
 * 账户
 */
Vue.prototype.account=Vue.prototype.oauthService+'api/account/'
/**
 * 部门
 */

Vue.prototype.department=Vue.prototype.waterService+'api/department/'
Vue.prototype.genre=Vue.prototype.waterService+'api/genre/'
Vue.prototype.type=Vue.prototype.waterService+'api/type/'
Vue.prototype.drainage=Vue.prototype.waterService+'api/drainage/'
Vue.prototype.water=Vue.prototype.waterService+'api/WaterMeter/'
Vue.prototype.user=Vue.prototype.waterService+'api/User/'
Vue.prototype.att=Vue.prototype.waterService+'api/Attachment/'
Vue.prototype.exhaust=Vue.prototype.waterService+'api/exhaust/'
Vue.prototype.fireFighting=Vue.prototype.waterService+'api/FireFighting/'
Vue.prototype.sludge=Vue.prototype.waterService+'api/sludge/'
Vue.prototype.valve=Vue.prototype.waterService+'api/valve/'
Vue.prototype.pipeLine=Vue.prototype.waterService+'api/pipeLine/'
Vue.prototype.initPassWord='12345'
Vue.prototype.pageSize='10'

Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.getAllPageFromRoutes()
    // 设置顶栏菜单
    this.$store.commit('d2adminMenuHeaderSet', menuHeader)
    // 设置侧边栏菜单
    this.$store.commit('d2adminMenuAsideSet', menuAside)
  },
  mounted () {
    // 获取并记录用户 UA
    this.$store.commit('d2adminUaGet')
    // 展示系统信息
    util.showInfo()
    // 用户登陆后从数据库加载一系列的设置
    this.$store.commit('d2adminLoginSuccessLoad')
    // 初始化全屏监听
    this.fullscreenListenerInit()
  },
  methods: {
    /**
     * 初始化全屏监听
     */
    fullscreenListenerInit () {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) {
            this.$store.commit('d2adminFullScreenSet', false)
          }
        })
      }
    },
    /**
     * 处理路由 得到所有的页面
     */
    getAllPageFromRoutes () {
      const pool = []
      function push (routes) {
        routes.forEach((route) => {
          if (route.children) {
            push(route.children)
          } else {
            const { meta, name, path } = route
            pool.push({ meta, name, path })
          }
        })
      }
      push(frameInRoutes)
      this.$store.commit('d2adminPagePoolSet', pool)
    }
  }
}).$mount('#app')
