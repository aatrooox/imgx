<template>
  <div
    class="flex flex-col gap-4 pt-1 items-center h-screen w-full overflow-y-auto transition-all duration-300 ease-in-out px-8">
    <div class="title">
      <SparklesText text="IMG X" :colors="{ first: '#9E7AFF', second: '#FE8BBB' }" :sparkles-count="10" class="my-8" />
    </div>
    <div class="options flex gap-4 w-full max-w-xl">
      <!-- 预设选择 -->
      <Select v-model="preset">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="选择一个预设" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>预设</SelectLabel> -->
            <SelectItem value="001">
              1200x630
            </SelectItem>
            <SelectItem value="002">
              500x500
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select v-model="template">
        <SelectTrigger class="w-[120px]">
          <SelectValue placeholder="选择一个模板" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <!-- <SelectLabel>预设</SelectLabel> -->
            <SelectItem value="001">
              模板 1
            </SelectItem>
            <SelectItem value="002">
              模板 2
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <InteractiveHoverButton class="w-56" text="返回到预览" @click="generateUrl = ''" />

    </div>

    <div class="w-full flex justify-center">
      <IInput placeholder="type a simple title" container-class="w-full max-w-xl" class="h-12" v-model="text"></IInput>
    </div>

    <div>
      <InteractiveHoverButton class="w-56" text="生成图片" @click="generateImage" />
    </div>

    <div class="img-preview max-w-xl" v-if="generateUrl">
      <img :src="generateUrl" alt="">
    </div>
    <div class="w-full max-w-xl h-auto">
      <PreviewWraper :presetCode="preset">
        <!-- <component :is="curComponent" :title="text"></component> -->
        <ImgTemplate1 :title="text"></ImgTemplate1>
      </PreviewWraper>
    </div>

  </div>
  <NuxtPage />
</template>

<script lang="ts" setup>
const templates = {
  '001': 'ImgxRender',
  '002': 'ImgTemplate1'
}


type Perset = '001' | '002';

const preset = ref<Perset>('001')
const template = ref<'001' | '002'>('001')
const text = ref('')
const generateUrl = ref('')
const curComponent = computed(() => {
  return templates[template.value] || 'ImgxRender'
})
const generateImage = async () => {
  generateUrl.value = `/api/img/${preset.value}/${template.value}/${text.value}`
}
</script>
