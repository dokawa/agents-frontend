import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const Game = () => {
  const gameContainerRef = useRef(null);
  const cursorsRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image(
        'tiles',
        'https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png'
      );
      this.load.tilemapTiledJSON(
        'map',
        'https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json'
      );
      this.load.atlas(
        'atlas',
        'https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png',
        'https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json'
      );
    }

    function create() {
      const map = this.make.tilemap({ key: 'map' });

      const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');

      const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
      const worldLayer = map.createLayer('World', tileset, 0, 0);
      const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);

      worldLayer.setCollisionByProperty({ collides: true });

      aboveLayer.setDepth(10);

      const spawnPoint = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

      playerRef.current = this.physics.add
        .sprite(spawnPoint.x, spawnPoint.y, 'atlas', 'misa-front')
        .setSize(30, 40)
        .setOffset(0, 24);

      this.physics.add.collider(playerRef.current, worldLayer);

      const anims = this.anims;
      anims.create({
        key: 'misa-left-walk',
        frames: anims.generateFrameNames('atlas', { prefix: 'misa-left-walk.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      anims.create({
        key: 'misa-right-walk',
        frames: anims.generateFrameNames('atlas', { prefix: 'misa-right-walk.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      anims.create({
        key: 'misa-front-walk',
        frames: anims.generateFrameNames('atlas', { prefix: 'misa-front-walk.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      anims.create({
        key: 'misa-back-walk',
        frames: anims.generateFrameNames('atlas', { prefix: 'misa-back-walk.', start: 0, end: 3, zeroPad: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      const camera = this.cameras.main;
      camera.startFollow(playerRef.current);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      cursorsRef.current = this.input.keyboard.createCursorKeys();

      this.add
        .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
          font: '18px monospace',
          fill: '#000000',
          padding: { x: 20, y: 10 },
          backgroundColor: '#ffffff',
        })
        .setScrollFactor(0)
        .setDepth(30);

      this.input.keyboard.once('keydown-D', (event) => {
        this.physics.world.createDebugGraphic();

        const graphics = this.add
          .graphics()
          .setAlpha(0.75)
          .setDepth(20);
        worldLayer.renderDebug(graphics, {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
          faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        });
      });
    }

    function update(time, delta) {
      const speed = 175;
      const prevVelocity = playerRef.current.body.velocity.clone();

      playerRef.current.body.setVelocity(0);

      if (cursorsRef.current.left.isDown) {
        playerRef.current.body.setVelocityX(-speed);
      } else if (cursorsRef.current.right.isDown) {
        playerRef.current.body.setVelocityX(speed);
      }

      if (cursorsRef.current.up.isDown) {
        playerRef.current.body.setVelocityY(-speed);
      } else if (cursorsRef.current.down.isDown) {
        playerRef.current.body.setVelocityY(speed);
      }

      playerRef.current.body.velocity.normalize().scale(speed);

      if (cursorsRef.current.left.isDown) {
        playerRef.current.anims.play('misa-left-walk', true);
      } else if (cursorsRef.current.right.isDown) {
        playerRef.current.anims.play('misa-right-walk', true);
      } else if (cursorsRef.current.up.isDown) {
        playerRef.current.anims.play('misa-back-walk', true);
      } else if (cursorsRef.current.down.isDown) {
        playerRef.current.anims.play('misa-front-walk', true);
      } else {
        playerRef.current.anims.stop();

        if (prevVelocity.x < 0) playerRef.current.setTexture('atlas', 'misa-left');
        else if (prevVelocity.x > 0) playerRef.current.setTexture('atlas', 'misa-right');
        else if (prevVelocity.y < 0) playerRef.current.setTexture('atlas', 'misa-back');
        else if (prevVelocity.y > 0) playerRef.current.setTexture('atlas', 'misa-front');
      }
    }
  }, []);

  return <div ref={gameContainerRef}></div>;
};

export default Game;