export default {
  state: {
    tabsOptions: [], activePath: ''
  },
  mutations: {
    clear_tabs (state) {
      state.tabsOptions = []
      state.activePath = ''
    },
    add_tabs (state, data) {
      state.tabsOptions.push(data)
    },
    delete_tabs (state, route) {
      let index = 0
      for (let option of state.tabsOptions) {
        if (option.route === route) {
          break
        }
        index++
      }
      state.tabsOptions.splice(index, 1)
    },
    set_active_index (state, index) {
      state.activePath = index
    }
  }
}
