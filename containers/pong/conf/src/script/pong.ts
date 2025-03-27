/* ************************************************************************** */
/*                                GLOBAL VARIABLES                            */
/* ************************************************************************** */
/*
 * Defnining canvas and Context
 */
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var	start_button: HTMLButtonElement;
var	reset_button: HTMLButtonElement;
var	index_button: HTMLButtonElement;

var	rotate: boolean = false;

/*
 * Define drawing var
 */
const	GOLDEN_NUMBER: number = 1.618033;
const	PLAYER_WALL_OFFSET: number = 0.05;
const	PLAYER_WIDTH_RAT: number = 0.09;
const	PLAYER_WIDTH_HEIGHT_RAT: number = 10;
var		PLAYER_HEIGHT: number;
var		PLAYER_WIDTH: number;
const	PLAYER_COLOR: string = "#FFFFFF";
const	PLAYER_SPEED: number = 7;

/* Score + Text */
const	FONT_NAME: string = "sans-serif";
var		FONT_SIZE: number;
const	SCORE_POS_RAT_X: number = 0.1;
const	SCORE_POS_RAT_Y: number = 0.9;
const	SCORE_RPOS_RAT_X: number = 0.05;
const	SCORE_RPOS_RAT_Y: number = 0.45;
const	MSG_POS_RAT: number = 0.7;

/* Ball */
const	BALL_INIT_SPEED: number = 8;
const	BALL_COLOR: string = "#FFFFFF";
const	BALL_MAX_SPEED: number = 50;
var		BALL_RADIUS: number;
/* Terrain draw */
const	TERRAIN_COLOR: string = "#FFFFFF";
var		TERRAIN_LINE_FAT: number;

/* Game status variable */
const	PLAYER_ONE: number = 1;
const	PLAYER_TWO: number = 2;
const	SCORE_LIMIT: number = 99;
var		game: Pong;
var		end_game: boolean;
var		game_interval: NodeJS.Timeout | number;
var		round_winner: number;
var		p1_upPressed: boolean = false;
var		p1_downPressed: boolean = false;
var		p2_upPressed: boolean = false;
var		p2_downPressed: boolean = false;

/* ************************************************************************** */
/*                              CLASSES && INTERFACES                         */
/* ************************************************************************** */
interface Vec2 {
	x: number;
	y: number;
}

class Player {
	name: string;
	score: number;
	pos: Vec2;

	constructor(name: string, pos: Vec2) {
		this.name = name;
		this.score = 0;
		this.pos = pos;
	}
}

class Ball {
	pos: Vec2;
	direction: Vec2;
	speed: number;

	constructor(pos: Vec2) {
		this.pos = pos;
		this.direction = { x: 0, y: 0 };
		this.speed = BALL_INIT_SPEED;
	}
}

class Pong {
	player_1: Player;
	player_2: Player;
	ball: Ball;
	score_max: number;
	new_round: boolean;
	terrain_size: Vec2;

	constructor(player_1_name: string, player_2_name: string, center: Vec2) {
		if (!canvas)
			throw new Error("Canvas not found.");
		if (canvas.width > canvas.height) {
			let player_offset = PLAYER_WALL_OFFSET * canvas.width;
			this.player_1 = new Player(player_1_name,
							{ x: player_offset, y: (canvas.height - PLAYER_WIDTH) / 2});
			this.player_2 = new Player(player_2_name,
							 { x: canvas.width - player_offset - PLAYER_HEIGHT, y: (canvas.height - PLAYER_WIDTH) / 2 });
		}
		else {
			let	player_offset = PLAYER_WALL_OFFSET * canvas.height;
			this.player_1 = new Player(player_1_name,
							{ x: (canvas.width - PLAYER_WIDTH) / 2, y: player_offset });
			this.player_2 = new Player(player_2_name,
							{ x: (canvas.width - PLAYER_WIDTH) / 2, y: canvas.height - player_offset - PLAYER_HEIGHT });
		}
		this.ball = new Ball(center);
		this.score_max = SCORE_LIMIT;
		this.new_round = true;
		this.terrain_size = { x: canvas.width, y: canvas.height };
	}
}

