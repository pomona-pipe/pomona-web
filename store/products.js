export const state = () => ({
  productCategories: [],
  products: []
})

export const mutations = {
  setProductCategories(state, payload) {
    state.productCategories = payload
  },
  addProduct(state, payload) {
    state.products = state.products.concat(payload)
  }
}
export const actions = {
  async getProductCategories({
    commit
  }, $prismic) {
    const byCategories = $prismic.predicates.at(
      'document.type',
      'product_categories'
    )
    const productCategories = await $prismic.api.query(byCategories)
    commit('setProductCategories', productCategories.results.map(
      (result) => result.data
    ))
  },
  async getProductsByCategory({ commit }, {$prismic, category} ) {
    const byCategory = $prismic.predicates.at(
      'my.products.product_category', category
    )
    const product = await $prismic.api.query(byCategory)
    commit('addProduct', product.results.map(
      (result) => result.data
    ))
  }
}
