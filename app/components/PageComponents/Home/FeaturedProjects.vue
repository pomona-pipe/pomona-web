<template>
  <!-- Featured Project Section -->
  <!-- note this section is not on Prismic home page -->
  <section>
    <v-container>
      <h2 class="text-center">Featured Projects:</h2>
      <v-row class="mt-12">
        <v-col
          v-for="(project, index) in projects"
          :key="project.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            :to="`/projects/${project.uid}`"
            hover
            outlined
            height="100%"
            class="d-flex flex-column justify-space-between"
          >
            <v-img
              :src="cardImgs[index].src"
              :srcset="cardImgs[index].srcset"
              :sizes="cardImgs[index].sizes"
              height="200px"
            ></v-img>

            <v-card-title>{{ project.data.name[0].text }}</v-card-title>
            <v-card-text class="text--primary">{{
              project.data.project_description
            }}</v-card-text>
            <v-card-subtitle>
              {{ formatDateString(project.data.overview_completion_date) }} in
              {{ project.data.project_location }}
            </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-hover v-slot:default="{ hover }">
            <v-btn
              to="/projects"
              rounded
              large
              color="primary"
              :outlined="hover ? true : false"
              >See All Projects</v-btn
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
import moment from 'moment'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'

@Component({
  components: {},
  computed: {
    ...mapState('pages', ['home']),
    ...mapState('projects', ['projects']),
    ...mapState('layout', ['placeholders'])
  }
})
export default class FeaturedProjects extends Vue {
  get projects() {
    return this.$store.state.projects.projects.slice(0, 3);
  }

  get cardImgs() {
    const cardUrls = this.projects.map((project: any) => project.data.hero_image.fileUrl);
    const placeholder = {
      src: (this as any).placeholders.file,
      srcSet: '',
      sizes: '',
    };
    if(cardUrls.length === 0) {
      return [placeholder]
    }
    const cols = {
      xs: 12,
      sm: 6,
      lg: 4,
    };
    return cardUrls.map((url?: string) => {
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


  formatDateString(dateString: string) {
    return moment(dateString).format('MMMM YYYY')
  }
}
</script>
