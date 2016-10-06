"use strict";9

module.exports = exports = Pipe;

function Pipe(i, x, y, end)
{
    this.pipeID = i;
    this.x = x+1;
    this.y = y+1;
    this.height = this.width = 62;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/pipes.png');
    this.empty = true;
    this.end = end;
    this.sideOpen = 
    {
        top:false,
        left:false,
        right:false,
        bottom:false
    }
    this.sourceRect =
    {
        x: 0,
        y: 0,
    }
    switch(i)
    {
        case 0:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 0;
            this.sourceRect.y = 0;
            break;
        case 1:
            this.sideOpen.top = false;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 32;
            break;
        case 2:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 63;
            this.sourceRect.y = 32;
            break;
        case 3:     
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 63;
            this.sourceRect.y = 64;
            break;
        case 4:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 31;
            this.sourceRect.y = 64;
            break;
        case 5:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 96;
            break;
        case 6:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 63;
            this.sourceRect.y = 96;
            break;
        case 7:
            this.sideOpen.top = true;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 63;
            this.sourceRect.y = 128;
            break;
        case 8:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = true;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 31;
            this.sourceRect.y = 128;
            break;
        case 9:
            this.sideOpen.top = false;
            this.sideOpen.left = true;
            this.sideOpen.right = true;
            this.sideOpen.bottom = false;
            this.sourceRect.x = 95;
            this.sourceRect.y = 32;
            break;
        case 10:
            this.sideOpen.top = true;
            this.sideOpen.left = false;
            this.sideOpen.right = false;
            this.sideOpen.bottom = true;
            this.sourceRect.x = 95;
            this.sourceRect.y = 64;
            break;
    }
}

Pipe.prototype.update = function()
{

}

Pipe.prototype.render = function(ctx)
{
    ctx.drawImage(this.spritesheet, 
                //image
                this.sourceRect.x, this.sourceRect.y, 32, 32,
                //grabbing what we want to display from image
                this.x, this.y, this.height, this.width);  
                //placing what we want where we want it
}