<template>
  <div id="technical-guides-page" class="page hero-overlap">
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
              <prismic-rich-text
                :field="technicalGuidesPage[0].data.main_title"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Page Content -->
    <section>
      <v-container>
        <!-- template for downloadable documents -->
        <v-row>
          <v-col cols="12" lg="10" offset-lg="1">
            <v-card elevation="8" class="pa-2 pa-lg-4 rounded-xl">
              <v-list rounded>
                <v-list-item
                  v-for="file in technicalGuidesPage[0].data.all_documents"
                  :key="file.id"
                  target="_blank"
                  :href="`${file.document.fileUrl}`"
                >
                  <v-list-item-icon>
                    <v-icon color="red">{{ mdiFilePdf }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="`${file.document.fileName}`">
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
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
import { mdiFilePdf } from '@mdi/js'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
import pageVisits from '~/services/pageVisits'
import { IPrismic } from '~/shims'

@Component({
  computed: {
    ...mapState('layout', ['theme']),
    ...mapState('pages', ['technicalGuidesPage']),
  }
})
export default class Index extends Vue {
  // Material Design Pdf Icon
  mdiFilePdf = mdiFilePdf

  get heroImg() {
    const url = (this as any).technicalGuidesPage[0].data.hero_image.fileUrl;
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
      title: (this as any).technicalGuidesPage[0].data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).technicalGuidesPage[0].data.meta_description
        }
      ]
    }
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    if (pageVisits(store) > 1) return
    await store.dispatch('pages/getTechnicalGuidesPage', $prismic)
  }
}
</script>
