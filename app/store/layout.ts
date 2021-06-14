import { Route } from 'vue-router/types'
import { Theme } from 'vuetify/types/services/theme'
import theme, { IExtendedTheme } from '~/settings/theme'
import { DeepPartial } from '../types/global';
// TODO: create types for api response data/payloads
import { IPrismic } from '~/shims'

interface SearchState {
  open: boolean
  isClosing: boolean
}

interface ILayoutThemeVariant extends Partial<IExtendedTheme> {
  heroGradient: string
}

interface ILayoutTheme extends DeepPartial<Theme> {
  themes: {
    dark: ILayoutThemeVariant
    light: ILayoutThemeVariant
  }
}

interface IState {
  routerHistory: Partial<Route>[]
  isMobile: boolean | null
  searchBar: SearchState
  mobileDrawer: boolean
  mainNavigation: any[]
  footerNavigation: any[]
  placeholders: { [key: string]: string }
  theme: ILayoutTheme
}

export const state: () => IState = () => {
  const { dark, themes, options } = theme;
  const heroGradients = {
    light: 'to right top, rgba(36, 36, 36, 0.9), rgba(25, 32, 72, 0.7)',
    dark: 'to right top, rgba(36, 36, 36, 0.9), rgba(25, 32, 72, 0.7)',
  };
  return {
    routerHistory: [],
    isMobile: null,
    searchBar: {
      open: false,
      isClosing: false
    },
    mobileDrawer: false,
    mainNavigation: [],
    footerNavigation: [],
    placeholders: {
      account: '/images/placeholders/account.svg',
      file: '/images/placeholders/file-image.svg'
    },
    // theme,
    theme: {
      dark,
      themes: {
        light: {
          ...themes.light,
          heroGradient: heroGradients.light,
        },
        dark: {
          ...themes.dark,
          heroGradient: heroGradients.dark,
        },
      },
      options,
    },
  }
}

export const mutations = {
  updateRouterHistory(state: IState, payload: Partial<Route>) {
    state.routerHistory.push(payload)
  },
  setIsMobile(state: IState, value: boolean) {
    state.isMobile = value
  },
  setSearchBar(state: IState, value: SearchState) {
    Object.assign(state.searchBar, value)
  },
  setMobileDrawer(state: IState, value: boolean) {
    state.mobileDrawer = value
  },
  toggleMobileDrawer(state: IState) {
    state.mobileDrawer = !state.mobileDrawer
  },
  setMainNavigation(state: IState, payload: any[]) {
    state.mainNavigation = payload
  },
  setFooterNavigation(state: IState, payload: any[]) {
    state.footerNavigation = payload
  }
}

export const actions = {
  async getMainNavigation({ commit }: { commit: any }, $prismic: IPrismic) {
    const byMainNavigation = $prismic.predicates.at(
      'document.type',
      'main_navigation'
    )
    const response = await $prismic.api.query(byMainNavigation, {})
    let mainNavigation = response.results[0].data.nav
    // ensure nav options have a label and a link
    mainNavigation = mainNavigation.filter(
      (option: any) =>
        option.primary.label.length > 0 &&
        option.primary.label[0].text &&
        option.primary.link.id
    )
    // ensure subnav options have a label and a link
    mainNavigation = mainNavigation.map((option: any) => {
      option.items = option.items.filter(
        (suboption: any) =>
          suboption.sub_nav_link_label.length > 0 &&
          suboption.sub_nav_link_label[0].text &&
          suboption.sub_nav_link.id
      )
      return option
    })
    commit('setMainNavigation', mainNavigation)
  },
  async getFooterNavigation({ commit }: { commit: any }, $prismic: IPrismic) {
    const byFooterNavigation = $prismic.predicates.at(
      'document.type',
      'footer_navigation'
    )
    const footerNavigation = await $prismic.api.query(byFooterNavigation, {})
    commit(
      'setFooterNavigation',
      footerNavigation.results.map((result) => result)
    )
  }
}
