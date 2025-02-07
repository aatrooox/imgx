<template>
  <div class="flex flex-col gap-4 pt-8 items-center h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
    <div class="title">
      <SparklesText
      text="IMGX"
      :colors="{ first: '#9E7AFF', second: '#FE8BBB' }"
      :sparkles-count="10"
      class="my-8"
    />
    </div>
    <div class="options">

    </div>

    <div class="w-full flex justify-center">
      <IInput placeholder="type a simple title"
      container-class="w-full max-w-xl" class="h-12"></IInput>
    </div>

    <InteractiveHoverButton
      class="w-56"
      text="Generate"
    />


  </div>
</template>
