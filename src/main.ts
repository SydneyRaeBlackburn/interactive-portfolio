import { getKaboomCtx } from './kaboom-ctx'

const k = getKaboomCtx()

k.loadSprite("spritesheet", "./spritesheet.png", {
  sliceX: 39, // # of frames horizontally in spritesheet
  sliceY: 31, // # of frames vertically in spritesheet
  anims: { // link names to animations in Tiled
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-side": 975,
    "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 }
  }
})