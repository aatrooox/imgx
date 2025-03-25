<script lang="ts" setup>
const model = defineModel({ type: Number, default: 18 })
</script>
<template>
  <div class="w-32">
    <NumberField id="size" :min="0" v-model="model">
    <!-- <Label for="size">Size</Label> -->
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
  </div>
  
</template>
<style scoped>
</style>