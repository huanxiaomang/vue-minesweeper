<template>
  <button w-10 h-10 m="0.5" border="1 gray-400/20" active:mb="-0.2" flex="~" items-center justify-center
    :class="getBlockClass(item)">
    <template v-if="item.flagged">
      <div i-mdi:flag text-red>
      </div>
    </template>
    <template v-else-if="item.revealed || isDev">
      <div v-if="item.mine" i-mdi:mine>
      </div>
      <div v-else>
        {{ item.adjacentMines }}
      </div>
    </template>
  </button>
</template>

<script setup lang='ts'>
import { BlockState } from '~/types';

defineProps<{ item: BlockState }>();

const numberColors = [
  'text-transparent',
  'text-blue-500/80',
  'text-green-500/80',
  'text-yellow-500/80',
  'text-orange-500/80',
  'text-red-500/80',
  'text-purple-500/80',
  'text-pink-500/80',
  'text-red-500/80',
]

function getBlockClass(block: BlockState) {
  if (block.flagged) {
    return 'bg-gray-500/10'
  }

  if (!block.revealed) {
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  }

  return block.mine ? 'text-red  cursor-default' : numberColors[block.adjacentMines];
}
</script>

<style lang="less" scoped></style>
