import {
	CAMERA_STARTING_X,
	CAMERA_STARTING_Y,
	PRONUNCIATIO_X_OFFSET,
	PRONUNCIATIO_Y_OFFSET,
	SPEECH_BUBBLE_X_OFFSET,
	SPEECH_BUBBLE_Y_OFFSET,
	TILE_WIDTH,
} from "../constants"

export const createGenerator = (agents, speech_bubbles, pronunciatios, mapRef, playerRef) =>
	function create() {
		const context = this

		mapRef.current = this.make.tilemap({ key: "map" })
		const map = mapRef.current
		const { tileWidth } = map

		setupDebugging(context)

		// Logging map is really helpful for debugging here:
		// console.log(map)

		createMap(map)
		setupCamera(context, playerRef, map)

		// *** SET UP AGENTS ***
		createSprites(context, tileWidth, agents, speech_bubbles, pronunciatios)
		createWalkingAnimations(context, agents)
	}

const createMap = (map) => {
	// The first parameter is the name you gave to the tileset in Tiled and then
	// the key of the tileset image in Phaser"s cache (i.e. the name you used in
	// preload)
	// For the first parameter here, really take a look at the
	//       console.log(map) output. You need to make sure that the name
	//       matches.
	const collisions = map.addTilesetImage("blocks", "blocks_1")
	const walls = map.addTilesetImage("Room_Builder_32x32", "walls")
	const interiors_pt1 = map.addTilesetImage("interiors_pt1", "interiors_pt1")
	const interiors_pt2 = map.addTilesetImage("interiors_pt2", "interiors_pt2")
	const interiors_pt3 = map.addTilesetImage("interiors_pt3", "interiors_pt3")
	const interiors_pt4 = map.addTilesetImage("interiors_pt4", "interiors_pt4")
	const interiors_pt5 = map.addTilesetImage("interiors_pt5", "interiors_pt5")
	const CuteRPG_Field_B = map.addTilesetImage("CuteRPG_Field_B", "CuteRPG_Field_B")
	const CuteRPG_Field_C = map.addTilesetImage("CuteRPG_Field_C", "CuteRPG_Field_C")
	const CuteRPG_Harbor_C = map.addTilesetImage("CuteRPG_Harbor_C", "CuteRPG_Harbor_C")
	const CuteRPG_Village_B = map.addTilesetImage("CuteRPG_Village_B", "CuteRPG_Village_B")
	const CuteRPG_Forest_B = map.addTilesetImage("CuteRPG_Forest_B", "CuteRPG_Forest_B")
	const CuteRPG_Desert_C = map.addTilesetImage("CuteRPG_Desert_C", "CuteRPG_Desert_C")
	const CuteRPG_Mountains_B = map.addTilesetImage("CuteRPG_Mountains_B", "CuteRPG_Mountains_B")
	const CuteRPG_Desert_B = map.addTilesetImage("CuteRPG_Desert_B", "CuteRPG_Desert_B")
	const CuteRPG_Forest_C = map.addTilesetImage("CuteRPG_Forest_C", "CuteRPG_Forest_C")

	//   const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
	// The first parameter is the layer name (or index) taken from Tiled, the
	// second parameter is the tileset you set above, and the final two
	// parameters are the x, y coordinate.
	// The "layer name" that comes as the first parameter value
	//       literally is taken from our Tiled layer name. So to find out what
	//       they are; you actually need to open up tiled and see how you
	//       named things there.
	const tileset_group_1 = [
		CuteRPG_Field_B,
		CuteRPG_Field_C,
		CuteRPG_Harbor_C,
		CuteRPG_Village_B,
		CuteRPG_Forest_B,
		CuteRPG_Desert_C,
		CuteRPG_Mountains_B,
		CuteRPG_Desert_B,
		CuteRPG_Forest_C,
		interiors_pt1,
		interiors_pt2,
		interiors_pt3,
		interiors_pt4,
		interiors_pt5,
		walls,
	]
	/* eslint-disable */
	const bottomGroundLayer = map.createLayer("Bottom Ground", tileset_group_1, 0, 0)
	const exteriorGroundLayer = map.createLayer("Exterior Ground", tileset_group_1, 0, 0)
	const exteriorDecorationL1Layer = map.createLayer("Exterior Decoration L1", tileset_group_1, 0, 0)
	const exteriorDecorationL2Layer = map.createLayer("Exterior Decoration L2", tileset_group_1, 0, 0)
	const interiorGroundLayer = map.createLayer("Interior Ground", tileset_group_1, 0, 0)
	const wallLayer = map.createLayer("Wall", [CuteRPG_Field_C, walls], 0, 0)
	const interiorFurnitureL1Layer = map.createLayer("Interior Furniture L1", tileset_group_1, 0, 0)
	const interiorFurnitureL2Layer = map.createLayer("Interior Furniture L2 ", tileset_group_1, 0, 0)
	/* eslint-enable */

	const foregroundL1Layer = map.createLayer("Foreground L1", tileset_group_1, 0, 0)
	const foregroundL2Layer = map.createLayer("Foreground L2", tileset_group_1, 0, 0)

	const collisionsLayer = map.createLayer("Collisions", collisions, 0, 0)

	collisionsLayer.setCollisionByProperty({ collide: true })

	// By default, everything gets depth sorted on the screen in the order we
	// created things. Here, we want the "Above Player" layer to sit on top of
	// the player, so we explicitly give it a depth. Higher depths will sit on
	// top of lower depth objects.
	// Collisions layer should get a negative depth since we do not want to see
	// it.
	collisionsLayer.setDepth(-1)
	foregroundL1Layer.setDepth(2)
	foregroundL2Layer.setDepth(2)
}
const createWalkingAnimations = (context, agents) => {
	// Create the player's walking animations from the texture atlas. These are
	// stored in the global animation manager so any sprite can access them.
	const anims = context.anims
	agents.map((agent) => {
		let agentKey = agent.key
		let left_walk_name = agentKey + "-left-walk"
		let right_walk_name = agentKey + "-right-walk"
		let down_walk_name = agentKey + "-down-walk"
		let up_walk_name = agentKey + "-up-walk"

		anims.create({
			key: left_walk_name,
			frames: anims.generateFrameNames(agentKey, {
				prefix: "left-walk.",
				start: 0,
				end: 3,
				zeroPad: 3,
			}),
			frameRate: 4,
			repeat: -1,
		})

		anims.create({
			key: right_walk_name,
			frames: anims.generateFrameNames(agentKey, {
				prefix: "right-walk.",
				start: 0,
				end: 3,
				zeroPad: 3,
			}),
			frameRate: 4,
			repeat: -1,
		})

		anims.create({
			key: down_walk_name,
			frames: anims.generateFrameNames(agentKey, {
				prefix: "down-walk.",
				start: 0,
				end: 3,
				zeroPad: 3,
			}),
			frameRate: 4,
			repeat: -1,
		})

		anims.create({
			key: up_walk_name,
			frames: anims.generateFrameNames(agentKey, {
				prefix: "up-walk.",
				start: 0,
				end: 3,
				zeroPad: 3,
			}),
			frameRate: 4,
			repeat: -1,
		})
	})
}

