class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = PLAYER.WIDTH;
        this.height = PLAYER.HEIGHT;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.canJump = false;
        this.alive = true;
    }

    update(platforms) {
        if (!this.alive) return;

        // Handle input
        let moveInput = 0;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A key
            moveInput = -1;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D key
            moveInput = 1;
        }

        // Apply movement with acceleration
        if (moveInput !== 0) {
            this.velocityX += moveInput * PLAYER.ACCELERATION;
            this.velocityX = constrain(this.velocityX, -PLAYER.MAX_SPEED, PLAYER.MAX_SPEED);
        } else {
            // Apply friction
            const friction = this.onGround ? GAME.FRICTION : GAME.AIR_FRICTION;
            this.velocityX *= friction;
        }

        // Jump
        if ((keyIsDown(32) || keyIsDown(87) || keyIsDown(UP_ARROW)) && this.onGround && this.canJump) {
            this.velocityY = PLAYER.JUMP_STRENGTH;
            this.onGround = false;
            this.canJump = false;
        }

        // Prevent holding jump
        if (!keyIsDown(32) && !keyIsDown(87) && !keyIsDown(UP_ARROW)) {
            this.canJump = true;
        }

        // Apply gravity
        this.velocityY += GAME.GRAVITY;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Collision with platforms
        this.onGround = false;
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                this.handleCollision(platform);
            }
        }

        // Check if player fell off the world
        if (this.y > 2000) {
            this.die();
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
        // Determine collision side
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
            // Left or right collision
            if (this.velocityX > 0) {
                // Hitting right side
                this.x = platform.x - this.width;
                this.velocityX = 0;
            } else if (this.velocityX < 0) {
                // Hitting left side
                this.x = platform.x + platform.width;
                this.velocityX = 0;
            }
        }
    }

    checkGoal(goal) {
        return (
            this.x < goal.x + goal.width &&
            this.x + this.width > goal.x &&
            this.y < goal.y + goal.height &&
            this.y + this.height > goal.y
        );
    }

    die() {
        this.alive = false;
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.alive = true;
        this.onGround = false;
        this.canJump = true;
    }

    draw(camera) {
        if (!this.alive) return;

        const screenPos = camera.worldToScreen(this.x, this.y);
        
        // Draw player with simple shape
        fill(PLAYER.COLOR[0], PLAYER.COLOR[1], PLAYER.COLOR[2]);
        stroke(0);
        strokeWeight(2);
        rect(screenPos.x, screenPos.y, this.width, this.height, 4);
        
        // Simple eyes for personality
        fill(0);
        noStroke();
        const eyeOffset = this.velocityX > 0 ? 4 : -4;
        circle(screenPos.x + this.width / 2 - 6 + eyeOffset, screenPos.y + 12, 4);
        circle(screenPos.x + this.width / 2 + 6 + eyeOffset, screenPos.y + 12, 4);
    }
}
