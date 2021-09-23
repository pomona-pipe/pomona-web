<template>
  <section>
    <!-- Customer Reach Section -->
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <v-img
            :src="mapImg.src"
            :srcset="mapImg.srcset"
            :sizes="mapImg.sizes"
            max-height="800px"
          ></v-img>
        </v-col>
        <v-col cols="12" md="5">
          <prismic-rich-text
            :field="home[0].data.customer_reach_title"
            class="text-center"
          />
          <p class="text-center text-lg-left">
            {{ home[0].data.customer_reach_subtitle }}
          </p>
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
    ...mapState('pages', ['home'])
  }
})
export default class CustomerReach extends Vue {
  get mapImg() {
    const mapUrl = this.$store.state.pages.home[0].data.customer_reach_map.fileUrl
    const cols = {
      xs: 12,
      md: 7,
    };
    return {
      src: mapUrl,
      srcset: createImgSrcset(mapUrl, cols),
      sizes: createImgSizes(cols),
    }
  }
}
</script>