const createSprites = (context, tileWidth, agents, speech_bubbles, pronunciatios) => {
	agents.map((agent) => {
		const agentKey = agent.key

		let start_pos = [
			agent.currTile[0] * tileWidth + tileWidth / 2,
			agent.currTile[1] * tileWidth + tileWidth / 2,
		]

		let character = context.physics.add
			.sprite(start_pos[0], start_pos[1], agentKey, "down")
			.setSize(30, 40)
			.setOffset(0, 0)

		// Scale up the sprite
		character.displayWidth = 40
		character.scaleY = character.scaleX

		// Here, we are creating the persona and its pronunciatio sprites.
		agent.character = character

		speech_bubbles[agentKey] = context.add
			.image(
				character.x + SPEECH_BUBBLE_X_OFFSET,
				character.y + SPEECH_BUBBLE_Y_OFFSET,
				"speech_bubble",
			)
			.setDepth(3)
		speech_bubbles[agentKey].displayWidth = 130
		speech_bubbles[agentKey].displayHeight = 58

		pronunciatios[agentKey] = context.add
			.text(character.x + PRONUNCIATIO_X_OFFSET, character.y + PRONUNCIATIO_Y_OFFSET, "🦁", {
				font: "24px monospace",
				fill: "#000000",
				padding: { x: 8, y: 8 },
				border: "solid",
				borderRadius: "10px",
			})
			.setDepth(3)
	})
}
function setupDebugging(context) {
	const inputKeyboard = context.input.keyboard

	inputKeyboard.once("keydown-H", () => {
		context.physics.world.createDebugGraphic()

		context.add.graphics().setAlpha(0.75).setDepth(20)
		// worldLayer.renderDebug(graphics, {
		// 	tileColor: null,
		// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
		// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255),
		// });
	})

	context.add
		.text(16, 16, "Arrow keys or WASD to move\nPress 'H' to show hitboxes", {
			font: "18px monospace",
			fill: "#000000",
			padding: { x: 20, y: 10 },
			backgroundColor: "#ffffff",
		})
		.setScrollFactor(0)
		.setDepth(30)
}

function setupCamera(context, playerRef, map) {
	// *** SET UP CAMERA ***
	// "player" is to be set as the center of mass for our "camera." We
	// basically create a game character sprite as we would for our agents
	// but we move it to depth -1 and let it pass through the collision map;
	// that is, do not have the following line:
	// this.physics.add.collider(player, collisionsLayer);
	// OLD NOTE: Create a sprite with physics enabled via the physics system.
	// The image  used for the sprite has a bit of whitespace, so I'm using
	// setSize & setOffset to control the size of the player's body.
	playerRef.current = context.physics.add
		.sprite(CAMERA_STARTING_X * TILE_WIDTH, CAMERA_STARTING_Y * TILE_WIDTH, "atlas", "down")
		.setSize(30, 40)
		.setOffset(0, 0)
	const player = playerRef.current
	player.setDepth(-1)

	// Setting up the camera.
	const camera = context.cameras.main
	camera.startFollow(player)

	camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
}
