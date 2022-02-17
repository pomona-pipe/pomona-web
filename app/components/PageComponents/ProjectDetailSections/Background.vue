<template>
  <section class="page">
    <v-row class="mx-0">
      <v-col class="px-0" order-md="2" cols="11" offset="1" md="5">
        <v-img
          class="rounded-l-xl"
          :src="sectionImg.src"
          :srcset="sectionImg.srcset"
          :sizes="sectionImg.sizes"
        ></v-img>
      </v-col>
      <v-col class="pl-0" order-md="1" cols="10" offset="1" md="5">
        <h2>Background</h2>
        <prismic-rich-text :field="document.data.background_paragraph" />
      </v-col>
    </v-row>
  </section>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { find } from 'lodash'
import { IPrismicDocument } from '~/shims'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'

@Component({})
export default class Background extends Vue {
  document: IPrismicDocument | null = null

  get sectionImg() {
    const url = (this.document as IPrismicDocument).data.background_image.fileUrl;
    const cols = {
      xs: 11,
      md: 5,
    };
    const layoutConfig = {
      useContainer: false,
      rowMarginX: 0,
      colPaddingX: 0,
    };
    return {
      src: url,
      srcset: createImgSrcset(url, cols, layoutConfig),
      sizes: createImgSizes(cols, layoutConfig),
    }
  }

  // fetch project from store and copy to component
  created() {
    const uid = this.$route.params.uid
    this.document = find(this.$store.state.projects.projects, { uid })
  }
}
</script>
