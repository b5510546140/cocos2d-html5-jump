var Jumper = cc.Sprite.extend({
    ctor: function( x, y ) {
        this._super();
        this.initWithFile( 'res/images/jumper.png' );
        this.setAnchorPoint( cc.p( 0.5, 0 ) );
        this.x = x;
        this.y = y;

        this.initVariable();
        this.updateSpritePosition();
    },

    initVariable: function(){
        this.maxVx = 8;
        this.accX = 0.25;
        this.backAccX = 0.5;
        this.jumpV = 20;
        this.g = -1;
        
        this.vx = 0;
        this.vy = 0;

        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;

        this.ground = null;

        this.blocks = [];
    },

    updateSpritePosition: function() {
        this.setPosition( cc.p( Math.round( this.x ),
                                Math.round( this.y ) ) );
    },

    getPlayerRect: function() {
        var spriteRect = this.getBoundingBoxToWorld();
        var spritePos = this.getPosition();

        var dX = this.x - spritePos.x;
        var dY = this.y - spritePos.y;
        return cc.rect( spriteRect.x + dX,
                        spriteRect.y + dY,
                        spriteRect.width,
                        spriteRect.height );
    },
    
    update: function() {
        var currentPositionRect = this.getPlayerRect();

        this.updateYMovement();
        this.updateXMovement();

        var newPositionRect = this.getPlayerRect();
        this.handleCollision( currentPositionRect,
                              newPositionRect );

        this.updateSpritePosition();
    },

    updateXMovement: function() {
        if ( this.ground ) {
            if ( ( !this.moveLeft ) && ( !this.moveRight ) ) {
                this.autoDeaccelerateX();
            } else if ( this.moveRight ) {
                this.accelerateX( Jumper.ACC.RIGHT );
            } else {
                this.accelerateX( Jumper.ACC.LEFT );
            }
        }
        setOutOfScreen();
    },

    setOutOfScreen: function(){
        this.x += this.vx;
        if ( this.x < 0 ) {
            this.x += screenWidth;
        }
        if ( this.x > screenWidth ) {
            this.x -= screenWidth;
        }
    },

    updateYMovement: function() {
        if ( this.ground ) {
            this.vy = 0;
            if ( this.jump ) {
                this.floating();
            }
        } else {
            this.droping();
        }
    },

    floating: function(){
        this.vy = this.jumpV;
        this.y = this.ground.getTopY() + this.vy;
        this.ground = null;
    },

    droping: function(){
        this.vy += this.g;
        this.y += this.vy;
    },

    isSameDirection: function( dir ) {
        return ( ( ( this.vx >=0 ) && ( dir >= 0 ) ) ||
                 ( ( this.vx <= 0 ) && ( dir <= 0 ) ) );
    },

    accelerateX: function( dir ) {
        if ( this.isSameDirection( dir ) ) {
            this.vx += dir * this.accX;
            checklimit(this.maxVx,dir);
        } else {
            checklimit(this.backAccX,dir);
            if ( Math.abs( this.vx ) < this.backAccX ) {
                this.vx = 0;
        }
    },
    checklimit: function(max,dir){
         if ( Math.abs( this.vx ) > max ) {
                this.vx = dir * max;
            }
    }
    
    autoDeaccelerateX: function() {
        if ( Math.abs( this.vx ) < this.accX ) {
            this.vx = 0;
        } else if ( this.vx > 0 ) {
            this.vx -= this.accX;
        } else {
            this.vx += this.accX;
        }
    },

    handleCollision: function( oldRect, newRect ) {
        if ( this.ground ) {
           isNotOnTop();
        } else {
            isOnTop()
        }
    },

    isNotOnTop: function(){
         if ( !this.ground.onTop( newRect ) ) {
                this.ground = null;
        }
    },

    isOnTop: function(){
        if ( this.vy <= 0 ) {
                var topBlock = this.findTopBlock( this.blocks,
                                                  oldRect,
                                                  newRect );
                
                if ( topBlock ) {
                    this.ground = topBlock;
                    this.y = topBlock.getTopY();
                    this.vy = 0;
                }
        }
    },
    
    findTopBlock: function( blocks, oldRect, newRect ) {
        var topBlock = null;
        var topBlockY = -1;
        
        blocks.forEach( function( b ) {
            if ( b.hitTop( oldRect, newRect ) ) {
                if ( b.getTopY() > topBlockY ) {
                    topBlockY = b.getTopY();
                    topBlock = b;
                }
            }
        }, this );
        
        return topBlock;
    },
    
    handleKeyDown: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = true;
        }
    },

    handleKeyUp: function( e ) {
        if ( Jumper.KEYMAP[ e ] != undefined ) {
            this[ Jumper.KEYMAP[ e ] ] = false;
        }
    },

    setBlocks: function( blocks ) {
        this.blocks = blocks;
    }
});

Jumper.KEYMAP = {}
Jumper.KEYMAP[cc.KEY.left] = 'moveLeft';
Jumper.KEYMAP[cc.KEY.right] = 'moveRight';
Jumper.KEYMAP[cc.KEY.up] = 'jump';

Jumper.ACC = {
    LEFT :-1;
    RIGHT :1;
};

        
