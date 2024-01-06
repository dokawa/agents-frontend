const animateTileMove = (
	curr_persona,
	curr_persona_name,
	curr_speech_bubble,
	curr_pronunciatio,
) => {
	if (curr_persona.body.x < movement_target[curr_persona_name][0]) {
		curr_persona.body.x += movement_speed
		anims_direction = "r"
		pre_anims_direction = "r"
		pre_anims_direction_dict[curr_persona_name] = "r"
	} else if (curr_persona.body.x > movement_target[curr_persona_name][0]) {
		curr_persona.body.x -= movement_speed
		anims_direction = "l"
		pre_anims_direction = "l"
		pre_anims_direction_dict[curr_persona_name] = "l"
	} else if (curr_persona.body.y < movement_target[curr_persona_name][1]) {
		curr_persona.body.y += movement_speed
		anims_direction = "d"
		pre_anims_direction = "d"
		pre_anims_direction_dict[curr_persona_name] = "d"
	} else if (curr_persona.body.y > movement_target[curr_persona_name][1]) {
		curr_persona.body.y -= movement_speed
		anims_direction = "u"
		pre_anims_direction = "u"
		pre_anims_direction_dict[curr_persona_name] = "u"
	} else {
		anims_direction = ""
	}

	curr_pronunciatio.x = curr_persona.body.x + 18
	curr_pronunciatio.y = curr_persona.body.y - 42 - 25 // DEBUG 1 --- I added 32 offset on Dec 29.
	curr_speech_bubble.x = curr_persona.body.x + 80
	curr_speech_bubble.y = curr_persona.body.y - 39

	let left_walk_name = curr_persona_name + "-left-walk"
	let right_walk_name = curr_persona_name + "-right-walk"
	let down_walk_name = curr_persona_name + "-down-walk"
	let up_walk_name = curr_persona_name + "-up-walk"
	if (anims_direction == "l") {
		curr_persona.anims.play(left_walk_name, true)
	} else if (anims_direction == "r") {
		curr_persona.anims.play(right_walk_name, true)
	} else if (anims_direction == "u") {
		curr_persona.anims.play(up_walk_name, true)
	} else if (anims_direction == "d") {
		curr_persona.anims.play(down_walk_name, true)
	}
}

const animateStop = (curr_persona, curr_persona_name) => {
	curr_persona.anims.stop()
	// If we were moving, pick an idle frame to use
	if (pre_anims_direction_dict[curr_persona_name] == "l")
		curr_persona.setTexture(curr_persona_name, "left")
	else if (pre_anims_direction_dict[curr_persona_name] == "r")
		curr_persona.setTexture(curr_persona_name, "right")
	else if (pre_anims_direction_dict[curr_persona_name] == "u")
		curr_persona.setTexture(curr_persona_name, "up")
	else if (pre_anims_direction_dict[curr_persona_name] == "d")
		curr_persona.setTexture(curr_persona_name, "down")
}

const fillSpeech = (curr_persona_name, curr_step_movement, pronunciatios, tileWidth) => {
	let curr_x = curr_step_movement[curr_persona_name.replace("_", " ")]["movement"][0]

	let curr_y = curr_step_movement[curr_persona_name.replace("_", " ")]["movement"][1]
	movement_target[curr_persona_name] = [curr_x * tileWidth, curr_y * tileWidth]

	let pronunciatio_content = curr_step_movement[curr_persona_name.replace("_", " ")]["pronunciatio"]
	let description_content = curr_step_movement[curr_persona_name.replace("_", " ")]["description"]
	let chat_content_raw = curr_step_movement[curr_persona_name.replace("_", " ")]["chat"]

	let chat_content = ""
	if (chat_content_raw != null) {
		for (let j = 0; j < chat_content_raw.length; j++) {
			chat_content += chat_content_raw[j][0] + ": " + chat_content_raw[j][1] + "<br>"
		}
	} else {
		chat_content = "<em>None at the moment</em>"
	}

	// This is what gives the pronunciatio balloon the name initials. We
	// use regex to extract the initials of the personas.
	// E.g., "Dolores Murphy" -> "DM"
	let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu")
	let initials = [...curr_persona_name.matchAll(rgx)] || []
	initials = ((initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")).toUpperCase()
	pronunciatios[curr_persona_name].setText(initials + ": " + pronunciatio_content)
	// console.log("initials", initials)

	// Updating the status of each personas
	document.getElementById("quick_emoji-" + curr_persona_name).innerHTML = pronunciatio_content
	document.getElementById("current_action__" + curr_persona_name).innerHTML =
		description_content.split("@")[0]
	document.getElementById("target_address__" + curr_persona_name).innerHTML =
		description_content.split("@")[1]
	document.getElementById("chat__" + curr_persona_name).innerHTML = chat_content
}
