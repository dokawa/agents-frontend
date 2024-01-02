import { preloadGenerator } from "../game/preload"
import { createGenerator } from "../game/create"
import { updateGenerator } from "../game/update/update"
import { WIDTH, HEIGHT } from "../constants"

// Variables for storing movements that are sent from the backend server.
// TODO delete this stubs from BE
export const persona_init_pos = {
	abigail_chen: [82, 14],
	mei_lin: [79, 19],
}
let personas = persona_init_pos
const movementsToExecute = {
	1: {
		abigail_chen: {
			movement: [82, 15],
			pronunciatio: "🦊",
		},
		mei_lin: {
			movement: [79, 20],
			pronunciatio: "🦊",
		},
	},
	2: {
		abigail_chen: {
			movement: [83, 15],
			pronunciatio: "🐺",
		},
		mei_lin: {
			movement: [80, 20],
			pronunciatio: "🐺",
		},
	},
}

const datetime = "01012024"

let start_datetime = new Date(Date.parse(datetime))

let phase = "process"

var pronunciatios = {}
var speech_bubbles = {}

export const getConfig = (
	playerRef,
	mapRef,
	executeCount,
	executeCountMax,
	stepRef,
	decrementExecuteCount,
	finishExecuteCount,
	resetExecuteCount,
) => ({
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	parent: "game-container",
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: {
		preload: preloadGenerator(personas),
		create: createGenerator(
			personas,
			persona_init_pos,
			speech_bubbles,
			pronunciatios,
			mapRef,
			playerRef,
		),
		update: updateGenerator(
			personas,
			speech_bubbles,
			movementsToExecute,
			pronunciatios,
			playerRef,
			mapRef,
			stepRef,
			start_datetime,
			phase,
			executeCount,
			executeCountMax,
			decrementExecuteCount,
			finishExecuteCount,
			resetExecuteCount,
		),
	},
})
