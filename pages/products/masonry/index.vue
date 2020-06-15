<template>
  <v-layout>
    <v-flex>
      <v-container>
        <!-- check product categories exists -->
        <div>
          <h1>This is the Masonry page</h1>
        </div>
        <v-layout
          v-if="products.length > 0"
          row
          wrap
          column
          justify-center
          align-center
        >
          <!-- template for product category cards -->
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-container v-for="product in products" :key="product.id">
                <v-flex xs12 md6 lg3>
                  <v-hover v-slot:default="{ hover }" open-delay="200">
                    <v-card
                      :elevation="hover ? 16 : 2"
                      class="mx-auto"
                      max-width="344"
                    >
                      <v-img
                        :src="product.cover_image.url"
                        height="200px"
                      ></v-img>

                      <v-card-title>
                        {{ product.name[0].text }}
                      </v-card-title>
                    </v-card>
                  </v-hover>
                </v-flex>
              </v-container>
            </v-layout>
          </v-container>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store } from 'vuex'
import { find } from 'lodash'
import { Prismic } from '~/shims'

const category = 'Masonry'

@Component({})
export default class ProductCategoryPage extends Vue {
  get products() {
    return this.$store.state.products.products.filter(
      (product: any) => product.product_category === category
    )
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: Prismic }) {
    const productsExist = find(store.state.products.products, [
      'product_category',
      category
    ])
    if (productsExist) return
    await store.dispatch('products/getProductsByCategory', {
      $prismic,
      category
    })
  }
}
</script>
