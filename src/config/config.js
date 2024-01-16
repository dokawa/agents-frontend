import { preloadGenerator } from "../game/preload"
import { createGenerator } from "../game/create"
import { updateGenerator } from "../game/update/update"
import { WIDTH, HEIGHT, TILE_WIDTH, PLAY_SPEED } from "../constants"
import Phaser from "phaser"

const executeCountMax = TILE_WIDTH / PLAY_SPEED
const datetime = "01012024"
let start_datetime = new Date(Date.parse(datetime))

let phase = "process"

var speech_bubbles = {}

const pronunciatios = {}

export const getConfig = (
	agents,
	simulationId,
	playerRef,
	cameraModeRef,
	mapRef,
	stepRef,
	executeCount,
	decrementExecuteCount,
	resetExecuteCount,
	finishExecuteCount,
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
		preload: preloadGenerator(agents),
		create: createGenerator(agents, speech_bubbles, pronunciatios, mapRef, playerRef),
		update: updateGenerator(
			simulationId,
			agents,
			speech_bubbles,
			pronunciatios,
			playerRef,
			cameraModeRef,
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
