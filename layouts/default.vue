<template>
  <v-app>
    <v-app-bar app fixed color="#303030" dark shrink-on-scroll dense>
      <img src="~/assets/logo_xlarge.png" class="pomona_logo"/>
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in navLinks"
          :key="link"
          :nuxt="true"
          :to="link.to"
          color="white"
          text
          rounded
          class="my-2"
        >{{ link.name }}</v-btn>
      </v-row>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer color="#303030" padless>
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in navLinks"
          :key="link"
          :nuxt="true"
          :to="link.to"
          color="white"
          text
          rounded
          class="my-2"
        >{{ link.name }}</v-btn>
        <v-col class="#303030 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>Vuetify</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<style lang="css" scoped>
.my-2 {
  display: flex;
}
.pomona_logo {
  max-height: 50%;
  margin: auto;
}
</style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'

@Component({
  components: {},
  computed: mapState('layout', ['navLinks'])
})
export default class DefaultLayout extends Vue {
 
}
</script>
