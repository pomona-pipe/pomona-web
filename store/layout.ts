// TODO: create types for api response data/payloads

import { Prismic } from '~/shims'

interface IState {
  mobileDrawer: boolean
  mainNavigation: any[]
}

export const state: () => IState = () => ({
  mobileDrawer: false,
  mainNavigation: []
})

export const mutations = {
  toggleMobileDrawer(state: IState) {
    state.mobileDrawer = !state.mobileDrawer
  },
  setMainNavigation(state: IState, payload: any[]) {
    state.mainNavigation = payload
  }
}

export const actions = {
  async getMainNavigation({ commit }: { commit: any }, $prismic: Prismic) {
    const byMainNavigation = $prismic.predicates.at(
      'document.type',
      'main_navigation'
    )
    const mainNavigation = await $prismic.api.query(byMainNavigation, {})
    commit('setMainNavigation', mainNavigation.results[0].data.nav)
  }
}
