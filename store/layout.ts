// TODO: create types for api response data/payloads
import { IPrismic } from '~/shims'

interface IState {
  pageName: string | null
  isMobile: boolean | null
  mobileDrawer: boolean
  mainNavigation: any[]
}

export const state: () => IState = () => ({
  pageName: null,
  isMobile: null,
  mobileDrawer: false,
  mainNavigation: []
})

export const mutations = {
  setPageName(state: IState, payload: string) {
    const pageName = payload.split('/').slice(-1)[0] || 'home'
    state.pageName = pageName
  },
  setIsMobile(state: IState, value: boolean) {
    state.isMobile = value
  },
  setMobileDrawer(state: IState, value: boolean) {
    state.mobileDrawer = value
  },
  toggleMobileDrawer(state: IState) {
    state.mobileDrawer = !state.mobileDrawer
  },
  setMainNavigation(state: IState, payload: any[]) {
    state.mainNavigation = payload
  }
}

export const actions = {
  async getMainNavigation({ commit }: { commit: any }, $prismic: IPrismic) {
    const byMainNavigation = $prismic.predicates.at(
      'document.type',
      'main_navigation'
    )
    const mainNavigation = await $prismic.api.query(byMainNavigation, {})
    commit('setMainNavigation', mainNavigation.results[0].data.nav)
  }
}
