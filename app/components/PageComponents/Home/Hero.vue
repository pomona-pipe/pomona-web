<template>
  <section class="hero">
    <v-img
      :src="heroImg.src"
      :srcset="heroImg.srcset"
      :sizes="heroImg.sizes"
      gradient="to right top, rgba(36, 36, 36, 0.9), rgba(25, 32, 72, 0.7)"
    />
    <v-container>
      <v-row align="center" class="fill-height">
        <v-col align="center">
          <div class="grey--text text--lighten-2">
            <prismic-rich-text :field="home[0].data.hero_title" />
          </div>
          <div>
            <p class="subtitle">{{ home[0].data.hero_subtitle }}</p>
          </div>
          <v-hover v-slot:default="{ hover }">
            <v-btn
              to="/about-us"
              rounded
              large
              color="primary"
              :outlined="hover ? true : false"
              >Learn More</v-btn
            >
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'

@Component({
  components: {},
  computed: {
    ...mapState('pages', ['home']),
  }
})
export default class Hero extends Vue {
  get heroImg() {
    const url = this.$store.state.pages.home[0].data.hero_image.fileUrl;
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
}
</script>
