import React, { useEffect, useRef } from "react"
import Phaser from "phaser"
import { STEP, TILE_WIDTH, PLAY_SPEED } from "../constants"
import { getConfig } from "../config/config"
import { persona_init_pos } from "../config/config"
import { MainPage } from "./MainPage"

export const Game = () => {
	const executeCountMax = TILE_WIDTH / PLAY_SPEED

	const executeCount = {}

	const mapRef = useRef()
	const playerRef = useRef()
	const stepRef = useRef(STEP)

	const decrementExecuteCount = () => {
		for (let personaName in persona_init_pos) {
			executeCount[personaName] -= 1
		}
	}

	const resetExecuteCount = () => {
		for (let personaName in persona_init_pos) {
			executeCount[personaName] = executeCountMax
		}
	}

	resetExecuteCount()

	const finishExecuteCount = (personaName) => {
		executeCount[personaName] = executeCountMax + 1
	}

	// let executeCount = executeCountMax

	const config = getConfig(
		playerRef,
		mapRef,
		executeCount,
		executeCountMax,
		stepRef,
		decrementExecuteCount,
		finishExecuteCount,
		resetExecuteCount,
	)

	useEffect(() => {
		const game = new Phaser.Game(config)

		return () => {
			// Cleanup Phaser game when component unmounts
			game.destroy(true)
		}
	}, [])

	return <MainPage />
}

export default Game