/* ************************************************************************** */
/*                                       DRAW                                 */
/* ************************************************************************** */
/**
 * @brief Draw player score
 */
function draw_score() {
	if (!ctx)
		throw new Error("Context not found");
	let		score_pos: Vec2;
	/* Calculate score width */
    const player1ScoreWidth = ctx.measureText(`${game.player_1.score}`).width;

	/* Draw score */
	ctx.font = `${FONT_SIZE}px ${FONT_NAME}`;
	if (game.terrain_size.x > game.terrain_size.y) {
		score_pos = { x: (game.terrain_size.x / 2) * (1 - SCORE_POS_RAT_X),
							y: (1 - SCORE_POS_RAT_Y) * canvas.height };
		ctx.fillText(`${game.player_1.score}`, score_pos.x - player1ScoreWidth, score_pos.y);
		ctx.fillText(`${game.player_2.score}`, game.terrain_size.x - score_pos.x, score_pos.y);
	}
	else {
		score_pos = { x: SCORE_RPOS_RAT_X * game.terrain_size.x,
						y: SCORE_RPOS_RAT_Y * game.terrain_size.y };
		let score_height: number = ctx.measureText(`M`).width; /* Size approximation */
		ctx.fillText(`${game.player_1.score}`, score_pos.x, score_pos.y);
		ctx.fillText(`${game.player_2.score}`, score_pos.x, game.terrain_size.y - score_pos.y + score_height);
	}
}

/**
 * @brief Draw basic pong terrain
 */
function draw_terrain() {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!ctx)
		throw new Error("Context not found");
	if (game.terrain_size.x > game.terrain_size.y)
		ctx.rect((game.terrain_size.x - TERRAIN_LINE_FAT) / 2, 0, TERRAIN_LINE_FAT, canvas.height);
	else
		ctx.rect(0, (game.terrain_size.y - TERRAIN_LINE_FAT) / 2, canvas.height, TERRAIN_LINE_FAT);
	ctx.fillStyle = TERRAIN_COLOR;
	ctx.fill();
}

/**
 * @brief Update ball direction and speed on collision in normale mode
 */
function update_ball_state() {
	let	p1 = game.player_1;
	let	p2 = game.player_2;
	let	ball = game.ball;
	let	dir = game.ball.direction;
	let	ball_next_pos = { x: ball.pos.x + ball.speed * dir.x, y: ball.pos.y + ball.speed * dir.y};

	/* Check for wall collision */
	if (ball_next_pos.y > canvas.height - BALL_RADIUS || ball_next_pos.y < BALL_RADIUS)
		dir.y = -dir.y;
	/* Check if player 1 touch the ball */
	if ((ball.pos.x > p1.pos.x && ball.pos.x < p1.pos.x + PLAYER_HEIGHT)
			&& (ball.pos.y > p1.pos.y && ball.pos.y < p1.pos.y + PLAYER_WIDTH)) {
		dir.x = -dir.x;
		game.ball.speed = Math.min(BALL_MAX_SPEED, ball.speed + 1);
	}
	/* Check if player 2 touch the ball */
	if ((ball.pos.x > p2.pos.x && ball.pos.x < p2.pos.x + PLAYER_HEIGHT)
			&& (ball.pos.y > p2.pos.y && ball.pos.y < p2.pos.y + PLAYER_WIDTH)) {
		dir.x = -dir.x;
		game.ball.speed = Math.min(BALL_MAX_SPEED, ball.speed + 1);
	}
	/* Check if player1 win a point */
	if (ball_next_pos.x > game.terrain_size.x - BALL_RADIUS) {
		game.player_1.score += 1;
		game.new_round = true;
	}
	/* Check if player2 win a point */
	if (ball_next_pos.x < BALL_RADIUS) {
		game.player_2.score += 1;
		game.new_round = true;
	}

	/* Update ball position */
	game.ball.pos = { x: game.ball.pos.x + game.ball.direction.x * game.ball.speed,
						y: game.ball.pos.y + game.ball.direction.y * game.ball.speed };
}

