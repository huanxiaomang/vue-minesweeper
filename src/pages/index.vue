<script setup lang="ts" generic="T extends any, O extends any">
import { b } from 'unplugin-vue-router/dist/options-8dbadba3.js';
import { BlockState } from '~/types';

const game = new GamePlay(10, 10);
const state = game.state;


</script>

<template>
  <div>
    <div text-4xl fw100 mb-5>Minesweeper
      <ToggleDevBtn></ToggleDevBtn>
    </div>


    <div v-for="(row, y) in state" :key="y" flex="~" items-center justify-center @contextmenu.prevent="() => false">
      <MineBlock :item="item" @click="game.handleClick(item)" @contextmenu.prevent="game.handleRightClick(item)"
        v-for="(item, x) in row" :key="x">
      </MineBlock>


    </div>
    <div flex="~ col justify-center items-center gap-3" mt-4>
      <div mt-3 text-yellow>{{ game.infoText }}</div>
      <div btn @click="game.reset">reset</div>
    </div>

  </div>
</template>
