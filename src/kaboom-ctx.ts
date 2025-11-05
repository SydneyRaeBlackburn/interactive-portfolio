import kaboom from 'kaboom'

export const getKaboomCtx = () => {
    const gameId = document.getElementById("game")
    if (!gameId) throw new Error("Element id missing for 'game'")
    
    return kaboom({
        global: false,
        touchToMouse: true, // register touch events as click events for mobile
        canvas: gameId as HTMLCanvasElement
    })
}
