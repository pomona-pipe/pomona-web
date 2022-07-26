<template>
  <div id="contact-page" class="page hero-overlap">
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
              <prismic-rich-text :field="contact[0].data.main_title" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Contact Form -->
    <section>
      <v-container>
        <v-row>
          <v-col cols="12" lg="10" offset-lg="1">
            <v-card elevation="8" class="pa-4 pa-lg-6 rounded-xl">
              <ContactForm />
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
import ContactForm from '~/components/Forms/ContactForm.vue'

@Component({
  components: { ContactForm },
  computed: {
    ...mapState('layout', ['theme']),
    ...mapState('pages', ['contact']),
  }
})
export default class Index extends Vue {
  get heroImg() {
    const url = (this as any).contact[0].data.hero_image.fileUrl;
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
      title: (this as any).contact[0].data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).contact[0].data.meta_description
        }
      ]
    }
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    if (pageVisits(store) > 1) return
    await store.dispatch('pages/getContact', $prismic)
  }
}
</script>
