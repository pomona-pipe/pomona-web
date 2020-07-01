// TODO: create types for api response data/payloads
import { IPrismic } from '~/shims'

interface IState {
  aboutUs: any []
}

export const state: () => IState = () => ({
  aboutUs: []
})

export const mutations = {
  setAboutUs(state: IState, payload: any[]) {
    state.aboutUs = payload
  }
}

export const actions = {
  async getAboutUs({ commit }: { commit: any }, $prismic: IPrismic) {
    const byAboutUs = $prismic.predicates.at(
      'document.type',
      'about_us_page'
    )
    const aboutUs = await $prismic.api.query(byAboutUs, {})
    commit('setAboutUs', aboutUs.results.map((result) => result))
  }
}
