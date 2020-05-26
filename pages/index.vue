<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 md6 lg3>
      <v-container>
        <!-- check product categories exists -->
        <v-layout
          row
          wrap
          v-if="productCategories.length !== 0"
          column
          justify-center
          align-center
        >
          <!-- template for product category cards -->
          <v-container fluid grid-list-lg>
            <v-layout row wrap>
              <v-flex
                xs12
                md6
                lg3
                v-for="cat in productCategories"
                :key="cat.id"
              >
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <v-card
                    :elevation="hover ? 16 : 2"
                    class="mx-auto"
                    max-width="344"
                  >
                    <v-img :src="cat.category_image.url" height="200px"></v-img>

                    <v-card-title>{{
                      cat.category_title[0].text
                    }}</v-card-title>
                  </v-card>
                </v-hover>
              </v-flex>
            </v-layout>
          </v-container>
        </v-layout>
      </v-container>
      <v-card>
        <v-card-title class="headline"
          >Welcome to the Pomona website</v-card-title
        >
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a href="https://vuetifyjs.com" target="_blank">documentation</a>.
          </p>
          <p>
            If you have questions, please join the official
            <a href="https://chat.vuetifyjs.com/" target="_blank" title="chat"
              >discord</a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              title="contribute"
              >issue board</a
            >.
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
          <a href="https://github.com/nuxt/nuxt.js" target="_blank"
            >Nuxt GitHub</a
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'

@Component({
  components: {},
  computed: {
    ...mapState('products', ['productCategories'])
  }
})
export default class Index extends Vue {
  async fetch({ store, $prismic }) {
    await store.dispatch('products/getProductCategories', $prismic)
  }
}
</script>
