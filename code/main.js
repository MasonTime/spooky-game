import kaboom from "kaboom"

// initialize context
kaboom({width:128,height:128,scale:4,background:[0,0,0]})

// load assets
loadSprite("player","sprites/player.png", {
	sliceX:3,
	sliceY:1,
	anims:{
		run:{
			from:0,
			to:2,
			loop:true,
		},
		idle:0,
	}
})

loadSprite("npc1","sprites/npc1.png", {
	sliceX:3,
	sliceY:1,
	anims:{
		run:{
			from:0,
			to:2,
			loop:true,
		},
		idle:0,
	}
})

loadSprite("npc2","sprites/npc2.png", {
	sliceX:3,
	sliceY:1,
	anims:{
		run:{
			from:0,
			to:2,
			loop:true,
		},
		idle:0,
	}
})


loadSpriteAtlas("sprites/tileset.png", {
	oUpL: {
		x:0,
		y:0,
		width:16,
		height:16
	},
	oUpR: {
		x:16,
		y:0,
		width:16,
		height:16
	},
	oDnL: {
		x:0,
		y:16,
		width:16,
		height:16
	},
	oDnR: {
		x:16,
		y:16,
		width:16,
		height:16
	},
	oUpL2: {
		x:0,
		y:128,
		width:16,
		height:16
	},
	oUpR2: {
		x:16,
		y:128,
		width:16,
		height:16
	},
	oDnL2: {
		x:0,
		y:144,
		width:16,
		height:16
	},
	oDnR2: {
		x:16,
		y:144,
		width:16,
		height:16
	},
	oWlL: {
		x:16,
		y:32,
		width:16,
		height:16
	},
	oWlR: {
		x:16,
		y:48,
		width:16,
		height:16
	},
	oWlD: {
		x:0,
		y:48,
		width:16,
		height:16,
	},
	oWlU: {
		x:32,
		y:112,
		width:16,
		height:16,
	},
	oWl: {
		x:0,
		y:32,
		width:16,
		height:16,
	},
	oG: {
		x:32,
		y:0,
		width:16,
		height:16,
	},
})

layers([
	"game",
	"ui",
	"menu",
	"text",
], "game")
var gameState = "game";

//cool mapping system
levels = [
	[
	"{------}",
	"(======d",
	"(oooooo=",
	"(ooooooo",
	"(ooooooo",
	"(ooooooe",
	"(oooooo)",
	"[______]",
	],
	[
	"{------}",
	"f======d",
	"=oooooo=",
	"oooooooo",
	"oooooooo",
	"rooooooe",
	"(oooooo)",
	"[_rooe_]",
	],
	[
	"{------}",
	"f======)",
	"=oooooo)",
	"ooooooo)",
	"ooooooo)",
	"roooooo)",
	"(oooooo)",
	"[______]",
	],
	[
	"{-food-}",
	"f==oo==d",
	"=oooooo=",
	"oooooooo",
	"oooooooo",
	"rooooooe",
	"(oooooo)",
	"[______]",
	],
]

map = [
	[0,1,2],
	[0,3,2],
]
mapW = 3
mapH = 2

for (let y = 0; y < mapH; y++) {
	for (let x = 0; x < mapW; x++) {
		addLevel(levels[map[y][x]], {
			width:16,
			height:16,
			pos:vec2( x * 128, y * 128),
			"{": () => [
				solid(),
				sprite("oUpL"),
				pos(),
				area(),
			],
			"}": () => [
				solid(),
				sprite("oUpR"),
				pos(),
				area(),
			],
			"[": () => [
				solid(),
				sprite("oDnL"),
				pos(),
				area(),
			],
			"]": () => [
				solid(),
				sprite("oDnR"),
				pos(),
				area(),
			],
			"(": () => [
				solid(),
				sprite("oWlL"),
				pos(),
				area(),
			],
			")": () => [
				solid(),
				sprite("oWlR"),
				pos(),
				area(),
			],
			"_": () => [
				solid(),
				sprite("oWlU"),
				pos(),
				area(),
			],
			"-": () => [
				solid(),
				sprite("oWlD"),
				pos(),
				area(),
			],
			"=": () => [
				solid(),
				sprite("oWl"),
				pos(),
				area(),
			],
			"o": () => [
				sprite("oG"),
				pos(),
				area(),
			],
			"e": () => [
				sprite("oUpL2"),
				pos(),
				solid(),
				area(),
			],
			"r": () => [
				sprite("oUpR2"),
				pos(),
				solid(),
				area(),
			],
			"d": () => [
				sprite("oDnL2"),
				pos(),
				solid(),
				area(),
			],
			"f": () => [
				sprite("oDnR2"),
				pos(),
				solid(),
				area(),
			],
		})
	}
}

