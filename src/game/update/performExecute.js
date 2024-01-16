import {
	PLAY_SPEED,
	PRONUNCIATIO_X_OFFSET,
	PRONUNCIATIO_Y_OFFSET,
	SPEECH_BUBBLE_X_OFFSET,
	SPEECH_BUBBLE_Y_OFFSET,
	TILE_WIDTH,
} from "../../constants"
import { getInitials, getPronunciatioContent, getTagIdName } from "./utils"
import { getEmoji } from "./utils"

const movement_speed = PLAY_SPEED
const movement_target = {}
const pre_anims_direction_dict = {}

export const performExecutePhase = (
	agents,
	speech_bubbles,
	pronunciatios,
	currentMovements,
	executeCount,
	executeCountMax,
	tileWidth,
	phase,
	decrementExecuteCount,
	finishExecuteCount,
	resetExecuteCount,
	stepRef,
) => {
	const allFinished = () => {
		for (let agentKey in executeCount) {
			if (executeCount[agentKey] !== executeCountMax + 1) {
				return false
			}
		}
		return true
	}

	const isFirstIteration = (agentKey) => {
		return executeCount[agentKey] == executeCountMax
	}

	const isCurrentMovementsEmpty = (currentMovements, agentKey) => {
		return !currentMovements || !currentMovements[agentKey] || !currentMovements[agentKey]["movement"]
	}

	console.log("currentMovements", currentMovements)
	console.log("step", stepRef.current)
	console.log("executeCount", executeCount)

	agents.map((agent) => {
		// name keys are camelized by axios interceptor
		const agentKey = agent.key

		const character = agent.character

		if (isCurrentMovementsEmpty(currentMovements, agentKey)) {
			finishExecuteCount(agentKey)
		} else if (isFirstIteration(agentKey)) {
			const agentAction = currentMovements[agentKey]

			const curr_x = agentAction["movement"][0]
			const curr_y = agentAction["movement"][1]
			movement_target[agentKey] = [curr_x * tileWidth, curr_y * tileWidth]

			const emojiCode = agentAction["pronunciatio"]

			const pronunciatioContent = getPronunciatioContent(emojiCode)

			const initials = getInitials(agentKey)
			const pronun = pronunciatios[agentKey]
			pronun.setText(initials + ": " + pronunciatioContent)
		}

		if (executeCount[agentKey] > 0) {
			playAnimation(character, agentKey, movement_target)
			setSpeechBubble(speech_bubbles, agentKey, pronunciatios, character)
		} else {
			// Once we are done moving the agents, we move on to the "process"
			// stage where we fetch more data

			character.x = movement_target[agentKey][0] + tileWidth / 2
			character.y = movement_target[agentKey][1] + tileWidth / 2

			finishExecuteCount(agentKey)

			// This have to be executed after all the other phases
			if (allFinished()) {
				phase = "process"
				return phase
			}
		}
	})

	if (currentMovements && allFinished()) {
		stepRef.current = stepRef.current + 1
		console.log("allfinished", executeCountMax)
		resetExecuteCount()
		fillCharactersMenu(agents, currentMovements, pronunciatios)
	} else {
		decrementExecuteCount()
	}
	return phase
}

const updateDirection = (curr_agent, curr_agent_name, direction) => {
	pre_anims_direction_dict[curr_agent_name] = direction
	curr_agent.anims.play(curr_agent_name + "-" + direction + "-walk", true)
}

const playAnimation = (character, agentKey, movement_target) => {
	const agentMovement = movement_target[agentKey]

	if (!agentMovement) {
		return
	}

	if (character.x < agentMovement[0] + TILE_WIDTH / 2) {
		character.x += movement_speed
		updateDirection(character, agentKey, "right")
	} else if (character.x > agentMovement[0] + TILE_WIDTH / 2) {
		character.x -= movement_speed
		updateDirection(character, agentKey, "left")
	} else if (character.y < agentMovement[1] + TILE_WIDTH / 2) {
		character.y += movement_speed
		updateDirection(character, agentKey, "down")
	} else if (character.y > agentMovement[1] + TILE_WIDTH / 2) {
		character.y -= movement_speed
		updateDirection(character, agentKey, "up")
	} else {
		character.anims.stop()

		const idleFrame = pre_anims_direction_dict[agentKey]

		if (idleFrame) {
			character.setTexture(agentKey, idleFrame)
		}
	}
}
const setSpeechBubble = (speech_bubbles, agentKey, pronunciatios, character) => {
	const curr_speech_bubble = speech_bubbles[agentKey]
	const curr_pronunciatio = pronunciatios[agentKey]
	curr_pronunciatio.x = character.x + PRONUNCIATIO_X_OFFSET
	curr_pronunciatio.y = character.y + PRONUNCIATIO_Y_OFFSET
	curr_speech_bubble.x = character.x + SPEECH_BUBBLE_X_OFFSET
	curr_speech_bubble.y = character.y + SPEECH_BUBBLE_Y_OFFSET
}

const fillCharactersMenu = (agents, currentMovements, pronunciatios) => {
	agents.map((agent) => {
		const agentKey = agent.key
		const movement = currentMovements[agentKey]["movement"]
		const pronunciatio = pronunciatios[agentKey]

		// TODO add target address

		document.getElementById(getTagIdName(agentKey, "position")).innerHTML =
			`(${movement[0]}, ${movement[1]})`
		document.getElementById(getTagIdName(agentKey, "pronunciatio")).innerHTML = getEmoji(pronunciatio)
	})
}
