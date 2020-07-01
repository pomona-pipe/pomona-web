// TODO: create types for api response data/payloads
import { IPrismic } from '~/shims'

interface IState {
  aboutUs: any []
  team: any []
}

export const state: () => IState = () => ({
  aboutUs: [],
  team: []
})

export const mutations = {
  setAboutUs(state: IState, payload: any[]) {
    state.aboutUs = payload
  },
  setTeam(state: IState, payload: any[]) {
    state.team = payload
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
  },
  async getTeam({ commit }: { commit: any }, $prismic: IPrismic) {
    const byTeam = $prismic.predicates.at(
      'document.type',
      'team_page'
    )
    const team = await $prismic.api.query(byTeam, {})
    commit('setTeam', team.results.map((result) => result))
  }

}
