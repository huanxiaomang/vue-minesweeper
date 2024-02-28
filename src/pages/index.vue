<script setup lang="ts" generic="T extends any, O extends any">
import { b } from 'unplugin-vue-router/dist/options-8dbadba3.js';
import { BlockState } from '~/types';



const WIDTH = 5;
const HEIGHT = 5;
const infoText = ref('开始扫雷');

const state: Ref<BlockState[][]> = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x) =>
      <BlockState>{
        x, y,
        adjacentMines: 0,
        revealed: false,
        mine: false,
        flagged: false
      }
    )
  )
)
console.log(state);

const numberColors = [
  'text-transparent',
  'text-blue-500/80',
  'text-green-500/80',
  'text-yellow-500/80',
  'text-orange-500/80',
  'text-red-500/80',
  'text-purple-500/80',
  'text-pink-500/80',
]

let dev = false;

function getSiblings(block: BlockState): BlockState[] {
  const directions = [
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ]
  return directions.map(([dx, dy]) => {
    const x = block.x + dx;
    const y = block.y + dy;
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return undefined;
    return state.value[y][x];
  }).filter(Boolean) as BlockState[];
}

function siBlingsMap(block: BlockState, fn: (sb: BlockState, index: number, array: BlockState[]) => any) {
  return getSiblings(block).map(fn);
}

const stateMap = (fn: (block: BlockState, y: number, x: number) => void) => {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {

      fn(block, y, x);
    })
  })
}

function generateMines(initial: BlockState) {
  stateMap((block) => {
    if (Math.abs(initial.x - block.x) < 1) return;
    if (Math.abs(initial.y - block.y) < 1) return;
    block.mine = Math.random() < 0.1;
  })
  updateNumbers();

}



function expendZeroBlock(block: BlockState) {
  if (block.adjacentMines) {
    return;
  }
  siBlingsMap(block, (sb: BlockState) => {
    if (!sb.revealed) {
      sb.revealed = true;

      expendZeroBlock(sb);

    }

  })

}


function updateNumbers() {
  stateMap((block) => {
    if (block.mine) return;

    siBlingsMap(block, (sb: BlockState) => {
      if (sb.mine) {
        block.adjacentMines++;
      }
    })
  })
}

function getBlockClass(block: BlockState) {
  if (block.flagged) {
    return 'bg-gray-500/10'
  }

  if (!block.revealed) {
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  }

  return block.mine ? 'text-red  cursor-default' : numberColors[block.adjacentMines];
}




let mineGenerated = false;

function handleClick(e: MouseEvent, block: BlockState) {
  if (block.flagged || block.revealed) return;
  if (!mineGenerated) {
    generateMines(block);
    mineGenerated = true;
  }
  expendZeroBlock(block);
  block.revealed = true;

  checkGameState();

  if (block.mine) {
    stateMap((block) => {
      if (block.mine) {
        block.revealed = true;
        infoText.value = 'BOOOOOOM!';
      }
    })
  }
}

function handleRightClick(block: BlockState) {
  if (block.revealed) return;
  block.flagged = !block.flagged;
  checkGameState();

}


function checkGameState() {
  if (!mineGenerated) return;
  const blocks = state.value.flat();

  if (blocks.every((b) => b.revealed || b.flagged)) {
    infoText.value = '1';

    if (blocks.some((b) => b.flagged && !b.mine)) {
      infoText.value = 'YOU CHEAT!';
    } else {
      infoText.value = 'YOU WIN!';
    }
  }

}

</script>

<template>
  <div>
    <div text-4xl fw100 mb-5>Minesweeper</div>


    <div v-for="(row, y) in state" :key="y" flex="~" items-center justify-center @contextmenu.prevent="() => false">
      <button w-10 h-10 m="0.5" border="1 gray-400/20" active:mb="-0.2" flex="~" items-center justify-center
        :class="getBlockClass(item)" v-for="(item, x) in row" :key="x" @click="handleClick($event, item)"
        @contextmenu.prevent="handleRightClick(item)">
        <template v-if="item.flagged">
          <div i-mdi:flag text-red>
          </div>
        </template>
        <template v-else-if="item.revealed || dev">
          <div v-if="item.mine" i-mdi:mine>
          </div>
          <div v-else>
            {{ item.adjacentMines }}
          </div>
        </template>



      </button>
    </div>
    <div mt-3 text-yellow>{{ infoText }}</div>
  </div>
</template>
