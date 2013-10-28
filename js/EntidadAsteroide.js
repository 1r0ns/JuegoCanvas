function EntidadAsteroide(){
	this.velocidadMovimiento = 150;
	this.juego;
	this.destruido=0;
	this.constructor = function(juego,AnchoConst,AltoConst, xConst, yConst,fila){
		switch(fila)
        {
            case 0:
                this.constructorMain(AnchoConst,AltoConst,[Sprites.get("sprites/alien1a.jpg"),Sprites.get("sprites/alien1b.jpg")],200,xConst,yConst,"a");
                break;
            case 1:
                this.constructorMain(AnchoConst,AltoConst,[Sprites.get("sprites/alien2a.jpg"),Sprites.get("sprites/alien2b.jpg")],250,xConst,yConst,"a");
                break;
            default:
                this.constructorMain(AnchoConst,AltoConst,[Sprites.get("sprites/alien3a.jpg"),Sprites.get("sprites/alien3b.jpg")],300,xConst,yConst,"a");
                break;
        }
		this.juego = juego;
		this.dy =+ this.velocidadMovimiento;
	}
   	this.mover = function(delta){
		if(this.dy>0 && this.y>juego.getAlturaCanvas()-(this.alto)){
        	this.juego.AsteroidesEscapados();
            this.juego.eliminarEntidad(this);
        }
        this.moverMain(delta);

        if (this.destruido>0)
        {
            this.destruido-=delta;
            if (this.destruido<=0)
            {
                this.juego.eliminarEntidad(this);
            }
        }
    }; 
    this.logica = function(){
        this.dy =+ this.dy;
        this.y += 10;
    };
    this.destruir = function(){
        this.sprites = [Sprites.get("sprites/explosion.jpg")];
        this.spriteActual = 0;
        this.destruido = 50;
    };
    this.colosionadoCon=function(otro){
    };
	
}
EntidadAsteroide.prototype = new Entidad();