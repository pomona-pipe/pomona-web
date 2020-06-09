export const state = () => ({
  productCategories: [],
  products: []
})

export const mutations = {
  setProductCategories(state, payload) {
    state.productCategories = payload
  },
  addProduct(state, payload) {
    state.products = payload
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
  async getProductByUid({
    commit
  }, $prismic) {
    const byUid = $prismic.predicates.at(
      'document.type',
      'products'
    )
    const product = await $prismic.api.query(byUid)
    commit('addProduct', product.results.map(
      (result) => result.data
    ))
  }
}
