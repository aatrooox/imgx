import { defineAsyncComponent, type Component } from 'vue';

export const templates = {
  '001': defineAsyncComponent(() => import('~/components/ImgxRender.vue')),
  '002': defineAsyncComponent(() => import('~/components/ImgTemplate1.vue')),
  '003': defineAsyncComponent(() => import('~/components/ImgTemplate2.vue'))
}

export const serverTemplates = {
  '001': () => import('~/components/ImgxRender.vue'),
  '002': () => import('~/components/ImgTemplate1.vue'),
  '003': () => import('~/components/ImgTemplate2.vue')
}

export type TemplateCode = keyof typeof templates;

