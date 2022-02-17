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
              :srcset="image.srcset"
              :sizes="image.sizes"
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
    const gallery = (this.document as IPrismicDocument).data.image_gallery;
    const cols = {
      xs: 12,
    };
    return (gallery as any[]).map((item) => ({
      key: item.key,
      src: item.project_image.fileUrl,
      srcset: createImgSrcset(item.project_image.fileUrl, cols),
      sizes: createImgSizes(cols),
    }));
  }

  // fetch project from store and copy to component
  created() {
    const uid = this.$route.params.uid
    this.document = find(this.$store.state.projects.projects, { uid })
  }
}
</script>
