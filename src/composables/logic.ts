import { Ref } from 'vue'
import type { BlockState } from '~/types'

export class GamePlay {
  public infoText = ref('开始扫雷');
  public state = ref<BlockState[][]>([])
  public gameState = ref<'playing' | 'won' | 'lost'>('playing')
  public mineGenerated = ref<boolean>(false);

  constructor(public width: number, public height: number) {
    this.reset();
    useStorage('vue-sweeper-state', this.state);
    useStorage('vue-sweeper-mineGenerated', this.mineGenerated);
  }

  reset() {
    this.gameState.value = 'playing'
    this.mineGenerated.value = false
    this.state.value
      = Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x) =>
          <BlockState>{
            x,
            y,
            adjacentMines: 0,
            revealed: false,
            mine: false,
            flagged: false,
          }))
  }

  getSiblings(block: BlockState): BlockState[] {
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
      const x = block.x + dx
      const y = block.y + dy
      if (x < 0 || y < 0 || x >= this.width || y >= this.height)
        return undefined
      return this.state.value[y][x]
    }).filter(Boolean) as BlockState[]
  }

  siBlingsMap(block: BlockState, fn: (sb: BlockState, index: number, array: BlockState[]) => any) {
    return this.getSiblings(block).map(fn)
  }

  stateMap(fn: (block: BlockState, y: number, x: number) => void) {
    this.state.value.forEach((row, y) => {
      row.forEach((block, x) => {
        fn(block, y, x)
      })
    })
  }

  generateMines(initial: BlockState) {
    this.stateMap((block) => {
      if (Math.abs(initial.x - block.x) < 1)
        return
      if (Math.abs(initial.y - block.y) < 1)
        return
      block.mine = Math.random() < 0.1
    })
    this.updateNumbers()
  }

  expendZeroBlock(block: BlockState) {
    if (block.adjacentMines)
      return

    this.siBlingsMap(block, (sb: BlockState) => {
      if (!sb.revealed) {
        sb.revealed = true

        this.expendZeroBlock(sb)
      }
    })
  }

  updateNumbers() {
    this.stateMap((block) => {
      if (block.mine)
        return

      this.siBlingsMap(block, (sb: BlockState) => {
        if (sb.mine)
          block.adjacentMines++
      })
    })
  }

  handleClick(block: BlockState) {
    if (block.flagged || block.revealed)
      return
    if (!this.mineGenerated.value) {
      this.generateMines(block)
      this.mineGenerated.value = true
    }
    this.expendZeroBlock(block)
    block.revealed = true

    this.checkGameState()

    if (block.mine) {
      this.stateMap((block) => {
        if (block.mine) {
          block.revealed = true;
        } else if (block.flagged) {
          block.flagged = false;
        }
      })
      this.gameState.value = 'lost'
      this.infoText.value = 'BOOOOOOM!'

      return;
    }
  }

  handleRightClick(block: BlockState) {
    if (this.gameState.value !== 'playing')
      return
    if (block.revealed)
      return
    block.flagged = !block.flagged
    this.checkGameState()
  }

  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.state.value.flat()

    if (blocks.every(b => b.revealed || b.flagged)) {
      this.infoText.value = '1'

      if (blocks.some(b => b.flagged && !b.mine)) {
        this.infoText.value = 'YOU CHEAT!'
      }
      else {
        this.gameState.value = 'won'

        this.infoText.value = 'YOU WIN!'
      }
    }
  }
}
