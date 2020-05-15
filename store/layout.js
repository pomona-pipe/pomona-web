export const state = () => ({
  mobileDrawer: false,
  navLinks: [
    { name: 'Bridges & Structures', to: '/' },
    { name: 'Pipe', to: '/inspire' },
    { name: 'Stormwater Management', to: '/todos' },
    { name: 'Geosynthetics', to: '/inspire' },
    { name: 'Masonry', to: '/inspire' },
    { name: 'Other Products', to: '/inspire' }
  ],
})

export const mutations = {
  toggleMobileDrawer(state) {
    state.mobileDrawer = !state.mobileDrawer
  },
}
