<template>
  <v-app>
    <v-app-bar app fixed color="#303030" dark shrink-on-scroll>
      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
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
          v-for="link in links"
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

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class DefaultLayout extends Vue {
  clipped = false
  drawer = false
  fixed = false
  items = [
    {
      icon: 'mdi-apps',
      title: 'Welcome',
      to: '/'
    },
    {
      icon: 'mdi-chart-bubble',
      title: 'Inspire',
      to: '/inspire'
    }
  ]
  miniVariant = false
  right = true
  rightDrawer = false
  title = 'Vuetify.js'
  links = [
    { name: 'Home', to: '/' },
    { name: 'About Us', to: '/inspire' },
    { name: 'Team', to: '/inspire' },
    { name: 'Services', to: '/inspire' },
    { name: 'Blog', to: '/inspire' },
    { name: 'Contact Us', to: '/inspire' }
  ]
}
</script>
