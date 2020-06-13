/*
  custom shim for prismic client - injected as $prismic into Vue prototype
  other type shims can be found at https://github.com/prismicio/prismic-vue/issues/5
*/
import { DefaultClient } from 'prismic-javascript/d.ts/client'

type PrismicClient = DefaultClient