//player
const player = add([
	sprite("player"),
	pos(64,64),
	z(),
	area({width:16,height:8,offset:vec2(0,8)}),
	solid(),
	"object",
	"hpHaver",
	"player",
	{
		spd:64,
		dir:"d",
		health:10,
		invis:10,
	}
])

onUpdate("player", (player) => {
	if (player.invis > 0) {
		player.invis -= .1
	}
})

//animating player
onKeyPress(["up","down","left","right","space"], () => {
	if (gameState === "game") {
		player.play("run")
		currentText = "Nothing was said, not even a mouse";
	}
})

onKeyRelease(["up","down","left","right","space"], () => {
	if (gameState === "game") {
		if (
			!isKeyDown("left")
			&& !isKeyDown("right")
			&& !isKeyDown("up")
			&& !isKeyDown("down")
		) {
			player.play("idle")
		}
	}
})

//controls
onKeyDown("right",() => {
	if (gameState === "game") {
		player.move(player.spd,0)
		player.flipX(false)
		player.dir = "r"
	}
})

onKeyDown("left",() => {
	if (gameState === "game") {
		player.move(-player.spd,0)
		player.flipX(true)
		player.dir = "l"
	}
})

onKeyDown("down",() => {
	if (gameState === "game") {
		player.move(0,player.spd)
		player.dir = "d"
	}
})

onKeyDown("up",() => {
	if (gameState === "game") {
		player.move(0,-player.spd)
		player.dir = "u"
	}
})

onKeyPress("up",() => {
	if (gameState === "menu") {
		menuPos -= 1;
	}
})

onKeyPress("down",() => {
	if (gameState === "menu") {
		menuPos += 1;
	}
})

//menu
onKeyPress("z",() => {
	switch (gameState) {
		case "game":
			gameState = "menu";
			break;
		case "menu":
			gameState = "game";
			break;
	}
})

onKeyPress("x",() => {

	switch (gameState) {
		case "menu":
			switch (menuPos) {
				case 0:
					gameState = "text";
					break;
				case 1:
					gameState = "game";
					break;
				case 2:
					gameState = "game";
					break;
				case 3:
					gameState = "game";
					break;
			}
			break;
		case "text":
			gameState = "game";
			break;
		case "game":
			spells[xSpell].use(player)
	}
})

onKeyPress("c", () => {
	if (gameState === "game") {
		spells[cSpell].use(player)
	}
}) 

onUpdate("object", (obj) => {
	//cool layering thing
	obj.z = obj.pos.y
})

//text and npc
function createNpc(x,y,spr,text) {
	add([
		sprite(spr),
		pos(x,y),
		z(),
		area({width:16,height:8,offset:vec2(0,8)}),
		solid(),
		"npc",
		"object",
		{
			txt:text,
		}
	])
}

createNpc(80,80,"npc1","Beans")

createNpc(32,24,"npc2","Im writing this at 3 am")

var currentText;

const textBox = add([
	//textbox under enemy text
	layer("text"),	
	rect(128,32),
	pos(camPos().x - width()/2 + 0,camPos().y - width()/2 + 96),
	color(0, 0, 0),
	"Text",
])

const npcText = add([
	//npc text
	pos(camPos().x - width()/2,camPos().y - width()/2 + 96),
	layer("text"),
	text(currentText,{
		width:128,
		size:6,
		font:"sink",
	}),
	"Text",
]);

onUpdate("npc", (npc) => {
	//if the player is close enough to an enemy it sets the current text to what the enemy is saying
	if ( 
		(player.pos.x+8) - (npc.pos.x+8) < 20 &&
		(player.pos.x+8) - (npc.pos.x+8) > -20	&&
		(player.pos.y+8) - (npc.pos.y+8) < 20	&&
		(player.pos.y+8) - (npc.pos.y+8) > -20
	) {
		currentText = npc.txt;
	}
})

