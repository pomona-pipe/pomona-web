<template>
  <v-layout>
    <v-flex>
      <v-container>
          <h1>This is the Contact Us page</h1>
        
       
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
  computed: mapState('products', ['productCategories'])
})
export default class Index extends Vue {
  async fetch({ store, $prismic }: { store: Store<any>; $prismic: IPrismic }) {
    await store.dispatch('products/getProductCategories', $prismic)
  }
}
</script>
