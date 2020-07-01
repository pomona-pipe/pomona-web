<template>
  <v-layout>
    <v-flex>
      <v-container>
        <h1>This is the team page</h1>
        <v-row cols="12">
          <v-col sm="6">
            <v-img :src="team[0].data.main_image.url"></v-img>
          </v-col>
          <v-col sm="6">
            <h1>{{ team[0].data.main_title[0].text }}</h1>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store, mapState } from 'vuex'
import { IPrismic } from '~/shims'

@Component({
  components: {},
  computed: mapState('pages', ['team'])
})
export default class Index extends Vue {
  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    await store.dispatch('pages/getTeam', $prismic)
  }
}
</script>
