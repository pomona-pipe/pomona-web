<template>
  <div id="team-page" class="page">
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
              <prismic-rich-text :field="team[0].data.main_title" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- Page Content -->
    <section>
      <v-container>
        <v-row>
          <v-col
            v-for="(employee, index) in employees"
            :key="employee.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <v-card class="card" hover outlined height="100%" max-width="300px">
              <v-img
                :src="cardImgs[index].src"
                :srcset="cardImgs[index].srcset"
                :sizes="cardImgs[index].sizes"
                height="200px"
              ></v-img>
              <v-card-title>{{ employee.data.name }}</v-card-title>
              <v-card-text>
                {{ employee.data.job_title }}
                <br />
                <span v-if="employee.data.territory">
                  {{ employee.data.territory }}
                  <br />
                </span>
                <a :href="`mailto:${employee.data.email_address}`">
                  {{ employee.data.email_address }}
                </a>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style lang="css" scoped>
.card {
  margin: auto;
}
</style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store, mapState } from 'vuex'
import { createImgSrcset, createImgSizes } from '~/services/imgOptimization'
import pageVisits from '~/services/pageVisits'
import { IPrismic } from '~/shims'

@Component({
  components: {},
  computed: {
    ...mapState('layout', ['placeholders', 'theme']),
    ...mapState('pages', ['team']),
    ...mapState('employees', ['employees']),
  }
})
export default class Index extends Vue {
  get heroImg() {
    const url = (this as any).team[0].data.hero_image.fileUrl;
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

  get cardImgs() {
    const cardUrls = (this as any).employees.map((employee: any) => employee.data.profile_image?.fileUrl);
    const placeholder = {
      src: (this as any).placeholders.account,
      srcSet: '',
      sizes: '',
    };
    if(cardUrls.length === 0) {
      return [placeholder]
    }
    const cols = {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
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

  head() {
    return {
      title: (this as any).team[0].data.title_tag,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).team[0].data.meta_description
        }
      ]
    }
  }

  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    if (pageVisits(store) > 1) return
    await store.dispatch('pages/getTeam', $prismic)
    await store.dispatch('employees/getEmployees', $prismic)
  }
}
</script>
