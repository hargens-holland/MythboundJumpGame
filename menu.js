// Menu System
let currentLevel = null;
let selectedLevelIndex = 0;
let lastKeyPress = 0;
let keyPressDelay = 200; // milliseconds between key presses

const MENU_STATES = {
    MENU: 'menu',
    LEVEL_SELECT: 'levelSelect',
    PLAYING: 'playing',
    DEAD: 'dead',
    WON: 'won'
};

const AVAILABLE_LEVELS = [
    { name: 'Level 1', data: LEVEL_1_DATA }
    // Add more levels here as you create them
];

function drawMenu() {
    // Background gradient
    for (let i = 0; i < height; i++) {
        const inter = map(i, 0, height, 0, 1);
        const c = lerpColor(
            color(135, 206, 250),
            color(176, 196, 222),
            inter
        );
        stroke(c);
        line(0, i, width, i);
    }
    
    // Title
    fill(255);
    stroke(0);
    strokeWeight(4);
    textAlign(CENTER, CENTER);
    textSize(64);
    text('MYTHBOUND JUMP', width / 2, height / 2 - 150);
    
    // Menu options
    textSize(32);
    strokeWeight(2);
    
    // Start button
    fill(100, 200, 255);
    rect(width / 2 - 150, height / 2 - 20, 300, 60, 10);
    fill(255);
    noStroke();
    text('START', width / 2, height / 2 + 10);
    
    // Instructions
    fill(255, 255, 255, 200);
    textSize(18);
    text('Press ENTER or click START', width / 2, height / 2 + 100);
}

function drawLevelSelect() {
    // Background gradient
    for (let i = 0; i < height; i++) {
        const inter = map(i, 0, height, 0, 1);
        const c = lerpColor(
            color(135, 206, 250),
            color(176, 196, 222),
            inter
        );
        stroke(c);
        line(0, i, width, i);
    }
    
    // Title
    fill(255);
    stroke(0);
    strokeWeight(4);
    textAlign(CENTER, CENTER);
    textSize(48);
    text('SELECT LEVEL', width / 2, 100);
    
    // Level buttons
    const buttonWidth = 300;
    const buttonHeight = 60;
    const startY = height / 2 - (AVAILABLE_LEVELS.length * 80) / 2;
    
    for (let i = 0; i < AVAILABLE_LEVELS.length; i++) {
        const y = startY + i * 80;
        const isSelected = i === selectedLevelIndex;
        
        // Button background
        if (isSelected) {
            fill(100, 200, 255);
            stroke(255);
            strokeWeight(3);
        } else {
            fill(200, 200, 200);
            stroke(0);
            strokeWeight(2);
        }
        rect(width / 2 - buttonWidth / 2, y, buttonWidth, buttonHeight, 10);
        
        // Button text
        fill(0);
        noStroke();
        textSize(24);
        text(AVAILABLE_LEVELS[i].name, width / 2, y + buttonHeight / 2);
    }
    
    // Instructions
    fill(255, 255, 255, 200);
    textSize(18);
    text('Arrow Keys: Navigate | ENTER: Select | ESC: Back', width / 2, height - 50);
}

function handleMenuInput() {
    const now = millis();
    const canPress = (now - lastKeyPress) > keyPressDelay;
    
    if (gameState === MENU_STATES.MENU) {
        if ((keyIsDown(13) || keyIsDown(32)) && canPress) { // Enter or Space
            gameState = MENU_STATES.LEVEL_SELECT;
            lastKeyPress = now;
        }
    } else if (gameState === MENU_STATES.LEVEL_SELECT) {
        if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && canPress) { // Up or W
            selectedLevelIndex = max(0, selectedLevelIndex - 1);
            lastKeyPress = now;
        }
        if ((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && canPress) { // Down or S
            selectedLevelIndex = min(AVAILABLE_LEVELS.length - 1, selectedLevelIndex + 1);
            lastKeyPress = now;
        }
        if (keyIsDown(13) && canPress) { // Enter
            startLevel(selectedLevelIndex);
            lastKeyPress = now;
        }
        if (keyIsDown(27) && canPress) { // ESC
            gameState = MENU_STATES.MENU;
            lastKeyPress = now;
        }
    } else if (gameState === MENU_STATES.WON) {
        if ((keyIsDown(13) || keyIsDown(32) || keyIsDown(82)) && canPress) { // Enter, Space, or R
            gameState = MENU_STATES.MENU;
            lastKeyPress = now;
        }
    } else if (gameState === MENU_STATES.DEAD) {
        if (keyIsDown(82) && canPress) { // R to respawn
            player.respawn(level.spawnX, level.spawnY);
            level.reset(); // Reset all enemies to original positions
            gameState = MENU_STATES.PLAYING;
            lastKeyPress = now;
        }
        if (keyIsDown(27) && canPress) { // ESC to menu
            gameState = MENU_STATES.MENU;
            lastKeyPress = now;
        }
    } else if (gameState === MENU_STATES.PLAYING) {
        if (keyIsDown(27) && canPress) { // ESC to menu
            gameState = MENU_STATES.MENU;
            lastKeyPress = now;
        }
    }
}

function startLevel(levelIndex) {
    if (levelIndex >= 0 && levelIndex < AVAILABLE_LEVELS.length) {
        const levelData = AVAILABLE_LEVELS[levelIndex].data;
        level = new Level(levelData);
        player = new Player(level.spawnX, level.spawnY);
        camera = new Camera();
        
        // Position camera so ground is at bottom of screen
        camera.y = GROUND_LEVEL - height;
        camera.x = 0;
        
        // Set camera bounds
        updateCameraBounds();
        
        gameState = MENU_STATES.PLAYING;
        currentLevel = levelIndex;
    }
}
