<template>
  <v-app>
    <v-app-bar app fixed color="#303030" dark hide-on-scroll dense prominent>
      <div class="d-flex justify-space-between align-center flex-no-wrap appBarContent">
        <div>
          <nuxt-link to="/">
            <img src="~/assets/logo_xlarge.png" class="pomona_logo" />
          </nuxt-link>
        </div>
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
                height="48px"
              >{{ navOption.primary.label[0].text }}</v-btn>
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
                <v-list-item-title>
                  {{
                  subNavOption.sub_nav_link_label[0].text
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>
<style lang="css" scoped>
.pomona_logo {
  max-height: 48px;
  margin: auto;
}
.appBarContent {
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Store, mapState } from 'vuex'
import { IPrismic } from '~/shims'

@Component({
  components: {},
  computed: {
    ...mapState('layout', ['mainNavigation', 'navLinks'])
  }
})
export default class DefaultLayout extends Vue {
  async middleware({
    route,
    store,
    $prismic
  }: {
    route: any
    store: Store<any>
    $prismic: IPrismic
  }) {
    store.commit('layout/setPageName', route.path)
    await store.dispatch('layout/getMainNavigation', $prismic)
  }
}
</script>
