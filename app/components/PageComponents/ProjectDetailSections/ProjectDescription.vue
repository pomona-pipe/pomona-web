<template>
  <section class="hero">
    <v-img
      :src="heroImg.src"
      :srcset="heroImg.srcset"
      :sizes="heroImg.sizes"
      :gradient="theme.dark ? theme.themes.dark.heroGradient : theme.themes.light.heroGradient"
    />
    <!-- breadcrumbs nav -->
    <Breadcrumb :breadcrumbs="breadcrumbs"/>
    <v-container>
      <v-row align="center" class="fill-height">
        <v-col align="center">
          <div class="grey--text text--lighten-2">
            <prismic-rich-text :field="document.data.name" />
          </div>
          <div>
            <p class="subtitle">{{ document.data.project_description }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { find } from 'lodash'
import moment from 'moment'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
import { IPrismicDocument } from '~/shims'
import Breadcrumb from '~/components/Navigation/Breadcrumbs.vue'

@Component({
  components: {
    Breadcrumb,
  },
  computed: {
    ...mapState('layout', ['theme']),
  }
})
export default class ProjectDescription extends Vue {
  document: IPrismicDocument | null = null
  breadcrumbs: IBreadcrumb[] | null = null

  get heroImg() {
    const url = (this as any).document.data.hero_image.fileUrl;
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

  formatDateString(dateString: string) {
    return moment(dateString).format('MMMM Do YYYY')
  }

  // fetch project from store and copy to component
  created() {
    const uid = this.$route.params.uid
    this.document = find(this.$store.state.projects.projects, { uid })

    this.breadcrumbs = [
      {
        exact: true,
        text: 'Projects',
        to: {
          path: '/projects'
        }
      },
      {
        exact: true,
        text: this.document!.data.name[0].text,
        to: {
          path: `/projects/${this.document!.uid}`
        }
      }
    ]
  }
}
</script>
