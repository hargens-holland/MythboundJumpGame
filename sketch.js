let player;
let level;
let camera;
let gameState = MENU_STATES.MENU; // Start at menu

function setup() {
    // Create canvas that fills the window
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateCameraBounds();
}

function updateCameraBounds() {
    camera.setBounds(0, level.width - width, 0, level.height - height);
}

function draw() {
    // Handle menu/level select
    if (gameState === MENU_STATES.MENU) {
        drawMenu();
        handleMenuInput();
        return;
    }
    
    if (gameState === MENU_STATES.LEVEL_SELECT) {
        drawLevelSelect();
        handleMenuInput();
        return;
    }
    
    // Game background
    background(135, 206, 250); // Sky blue
    
    // Draw background gradient effect
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

    // Update game state
    if (gameState === MENU_STATES.PLAYING) {
        // Update player
        player.update(level.platforms);
        
        // Update level (enemies, etc.)
        level.update(player);
        
        // Update camera
        camera.update(player);
        
        // Check goal
        if (level.goal && player.checkGoal(level.goal)) {
            gameState = MENU_STATES.WON;
        }
        
        // Check if player died
        if (!player.alive) {
            gameState = MENU_STATES.DEAD;
        }
    }

    // Draw everything
    if (level && player) {
        push();
        translate(-camera.x, -camera.y);
        
        level.draw(camera);
        player.draw(camera);
        
        pop();
    }

    // Draw UI
    drawUI();
    
    // Handle input
    handleMenuInput();
}

function drawUI() {
    if (gameState === MENU_STATES.MENU || gameState === MENU_STATES.LEVEL_SELECT) {
        return; // Menu handles its own UI
    }
    
    // Game state messages
    fill(255);
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER, CENTER);
    textSize(32);
    
    if (gameState === MENU_STATES.DEAD) {
        fill(255, 0, 0);
        text('YOU DIED!', width / 2, height / 2 - 20);
        fill(255);
        textSize(20);
        text('Press R to Respawn | ESC for Menu', width / 2, height / 2 + 20);
    } else if (gameState === MENU_STATES.WON) {
        fill(255, 215, 0);
        text('LEVEL COMPLETE!', width / 2, height / 2 - 40);
        fill(255);
        textSize(20);
        text('Press ENTER to return to Menu', width / 2, height / 2 + 10);
    }
    
    // Instructions (top left) - only show during gameplay
    if (gameState === MENU_STATES.PLAYING) {
        fill(255, 255, 255, 200);
        noStroke();
        textAlign(LEFT, TOP);
        textSize(14);
        text('Arrow Keys / WASD: Move\nSpace / W / Up: Jump\nESC: Menu', 10, 10);
    }
}
