export const createGenerator = (
	persona_init_pos,
	personas,
	speech_bubbles,
	pronunciatios,
	mapRef,
	playerRef,
) =>
	function create() {
		mapRef.current = this.make.tilemap({ key: "map" })

		var spawn_tile_loc = {}
		for (var key in persona_init_pos) {
			spawn_tile_loc[key] = personas[key]
		}

		const map = mapRef.current
		const { tileWidth } = map

		// Logging map is really helpful for debugging here:
		// console.log(map)

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
		const bottomGroundLayer = map.createLayer("Bottom Ground", tileset_group_1, 0, 0)
		const exteriorGroundLayer = map.createLayer("Exterior Ground", tileset_group_1, 0, 0)
		const exteriorDecorationL1Layer = map.createLayer("Exterior Decoration L1", tileset_group_1, 0, 0)
		const exteriorDecorationL2Layer = map.createLayer("Exterior Decoration L2", tileset_group_1, 0, 0)
		const interiorGroundLayer = map.createLayer("Interior Ground", tileset_group_1, 0, 0)
		const wallLayer = map.createLayer("Wall", [CuteRPG_Field_C, walls], 0, 0)
		const interiorFurnitureL1Layer = map.createLayer("Interior Furniture L1", tileset_group_1, 0, 0)
		const interiorFurnitureL2Layer = map.createLayer("Interior Furniture L2 ", tileset_group_1, 0, 0)
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
		playerRef.current = this.physics.add
			.sprite(2400, 588, "atlas", "down")
			.setSize(30, 40)
			.setOffset(0, 0)
		const player = playerRef.current
		player.setDepth(-1)

		// Setting up the camera.
		const camera = this.cameras.main
		camera.startFollow(player)

		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

		const cursors = this.input.keyboard.createCursorKeys()

		// *** SET UP PERSONAS ***
		// We start by creating the game sprite objects.
		for (let i = 0; i < Object.keys(spawn_tile_loc).length; i++) {
			let persona_name = Object.keys(spawn_tile_loc)[i]
			let start_pos = [
				spawn_tile_loc[persona_name][0] * tileWidth + tileWidth / 2,
				spawn_tile_loc[persona_name][1] * tileWidth + tileWidth,
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
				.image(new_sprite.body.x + speechOffset, new_sprite.body.y - 30, "speech_bubble")
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