/**
 * @brief Update ball direction and speed on collision in rotated mode
 */
function update_ball_state_rot() {
	let	p1 = game.player_1;
	let	p2 = game.player_2;
	let	ball = game.ball;
	let	dir = game.ball.direction;
	let	ball_next_pos = { x: ball.pos.x + ball.speed * dir.x, y: ball.pos.y + ball.speed * dir.y};

	/* Check for wall collision */
	if (ball_next_pos.x > canvas.height - BALL_RADIUS || ball_next_pos.x < BALL_RADIUS)
		dir.x = -dir.x;
	/* Check if player 1 touch the ball */
	if ((ball.pos.x > p1.pos.x && ball.pos.x < p1.pos.x + PLAYER_WIDTH)
			&& (ball.pos.y > p1.pos.y && ball.pos.y < p1.pos.y + PLAYER_HEIGHT)) {
		dir.y = -dir.y;
		game.ball.speed = Math.min(BALL_MAX_SPEED, ball.speed + 1);
	}
	/* Check if player 2 touch the ball */
	if ((ball.pos.x > p2.pos.x && ball.pos.x < p2.pos.x + PLAYER_WIDTH)
			&& (ball.pos.y > p2.pos.y && ball.pos.y < p2.pos.y + PLAYER_HEIGHT)) {
		dir.y = -dir.y;
		game.ball.speed = Math.min(BALL_MAX_SPEED, ball.speed + 1);
	}
	/* Check if player1 win a point */
	if (ball_next_pos.y > game.terrain_size.y - BALL_RADIUS) {
		game.player_1.score += 1;
		game.new_round = true;
	}
	/* Check if player2 win a point */
	if (ball_next_pos.y < BALL_RADIUS) {
		game.player_2.score += 1;
		game.new_round = true;
	}

	/* Update ball position */
	game.ball.pos = { x: game.ball.pos.x + game.ball.direction.x * game.ball.speed,
						y: game.ball.pos.y + game.ball.direction.y * game.ball.speed };
}

/**
 * @brief Move player
 */
function update_player_pos() {
	let	p1 = game.player_1;
	let	p2 = game.player_2;

	if (!canvas)
		throw new Error("Canvas not found");
	/* Update position */
	if (p1_upPressed && !p1_downPressed)
		p1.pos.y -= PLAYER_SPEED;
	if (!p1_upPressed && p1_downPressed)
		p1.pos.y += PLAYER_SPEED;
	if (p2_upPressed && !p2_downPressed)
		p2.pos.y -= PLAYER_SPEED;
	if (!p2_upPressed && p2_downPressed)
		p2.pos.y += PLAYER_SPEED;

	/* Check for out of bound */
	if (p1.pos.y > canvas.height - PLAYER_WIDTH)
		p1.pos.y = canvas.height - PLAYER_WIDTH;
	if (p1.pos.y < 0)
		p1.pos.y = 0;
	if (p2.pos.y > canvas.height - PLAYER_WIDTH)
		p2.pos.y = canvas.height - PLAYER_WIDTH;
	if (p2.pos.y < 0)
		p2.pos.y = 0;
}

/**
 * @brief Draw the two players
 */
function draw_player(player: Player) {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!ctx)
		throw new Error("Context not found");

	if (game.terrain_size.x > game.terrain_size.y)
		ctx.rect(player.pos.x, player.pos.y, PLAYER_HEIGHT, PLAYER_WIDTH);
	else
		ctx.rect(player.pos.x, player.pos.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	ctx.fillStyle = PLAYER_COLOR;
	ctx.fill();
}

