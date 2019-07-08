import * as PIXI from "pixi.js";

const app = new PIXI.Application({ width: 800, height: 600, antialias: true });
document.body.appendChild(app.view);

const gfx = new PIXI.Graphics();

gfx.beginFill(0x000);
gfx.lineStyle(4, 0xFFF, 1);

gfx.moveTo(50, 50);
gfx.lineTo(250, 50);
gfx.lineTo(100, 100);
gfx.lineTo(50, 50);
gfx.endFill();

app.stage.addChild(gfx);
