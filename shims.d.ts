/*
  shim for $prismic on Vue prototype - injected by prismic-vue
  https://github.com/prismicio/prismic-vue/issues/5
  more details about $prismic can be found at ./node_modules/prismic-vue/src/index.js
*/
// TODO: review VuePrismic interface - many discrepancies between type defs and actual usage
import { getApi } from 'prismic-javascript'
import { DefaultClient } from 'prismic-javascript/d.ts/client'

import Vue from 'vue'

type ThenArg<T> = T extends Promise<infer U> ? U : T
type PrismicAPIPromise = ReturnType<typeof getApi>
type PrismicAPI = ThenArg<PrismicAPIPromise>

type ElementType =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'paragraph'
  | 'preformatted'
  | 'strong'
  | 'em'
  | 'list-item'
  | 'o-list-item'
  | 'group-list-item'
  | 'group-o-list-item'
  | 'image'
  | 'embed'
  | 'hyperlink'
  | 'label'
  | 'span'

type Elements = { [key in ElementType]: string }

type HTMLSerializer<T> = (
  type: ElementType,
  element: any,
  text: string | null,
  children: T[],
  index: number
) => T

interface RichText {
  Elements: Elements
  asHtml(
    richText: any,
    linkResolver?: (doc: any) => string,
    serializer?: HTMLSerializer<string>
  ): string
  asText(richText: any, joinString?: string): string
}

interface Link {
  url(link: any, linkResolver?: (doc: any) => string): string
}

interface VuePrismic {
  endpoint: string
  linkResolver: (doc: any) => string
  htmlSerializer: HTMLSerializer<string>
  // replaced client with api
  api: DefaultClient
  // add predicates
  predicates: {
    at(
      fragment: string,
      value:
        | string
        | number
        | boolean
        | Date
        | (string | number | boolean | Date)[]
    ): string
    not(
      fragment: string,
      value:
        | string
        | number
        | boolean
        | Date
        | (string | number | boolean | Date)[]
    ): string
    missing(fragment: string): string
    has(fragment: string): string
    any(fragment: string, values: (string | number | boolean | Date)[]): string
    in(fragment: string, values: string[]): string
    fulltext(fragment: string, value: string): string
    similar(documentId: string, maxResults: number): string
    date: {
      before(fragment: string, before: string | number | boolean | Date): string
      after(fragment: string, after: string | number | boolean | Date): string
      between(
        fragment: string,
        before: string | number | boolean | Date,
        after: string | number | boolean | Date
      ): string
      dayOfMonth(fragment: string, day: number): string
      dayOfMonthAfter(fragment: string, day: number): string
      dayOfMonthBefore(fragment: string, day: number): string
      dayOfWeek(fragment: string, day: string | number): string
      dayOfWeekAfter(fragment: string, day: string | number): string
      dayOfWeekBefore(fragment: string, day: string | number): string
      month(fragment: string, month: string | number): string
      monthBefore(fragment: string, month: string | number): string
      monthAfter(fragment: string, month: string | number): string
      year(fragment: string, year: number): string
      hour(fragment: string, hour: number): string
      hourBefore(fragment: string, hour: number): string
      hourAfter(fragment: string, hour: number): string
    }
    dateBefore: (
      fragment: string,
      before: string | number | boolean | Date
    ) => string
    dateAfter: (
      fragment: string,
      after: string | number | boolean | Date
    ) => string
    dateBetween: (
      fragment: string,
      before: string | number | boolean | Date,
      after: string | number | boolean | Date
    ) => string
    dayOfMonth: (fragment: string, day: number) => string
    dayOfMonthAfter: (fragment: string, day: number) => string
    dayOfMonthBefore: (fragment: string, day: number) => string
    dayOfWeek: (fragment: string, day: string | number) => string
    dayOfWeekAfter: (fragment: string, day: string | number) => string
    dayOfWeekBefore: (fragment: string, day: string | number) => string
    month: (fragment: string, month: string | number) => string
    monthBefore: (fragment: string, month: string | number) => string
    monthAfter: (fragment: string, month: string | number) => string
    year: (fragment: string, year: number) => string
    hour: (fragment: string, hour: number) => string
    hourBefore: (fragment: string, hour: number) => string
    hourAfter: (fragment: string, hour: number) => string
    number: {
      gt(fragment: string, value: number): string
      lt(fragment: string, value: number): string
      inRange(fragment: string, before: number, after: number): string
    }
    gt: (fragment: string, value: number) => string
    lt: (fragment: string, value: number) => string
    inRange: (fragment: string, before: number, after: number) => string
    near: (
      fragment: string,
      latitude: number,
      longitude: number,
      radius: number
    ) => string
    geopoint: {
      near(
        fragment: string,
        latitude: number,
        longitude: number,
        radius: number
      ): string
    }
  }
  richTextAsPlain: (field: string) => string
}

type PrismicVue<T> = VuePrismic & T

declare module 'vue/types/vue' {
  interface Vue {
    $prismic: PrismicVue<PrismicAPI>
  }
}

// use this for $prismic type
type Prismic = PrismicVue<PrismicAPI>
