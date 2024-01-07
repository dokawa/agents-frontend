import {
	PLAY_SPEED,
	PRONUNCIATIO_X_OFFSET,
	PRONUNCIATIO_Y_OFFSET,
	SPEECH_BUBBLE_X_OFFSET,
	SPEECH_BUBBLE_Y_OFFSET,
	TILE_WIDTH,
} from "../../constants"
import humps from "humps"

const movement_speed = PLAY_SPEED
const movement_target = {}
const pre_anims_direction_dict = {}

export const performExecutePhase = (
	personas,
	speech_bubbles,
	pronunciatios,
	execute_movement,
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

	const camelCaseToName = (inputString) => {
		// Add a space before each uppercase letter that is not at the beginning
		const spacedString = inputString.replace(/([a-z])([A-Z])/g, "$1 $2")

		// Capitalize the first letter of each word
		const nameFormat = spacedString.replace(/\b\w/g, (char) => char.toUpperCase())

		return nameFormat
	}

	// console.log("executeCount", executeCount, stepRef.current)

	personas.map((persona) => {
		// name keys are camelized by axios interceptor
		let agentKey = humps.camelize(persona.name)
		let curr_persona = persona
		let curr_speech_bubble = speech_bubbles[agentKey]
		let curr_pronunciatio = pronunciatios[agentKey]
		const character = persona.character

		if (!execute_movement || !execute_movement[agentKey]) {
			finishExecuteCount(agentKey)
		} else if (isFirstIteration(agentKey)) {
			const personaAction = execute_movement[agentKey]

			let curr_x = personaAction[0]
			let curr_y = personaAction[1]
			movement_target[agentKey] = [curr_x * tileWidth, curr_y * tileWidth]
			let pronunciatio_content = personaAction["pronunciatio"]

			let initials = getInitials(agentKey)
			pronunciatios[agentKey].setText(initials + ": " + pronunciatio_content)
		}

		// console.log(curr_persona_name)
		if (executeCount[agentKey] > 0) {
			playAnimation(character, agentKey, movement_target)

			curr_pronunciatio.x = character.x + PRONUNCIATIO_X_OFFSET
			curr_pronunciatio.y = character.y + PRONUNCIATIO_Y_OFFSET
			curr_speech_bubble.x = character.x + SPEECH_BUBBLE_X_OFFSET
			curr_speech_bubble.y = character.y + SPEECH_BUBBLE_Y_OFFSET
		} else {
			// Once we are done moving the personas, we move on to the "process"
			// stage where we will send the current locations of all personas at the
			// end of the movemments to the frontend server, and then the backend.

			// curr_persona.x = movement_target[agentKey][0] + tileWidth / 2
			// curr_persona.y = movement_target[agentKey][1] + tileWidth / 2

			finishExecuteCount(agentKey)

			if (allFinished()) {
				phase = "process"
			}
			// console.log("finished")
		}

		// if (curr_persona_name == "meiLin") {
		// 	console.log(
		// 		"personaMovement",
		// 		curr_persona_name,
		// 		movement_target[curr_persona_name],
		// 		[curr_persona.body.x, curr_persona.body.y],
		// 		[curr_persona.x, curr_persona.y],
		// 		executeCount[curr_persona_name],
		// 	)
		// }
	})

	// Filling in the action description.
	// if (executeCount == executeCountMax) {
	// 	for (let i = 0; i < Object.keys(personas).length; i++) {
	// 		// let action_description = ""
	// 		let curr_persona_name = Object.keys(personas)[i]
	// 		// let curr_persona_name_os = curr_persona_name.replace(/ /g, "_")
	// 		// let description_content = execute_movement["persona"][curr_persona_name]["description"]
	// 		let chat_content = ""

	// 		if (execute_movement[curr_persona_name]["chat"] != null) {
	// 			for (let j = 0; j < execute_movement[curr_persona_name]["chat"].length; j++) {
	// 				chat_content +=
	// 					execute_movement[curr_persona_name]["chat"][j][0] +
	// 					": " +
	// 					execute_movement[curr_persona_name]["chat"][j][1] +
	// 					"<br>"
	// 			}
	// 		} else {
	// 			chat_content = "<em>None at the moment</em>"
	// 		}
	// 		// action_description += description_content + "<br>";
	// 		// document.getElementById("current_action__" + curr_persona_name_os).innerHTML =
	// 		// 	description_content.split("@")[0]
	// 		// document.getElementById("target_address__" + curr_persona_name_os).innerHTML =
	// 		// 	description_content.split("@")[1]
	// 		// document.getElementById("chat__" + curr_persona_name_os).innerHTML = chat_content
	// 	}
	// }

	console.log("step", stepRef.current)
	console.log("executeCount", executeCount)

	if (allFinished()) {
		stepRef.current = stepRef.current + 1
		console.log("allfinished", executeCountMax)
		resetExecuteCount()
	} else {
		decrementExecuteCount()
	}
	return { executeCount, phase }
}

const getInitials = (curr_persona_name) => {
	// This is what gives the pronunciatio balloon the name initials. We
	// use regex to extract the initials of the personas.
	// E.g., "Dolores Murphy" -> "DM"
	return getInitialsFromCamelCase(curr_persona_name)
}

const getInitialsFromSnakeCase = (curr_persona_name) => {
	let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu")
	let initials = [...curr_persona_name.matchAll(rgx)] || []
	initials = ((initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")).toUpperCase()
	return initials
}

const getInitialsFromCamelCase = (curr_persona_name) => {
	const words = curr_persona_name.match(/[A-Z]*[^A-Z]*/g)

	// Extract the first letter from each word and concatenate them
	const initials = words.map((word) => word.charAt(0)).join("")

	return initials.toUpperCase()
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
