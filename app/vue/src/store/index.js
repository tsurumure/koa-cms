import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookie'

import config from './config'
import tabs from './tabs'
import state from './state'

import Public from '../Views/public/store'
import Login from '../Views/login/store'
import Account from '../Views/account/store'
import Articles from '../Views/articles/store'
import FriendLinks from '../Views/friend_links/store'
import Site from '../Views/site/store'

Vue.use(Vuex)
export default () => {
  const store = new Vuex.Store({
    state,
    actions: { },
    modules: {
      config, tabs,
      Public, Login, Account, Articles, FriendLinks, Site
    }
  })
  return store
}
