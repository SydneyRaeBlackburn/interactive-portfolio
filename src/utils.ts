import type { KaboomCtx } from "kaboom";

type Callback = () => void;

export function displayDialogue(text: string, onDisplayEnd: Callback) {
  const dialogue = document.getElementById("dialogue")
  
  if (dialogue) {
    let index = 0
    let currentText = ""
    const intervalRef = setInterval(() => {
      if (index < text.length) {
        currentText += text[index]
        dialogue.innerHTML = currentText // find alternative to innerHTML (cross site scripting issue)
        index++
        return
      }

      clearInterval(intervalRef)
    }, 5)

    const dialogueUI = document.getElementById("textbox-container") 
    if (dialogueUI) {
      dialogueUI.style.display = "block" // shows dialogue box
      
      const closeBtn = document.getElementById("close")
      
      if (closeBtn) {
        function onCloseBtnClick() {
          onDisplayEnd()
          dialogueUI!.style.display = "none"
          dialogue!.innerHTML = ""
          clearInterval(intervalRef)
          closeBtn?.removeEventListener("click", onCloseBtnClick)
        }

        closeBtn.addEventListener("click", onCloseBtnClick)
      }
    }
  }
}

// change size based on screen
export function setCamScale(k: KaboomCtx) {
  const resizeFactor = k.width() / k.height()
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1))
  } else {
    k.camScale(k.vec2(1.5))
  }
}