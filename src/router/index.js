import Vue from 'vue'
import Router from 'vue-router'
import http from '../lib/httpclient'

Vue.use(Router)

import management from '../components/management/management'
import kindLists from '../components/management/kinds/kindLists'
import details from '../components/management/kinds/variety/details'
import addData from '../components/management/kinds/variety/addData'
import login from '../components/management/login/login'
import changePassword from '../components/user/changePassword'
import changeData from '../components/user/changeData'

import store from '../store'
import {
  setImmediate
} from 'timers';

const router = new Router({
  routes: [{
      path: '/management',
      name: 'management',
      component: management,
      children: [{
        path: 'kindLists',
        component: kindLists,
        name: 'kindLists'
      }, {
        path: 'details',
        component: details,
        name: 'details'
      }, {
        path: 'addData',
        component: addData,
        name: 'addData'
      }, {
        path: '/changePassword',
        name: 'changePassword',
        component: changePassword
      }, {
        path: '/changeData',
        name: 'changeData',
        component: changeData
      }]
    },
    {
      path: '/',
      name: 'login',
      component: login
    }
  ]
})

let need_user_state = ['management', 'kindLists', 'details', 'addData', 'changePassword', 'changeData']

router.beforeEach((to, from, next) => {
  //是否需要判断登陆状态
  let need_us = need_user_state.some(name => to.name === name)
  if (need_user_state.indexOf(to.name) >= 0) {
    if (!store.state.kinds.user.isLogin) {
      let username = window.localStorage.getItem('user')
      http.post('userData', {
        username
      }).then(res => {
        if (!res.status) {
          next('/');
          return false;
        }
      })

    }
  }
  next();
})

export default router
