export const state = () => ({
  productCategories: []
})

export const mutations = {
  setProductCategories(state, payload) {
    state.productCategories = payload
  }
}
export const actions = {
  async getProductCategories({ commit }, $prismic) {
    const byCategories = $prismic.predicates.at(
      'document.type',
      'product_categories'
    )
    const productCategories = await $prismic.api.query(byCategories)
    commit('setProductCategories', productCategories.results.map(
      (result) => result.data
    ))
  }
}
