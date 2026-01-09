class BlobEnemy {
    constructor(x, y, type = 'forward', direction = 1) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = ENEMY.WIDTH;
        this.height = ENEMY.HEIGHT;
        this.velocityX = ENEMY.SPEED;
        this.velocityY = 0;
        this.type = type; // 'forward' (Goomba-like), 'static'
        this.direction = direction; // 1 for right, -1 for left (always forward, never reverses)
        this.onGround = false;
    }

    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = ENEMY.SPEED;
        this.velocityY = 0;
        this.onGround = false;
    }

    update(platforms) {
        // Goomba-like behavior: always move forward
        if (this.type === 'forward') {
            this.x += this.velocityX * this.direction;
        }
        // 'static' enemies don't move

        // Apply gravity
        this.velocityY += GAME.GRAVITY;
        this.y += this.velocityY;

        // Reset ground state
        this.onGround = false;

        // Collision with platforms
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                this.handleCollision(platform);
            }
        }
    }

    checkCollision(platform) {
        return (
            this.x < platform.x + platform.width &&
            this.x + this.width > platform.x &&
            this.y < platform.y + platform.height &&
            this.y + this.height > platform.y
        );
    }

    handleCollision(platform) {
        const overlapX = min(
            (this.x + this.width) - platform.x,
            (platform.x + platform.width) - this.x
        );
        const overlapY = min(
            (this.y + this.height) - platform.y,
            (platform.y + platform.height) - this.y
        );

        if (overlapY < overlapX) {
            // Top or bottom collision
            if (this.velocityY > 0 && this.y < platform.y) {
                // Landing on top
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
            } else if (this.velocityY < 0) {
                // Hitting bottom
                this.y = platform.y + platform.height;
                this.velocityY = 0;
            }
        } else {
            // Left or right collision - Goomba doesn't turn around, just stops or falls
            // Push back slightly but keep moving forward (will fall off edge if no ground)
            if (this.direction > 0) {
                this.x = platform.x - this.width;
            } else if (this.direction < 0) {
                this.x = platform.x + platform.width;
            }
            // Don't reverse direction - Goomba keeps going forward (will fall off)
        }
    }

    checkPlayerCollision(player) {
        if (!player.alive) return false;
        
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    draw(camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        
        // Draw enemy with simple shape
        fill(ENEMY.COLOR[0], ENEMY.COLOR[1], ENEMY.COLOR[2]);
        stroke(0);
        strokeWeight(2);
        rect(screenPos.x, screenPos.y, this.width, this.height, 4);
        
        // Simple angry eyes
        fill(0);
        noStroke();
        const eyeOffset = this.direction > 0 ? 2 : -2;
        circle(screenPos.x + this.width / 2 - 6 + eyeOffset, screenPos.y + 10, 5);
        circle(screenPos.x + this.width / 2 + 6 + eyeOffset, screenPos.y + 10, 5);
        
        // Simple mouth
        stroke(0);
        strokeWeight(2);
        noFill();
        arc(screenPos.x + this.width / 2, screenPos.y + 20, 12, 8, 0, PI);
    }
}
