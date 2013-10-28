function BasuraEspacial(){
	this.velocidadMovimiento = 150;
	this.juego;

	this.constructor = function(juego,AnchoConst,AltoConst, xConst, yConst){

		this.constructorMain(AnchoConst,AltoConst,[Sprites.get("sprites/nave.jpg")],999999,xConst,yConst,"bs");

		this.dy =+ this.velocidadMovimiento;
		this.juego = juego;
	}

	this.mover = function(delta){
		if(this.dy>0 && this.y>juego.getAlturaCanvas()-(this.alto)){
            this.juego.eliminarEntidad(this);
        }
        this.moverMain(delta);
    }; 
    this.logica = function(){
        this.dy =+ this.dy;
        this.y += 10;
    };
    this.colosionadoCon=function(otro){
    	if (otro instanceof EntidadNave)
    	{
    		this.juego.eliminarEntidad(this);
    	}
    };
}

BasuraEspacial.prototype = new Entidad();