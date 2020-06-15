<template>
  <section>
    <!-- custom markup with document props -->
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Prismic } from '~/shims'
@Component({})
export default class DetailPage extends Vue {
  async fetch({
    $prismic,
    params,
    error
  }: {
    $prismic: Prismic
    params: any
    error: any
  }) {
    try {
      // Query to get post content
      const document = (await $prismic.getByUID('page', params.uid, {})).data
      return { document }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  }
}
</script>
