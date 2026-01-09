class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 0.2; // Increased for faster response
    }

    update(player) {
        // Calculate where player is on screen BEFORE updating camera
        const playerScreenX = player.x - this.x;
        const playerScreenY = player.y - this.y;
        
        // Hard boundaries - player must NEVER go outside these
        const hardMargin = 100; // Keep player at least 100px from edges
        const isOutsideBounds = playerScreenX < hardMargin || 
                                playerScreenX > width - hardMargin ||
                                playerScreenY < hardMargin || 
                                playerScreenY > height - hardMargin;
        
        // If player is outside safe bounds, snap camera immediately
        if (isOutsideBounds) {
            // Snap camera to keep player centered
            this.x = player.x - width / 2;
            
            // Keep ground at bottom of screen (or follow player if above ground)
            const groundY = GROUND_LEVEL - height;
            this.y = min(player.y - height / 2, groundY);
        } else {
            // Player is safe - use smooth following
            // Follow player horizontally - keep player centered
            this.targetX = player.x - width / 2;
            
            // Keep ground at bottom of screen (or follow player if above ground)
            const groundY = GROUND_LEVEL - height;
            this.targetY = min(player.y - height / 2, groundY);
            
            // Use adaptive smoothing based on player speed
            const playerSpeed = abs(player.velocityX) + abs(player.velocityY);
            const adaptiveSmoothing = playerSpeed > 5 ? 0.5 : this.smoothing;
            
            // Smooth camera movement
            this.x += (this.targetX - this.x) * adaptiveSmoothing;
            this.y += (this.targetY - this.y) * adaptiveSmoothing;
        }
        
        // Final absolute safety check - ensure player is never off screen
        const finalPlayerScreenX = player.x - this.x;
        const finalPlayerScreenY = player.y - this.y;
        
        if (finalPlayerScreenX < 0) {
            this.x = player.x;
        } else if (finalPlayerScreenX > width) {
            this.x = player.x - width;
        }
        
        if (finalPlayerScreenY < 0) {
            this.y = player.y;
        } else if (finalPlayerScreenY > height) {
            this.y = player.y - height;
            // But still respect ground level
            const groundY = GROUND_LEVEL - height;
            this.y = min(this.y, groundY);
        }
        
        // Keep camera within level bounds (will be set by level)
        if (this.minX !== undefined) {
            this.x = constrain(this.x, this.minX, this.maxX);
        }
        if (this.minY !== undefined) {
            this.y = constrain(this.y, this.minY, this.maxY);
        }
    }

    setBounds(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    // Convert screen coordinates to world coordinates
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}
