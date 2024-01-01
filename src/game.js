/* eslint-disable camelcase */
import React, { useEffect, useRef } from "react"
import Phaser from "phaser"
import { preloadGenerator } from "./preload"
import { createGenerator } from "./create"
import { updateGenerator } from "./update"
import { WIDTH, HEIGHT, SEC_PER_STEP } from "./constants"

function Game() {
	const gameContainerRef = useRef(null)

	// TODO delete this stubs from BE
	const persona_init_pos = { Abigail_Chen: [10, 10] }
	const all_movement = {
		1: {
			Abigail_Chen: {
				movement: [10, 10],
			},
		},
		// 2: {
		// 	Abigail_Chen: {
		// 		movement: [50, 50],
		// 	},
		// },
	}

	var pronunciatios = {}
	var speech_bubbles = {}

	const mapRef = useRef()
	const playerRef = useRef()

	// TODO add controls

	const datetime = "01012024"

	// Variables for storing movements that are sent from the backend server.

	let start_datetime = new Date(Date.parse(datetime))

	// // Control button binders
	// var play_button=document.getElementById("play_button");
	// var pause_button=document.getElementById("pause_button");

	let personas = persona_init_pos

	const config = {
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
				all_movement,
				speech_bubbles,
				pronunciatios,
				playerRef,
				mapRef,
				start_datetime,
			),
		},
	}

	useEffect(() => {
		const game = new Phaser.Game(config)

		return () => {
			// Cleanup Phaser game when component unmounts
			game.destroy(true)
		}
	}, [])

	return <div ref={gameContainerRef} />
}

export default Game
