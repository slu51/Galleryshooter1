class Game extends Phaser.Scene {
    constructor() {
        super("Game");
        this.my = { sprite: {}, text: {} };
        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullets = []; // Array to hold enemy bullets
        this.maxBullets = 10;
        this.maxEnemyBullets = 5;
        this.myScore = 0;
        this.myLife = 3; 
        this.enemyWaveInterval = 3000; // Enemy waves every 3000 ms
        this.enemySpeed = 2;           // Speed of the enemy movement towards player
        this.enemyBulletSpeed = 3;     // Speed of enemy bullets
        this.enemyFireRate = 1000;     // Enemy fires every 1000 ms
        this.nextEnemyBulletTime = 0;  // Timer to track enemy bullet firing
        this.enemyCount = 5;           // Number of enemies per wave
        this.enemies = [];             // Array to store enemies
        
    }

    preload() {
        this.load.setPath("./assets/");
        // Load all necessary assets
        this.load.image("heart", "heart.png");
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
        this.load.image("Enemybullet", "Green_bullet.png");
        this.load.image("enemy0", "ship_0000.png");
        this.load.image("enemy1", "ship_0007.png");
        this.load.image("player", "ship_0005.png");
        this.load.image("playerbullet", "tile_0000.png");
        this.load.audio("Player Shoot", "PShoot.ogg");
        this.load.audio("Enemy Shoot", "EShoot.ogg");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;
        my.sprite.player = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 40, "player");
        my.sprite.player.setScale(2);
        this.highScore = localStorage.getItem('highScore') || 0; // Get high score from local storage
        this.highScoreText = this.add.bitmapText(630, 50, 'thickFont', 'HS: ' + this.highScore, 32).setOrigin(0.5); // Display high score

        this.spawnWave();

        this.anims.create({
            key: "puff",
            frames: [{ key: "whitePuff00" }, { key: "whitePuff01" }, { key: "whitePuff02" }, { key: "whitePuff03" }],
            frameRate: 20,
            repeat: 5,
            hideOnComplete: true
        });

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        document.getElementById('description').innerHTML = '<h2>GalleryShooter.js</h2><br>A: left // D: right // Space: fire/emit //'
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);
        my.text.life = this.add.bitmapText(15, 50, "rocketSquare", "Life " + this.myLife);

        this.add.text(10, 5, "Level1", { fontFamily: 'Times, serif', fontSize: 24 });
        
    }

    spawnWave() {
        for (let i = 0; i < this.enemyCount; i++) {
            let enemy = this.add.sprite(this.sys.game.config.width / (this.enemyCount + 1) * (i + 1), -50, "enemy0");
            enemy.setScale(1.5);
            enemy.scorePoints = 25;
            enemy.flipY = true;
            enemy.setActive(true).setVisible(true);
            this.enemies.push(enemy);
        }
    }

    update(time, delta) {
        let my = this.my;

        this.handlePlayerMovement();
        this.handleBullets();
        this.handleEnemyBullets(time);
        this.moveEnemies();
        this.checkWaveClear();
        this.checkPlayerHits();
    }

    handlePlayerMovement() {
        let my = this.my;
        if (this.left.isDown && my.sprite.player.x > (my.sprite.player.displayWidth / 2)) {
            my.sprite.player.x -= this.playerSpeed;
        }
        if (this.right.isDown && my.sprite.player.x < (this.sys.game.config.width - (my.sprite.player.displayWidth / 2))) {
            my.sprite.player.x += this.playerSpeed;
        }
    }
    checkPlayerHits() {
        let my = this.my;
        my.sprite.enemyBullets.forEach((bullet, index) => {
            if (bullet.active && this.collides(my.sprite.player, bullet)) {
                bullet.setActive(false).setVisible(false);  // Properly deactivate the bullet
                this.handlePlayerHit();
            }
        });
    }
    handlePlayerHit() {
        let my = this.my;
        this.myLife -= 1;
        my.text.life.setText("Life " + this.myLife);
        if (this.myLife <= 0) { 
            this.myScore = 0;
            this.myLife = 3;
            this.scene.start("Deafeat");

                
                    

            
        }
    }

     
     
    

    handleBullets() {
        let my = this.my;
        if (Phaser.Input.Keyboard.JustDown(this.space) && my.sprite.bullet.length < this.maxBullets) {
            my.sprite.bullet.push(this.add.sprite(my.sprite.player.x, my.sprite.player.y - (my.sprite.player.displayHeight / 2), "playerbullet"));
        }

        my.sprite.bullet = my.sprite.bullet.filter(bullet => bullet.y > -(bullet.displayHeight / 2));

        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
            this.enemies.forEach((enemy, index) => {
                if (this.collides(enemy, bullet) && enemy.visible) {
                    this.handleEnemyHit(enemy, bullet);
                    if (this.enemies.every(e => !e.visible)) {
                        this.spawnWave();
                    }
                }
            });
        }
    }

    handleEnemyBullets(time) {
        let my = this.my;
        this.enemies.forEach(enemy => {
            if (enemy.visible && time > this.nextEnemyBulletTime) {
                if (my.sprite.enemyBullets.length < this.maxEnemyBullets) {
                    let bullet = this.add.sprite(enemy.x, enemy.y + enemy.displayHeight / 2, "Enemybullet");
                    my.sprite.enemyBullets.push(bullet);
                    this.sound.play("Enemy Shoot"); // Optional: add enemy shooting sound
                }
                this.nextEnemyBulletTime = time + this.enemyFireRate;
            }
        });

        my.sprite.enemyBullets = my.sprite.enemyBullets.filter(bullet => bullet.y < this.sys.game.config.height + bullet.displayHeight / 2);

        for (let bullet of my.sprite.enemyBullets) {
            bullet.y += this.enemyBulletSpeed;
        }
    }

    moveEnemies() {
        // Move enemies down slowly, stay within the bounds of the screen
        this.enemies.forEach(enemy => {
            if (enemy.visible) {
                enemy.y += this.enemySpeed;
                if (enemy.y > this.sys.game.config.height + 50) {
                    enemy.y = -50; // Reset position to top
                }
            }
        });
    }

    handleEnemyHit(enemy, bullet) {
        let my = this.my;
        this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
        bullet.y = -100; // Clear bullet
        enemy.setActive(false).setVisible(false);
        this.myScore += enemy.scorePoints;
        this.updateScore();
        this.sound.play("dadada", { volume: 1 });
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
        if (this.myScore > this.highScore) {
            this.highScore = this.myScore;
            
            this.highScoreText.setText('HS: ' + this.highScore);
            localStorage.setItem('highScore', this.highScore.toString()); // Save new high score to local storage
            
        }
    }

    collides(a, b) {
        return Math.abs(a.x - b.x) <= (a.displayWidth / 2 + b.displayWidth / 2) && Math.abs(a.y - b.y) <= (a.displayHeight / 2 + b.displayHeight / 2);
    }

    checkWaveClear() {
        // Check if all enemies are inactive
        if (this.enemies.every(enemy => !enemy.visible)) {
            this.enemies = []; // Clear the old enemies array
            this.spawnWave();  // Spawn a new wave
        }
    }
}
