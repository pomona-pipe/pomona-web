<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">{{ message }}</v-card-title>
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a
              href="https://vuetifyjs.com"
              target="_blank"
            >documentation</a>.
          </p>
          <p>
            If you have questions, please join the official
            <a
              href="https://chat.vuetifyjs.com/"
              target="_blank"
              title="chat"
            >discord</a>.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              title="contribute"
            >issue board</a>.
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
          <div class="text-xs-right">
            <em>
              <small>&mdash; John Leider</small>
            </em>
          </div>
          <hr class="my-3" />
          <a href="https://nuxtjs.org/" target="_blank">Nuxt Documentation</a>
          <br />
          <a href="https://github.com/nuxt/nuxt.js" target="_blank">Nuxt GitHub</a>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire">Continue</v-btn>
        </v-card-actions>
      </v-card>
      <!-- check posts exists -->
      <div v-if="products.length !== 0">
        <!-- template for products cards -->
        <section v-for="product in products" :key="product.id" v-bind:product="product">
          <v-card class="mx-auto" max-width="344">
            <v-img :src=product.cover_image.url  height="200px"></v-img>

            <v-card-title> {{ product.name[0].text }}</v-card-title>

            <v-card-subtitle>{{ product.description[0].text }}</v-card-subtitle>
          </v-card>
        </section>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

@Component({
  components: {
    Logo,
    VuetifyLogo
  }
})
export default class Index extends Vue {
  message = 'Welcome to the Pomona website!'
  products: any[]

  // server-side nuxt lifecycle hook
  async asyncData({ $prismic, error }) {
    const byProducts = $prismic.predicates.at('document.type', 'products')
    const products = await $prismic.api.query(byProducts)
    return {
      products: products.results.map((result) => result.data)
    }
  }
}
</script>
