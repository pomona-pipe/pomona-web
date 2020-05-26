export const state = () => ({
  mobileDrawer: false,
  mainNavigation: null,
  navLinks: [
    {
      title: {
        text: "Home",
        path: "/"
      }
    },
    {
      title: {
        text: "Products",
        path: "/products"
      },
      sub_nav: [{
          text: "Bridges & Structures",
          path: "/products/bridges-and-structures"
        },
        {
          text: "Pipe",
          path: "/products/pipe"
        },
        {
          text: "Stormwater Management",
          path: "/products/stormwater-management"
        },
        {
          text: "Geosynthetics",
          path: "/products/geosynthetics"
        },
        {
          text: "Masonry",
          path: "/products/masonry"
        },
        {
          text: "Other Products",
          path: "/products/other-products"
        },
      ]
    },
    {
      title: {
        text: "About Us",
        path: "/about-us"
      },
      sub_nav: [{
          text: "Team",
          path: "/about-us/team"
        },
        {
          text: "Contact",
          path: "/about-us/contact"
        },
      ]
    }
  ]
})

export const mutations = {
  toggleMobileDrawer(state) {
    state.mobileDrawer = !state.mobileDrawer
  },
  setMainNavigation(state, mainNavigation) {
    state.mainNavigation = mainNavigation
  }
}

export const actions = {
  async getMainNavigation({ commit }, $prismic) {
    const byMainNavigation = $prismic.predicates.at(
      'document.type',
      'main_navigation'
    )
    const mainNavigation = await $prismic.api.query(byMainNavigation)
    commit('setMainNavigation', mainNavigation.results.map(
      (result) => result.data.nav
    ))
  }
}
