class Start extends Phaser.Scene {
    constructor() {
        super("Start");
        
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("wKey", "keyboard_w_outline.png");
        this.load.image("aKey", "keyboard_a_outline.png");
        this.load.image("sKey", "keyboard_s_outline.png");
        this.load.image("dKey", "keyboard_d_outline.png");

        this.load.bitmapFont("thickFont", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }
    create() {
        // Display controls using bitmap text
        this.add.bitmapText(150, 200, 'thickFont', 'Info:', 32).setOrigin(0.5);
        this.add.image(125, 250, 'wKey').setScale(1);
        this.add.image(75, 300, 'aKey').setScale(1);
        this.add.image(125, 300, 'sKey').setScale(1);
        this.add.image(175, 300, 'dKey').setScale(0.5);
        this.add.bitmapText(125, 375, 'thickFont', 'To Move', 32).setOrigin(0.5);
        this.add.bitmapText(320, 500, 'thickFont', 'Press Space to start', 32).setOrigin(0.5);

        // Listen for spacebar input
        this.input.keyboard.on('keydown-SPACE', this.startGame, this);
    }
        
    startGame() {
        // Transition to the main game scene
        this.scene.start('Game');
    }
}