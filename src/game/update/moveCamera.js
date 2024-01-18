import { WIDTH, HEIGHT, TILE_WIDTH, CAMERA_MODE } from "../../constants"

export const moveCamera = (
	player,
	cameraModeRef,
	inputKeyboard,
	canvasWidth,
	canvasHeight,
	tileWidth,
) => {
	// *** MOVE CAMERA ***
	// This is where we finish up the camera setting we started in the create()
	// function. We set the movement speed of the camera and wire up the keys to
	// map to the actual movement.
	const mode = cameraModeRef.current[0]

	if (inputKeyboard.addKey("ESC").isDown) {
		console.log("eeeesesssc")
		cameraModeRef.current = [CAMERA_MODE.FREE_MOVEMENT, player]
	}

	if (mode == CAMERA_MODE.FOLLOWING) {
		const charToFollow = cameraModeRef.current[1]
		player.body.x = charToFollow.body.x
		player.body.y = charToFollow.body.y
	} else {
		cameraFreeMovement(player, inputKeyboard, canvasWidth, canvasHeight, tileWidth)
	}
}

const cameraFreeMovement = (player, inputKeyboard, canvasWidth, canvasHeight, tileWidth) => {
	const camera_speed = 800

	const cursors = inputKeyboard.createCursorKeys()

	// Stop any previous movement from the last frame
	player.body.setVelocity(0)

	const tileBoundaryXOffset = WIDTH / 2
	const tileBoundaryYOffset = HEIGHT / 2

	// TODO check if player is camera because we are restricting movement below
	const tileHeight = tileWidth
	if (
		(cursors.left.isDown || inputKeyboard.addKey("A").isDown) &&
		player.body.x > tileBoundaryXOffset
	) {
		player.body.setVelocityX(-camera_speed)
	}
	if (
		(cursors.up.isDown || inputKeyboard.addKey("W").isDown) &&
		player.body.y > tileBoundaryYOffset
	) {
		player.body.setVelocityY(-camera_speed)
	}
	if (
		(cursors.right.isDown || inputKeyboard.addKey("D").isDown) &&
		player.body.x < canvasWidth * tileWidth - tileBoundaryXOffset
	) {
		player.body.setVelocityX(camera_speed)
	}
	if (
		(cursors.down.isDown || inputKeyboard.addKey("S").isDown) &&
		player.body.y < canvasHeight * tileHeight - tileBoundaryYOffset
	) {
		player.body.setVelocityY(camera_speed)
	}

	document.getElementById("position-x").innerHTML = Math.floor(
		(player.body.x + TILE_WIDTH / 2) / TILE_WIDTH,
	)
	document.getElementById("position-y").innerHTML = Math.floor(
		(player.body.y + TILE_WIDTH / 2) / TILE_WIDTH,
	)
}