onUpdate("Text", (text) => {
	if (gameState === "game") {
		text.hidden = true;
	}
	if (gameState === "text") {
		text.hidden = false;
	}
})

//menu
var menuPos = 3;

const menuBox = add([
	//textbox under enemy text
	layer("menu"),	
	rect(128,32),
	pos(camPos().x - width()/2,camPos().y - width()/2),
	color(0, 0, 0),
	"menu",
])

const menuText = add([
	layer("menu"),
	pos(camPos().x - width()/2,camPos().y - width()/2),
	text("Text\nTricks\nSave",{
		width:128,
		size:6,
		font:"sink",
	}),
	"menu",
])

const menuCursor = add([
	layer("menu"),
	rect(2,2),
	pos(camPos().x - width()/2+28,camPos().y - width()/2 + 2 + 6*menuPos),
	"menu",
])

onUpdate("menu", (menu) => {
	//set the current
	if (gameState === "game") {
		menu.hidden = true;
	} else {
		menu.hidden = false;
	}
})

//spells
xSpell = 0
cSpell = 0

const spells = {
	0 : {
		use:function(object) {
			let DX;
			let DY;
			let dir = object.dir;
			let SX;
			let SY;
			
			switch (dir) {
				case "u":
					DY = -128;
					DX = 0;
					SY = -4;
					SX = 4;
					break;
				case "d":
					DY = 128;
					DX = 0;
					SY = 18;
					SX = 4;
					break;
				case "l":
					DX = -128;
					DY = 0;
					SX = -4;
					SY = 0;
					break;
				case "r":
					DX = 128;
					DY = 0;
					SX = 12;
					SY = 0;
					break;
			}
			
			add([
				pos( [object.pos.x+SX,object.pos.y+SY] ),
				area(),
				rect(8,8),
				color(255,0,0),

				"shoot",
				{
					dx:DX,
					dy:DY,
				}
			])
		},
	}
}

onUpdate("shoot", (object) => {
	object.move(object.dx,object.dy);
})

onCollide("solid", "shoot", (solid,object) => {
  object.destroy()
})

//enemies
function createEnemy(x,y,spr,health) {
	add([
		pos(x,y),
		area(),
		solid(),
		sprite(spr),

		"follower",
		"enemy",
		{
			health: health,
			damage: 2,
		}
	])
}

function createCrawler (x,y){
	createEnemy(x,y,"npc2",3);
}
createCrawler(32,64)

onUpdate("follower", (enemy) => {

	if (player.pos.x - enemy.pos.x < 128 || player.pos.y - enemy.pos.y < 128)	{
		enemy.moveTo(player.pos.x,player.pos.y,32)
	}
		
	if (enemy.health < 1) {
		enemy.destroy()
	}
})

onCollide("player","enemy", (player,enemy) => {

	if (player.invis < .1) {
		player.health -= enemy.damage;

		player.invis = 10;
	}
})

onCollide("shoot","enemy", (bullet,object) => {
	object.health -= 1;
})

//simple update function
onUpdate(() => {
	//set the current text
	menuBox.pos = [camPos().x - width()/2,camPos().y - width()/2];
	menuText.pos = [camPos().x - width()/2,camPos().y - width()/2];
	menuCursor.pos = [camPos().x - width()/2+28,camPos().y - width()/2 + 2 + 6*menuPos];
	npcText.text = currentText;
	npcText.pos = [camPos().x - width()/2 + 0,camPos().y - width()/2 + 96];
	textBox.pos = [camPos().x - width()/2 + 0,camPos().y - width()/2 + 96];

	//zelda like camera
	camPos(Math.ceil( player.pos.x/width())*width()-width()+width()/2,Math.ceil( player.pos.y/height())*height()-height()+height()/2 )

	//menu positoning
	if (menuPos > 2) {
		menuPos = 0;
	}

	if (menuPos < 0) {
		menuPos = 2;
	}
	
	//player animation fix
	if (gameState != "game") {
		player.play("idle")
	}

	debug.log(player.health)
})