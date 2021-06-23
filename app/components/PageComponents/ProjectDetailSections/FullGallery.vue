<template>
  <section class="page">
    <v-container>
      <h2 class="text-center">Full Gallery</h2>
      <v-row justify="center" class="fill-height">
        <v-col cols="12" align="start">
          <v-carousel class="rounded-xl img-overflow-mask" show-arrows-on-hover>
            <v-carousel-item
              v-for="image in galleryImgs"
              :key="image.id"
              :src="image.src"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { find } from 'lodash'
import { IPrismicDocument } from '~/shims'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'

@Component({})
export default class FullGallery extends Vue {
  document: IPrismicDocument | null = null

  get galleryImgs() {
    const filtered = this.document!.data.image_gallery.filter((item: any) => item.project_image && item.project_image.fileUrl);
    const cols = {
      xs: 12,
      md: 5,
    };
    return filtered.map((item: any) => {
      const url = item.project_image.fileUrl;
      return {
        src: url,
        srcset: createImgSrcset(url, cols),
        sizes: createImgSizes(cols),
      };
    })
  }

  // fetch project from store and copy to component
  created() {
    const uid = this.$route.params.uid
    this.document = find(this.$store.state.projects.projects, { uid })
  }
}
</script>
