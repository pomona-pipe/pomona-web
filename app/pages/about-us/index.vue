<template>
  <div id="about-us-page" class="page">
    <!-- Hero Banner -->
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
              <prismic-rich-text :field="aboutUs[0].data.hero_title" />
            </div>
            <div>
              <p class="subtitle">
                {{ aboutUs[0].data.hero_subtitle[0].text }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Page Content -->
    <section>
      <v-container>
        <v-row cols="12">
          <v-col sm="10" lg="8" offset-sm="1" offset-lg="2">
            <prismic-rich-text
              class="text-center"
              :field="aboutUs[0].data.page_sections[0].primary.section_title"
            />
            <prismic-rich-text
              class="pa-3"
              :field="aboutUs[0].data.page_sections[0].primary.section_text"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>
<style lang="css" scoped></style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store, mapState } from 'vuex'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
import pageVisits from '~/services/pageVisits'
import { IPrismic } from '~/shims'

@Component({
  components: {},
  computed: {
    ...mapState('layout', ['theme']),
    ...mapState('pages', ['aboutUs']),
  }
})
export default class Index extends Vue {
  get heroImg() {
    const url = (this as any).aboutUs[0].data.hero_background_image.fileUrl;
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

  head() {
    return {
      title: (this as any).aboutUs[0].data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).aboutUs[0].data.meta_description
        }
      ]
    }
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    if (pageVisits(store) > 1) return
    await store.dispatch('pages/getAboutUs', $prismic)
  }
}
</script>
