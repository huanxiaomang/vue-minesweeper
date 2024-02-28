<template>
  <span i-material-symbols-light:logo-dev inline-block w-8 h-8 mb="-1" @click="handleClick" ref="devBtn"
    cursor-pointer></span>
</template>

<script setup lang='ts'>
import { toggleDev } from '~/composables';

const devBtn = ref() as Ref<HTMLSpanElement>;

function handleClick() {
  devBtn.value.classList.toggle('text-#22A7F2');
  toggleDev();
}

</script>

<style lang="less" scoped></style>
