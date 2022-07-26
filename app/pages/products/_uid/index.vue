<template>
  <div>
    <section class="hero">
      <v-img
        :src="heroImg.src"
        :srcset="heroImg.srcset"
        :sizes="heroImg.sizes"
        :gradient="theme.dark ? theme.themes.dark.heroGradient : theme.themes.light.heroGradient"
      />
      <!-- breadcrumbs nav -->
      <Breadcrumb :breadcrumbs="breadcrumbs"/>
      <v-container>
        <v-row align="center" class="fill-height text-center">
          <v-col>
            <div class="grey--text text--lighten-2">
              <prismic-rich-text :field="document.data.name" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section>
      <v-container>
        <!-- template for product category cards -->
        <v-row>
          <v-col
            v-for="(product, index) in products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              :to="`./${uid}/${product.uid}`"
              outlined
              hover
              height="100%"
            >
              <v-img
                :src="cardImgs[index].src"
                :srcset="cardImgs[index].srcset"
                :sizes="cardImgs[index].sizes"
                height="200px"
              ></v-img>

              <v-card-title>{{ product.data.name[0].text }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Route } from 'vue-router/types'
import { Store, mapState } from 'vuex'
import { find } from 'lodash'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
import pageVisits from '~/services/pageVisits'
import { IPrismic, IPrismicDocument } from '~/shims'
import Breadcrumb from '~/components/Navigation/Breadcrumbs.vue'

@Component({
  components: {
    Breadcrumb,
  },
  computed: {
    ...mapState('layout', ['placeholders', 'theme']),
  }
})
export default class ProductCategoryPage extends Vue {
  document: IPrismicDocument | null = null
  breadcrumbs: IBreadcrumb[] | null = null

  get heroImg() {
    const url = this.document?.data.hero_image.fileUrl;
    if(!url) {
      return {
        src: '',
        srcset: '',
        sizes: '',
      }
    }
    return {
      src: url,
      srcset: createImgSrcset(url),
      sizes: createImgSizes(),
    }
  }

  get cardImgs() {
    const cardUrls = this.products.map((product: any) => product.data.hero_image.fileUrl);
    const placeholder = {
      src: (this as any).placeholders.file,
      srcset: '',
      sizes: '',
    };
    if(cardUrls.length === 0) {
      return [placeholder]
    }
    const cols = {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
    };
    return cardUrls.map((url?: string) => {
      if(!url) {
        return placeholder;
      }
      return {
        src: url,
        srcset: createImgSrcset(url, cols),
        sizes: createImgSizes(cols),
      };
    })
  }

  head() {
    return {
      title: this.document?.data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.document?.data.meta_description
        }
      ]
    }
  }

  // product cards
  get products() {
    return this.$store.state.products.products.filter(
      (product: any) =>
        product.data.product_category.uid === this.$route.params.uid
    )
  }

  // for product card links
  get uid() {
    return this.$route.params.uid
  }

  async fetch({
    store,
    $prismic,
    params
  }: {
    store: Store<any>
    $prismic: IPrismic
    params: Route['params']
  }) {
    // return if page has been visited
    if (pageVisits(store) > 1) return

    const { uid } = params

    // get product category - either from store or by querying prismic
    let cat = find(
      store.state.products.productCategories,
      (category) => category.uid === uid
    )
    if (!cat) {
      cat = await $prismic.api.getByUID('product_categories', uid)
      store.commit('products/addProductCategory', cat)
    }

    // get products by category id
    const catId = cat.id
    await store.dispatch('products/getProductsByCategory', {
      $prismic,
      catId
    })
  }

  created() {
    const uid = this.$route.params.uid
    this.document = find(
      this.$store.state.products.productCategories,
      (category) => category.uid === uid
    )
    this.breadcrumbs = [
      {
        exact: true,
        text: 'Products',
        to: {
          path: '/products'
        }
      },
      {
        exact: true,
        text: this.document?.data.name[0].text,
        to: {
          path: `/products/${this.document?.uid}`
        }
      }
    ]
  }
}
</script>
