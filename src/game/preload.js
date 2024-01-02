import { ID_TO_SPRITE_NAME } from "../constants"

export const preloadGenerator = (personas) =>
	function preload() {
		this.load.image("blocks_1", "assets/the_ville/visuals/map_assets/blocks/blocks_1.png")
		this.load.image("walls", "assets/the_ville/visuals/map_assets/v1/Room_Builder_32x32.png")
		this.load.image("interiors_pt1", "assets/the_ville/visuals/map_assets/v1/interiors_pt1.png")
		this.load.image("interiors_pt2", "assets/the_ville/visuals/map_assets/v1/interiors_pt2.png")
		this.load.image("interiors_pt3", "assets/the_ville/visuals/map_assets/v1/interiors_pt3.png")
		this.load.image("interiors_pt4", "assets/the_ville/visuals/map_assets/v1/interiors_pt4.png")
		this.load.image("interiors_pt5", "assets/the_ville/visuals/map_assets/v1/interiors_pt5.png")
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

		this.load.tilemapTiledJSON("map", "assets/the_ville/visuals/the_ville_jan7.json")

		this.load.image("speech_bubble", "assets/speech_bubble/v3.png")

		for (let p in personas) {
			const spriteName = ID_TO_SPRITE_NAME[p]
			var imageStatic = "assets/characters/" + spriteName + ".png"

			this.load.atlas(p.replace(/ /g, "_"), imageStatic, "assets/characters/atlas.json")
		}
	}
