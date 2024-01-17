import React, { useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import { STEP } from "../constants"
import { getConfig } from "../config/config"
import { MainPage } from "./MainPage"
import SimulationsApi from "../api/SimulationsApi"
import humps from "humps"
import { TILE_WIDTH, PLAY_SPEED } from "../constants"
import { usePronunciatioContext } from "./pronunciatioContext"

export const Game = () => {
	const mapRef = useRef()
	const playerRef = useRef()
	const stepRef = useRef(STEP)

	const pronunciatioContext = usePronunciatioContext()

	const executeCountMax = TILE_WIDTH / PLAY_SPEED
	const executeCount = {}

	// TODO get simulation id from dropdown
	const simulationId = 1

	const [agents, setAgents] = useState(undefined)

	// const pronunciatios = {}

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

	resetSimulationCount()

	const finishExecuteCount = (agentKey) => {
		executeCount[agentKey] = executeCountMax + 1
	}

	const config = getConfig(
		agents,
		pronunciatioContext.pronunciatios,
		pronunciatioContext.setPronunciatios,
		simulationId,
		playerRef,
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

		return () => {
			// Cleanup Phaser game when component unmounts
			game.destroy(true)
		}
	}, [agents])

	return <MainPage agents={agents} pronunciatios={pronunciatioContext.pronunciatios} />
}

export default Game
