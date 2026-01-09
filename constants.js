// Game Constants
const GAME = {
    WIDTH: 1200,
    HEIGHT: 800,
    GRAVITY: 0.8,
    FRICTION: 0.85,
    AIR_FRICTION: 0.95
};

// Level Constants
const GROUND_LEVEL = 800; // Ground Y position (bottom of screen)

const PLAYER = {
    WIDTH: 32,
    HEIGHT: 48,
    SPEED: 6,
    JUMP_STRENGTH: -20, // Increased jump height
    ACCELERATION: 0.5,
    MAX_SPEED: 8,
    COLOR: [100, 200, 255] // Light blue
};

const ENEMY = {
    WIDTH: 32,
    HEIGHT: 32,
    SPEED: 2,
    COLOR: [255, 100, 100] // Light red
};

const PLATFORM = {
    COLOR: [139, 69, 19], // Brown
    HEIGHT: 20
};

const GOAL = {
    WIDTH: 40,
    HEIGHT: 60,
    COLOR: [255, 215, 0] // Gold
};
