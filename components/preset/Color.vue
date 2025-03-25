<script lang="ts" setup>
const model = defineModel<string>({
  default: '#000000'
})

const colorInput = ref<HTMLInputElement>()

const openColorPicker = () => {
  colorInput.value?.click()
}

</script>

<template>
  <div class="color-picker">
    <div class="w-6 h-6 rounded-full relative" :style="{ backgroundColor: model }" @click="openColorPicker"></div>
    <input 
      type="color" 
      v-model="model" 
      ref="colorInput"
      class="w-full h-10 hidden"
    />
    <input 
      type="text" 
      v-model="model" 
      class="color-text" 
      placeholder="#000000"
    />
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 20px;
  border: 1px solid #ddd;
}

.color-input {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  cursor: pointer;
}

.color-text {
  padding: 5px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
</style>