/**
 * @brief Draw ball  on screen
 */
function draw_ball(ball: Ball) {
	if (!ctx)
		throw new Error("Context not found.");
	ctx.beginPath();
	ctx.arc(ball.pos.x, ball.pos.y, BALL_RADIUS, 0, 2 * Math.PI);
	ctx.fillStyle = BALL_COLOR;
	ctx.fill();
}

/**
 * @brief Draw the pong game frame
 */
function draw() {
	if (!canvas)
		throw new Error("Canvas context not found");
	if (!ctx)
		throw new Error("Context not found");
	ctx.beginPath();
	ctx.clearRect(0, 0, game.terrain_size.x, canvas.height);
	draw_terrain();
	draw_player(game.player_1);
	draw_player(game.player_2);
	draw_ball(game.ball);
	draw_score();
	ctx.closePath();
	update_player_pos();
	if (canvas.width > canvas.height)
		update_ball_state();
	else
		update_ball_state_rot();
}

/**
 * @brief Draw fianal state, when player win
 */
function draw_finish() {
	if (!canvas)
		throw new Error("Canvas context not found");
	if (!ctx)
		throw new Error("Context not found");
	let msg_pos: Vec2 = { x: MSG_POS_RAT * game.terrain_size.x / 2,
		y: (1 - MSG_POS_RAT) * canvas.height };
    const msg_len: number = ctx.measureText("YOU WIN").width;
	ctx.beginPath();
	ctx.clearRect(0, 0, game.terrain_size.x, canvas.height);
	reset_ball();
	reset_player_pos();
	draw_terrain();
	draw_player(game.player_1);
	draw_player(game.player_2);
	draw_ball(game.ball);
	draw_score();

	ctx.font = `${FONT_SIZE}px ${FONT_NAME}`;
	if (game.player_1.score >= game.score_max)
		ctx.fillText("YOU WIN", msg_pos.x - msg_len, msg_pos.y);
	else
		ctx.fillText("YOU WIN", game.terrain_size.x - msg_pos.x, msg_pos.y);
	ctx.closePath();
}

/* ************************************************************************** */
/*                                  KEY HANDLER                               */
/* ************************************************************************** */
/**
 * @brief Pressed key handler
 *
 * Check if one player want to move
 */
function pressedKeyHandler(e: KeyboardEvent) {
	if (e.key === "Up" || e.key === "ArrowUp")
		p2_upPressed = true;
	if (e.key === "Down" || e.key === "ArrowDown")
		p2_downPressed = true;
	if (e.key === "w" || e.key === "W") // || e.key === "z" || e.key === "Z") // AZERTY keyboard
		p1_upPressed = true;
	if (e.key === "s" || e.key === "S")
		p1_downPressed = true;
}

/**
 * @brief Released key handler
 *
 * Check if one player want to stop move
 */
function releasedKeyHandler(e: KeyboardEvent) {
	if (e.key === "Up" || e.key === "ArrowUp")
		p2_upPressed = false;
	if (e.key === "Down" || e.key === "ArrowDown")
		p2_downPressed = false;
	if (e.key === "w" || e.key === "W") // || e.key === "z" || e.key === "Z") // AZERTY keyboard
		p1_upPressed = false;
	if (e.key === "s" || e.key === "S")
		p1_downPressed = false;
}

/* ************************************************************************** */
/*                                      GAME                                  */
/* ************************************************************************** */
/**
 * @brief Reset ball position
 *
 * On new game or new round
 */
function reset_ball() {
	game.ball.pos = { x: game.terrain_size.x / 2, y: canvas.height / 2 };
	game.ball.direction = { x: 0, y: 0 };
	game.ball.speed = 0;
}

/**
 * @brief Set player position to the middle
 */
