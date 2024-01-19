import React, { useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import { CAMERA_MODE, STEP } from "../constants"
import { getConfig } from "../config/config"
import { MainPage } from "./ui/MainPage"
import SimulationsApi from "../api/SimulationsApi"
import humps from "humps"
import { TILE_WIDTH, PLAY_SPEED } from "../constants"
import { usePronunciatiosContext } from "../hooks/usePronunciatiosContext"
import { useMovementsContext } from "../hooks/useMovementsContext"

export const Game = () => {
	const mapRef = useRef()
	const playerRef = useRef()
	const stepRef = useRef(STEP)
	const cameraModeRef = useRef([undefined, undefined]) // (MODE, character)

	// It is not a ref because it needs to trigger render for ui
	const pronunciatiosContext = usePronunciatiosContext()
	const pronunciatiosRef = useRef({})

	const movementsContext = useMovementsContext()
	const movementsRef = useRef({})

	const executeCountMax = TILE_WIDTH / PLAY_SPEED
	const executeCount = {}

	// TODO get simulation id from dropdown
	const simulationId = 1

	const [agents, setAgents] = useState(undefined)

	console.log(agents)

	useEffect(() => {
		const getAgents = async () => {
			const agents = await SimulationsApi.getAgents(simulationId)

			setAgents(agents)
		}
		getAgents(simulationId)
	}, [simulationId])

	const initializeAgentKeys = () => {
		agents &&
			agents.map((agent) => {
				const agentKey = humps.camelize(agent.name)
				agent.key = agentKey
			})
	}
	initializeAgentKeys()

	const decrementExecuteCount = () => {
		agents &&
			agents.map((agent) => {
				executeCount[agent.key] -= 1
			})
	}

	const resetExecuteCount = () => {
		agents &&
			agents.map((agent) => {
				executeCount[agent.key] = executeCountMax
			})
	}
	resetExecuteCount()

	const resetSimulationCount = async () => {
		await SimulationsApi.resetCount(simulationId)
	}

	const finishExecuteCount = (agentKey) => {
		executeCount[agentKey] = executeCountMax + 1
		console.log("finish", executeCount)
	}

	const onCharacterClick = (character) => {
		cameraModeRef.current = [CAMERA_MODE.FOLLOWING, character]
	}

	const config = getConfig(
		agents,
		movementsContext.movements,
		movementsContext.setMovements,
		pronunciatiosContext.pronunciatios,
		pronunciatiosContext.setPronunciatios,
		simulationId,
		playerRef,
		cameraModeRef,
		mapRef,
		stepRef,
		executeCount,
		decrementExecuteCount,
		resetExecuteCount,
		finishExecuteCount,
	)

	useEffect(() => {
		if (!agents) {
			return
		}

		const game = new Phaser.Game(config)

		resetSimulationCount()

		return () => {
			// Cleanup Phaser game when component unmounts
			game.destroy(true)
		}
	}, [agents])

	return (
		<MainPage
			agents={agents}
			pronunciatios={pronunciatiosContext.pronunciatios}
			movements={movementsContext.movements[stepRef.current]}
			onCharacterClick={onCharacterClick}
		/>
	)
}

export default Game
