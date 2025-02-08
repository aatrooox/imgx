<template>
  <div
    class="flex flex-col gap-4 pt-8 items-center h-screen w-full overflow-hidden transition-all duration-300 ease-in-out px-8">
    <div class="title">
      <SparklesText text="IMGX" :colors="{ first: '#9E7AFF', second: '#FE8BBB' }" :sparkles-count="10" class="my-8" />
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
          </SelectGroup>
        </SelectContent>
      </Select>
      <InteractiveHoverButton class="w-56" text="清除" @click="generateUrl = ''" />

    </div>

    <div class="w-full flex justify-center">
      <IInput placeholder="type a simple title" container-class="w-full max-w-xl" class="h-12" v-model="text"></IInput>
    </div>

    <InteractiveHoverButton class="w-56" text="Generate" @click="generateImage" />

    <div class="img-preview max-w-xl" v-if="generateUrl">
      <img :src="generateUrl" alt="">
    </div>
    <div class="w-full max-w-xl h-auto" v-else>
      <PreviewWraper :presetCode="preset">
        <ImgxRender :title="text"></ImgxRender>
      </PreviewWraper>
    </div>

  </div>
</template>

<script lang="ts" setup>

type Perset = '001' | '002';

const preset = ref<Perset>('001')
const template = ref('001')
const text = ref('')
const generateUrl = ref('')

const generateImage = async () => {
  generateUrl.value = `/api/img/${preset.value}/${text.value}`
}
</script>
