// TODO: create types for api response data/payloads
import { IPrismic } from '~/shims'

interface IState {
  employees: any []
}

export const state: () => IState = () => ({
  employees: []
})

export const mutations = {
  setEmployees(state: IState, payload: any[]) {
    state.employees = payload
  }
}

export const actions = {
  async getEmployees({ commit }: { commit: any }, $prismic: IPrismic) {
    const byEmployees = $prismic.predicates.at(
      'document.type',
      'employees'
    )
    const employees = await $prismic.api.query(byEmployees, {})
    commit('setEmployees', employees.results.map((result) => result))
  }

}
