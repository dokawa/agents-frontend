import { preloadGenerator } from "../game/preload"
import { createGenerator } from "../game/create"
import { updateGenerator } from "../game/update/update"
import { WIDTH, HEIGHT, TILE_WIDTH, PLAY_SPEED } from "../constants"
import AgentsApi from "../api/AgentsApi"
import humps from "humps"

// Variables for storing movements that are sent from the backend server.
// TODO delete this stubs from BE
export const persona_init_pos = [
	{
		id: 1,
		name: "Abigail Chen",
		sprite_name: "Abigail_Chen.png",
	},
	{
		id: 1,
		name: "Mei Lin",
		sprite_name: "Abigail_Chen.png",
	},
]

const executeCountMax = TILE_WIDTH / PLAY_SPEED
const datetime = "01012024"
let start_datetime = new Date(Date.parse(datetime))

let phase = "process"

var pronunciatios = {}
var speech_bubbles = {}
const executeCount = {}

// TODO get agents from simulation
const personas = await AgentsApi.list()

personas.map((agent) => {
	const agentKey = humps.camelize(agent.name)
	agent.key = agentKey
})

const decrementExecuteCount = () => {
	personas.map((persona) => {
		executeCount[persona.key] -= 1
	})
}

const resetExecuteCount = () => {
	personas.map((persona) => {
		executeCount[persona.key] = executeCountMax
		console.log(persona)
	})
}

resetExecuteCount()
console.log("starting", executeCount)

const finishExecuteCount = (agentKey) => {
	executeCount[agentKey] = executeCountMax + 1
}

// let personas = persona_init_pos

export const getConfig = (playerRef, mapRef, stepRef) => ({
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
		create: createGenerator(personas, speech_bubbles, pronunciatios, mapRef, playerRef),
		update: updateGenerator(
			personas,
			speech_bubbles,
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
