import {
	PLAY_SPEED,
	PRONUNCIATIO_X_OFFSET,
	PRONUNCIATIO_Y_OFFSET,
	SPEECH_BUBBLE_X_OFFSET,
	SPEECH_BUBBLE_Y_OFFSET,
	TILE_WIDTH,
} from "../../constants"
import humps from "humps"
import { getInitials, getPronunciatioContent } from "./utils"

const movement_speed = PLAY_SPEED
const movement_target = {}
const pre_anims_direction_dict = {}

export const performExecutePhase = (
	personas,
	speech_bubbles,
	pronunciatios,
	setPronunciatios,
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

	personas.map((persona) => {
		// name keys are camelized by axios interceptor
		const agentKey = persona.key

		const character = persona.character

		if (isCurrentMovementsEmpty(currentMovements, agentKey)) {
			finishExecuteCount(agentKey)
		} else if (isFirstIteration(agentKey)) {
			const personaAction = currentMovements[agentKey]

			const curr_x = personaAction["movement"][0]
			const curr_y = personaAction["movement"][1]
			movement_target[agentKey] = [curr_x * tileWidth, curr_y * tileWidth]

			const emojiCode = personaAction["pronunciatio"]

			const pronunciatioContent = getPronunciatioContent(emojiCode)

			const initials = getInitials(agentKey)
			const pronun = pronunciatios[agentKey]
			pronun.setText(initials + ": " + pronunciatioContent)

			// This forces update on pronunciatios for showing in the character menu
			setPronunciatios((pronunciatios) => ({
				...pronunciatios,
				...{ [agentKey]: pronunciatios[agentKey] },
			}))
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

	// TODO check
	// Filling in the action description.
	// fillDescription(executeCount, executeCountMax, personas, currentMovements)

	if (currentMovements && allFinished()) {
		stepRef.current = stepRef.current + 1
		console.log("allfinished", executeCountMax)
		resetExecuteCount()
	} else {
		decrementExecuteCount()
	}
	return phase
}

const updateDirection = (curr_persona, curr_persona_name, direction) => {
	pre_anims_direction_dict[curr_persona_name] = direction
	curr_persona.anims.play(curr_persona_name + "-" + direction + "-walk", true)
}

const playAnimation = (character, agentKey, movement_target) => {
	const personaMovement = movement_target[agentKey]

	if (!personaMovement) {
		return
	}

	if (character.x < personaMovement[0] + TILE_WIDTH / 2) {
		character.x += movement_speed
		updateDirection(character, agentKey, "right")
	} else if (character.x > personaMovement[0] + TILE_WIDTH / 2) {
		character.x -= movement_speed
		updateDirection(character, agentKey, "left")
	} else if (character.y < personaMovement[1] + TILE_WIDTH / 2) {
		character.y += movement_speed
		updateDirection(character, agentKey, "down")
	} else if (character.y > personaMovement[1] + TILE_WIDTH / 2) {
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
function setSpeechBubble(speech_bubbles, agentKey, pronunciatios, character) {
	const curr_speech_bubble = speech_bubbles[agentKey]
	const curr_pronunciatio = pronunciatios[agentKey]
	curr_pronunciatio.x = character.x + PRONUNCIATIO_X_OFFSET
	curr_pronunciatio.y = character.y + PRONUNCIATIO_Y_OFFSET
	curr_speech_bubble.x = character.x + SPEECH_BUBBLE_X_OFFSET
	curr_speech_bubble.y = character.y + SPEECH_BUBBLE_Y_OFFSET
}

function fillDescription(executeCount, executeCountMax, personas, currentMovements) {
	if (executeCount == executeCountMax) {
		for (let agentKey in personas) {
			// let action_description = ""

			// let description_content = currentMovements["persona"][curr_persona_name]["description"]
			let chat_content = ""

			if (currentMovements[agentKey]["chat"] != null) {
				for (let j = 0; j < currentMovements[agentKey]["chat"].length; j++) {
					chat_content +=
						currentMovements[agentKey]["chat"][j][0] +
						": " +
						currentMovements[agentKey]["chat"][j][1] +
						"<br>"
				}
			} else {
				chat_content = "<em>None at the moment</em>"
			}
			// action_description += description_content + "<br>";
			// document.getElementById("current_action__" + curr_persona_name_os).innerHTML =
			// 	description_content.split("@")[0]
			// document.getElementById("target_address__" + curr_persona_name_os).innerHTML =
			// 	description_content.split("@")[1]
			// document.getElementById("chat__" + curr_persona_name_os).innerHTML = chat_content
		}
	}
}
