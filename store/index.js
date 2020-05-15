export const state = () => ({
  message: 'Welcome to the Pomona website!',
  product_categories: [],
})

export const mutations = {
  setProductCategories(state, product_categories) {
    state.product_categories = product_categories
  }
}
export const actions = {
  async getProductCategories({ commit }, $prismic) {
    const byCategories = $prismic.predicates.at(
      'document.type',
      'product_categories'
    )
    const product_categories = await $prismic.api.query(byCategories)
    commit('setProductCategories', product_categories.results.map(
      (result) => result.data
    ))
  }
}
