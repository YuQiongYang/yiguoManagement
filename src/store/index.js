import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import kinds from './kinds'

const store = new Vuex.Store({
    modules:{
        kinds
    }
})

export default store