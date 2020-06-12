<template>
  <v-app>
    <v-app-bar app fixed color="#303030" dark shrink-on-scroll dense>
      <img src="~/assets/logo_xlarge.png" class="pomona_logo" />
      <div>
        <v-menu
          v-for="navOption in mainNavigation"
          :key="navOption.primary.link.id"
          open-on-hover
          bottom
          offset-y
        >
          <!-- non-repeat -->
          <template v-slot:activator="{ on }">
            <v-btn
              :nuxt="true"
              :to="{ path: `/${navOption.primary.link.uid}` }"
              color="#303030"
              dark
              v-on="on"
              >{{ navOption.primary.label[0].text }}</v-btn
            >
          </template>

          <!-- repeat -->
          <v-list v-if="navOption.items && navOption.items.length > 0">
            <v-list-item
              v-for="subNavOption in navOption.items"
              :key="subNavOption.sub_nav_link.id"
              :nuxt="true"
              :to="{
                path: `/${navOption.primary.link.uid}/${subNavOption.sub_nav_link.uid}`
              }"
              text
              rounded
              class="my-2"
            >
              <v-list-item-title>{{
                subNavOption.sub_nav_link_label[0].text
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
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

    <!-- <v-footer color="#303030" padless>
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
    </v-footer>-->
  </v-app>
</template>
<style lang="css" scoped>
.my-2 {
  display: flex;
}
.pomona_logo_link {
  max-height: 50%;
  margin: auto;
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
  computed: {
    ...mapState('layout', ['mainNavigation', 'navLinks'])
  }
})
export default class DefaultLayout extends Vue {
  async middleware({ store, $prismic }) {
    await store.dispatch('layout/getMainNavigation', $prismic)
  }
}
</script>
