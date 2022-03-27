import kaboom from "kaboom"

// initialize context
kaboom({width:128,height:128,scale:3,background:[0,0,0]})

import loadAssets from "./assets.js"

loadAssets();

layers([
	"game",
	"ui",
	"menu",
	"text",
], "game")
var gameState = "game";

//cool mapping system
grumbleSnatchLevels = [
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

grumbleSnatchMap = [
	[0,1,2],
	[0,3,2],
]
grumbleSnatchMap.w = 3
grumbleSnatchMap.h = 2

function createMap(levels,map,spriteSheet) {
	for (let y = 0; y < map.h; y++) {
		for (let x = 0; x < map.w; x++) {
			if (spriteSheet === "scum") {
				addLevel(levels[map[y][x]], {
					width:16,
					height:16,
					pos:vec2( x * 128, y * 128),
					"{": () => [
						solid(),
						sprite("ScumUpLC1"),
						pos(),
						area(),
					],
					"}": () => [
						solid(),
						sprite("ScumUpRC1"),
						pos(),
						area(),
					],
					"[": () => [
						solid(),
						sprite("ScumDnLC1"),
						pos(),
						area(),
					],
					"]": () => [
						solid(),
						sprite("ScumDnRC1"),
						pos(),
						area(),
					],
					"(": () => [
						solid(),
						sprite("ScumWallL1"),
						pos(),
						area(),
					],
					")": () => [
						solid(),
						sprite("ScumWallR1"),
						pos(),
						area(),
					],
					"_": () => [
						solid(),
						sprite("ScumWallDn1"),
						pos(),
						area(),
					],
					"-": () => [
						solid(),
						sprite("ScumWallUp1"),
						pos(),
						area(),
					],
					"=": () => [
						solid(),
						sprite("ScumWall1"),
						pos(),
						area(),
					],
					"o": () => [
						sprite("ScumGround1"),
						pos(),
						area(),
					],
					"e": () => [
						sprite("ScumUpLC2"),
						pos(),
						solid(),
						area(),
					],
					"r": () => [
						sprite("ScumUpRC2"),
						pos(),
						solid(),
						area(),
					],
					"d": () => [
						sprite("ScumDnLC2"),
						pos(),
						solid(),
						area(),
					],
					"f": () => [
						sprite("ScumDnRC2"),
						pos(),
						solid(),
						area(),
					],
				})
			}
		}
	}
}

createMap(grumbleSnatchLevels,grumbleSnatchMap, "scum")

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
var menuPos = 1;

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
	text("Text\nSave",{
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
	if (menuPos > 1) {
		menuPos = 1;
	}

	if (menuPos < 0) {
		menuPos = 0;
	}
	
	//player animation fix
	if (gameState != "game") {
		player.play("idle")
	}
})