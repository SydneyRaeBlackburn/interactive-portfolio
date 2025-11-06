import { dialogueData, scaleFactor } from './constants'
import { getKaboomCtx } from './kaboom-ctx'
import { displayDialogue, setCamScale } from './utils'

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

k.loadSprite("map", "./map.png")
k.setBackground(k.Color.fromHex("#311047"))

k.scene("main", async () => {
  const mapData = await fetch("./map.json")
  const mapJson = await mapData.json()
  const layers = mapJson.layers

  const map = k.add([
    k.sprite("map"), // comes from loadSprite()
    k.pos(0),
    k.scale(scaleFactor)
  ])

  const player = k.make([
    k.sprite("spritesheet", {anim: "idle-down"}),
    k.area({ // create hitbox for player
      shape: new k.Rect(k.vec2(0, 3), 10, 10)
    }),
    k.body(), // makes player tangible
    k.anchor("center"),
    k.pos(),
    k.scale(scaleFactor),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false // immobile while in dialogue
    },
    "player" // tag to check for collisions
  ])

  for (const layer of layers) {
    if (layer.name === "boundaries") { // comes from map.json
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name
        ])

        // set collision events
        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialogue = true
            displayDialogue(dialogueData[boundary.name as keyof typeof dialogueData], () => player.isInDialogue = false)
          })
        }
      }
      // continue?
    } 

    if (layer.name === "spawnpoints") {
      for (const entity of layer.objects) {
        if (entity.name === "player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * scaleFactor,
            (map.pos.y + entity.y) * scaleFactor
          )
        }
        k.add(player)
        // continue?
      }
    }
  }

  setCamScale(k)

  k.onResize(() => {
    setCamScale(k)
  })

  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y + 100)
  })

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return

    const worldMousePos = k.toWorld(k.mousePos())
    player.moveTo(worldMousePos, player.speed)

    const mouseAngle = player.pos.angle(worldMousePos)

    const lowerBound = 50
    const upperBound = 125

    // up animation
    if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== "walk-up") {
      player.play("walk-up")
      player.direction = "up"
      return
    }

    // down animation
    if (mouseAngle < -lowerBound && mouseAngle > -upperBound && player.curAnim() !== "walk-down") {
      player.play("walk-down")
      player.direction = "down"
      return
    }

    // right animation
    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false
      if (player.curAnim() !== "walk-side") player.play("walk-side")
      player.direction = "right"
      return
    }

    // left animation
    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true
      if (player.curAnim() !== "walk-side") player.play("walk-side")
      player.direction = "left"
      return
    }
  })

  k.onMouseRelease(() => {
    if (player.direction === "down") {
      player.play("idle-down")
      return
    }
    if (player.direction === "up") {
      player.play("idle-up")
      return
    }

    player.play("idle-side")
  })
})

k.go("main") // default scene