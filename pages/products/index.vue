<template>
  <v-layout>
    <v-flex>
      <v-container>
        <!-- check product categories exists -->
        <div>
          <h1>This is the Products page</h1>
        </div>
        <v-layout
          row
          wrap
          v-if="productCategories.length !== 0"
          column
          justify-center
          align-center
        >
          <!-- template for product category cards -->
          <v-container fluid grid-list-sm>
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
