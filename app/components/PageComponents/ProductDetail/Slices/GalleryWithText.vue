<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="5" :offset-md="index % 2 === 0 ? 1 : 0" :order-md="index % 2 === 0 ? 2 : 1">
        <v-img
          class="rounded-xl"
          v-if="galleryImgs.length === 1"
          height="500"
          :src="galleryImgs[0].src"
          :srcset="galleryImgs[0].srcset"
          :sizes="galleryImgs[0].sizes"
        ></v-img>
        <v-carousel
          class="rounded-xl img-overflow-mask"
          v-else
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="image in galleryImgs"
            :key="image.id"
            :src="image.src"
            :srcset="image.srcset"
            :sizes="image.sizes"
          ></v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="12" md="5" :offset-md="index % 2 === 0 ? 0 : 1"   :order-md="index % 2 === 0 ? 1 : 2">
        <prismic-rich-text :field="slice.primary.section_title" />
        <prismic-rich-text :field="slice.primary.section_text" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
@Component({
  props: ['slice', 'index'],
  computed: {
    ...mapState('layout', ['placeholders'])
  }
})
export default class GalleryWithText extends Vue {
  get galleryImgs() {
    const galleryUrls = this.$props.slice.items.map((item: any) => item.section_image.fileUrl);
    const placeholder = {
      src: this.$store.state.layout.placeholders.file,
      srcset: '',
      sizes: '',
    };
    if(galleryUrls.length === 0) {
      return [placeholder]
    }
    const cols = {
      xs: 12,
      md: 5,
    };
    return galleryUrls.map((url?: string) => {
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
}
</script>
