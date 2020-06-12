export const state = () => ({
  mobileDrawer: false,
  mainNavigation: []
})

export const mutations = {
  toggleMobileDrawer(state) {
    state.mobileDrawer = !state.mobileDrawer
  },
  setMainNavigation(state, payload) {
    state.mainNavigation = payload
  }
}

export const actions = {
  async getMainNavigation({ commit }, $prismic) {
    const byMainNavigation = $prismic.predicates.at(
      'document.type',
      'main_navigation'
    )
    const mainNavigation = await $prismic.api.query(byMainNavigation)
    commit(
      'setMainNavigation',
      mainNavigation.results[0].data.nav
    )
  }
}
