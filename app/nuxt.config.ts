import { Configuration } from 'webpack'
import theme from './settings/theme'
import sitemapRouteGenerator from './modules/sitemapRouteGenerator'

export default {
  mode: 'universal',
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOSTNAME || 'localhost',
    timing: false
  },
  /*
  ** Client-side env vars
  ** 1. process.env.myEnvVarCamelCase
  ** 2. context.env.myEnvVarCamelCase
  */
  env: {
      algoliaAppId: process.env.ALGOLIA_APP_ID,
      algoliaApiKey: process.env.ALGOLIA_API_KEY
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '',
    titleTemplate: (titleChunk: string) => {
      return titleChunk
        ? `${titleChunk} - Pomona Pipe Products`
        : 'Pomona Pipe Products'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: ['~/assets/fonts/openSans.css','~/assets/fonts/playfairDisplay.css','~/assets/fonts/poppins.css','~/assets/fonts/roboto.css', '~/assets/style/app.scss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@plugins/prismic-links.client.ts',
    '@plugins/vue-instantsearch.ts'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@modules/sitemapRouteGenerator'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxt/http',
    '@/modules/static',
    '@/modules/crawler',
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/prismic',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/google-gtag'
  ],
  /*
  ** Nuxt.js router
  */
  router: {
    middleware: 'redirects'
  },
  // vuetify config
  vuetify: {
    theme,
    icons: {
      iconfont: 'mdiSvg'
    },
    defaultAssets: false,
    treeShake: true,
    customVariables: ['~/assets/style/vuetify.scss']
  },
  // This is where you configure your settings for the new plugin
  prismic: {
    endpoint: 'https://pomona.cdn.prismic.io/api/v2',
    linkResolver: '@/plugins/link-resolver.ts',
    htmlSerializer: '@/plugins/html-serializer.ts'
  },
  // @nuxtjs/sitemap module config
  sitemap: {
    hostname: 'https://www.pomonapipeproducts.com',
    gzip: true,
    routes: async () => {
      return await sitemapRouteGenerator()
    },
    exclude: ['/preview'],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    }
  },
  // @nuxtjs/robots module config
  robots: {
    UserAgent: '*',
    Disallow: '/preview',
  },
  // @nuxtjs/google-gtag module config
  'google-gtag': {
    id: 'G-RZJQCE20Y7',
    config: {
      send_page_view: false,
    },
    debug: false,
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** style-resources - automatically shares scss vars across components and stylesheets
  ** https://github.com/nuxt-community/style-resources-module
  */
  styleResources: {
    scss: ['~/assets/style/variables.scss']
  },
  /*
  **  server middleware - use for api endpoints
  **  https://nuxtjs.org/api/configuration-servermiddleware/
  */
  serverMiddleware: { '/api': '~/api' },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es'],
    /*
    ** You can extend webpack config here
    */
    extend(config: Configuration) {
      config.resolve!.alias!.vue = 'vue/dist/vue.common'
    }
  }
}
