import {
  GETKINDS,
  USERSTATUS,
  USERDATA
} from './conts'

const mutations = {
  [GETKINDS](_state, payload) {
    _state.allKinds = payload.allKinds
  },
  [USERSTATUS](_state, payload) {
    _state.user.isLogin = payload.status
    _state.user.username = payload.username
  },
  [USERDATA](_state, payload) {
    _state.userData = payload.userData
  }
}

export default mutations
