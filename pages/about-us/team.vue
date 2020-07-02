<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-container>
          <v-row cols="12">
            <v-col sm="6">
              <h1>{{ team[0].data.main_title[0].text }}</h1>
            </v-col>
            <v-col sm="6">
              <v-img :src="team[0].data.main_image.url"></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-container fluid grid-list-sm>
        <v-layout row wrap class="align-stretch">
          <v-flex v-for="employee in employees" :key="employee.id" xs12 md6 lg3>
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <v-card :elevation="hover ? 16 : 2" class="mx-auto" max-width="344" height="100%">
                <v-img :src="employee.data.profile_image.url" height="200px"></v-img>

                <v-card-title>{{ employee.data.name[0].text }}</v-card-title>
                <v-card-text>
                  <div>{{ employee.data.job_title[0].text }}</div>
                  <div v-if="employee.data.territory.length > 0">{{ employee.data.territory[0].text }}</div>
                  <div>{{ employee.data.email_address[0].text }}</div>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store, mapState } from 'vuex'
import { IPrismic } from '~/shims'

@Component({
  components: {},
  computed: {
    ...mapState('pages', ['team']),
    ...mapState('employees', ['employees'])
  }
})
export default class Index extends Vue {
  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    await store.dispatch('pages/getTeam', $prismic)
    await store.dispatch('employees/getEmployees', $prismic)
  }
}
</script>