function reset_player_pos() {
	const player_offset = 0.05 * game.terrain_size.x;
	game.player_1.pos = { x: player_offset, y: (canvas.height - PLAYER_WIDTH) / 2};
	game.player_2.pos = { x: game.terrain_size.x - player_offset - PLAYER_HEIGHT, y: (canvas.height - PLAYER_WIDTH) / 2 };
}

/**
 * @brief start a new round
 *
 * Laucnh the ball
 */
function start_round() {
	game.ball.speed = BALL_INIT_SPEED;
	if (round_winner = PLAYER_ONE)
		game.ball.direction = { x: 0.45, y: 0.55 };
	else
		game.ball.direction = { x: -0.45, y: 0.55 };
}

/**
 * @brief Handler on game finish
 */
function finish_game() {
	draw_finish();
}

/**
 * @brief Main game loop
 */
function game_loop() {
	if (game.player_1.score >= game.score_max || game.player_2.score >= game.score_max) {
		end_game = true;
		clearInterval(game_interval);
		finish_game();
		return ;
	}
	if (game.new_round) {
		reset_ball();
		setTimeout(start_round, 1000);
		game.new_round = false;
	}

	/* Rotate canvas if in portrait mode */
	// if (window.innerHeight > window.innerWidth) {
	// 	ctx.save();
	// 	ctx.translate(canvas.width / 2, canvas.height / 2);
	// 	ctx.rotate(Math.PI / 2);
	// 	ctx.translate(-canvas.width / 2, -canvas.height / 2);
	// 	draw();
	// 	ctx.restore();
	// }
	// else
		draw();
}

/**
 * @brief Launch a new pong game
 */
function launch_game(p1_name: string, p2_name: string) {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!p1_name || !p2_name)
		throw new Error("Invalid player name");
	game = new Pong(p1_name, p2_name, { x: canvas.width / 2, y: canvas.height / 2 });
	game.ball.direction = { x: 0.5, y: 0.5 };
	end_game = false;
	game_interval = setInterval(game_loop, 10);
}

/* ************************************************************************** */
/*                                     RESIZE                                 */
/* ************************************************************************** */
/**
 * @brief Reset player pos on resize
 */
function resize_player_pos() {
	const	p1_offset_x = game.player_1.pos.x / game.terrain_size.x;
	const	p1_offset_y = game.player_1.pos.y / game.terrain_size.y;
	const	p2_offset_x = game.player_2.pos.x / game.terrain_size.x;
	const	p2_offset_y = game.player_2.pos.y / game.terrain_size.y;

	/* Terrain rotation Clockwise */
	if (game.terrain_size.x > game.terrain_size.y != canvas.width > canvas.height) {
		if (game.terrain_size.x > game.terrain_size.y) {
			game.player_1.pos.x = (1 - p1_offset_y) * canvas.width;
			game.player_1.pos.y = p1_offset_x * canvas.height;
			game.player_2.pos.x = (1 - p2_offset_y) * canvas.width;
			game.player_2.pos.y = p2_offset_x * canvas.height;
		}
		else {
			game.player_1.pos.x = p1_offset_y * canvas.width;
			game.player_1.pos.y = p1_offset_x * canvas.width;
			game.player_2.pos.x = p2_offset_y * canvas.width;
			game.player_2.pos.y = p2_offset_x * canvas.width;
		}
	}
	else {
		game.player_1.pos.y = p1_offset_y * canvas.height;
		game.player_1.pos.x = p1_offset_x * canvas.width;
		game.player_2.pos.y = p2_offset_y * canvas.height;
		game.player_2.pos.x = p2_offset_x * canvas.width;
	}
}

