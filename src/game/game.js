import React, { useEffect, useRef } from "react"
import Phaser from "phaser"
import { STEP } from "../constants"
import { getConfig } from "../config/config"
import { MainPage } from "./MainPage"

export const Game = () => {
	const mapRef = useRef()
	const playerRef = useRef()
	const stepRef = useRef(STEP)

	const config = getConfig(playerRef, mapRef, stepRef)

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
