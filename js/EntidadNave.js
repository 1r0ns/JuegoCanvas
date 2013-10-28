function EntidadNave(){
	this.juego;
	this.constructor = function(juego, xConst, yConst){
		this.constructorMain(40,25,[Sprites.get("sprites/nave.jpg")],999999,xConst,yConst,"n");
		this.juego = juego;
	};
	this.mover=function(delta){
        if (this.dx<0 && this.x<10){
            return;
        }else if (this.dx>0 && this.x>juego.getAnchuraCanvas()-(this.ancho+8)){
            return;
        }
        else if (this.dy<0 && this.y<10){
            return;
        }else if (this.dy>0 && this.y>juego.getAlturaCanvas()-(this.alto+10)){
            return;
        }
        this.moverMain(delta);
    };

    this.logica = function(){
    };

    
    this.colosionadoCon=function(otro){
        if (otro instanceof EntidadAsteroide)
        {
            this.juego.notificarMuerte();
        }
        if(otro instanceof BasuraEspacial)
        {
            this.juego.efectoExtra(aleatorio(1,3));
        }
    };
}
EntidadNave.prototype = new Entidad();

function aleatorio(inferior,superior){ 
    numPosibilidades = superior - inferior 
    aleat = Math.random() * numPosibilidades 
    aleat = Math.floor(aleat) 
    return parseInt(inferior) + aleat;
} 