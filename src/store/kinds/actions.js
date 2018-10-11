import http from '../../lib/httpclient'
import router from '../../router'
import {
  GETKINDS,
  USERSTATUS,
  USERDATA
} from './conts'

const actions = {
  getKinds(_context, payload) {
    http.post('allKinds').then(res => {
      _context.commit({
        type: GETKINDS,
        allKinds: res.data
      })
    })
  },
  login(_context, payload) {
    let _data = {
      username: payload.username,
      password: payload.password
    }
    http.post('admin', _data).then(res => {
      // console.log(res)
      let token = window.localStorage.setItem('token', res.message)
      if (res.status) {
        _context.commit({
          type: USERSTATUS,
          status: res.status,
          username: res.data.username
        })

        router.push({
          name: 'kindLists',
          query: {
            sort: 'fruits'
          }
        })
        this.loading = true
        window.localStorage.setItem('user', res.data.username)
      }else{
        // this.loading = false
        alert('用户名或密码错误')
      }
    })
  },

  userData(_context, payload) {
    let username = window.localStorage.getItem('user')

    if (username) {
      http.post('userData', {
        username
      }).then(res => {
        // console.log(res)
        if (res.status) {
          _context.commit({
            type: USERSTATUS,
            status: res.status
          })
        }
      })
    } else {
      _context.commit({
        type: USERSTATUS,
        status: false
      })
    }
  }
}

export default actions
