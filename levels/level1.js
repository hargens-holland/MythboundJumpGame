class Level {
    constructor(levelData) {
        this.platforms = [];
        this.enemies = [];
        this.goal = null;
        this.spawnX = 100;
        this.spawnY = 100;
        this.width = 0;
        this.height = 0;
        
        this.loadLevel(levelData);
    }

    loadLevel(levelData) {
        // Load platforms
        if (levelData.platforms) {
            for (let p of levelData.platforms) {
                this.platforms.push({
                    x: p.x,
                    y: p.y,
                    width: p.width || 200,
                    height: p.height || PLATFORM.HEIGHT
                });
            }
        }

        // Load enemies
        if (levelData.enemies) {
            for (let e of levelData.enemies) {
                this.enemies.push(new BlobEnemy(
                    e.x,
                    e.y,
                    e.type || 'forward',
                    e.direction !== undefined ? e.direction : -1 // Default to left
                ));
            }
        }

        // Load goal
        if (levelData.goal) {
            this.goal = {
                x: levelData.goal.x,
                y: levelData.goal.y,
                width: GOAL.WIDTH,
                height: GOAL.HEIGHT
            };
        }

        // Set spawn point
        if (levelData.spawn) {
            this.spawnX = levelData.spawn.x;
            this.spawnY = levelData.spawn.y;
        }

        // Set level bounds
        if (levelData.bounds) {
            this.width = levelData.bounds.width;
            this.height = levelData.bounds.height;
        } else {
            // Calculate bounds from platforms
            let maxX = 0;
            let maxY = 0;
            for (let p of this.platforms) {
                maxX = max(maxX, p.x + p.width);
                maxY = max(maxY, p.y + p.height);
            }
            this.width = maxX + 200;
            this.height = maxY + 200;
        }
    }

    reset() {
        // Reset all enemies to their starting positions
        for (let enemy of this.enemies) {
            enemy.respawn();
        }
    }

    update(player) {
        // Update enemies
        for (let enemy of this.enemies) {
            enemy.update(this.platforms);
            
            // Check collision with player
            if (enemy.checkPlayerCollision(player)) {
                player.die();
            }
        }
    }

    draw(camera) {
        // Draw platforms
        for (let platform of this.platforms) {
            const screenPos = camera.worldToScreen(platform.x, platform.y);
            
            // Check if platform is visible on screen
            if (screenPos.x + platform.width < 0 || screenPos.x > width ||
                screenPos.y + platform.height < 0 || screenPos.y > height) {
                continue; // Skip drawing if off-screen
            }
            
            fill(PLATFORM.COLOR[0], PLATFORM.COLOR[1], PLATFORM.COLOR[2]);
            stroke(0);
            strokeWeight(2);
            rect(screenPos.x, screenPos.y, platform.width, platform.height, 4);
            
            // Simple platform texture
            fill(PLATFORM.COLOR[0] - 20, PLATFORM.COLOR[1] - 20, PLATFORM.COLOR[2] - 20);
            rect(screenPos.x, screenPos.y, platform.width, 4);
        }

        // Draw enemies
        for (let enemy of this.enemies) {
            enemy.draw(camera);
        }

        // Draw goal
        if (this.goal) {
            const screenPos = camera.worldToScreen(this.goal.x, this.goal.y);
            
            // Animated pulsing goal
            const pulse = sin(frameCount * 0.1) * 5;
            fill(GOAL.COLOR[0], GOAL.COLOR[1], GOAL.COLOR[2]);
            stroke(0);
            strokeWeight(2);
            rect(
                screenPos.x - pulse,
                screenPos.y - pulse,
                this.goal.width + pulse * 2,
                this.goal.height + pulse * 2,
                6
            );
            
            // Goal marker
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(24);
            text('🏁', screenPos.x + this.goal.width / 2, screenPos.y + this.goal.height / 2);
        }
    }
}

// Level 1 Data - 3x longer with ground at bottom
const LEVEL_LENGTH = 6000; // 3x the original 2000

const LEVEL_1_DATA = {
    spawn: { x: 100, y: GROUND_LEVEL - PLAYER.HEIGHT }, // Spawn on ground
    bounds: { width: LEVEL_LENGTH, height: 1200 },
    platforms: [
        // Continuous ground platform spanning the entire level
        // Make it very tall so it extends to bottom of screen (no gaps)
        { x: 0, y: GROUND_LEVEL, width: LEVEL_LENGTH, height: 2000 },
        
        // Platforms above ground (3x spacing)
        { x: 900, y: GROUND_LEVEL - 150, width: 150, height: 20 },
        { x: 1800, y: GROUND_LEVEL - 250, width: 150, height: 20 },
        { x: 3000, y: GROUND_LEVEL - 200, width: 200, height: 20 },
        { x: 3900, y: GROUND_LEVEL - 300, width: 150, height: 20 },
        { x: 4800, y: GROUND_LEVEL - 150, width: 150, height: 20 },
        { x: 5700, y: GROUND_LEVEL - 300, width: 100, height: 20 },
        
        // Higher platforms
        { x: 2400, y: GROUND_LEVEL - 400, width: 100, height: 20 },
        { x: 3300, y: GROUND_LEVEL - 450, width: 100, height: 20 },
        { x: 4200, y: GROUND_LEVEL - 500, width: 120, height: 20 },
        { x: 5100, y: GROUND_LEVEL - 400, width: 100, height: 20 },
        
        // Additional platforms for variety
        { x: 1200, y: GROUND_LEVEL - 350, width: 120, height: 20 },
        { x: 2100, y: GROUND_LEVEL - 200, width: 150, height: 20 },
        { x: 3600, y: GROUND_LEVEL - 180, width: 150, height: 20 },
        { x: 4500, y: GROUND_LEVEL - 220, width: 150, height: 20 },
        { x: 5400, y: GROUND_LEVEL - 150, width: 150, height: 20 },
    ],
    enemies: [
        // Ground enemies - all moving left
        { x: 1050, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 1950, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 3150, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 4050, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 4950, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 5500, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 2500, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 3500, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        { x: 4500, y: GROUND_LEVEL - 50, type: 'forward', direction: -1 },
        // Platform enemies - all moving left
        { x: 1350, y: GROUND_LEVEL - 170, type: 'forward', direction: -1 },
        { x: 2250, y: GROUND_LEVEL - 220, type: 'forward', direction: -1 },
        { x: 3750, y: GROUND_LEVEL - 310, type: 'forward', direction: -1 },
        { x: 2550, y: GROUND_LEVEL - 420, type: 'forward', direction: -1 },
        { x: 3450, y: GROUND_LEVEL - 470, type: 'forward', direction: -1 },
        { x: 4350, y: GROUND_LEVEL - 520, type: 'forward', direction: -1 },
        { x: 5250, y: GROUND_LEVEL - 420, type: 'forward', direction: -1 },
        { x: 1650, y: GROUND_LEVEL - 370, type: 'forward', direction: -1 },
        { x: 2850, y: GROUND_LEVEL - 200, type: 'forward', direction: -1 },
        { x: 4650, y: GROUND_LEVEL - 240, type: 'forward', direction: -1 },
    ],
    goal: { x: LEVEL_LENGTH - 150, y: GROUND_LEVEL - 500 }
};