function resize_ball_pos() {
	const	ball_offset_x = game.ball.pos.x / game.terrain_size.x;
	const	ball_offset_y = game.ball.pos.y / game.terrain_size.y;

	if (game.terrain_size.x > game.terrain_size.y != canvas.width > canvas.height) {
		let	tmp_dir = game.ball.direction.x;
		// if (game.terrain_size.x > game.terrain_size.y) {
			game.ball.pos.y = ball_offset_x * canvas.height;
			game.ball.pos.x = ball_offset_y * canvas.width;
			game.ball.direction.x = game.ball.direction.y;
			game.ball.direction.y = -tmp_dir;
		// }
		// else {
		// }
	}
	else {
		game.ball.pos.y = ball_offset_y * canvas.height;
		game.ball.pos.x = ball_offset_x * canvas.width;
	}
}

/**
 * @brief REsize canvas for "Responsivness"
 */
function resizeCanvas() {
	if (!ctx)
		throw new Error("Context not found");
	if (!canvas)
		throw new Error("Canvas not found");

	/* Rotate canvas if needed */
	if (window.innerHeight > window.innerWidth) {
		canvas.height = window.innerHeight * 0.8;
		canvas.width = canvas.height / GOLDEN_NUMBER;
	}
	else {
		canvas.width = window.innerWidth * 0.8;
		canvas.height = canvas.width / GOLDEN_NUMBER;
	}
	PLAYER_WIDTH = canvas.width * PLAYER_WIDTH_RAT;
	PLAYER_HEIGHT = PLAYER_WIDTH / PLAYER_WIDTH_HEIGHT_RAT;
	TERRAIN_LINE_FAT = 0.01 * Math.max(canvas.width, canvas.height);
	BALL_RADIUS = 0.01 * Math.min(canvas.width, canvas.height);
	FONT_SIZE = 0.08 * Math.min(canvas.width, canvas.height);

	/* Set terrain new siwe and reset player pos */
	if (game) {
		resize_ball_pos();
		resize_player_pos();
		game.terrain_size = { x: canvas.width, y: canvas.height };
	}
}

/* ************************************************************************** */
/*                                    SPECIAL                                 */
/* ************************************************************************** */
/**
 * @brief Go back to login page
 */
function get_index() {
	const	xhttp = new XMLHttpRequest();
	const	main_div = document.getElementById("main");

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200 && main_div) {
			main_div.innerHTML = this.responseText;
		}
	};

	xhttp.open("GET", "/auth/login", true);
	xhttp.send();
}

/**
 * @brief Load the different event for the pong game
 *
 * This function should be called when the rigth html page is loaded
 */
function load_script() {
	try {
		/* Set var */
		start_button = document.getElementById("button_start_game") as HTMLButtonElement;
		if (!start_button)
			throw new Error("Start button not found.");
		reset_button = document.getElementById("reset_button") as HTMLButtonElement;
		if (!reset_button)
			throw new Error("Reset button not found.");
		index_button = document.getElementById("index_button") as HTMLButtonElement;
		if (!index_button)
			throw new Error("Index button not found.");
		canvas = document.getElementById("pong_canvas") as HTMLCanvasElement;
		if (!canvas)
			throw new Error("Canvas not found");
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		if (!ctx)
			throw new Error("Context not found");

		/* Set events listeners */
		start_button.addEventListener("click", () => {
			// canvas.style.display = 'block';
			start_button.style.display = 'none';
			reset_button.style.display = 'block';
			/* Start game */
			resizeCanvas();
			launch_game("Jojo", "Lili");
		});
		reset_button.addEventListener("click", () => {
			// canvas.style.display = 'none';
			start_button.style.display = 'block';
			reset_button.style.display = 'none';

		});
		index_button.addEventListener("click", get_index);
		document.addEventListener("keydown", pressedKeyHandler, false);
		document.addEventListener("keyup", releasedKeyHandler, false);
		window.addEventListener("resize", resizeCanvas); /* Resize
														  * "Responsivness" attempt
														  */
	}
	catch(err: any) {
		console.log(err);
	}
}

load_script(); /* Should be called when the right html is loaded */
