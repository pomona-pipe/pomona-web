<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <v-img
        :src="heroImg.src"
        :srcset="heroImg.srcset"
        :sizes="heroImg.sizes"
        :gradient="theme.dark ? theme.themes.dark.heroGradient : theme.themes.light.heroGradient"
      />
      <v-container>
        <v-row align="center" class="fill-height">
          <v-col align="center">
            <div class="grey--text text--lighten-2">
              <prismic-rich-text :field="categoryPage[0].data.main_title" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Page Content -->
    <section>
      <v-container>
        <!-- template for product category cards -->
        <v-row>
          <v-col
            v-for="(cat, index) in productCategories"
            :key="cat.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card :to="`/products/${cat.uid}`" hover outlined height="100%">
              <v-img
                :src="cardImgs[index].src"
                :srcset="cardImgs[index].srcset"
                :sizes="cardImgs[index].sizes"
                height="200px"
              ></v-img>

              <v-card-title>{{ cat.data.name[0].text }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store, mapState } from 'vuex'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
import pageVisits from '~/services/pageVisits'
import { IPrismic } from '~/shims'

@Component({
  components: {},
  computed: {
    ...mapState('layout', ['placeholders', 'theme']),
    ...mapState('products', ['productCategories']),
    ...mapState('pages', ['categoryPage']),
  }
})
export default class Index extends Vue {
  get heroImg() {
    const url = (this as any).categoryPage[0].data.hero_image.fileUrl;
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
    const cardUrls = (this as any).productCategories.map((cat: any) => cat.data.hero_image.fileUrl);
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
      title: (this as any).categoryPage[0].data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).categoryPage[0].data.meta_description
        }
      ]
    }
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    if (pageVisits(store) > 1) return
    await store.dispatch('products/getProductCategories', $prismic)
    await store.dispatch('pages/getCategoryPage', $prismic)
  }
}
</script>
