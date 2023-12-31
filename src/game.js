/* eslint-disable camelcase */
import React, { useEffect, useRef } from "react"
import Phaser from "phaser"

const PLAY_SPEED = 1
const STEP = 1
const SEC_PER_STEP = 10
const WIDTH = 1920
const HEIGHT = 1080

function Game() {
	const gameContainerRef = useRef(null)
	let player
	let cursors

	// TODO delete this stubs from BE
	const persona_init_pos = { Abigail_Chen: [10, 10] }
	const all_movement = {
		1: {
			Abigail_Chen: {
				movement: [15, 15],
			},
		},
	}

	var pronunciatios = {}
	var speech_bubbles = {}
	let pre_anims_direction_dict = {}

	let map
	// TODO add controls
	let step = STEP
	let movement_speed = PLAY_SPEED
	let sec_per_step = SEC_PER_STEP
	const datetime = "01012024"

	const tileBoundaryXOffset = WIDTH / 2
	const tileBoundaryYOffset = HEIGHT / 2

	// <step> -- one full loop around all three phases determined by <phase> is
	// a step. We use this to link the steps in the backend.
	// let sim_code = "{{sim_code}}";
	let step_size = sec_per_step * 1000 // 10 seconds = 10000

	// Variables for storing movements that are sent from the backend server.
	let execute_count
	let movement_target = {}

	let start_datetime = new Date(Date.parse(datetime))

	// // Control button binders
	// var play_button=document.getElementById("play_button");
	// var pause_button=document.getElementById("pause_button");

	// Persona related variables. This should have the name of the persona as its
	// keys, and the instances of the Persona class as the values.

	let personas = persona_init_pos
	var spawn_tile_loc = {}
	for (var key in persona_init_pos) {
		spawn_tile_loc[key] = personas[key]
	}

	useEffect(() => {
		const preload = function () {
			//   this.load.atlas(
			//     "atlas",
			//     "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1assets/atlas/atlas.png",
			//     "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1assets/atlas/atlas.json"
			//   );

			this.load.image(
				"blocks_1",
				"assets/the_ville/visuals/map_assets/blocks/blocks_1.png",
			)
			this.load.image(
				"walls",
				"assets/the_ville/visuals/map_assets/v1/Room_Builder_32x32.png",
			)
			this.load.image(
				"interiors_pt1",
				"assets/the_ville/visuals/map_assets/v1/interiors_pt1.png",
			)
			this.load.image(
				"interiors_pt2",
				"assets/the_ville/visuals/map_assets/v1/interiors_pt2.png",
			)
			this.load.image(
				"interiors_pt3",
				"assets/the_ville/visuals/map_assets/v1/interiors_pt3.png",
			)
			this.load.image(
				"interiors_pt4",
				"assets/the_ville/visuals/map_assets/v1/interiors_pt4.png",
			)
			this.load.image(
				"interiors_pt5",
				"assets/the_ville/visuals/map_assets/v1/interiors_pt5.png",
			)
			this.load.image(
				"CuteRPG_Field_B",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Field_B.png",
			)
			this.load.image(
				"CuteRPG_Field_C",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Field_C.png",
			)
			this.load.image(
				"CuteRPG_Harbor_C",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Harbor_C.png",
			)
			this.load.image(
				"CuteRPG_Village_B",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Village_B.png",
			)
			this.load.image(
				"CuteRPG_Forest_B",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Forest_B.png",
			)
			this.load.image(
				"CuteRPG_Desert_C",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Desert_C.png",
			)
			this.load.image(
				"CuteRPG_Mountains_B",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Mountains_B.png",
			)
			this.load.image(
				"CuteRPG_Desert_B",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Desert_B.png",
			)
			this.load.image(
				"CuteRPG_Forest_C",
				"assets/the_ville/visuals/map_assets/cute_rpg_word_VXAce/tilesets/CuteRPG_Forest_C.png",
			)

			this.load.tilemapTiledJSON(
				"map",
				"assets/the_ville/visuals/the_ville_jan7.json",
			)
			// this.load.atlas("atlas", "assets/characters/Yuriko_Yamamoto.png", "assets/characters/atlas.json");
			this.load.image("speech_bubble", "assets/speech_bubble/v3.png")

			console.log("personas", personas)
			for (let p in personas) {
				var imageStatic = "assets/characters/" + p.replace(/ /g, "_") + ".png"
				console.log("p", p)

				this.load.atlas(
					p.replace(/ /g, "_"),
					imageStatic,
					"assets/characters/atlas.json",
				)
			}
		}

		const create = function () {
			map = this.make.tilemap({ key: "map" })
			const { tileWidth } = map

			// Logging map is really helpful for debugging here:
			console.log(map)

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
			const CuteRPG_Field_B = map.addTilesetImage(
				"CuteRPG_Field_B",
				"CuteRPG_Field_B",
			)
			const CuteRPG_Field_C = map.addTilesetImage(
				"CuteRPG_Field_C",
				"CuteRPG_Field_C",
			)
			const CuteRPG_Harbor_C = map.addTilesetImage(
				"CuteRPG_Harbor_C",
				"CuteRPG_Harbor_C",
			)
			const CuteRPG_Village_B = map.addTilesetImage(
				"CuteRPG_Village_B",
				"CuteRPG_Village_B",
			)
			const CuteRPG_Forest_B = map.addTilesetImage(
				"CuteRPG_Forest_B",
				"CuteRPG_Forest_B",
			)
			const CuteRPG_Desert_C = map.addTilesetImage(
				"CuteRPG_Desert_C",
				"CuteRPG_Desert_C",
			)
			const CuteRPG_Mountains_B = map.addTilesetImage(
				"CuteRPG_Mountains_B",
				"CuteRPG_Mountains_B",
			)
			const CuteRPG_Desert_B = map.addTilesetImage(
				"CuteRPG_Desert_B",
				"CuteRPG_Desert_B",
			)
			const CuteRPG_Forest_C = map.addTilesetImage(
				"CuteRPG_Forest_C",
				"CuteRPG_Forest_C",
			)

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
			const bottomGroundLayer = map.createLayer(
				"Bottom Ground",
				tileset_group_1,
				0,
				0,
			)
			const exteriorGroundLayer = map.createLayer(
				"Exterior Ground",
				tileset_group_1,
				0,
				0,
			)
			const exteriorDecorationL1Layer = map.createLayer(
				"Exterior Decoration L1",
				tileset_group_1,
				0,
				0,
			)
			const exteriorDecorationL2Layer = map.createLayer(
				"Exterior Decoration L2",
				tileset_group_1,
				0,
				0,
			)
			const interiorGroundLayer = map.createLayer(
				"Interior Ground",
				tileset_group_1,
				0,
				0,
			)
			const wallLayer = map.createLayer("Wall", [CuteRPG_Field_C, walls], 0, 0)
			const interiorFurnitureL1Layer = map.createLayer(
				"Interior Furniture L1",
				tileset_group_1,
				0,
				0,
			)
			const interiorFurnitureL2Layer = map.createLayer(
				"Interior Furniture L2 ",
				tileset_group_1,
				0,
				0,
			)
			const foregroundL1Layer = map.createLayer(
				"Foreground L1",
				tileset_group_1,
				0,
				0,
			)
			const foregroundL2Layer = map.createLayer(
				"Foreground L2",
				tileset_group_1,
				0,
				0,
			)

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

			// const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
			// const worldLayer = map.createLayer("World", tileset, 0, 0);
			// const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
			// worldLayer.setCollisionByProperty({ collides: true });
			// aboveLayer.setDepth(10);

			// const spawnPoint = map.findObject("Objects", (obj) => obj.name === "Spawn Point");

			// player = this.physics.add
			// 	.sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
			// 	.setSize(30, 40)
			// 	.setOffset(0, 24);

			// this.physics.add.collider(player, worldLayer);

			// player = this.physics.add
			// 	.sprite(0, 0, "atlas", "misa-front")
			// 	.setSize(30, 40)
			// 	.setOffset(0, 24);

			// this.physics.add.collider(player, worldLayer);
			// *** SET UP CAMERA ***
			// "player" is to be set as the center of mass for our "camera." We
			// basically create a game character sprite as we would for our personas
			// but we move it to depth -1 and let it pass through the collision map;
			// that is, do not have the following line:
			// this.physics.add.collider(player, collisionsLayer);
			// OLD NOTE: Create a sprite with physics enabled via the physics system.
			// The image  used for the sprite has a bit of whitespace, so I'm using
			// setSize & setOffset to control the size of the player's body.
			player = this.physics.add
				.sprite(2400, 588, "atlas", "down")
				.setSize(30, 40)
				.setOffset(0, 0)
			player.setDepth(-1)
			// Setting up the camera.
			const camera = this.cameras.main
			camera.startFollow(player)

			camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

			cursors = this.input.keyboard.createCursorKeys()

			// *** SET UP PERSONAS ***
			// We start by creating the game sprite objects.
			for (let i = 0; i < Object.keys(spawn_tile_loc).length; i++) {
				let persona_name = Object.keys(spawn_tile_loc)[i]
				let start_pos = [
					spawn_tile_loc[persona_name][0] * tileWidth + tileWidth / 2,
					spawn_tile_loc[persona_name][1] * tileWidth + tileWidth,
					// 100,
					// 100,
				]
				console.log("pos", persona_name, spawn_tile_loc, start_pos, tileWidth)
				let new_sprite = this.physics.add
					.sprite(start_pos[0], start_pos[1], persona_name, "down")

					.setSize(30, 40)
					.setOffset(0, 0)
				// Scale up the sprite
				new_sprite.displayWidth = 40
				new_sprite.scaleY = new_sprite.scaleX

				// Here, we are creating the persona and its pronunciatio sprites.
				personas[persona_name] = new_sprite

				const speechOffset = 50
				speech_bubbles[persona_name] = this.add
					.image(
						new_sprite.body.x + speechOffset,
						new_sprite.body.y - 30,
						"speech_bubble",
					)
					.setDepth(3)
				speech_bubbles[persona_name].displayWidth = 130
				speech_bubbles[persona_name].displayHeight = 58

				pronunciatios[persona_name] = this.add
					.text(new_sprite.body.x + speechOffset - 6, new_sprite.body.y - 42, "🦁", {
						font: "24px monospace",
						fill: "#000000",
						padding: { x: 8, y: 8 },
						border: "solid",
						borderRadius: "10px",
					})
					.setDepth(3)
			}

			// const {anims} = this;
			// anims.create({
			// 	key: "misa-left-walk",
			// 	frames: anims.generateFrameNames("atlas", {
			// 		prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3
			// 	}),
			// 	frameRate: 10,
			// 	repeat: -1,
			// });
			// anims.create({
			// 	key: "misa-right-walk",
			// 	frames: anims.generateFrameNames("atlas", {
			// 		prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3
			// 	}),
			// 	frameRate: 10,
			// 	repeat: -1,
			// });
			// anims.create({
			// 	key: "misa-front-walk",
			// 	frames: anims.generateFrameNames("atlas", {
			// 		prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3
			// 	}),
			// 	frameRate: 10,
			// 	repeat: -1,
			// });
			// anims.create({
			// 	key: "misa-back-walk",
			// 	frames: anims.generateFrameNames("atlas", {
			// 		prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3
			// 	}),
			// 	frameRate: 10,
			// 	repeat: -1,
			// });

			cursors = this.input.keyboard.createCursorKeys()

			this.add
				.text(16, 16, "Arrow keys or WASD to move\nPress 'H' to show hitboxes", {
					font: "18px monospace",
					fill: "#000000",
					padding: { x: 20, y: 10 },
					backgroundColor: "#ffffff",
				})
				.setScrollFactor(0)
				.setDepth(30)

			this.input.keyboard.once("keydown-H", (event) => {
				this.physics.world.createDebugGraphic()

				const graphics = this.add.graphics().setAlpha(0.75).setDepth(20)
				// worldLayer.renderDebug(graphics, {
				// 	tileColor: null,
				// 	collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
				// 	faceColor: new Phaser.Display.Color(40, 39, 37, 255),
				// });
			})

			// Create the player's walking animations from the texture atlas. These are
			// stored in the global animation manager so any sprite can access them.
			const anims = this.anims
			for (let i = 0; i < Object.keys(personas).length; i++) {
				let persona_name = Object.keys(personas)[i]
				let left_walk_name = persona_name + "-left-walk"
				let right_walk_name = persona_name + "-right-walk"
				let down_walk_name = persona_name + "-down-walk"
				let up_walk_name = persona_name + "-up-walk"

				console.log(persona_name, left_walk_name, "DEUBG")
				anims.create({
					key: left_walk_name,
					frames: anims.generateFrameNames(persona_name, {
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
					frames: anims.generateFrameNames(persona_name, {
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
					frames: anims.generateFrameNames(persona_name, {
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
					frames: anims.generateFrameNames(persona_name, {
						prefix: "up-walk.",
						start: 0,
						end: 3,
						zeroPad: 3,
					}),
					frameRate: 4,
					repeat: -1,
				})
			}
		}

		const update = function (time, delta) {
			const { height: canvasHeight, width: canvasWidth, tileWidth } = map
			const execute_count_max = tileWidth / movement_speed

			// const speed = 175;
			// const prevVelocity = player.body.velocity.clone();

			// player.body.setVelocity(0);

			// if (cursors.left.isDown) {
			// 	player.body.setVelocityX(-speed);
			// } else if (cursors.right.isDown) {
			// 	player.body.setVelocityX(speed);
			// }

			// if (cursors.up.isDown) {
			// 	player.body.setVelocityY(-speed);
			// } else if (cursors.down.isDown) {
			// 	player.body.setVelocityY(speed);
			// }

			// player.body.velocity.normalize().scale(speed);

			// if (cursors.left.isDown) {
			// 	player.anims.play("misa-left-walk", true);
			// } else if (cursors.right.isDown) {
			// 	player.anims.play("misa-right-walk", true);
			// } else if (cursors.up.isDown) {
			// 	player.anims.play("misa-back-walk", true);
			// } else if (cursors.down.isDown) {
			// 	player.anims.play("misa-front-walk", true);
			// } else {
			// 	player.anims.stop();

			// 	if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
			// 	else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
			// 	else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
			// 	else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
			// }

			// *** SETUP PLAY AND PAUSE BUTTON ***
			let play_context = this
			// function game_resume() {
			// 	play_context.scene.resume();
			// }
			// play_button.onclick = function(){
			// 	game_resume();
			// };
			// function game_pause() {
			// 	play_context.scene.pause();
			// }
			// pause_button.onclick = function(){
			// 	game_pause();
			// };

			// *** MOVE CAMERA ***
			// This is where we finish up the camera setting we started in the create()
			// function. We set the movement speed of the camera and wire up the keys to
			// map to the actual movement.
			const camera_speed = 800

			// Stop any previous movement from the last frame
			player.body.setVelocity(0)

			// TODO add if player is camera

			const tileHeight = tileWidth
			if (
				(cursors.left.isDown || this.input.keyboard.addKey("A").isDown) &&
				player.body.x > tileBoundaryXOffset
			) {
				player.body.setVelocityX(-camera_speed)
			}
			if (
				(cursors.up.isDown || this.input.keyboard.addKey("W").isDown) &&
				player.body.y > tileBoundaryYOffset
			) {
				player.body.setVelocityY(-camera_speed)
			}
			if (
				(cursors.right.isDown || this.input.keyboard.addKey("D").isDown) &&
				player.body.x < canvasWidth * tileWidth - tileBoundaryXOffset
			) {
				player.body.setVelocityX(camera_speed)
			}
			if (
				(cursors.down.isDown || this.input.keyboard.addKey("S").isDown) &&
				player.body.y < canvasHeight * tileHeight - tileBoundaryYOffset
			) {
				player.body.setVelocityY(camera_speed)
			}

			// TODO add forms to get current focus

			//   let curr_focused_persona = document.getElementById("temp_focus").textContent;
			//   if (curr_focused_persona != "") {
			//   	player.body.x = personas[curr_focused_persona].body.x;
			//   	player.body.y = personas[curr_focused_persona].body.y;
			//   	document.getElementById("temp_focus").innerHTML = "";
			//   }

			// *** MOVING PERSONAS ***
			for (let i = 0; i < Object.keys(personas).length; i++) {
				let curr_persona_name = Object.keys(personas)[i]
				let curr_persona = personas[curr_persona_name]
				// let curr_pronunciatio = pronunciatios[Object.keys(personas)[i]]
				let curr_speech_bubble = speech_bubbles[Object.keys(personas)[i]]

				if (curr_persona_name.replace("_", " ") in all_movement[step]) {
					if (execute_count == execute_count_max) {
						let curr_x =
							all_movement[step][curr_persona_name.replace("_", " ")]["movement"][0]
						console.log(
							all_movement[step],
							all_movement[step][curr_persona_name.replace("_", " ")],
							all_movement[step][curr_persona_name.replace("_", " ")]["movement"],
							all_movement[step][curr_persona_name.replace("_", " ")]["movement"][0],
						)
						let curr_y =
							all_movement[step][curr_persona_name.replace("_", " ")]["movement"][1]
						movement_target[curr_persona_name] = [
							curr_x * tileWidth,
							curr_y * tileWidth,
						]
						console.log("curr_x", curr_x)
						console.log("curr_y", curr_y)
						let pronunciatio_content =
							all_movement[step][curr_persona_name.replace("_", " ")]["pronunciatio"]
						let description_content =
							all_movement[step][curr_persona_name.replace("_", " ")]["description"]
						let chat_content_raw =
							all_movement[step][curr_persona_name.replace("_", " ")]["chat"]

						let chat_content = ""
						if (chat_content_raw != null) {
							for (let j = 0; j < chat_content_raw.length; j++) {
								chat_content +=
									chat_content_raw[j][0] + ": " + chat_content_raw[j][1] + "<br>"
							}
						} else {
							chat_content = "<em>None at the moment</em>"
						}

						// This is what gives the pronunciatio balloon the name initials. We
						// use regex to extract the initials of the personas.
						// E.g., "Dolores Murphy" -> "DM"
						let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu")
						let initials = [...curr_persona_name.matchAll(rgx)] || []
						initials = (
							(initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
						).toUpperCase()
						pronunciatios[curr_persona_name].setText(
							initials + ": " + pronunciatio_content,
						)

						// Updating the status of each personas
						document.getElementById("quick_emoji-" + curr_persona_name).innerHTML =
							pronunciatio_content
						document.getElementById(
							"current_action__" + curr_persona_name,
						).innerHTML = description_content.split("@")[0]
						document.getElementById(
							"target_address__" + curr_persona_name,
						).innerHTML = description_content.split("@")[1]
						document.getElementById("chat__" + curr_persona_name).innerHTML =
							chat_content
					}

					if (execute_count > 0) {
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
				} else {
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
			}

			if (execute_count == 0) {
				for (let i = 0; i < Object.keys(personas).length; i++) {
					let curr_persona_name = Object.keys(personas)[i]
					let curr_persona = personas[curr_persona_name]
					curr_persona.body.x = movement_target[curr_persona_name][0]
					curr_persona.body.y = movement_target[curr_persona_name][1]
				}
				execute_count = execute_count_max + 1
				step = step + 1

				start_datetime = new Date(start_datetime.getTime() + step_size)
				// document.getElementById("game-time-content").innerHTML =
				// 	start_datetime.toLocaleTimeString("en-US", datetime_options)
			}

			execute_count -= 1
		}

		const config = {
			type: Phaser.AUTO,
			width: WIDTH,
			height: HEIGHT,
			parent: "game-container",
			pixelArt: true,
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
				},
			},
			scene: {
				preload,
				create,
				update,
			},
		}

		const game = new Phaser.Game(config)

		return () => {
			// Cleanup Phaser game when component unmounts
			game.destroy(true)
		}
	}, [])

	return <div ref={gameContainerRef} />
}

export default Game
