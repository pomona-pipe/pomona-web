<template>
  <section>
    <!-- custom markup with document props -->
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
@Component({})
export default class DetailPage extends Vue {
  async fetch({ $prismic, params, error }) {
    try{
      // Query to get post content
      this.document = (await $prismic.api.getByUID('page', params.uid)).data
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  }
}
</script>