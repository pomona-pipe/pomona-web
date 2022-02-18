<template>
  <div id="services-page" class="page">
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
              <prismic-rich-text :field="services[0].data.hero_title" />
            </div>
            <div>
              <p class="subtitle">
                {{ services[0].data.hero_subtitle[0].text }}
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
          <v-col sm="10" offset-sm="1" class="text-center">
            <prismic-rich-text
              :field="services[0].data.body[0].primary.section_title"
            />
            <prismic-rich-text
              :field="services[0].data.body[0].primary.section_text"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section>
      <v-container>
        <v-row>
          <v-col cols="12" md="12" class="text-center">
            <prismic-rich-text
              :field="services[0].data.body[1].primary.video_title"
            />
            <prismic-rich-text
              :field="services[0].data.body[1].primary.video_text"
            />
          </v-col>
          <v-col cols="12" md="12">
            <v-responsive
              style="max-height: 70vh; max-width: 124.5vh"
              class="mx-auto rounded-xl"
              :aspect-ratio="16 / 9"
            >
              <iframe
                frameborder="0"
                width="100%"
                height="100%"
                :src="
                  services[0].data.body[1].primary.video_link.embed_url.replace(
                    'watch?v=',
                    'embed/'
                  )
                "
                allowfullscreen="true"
              ></iframe>
            </v-responsive>
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
    ...mapState('pages', ['services']),
  }
})
export default class Index extends Vue {
  get heroImg() {
    const url = (this as any).services[0].data.hero_image.fileUrl;
    if(!url) {
      return {
        src: '',
        srcSet: '',
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
      title: (this as any).services[0].data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).services[0].data.meta_description
        }
      ]
    }
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    if (pageVisits(store) > 1) return
    await store.dispatch('pages/getServices', $prismic)
  }
}
</script>
