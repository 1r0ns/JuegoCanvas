function EntidadDisparo(){

    this.velocidadMovimiento=-300;
    this.juego;
    
    this.usado = false;
    
    this.constructor = function(juego,xIni,yIni){
        this.constructorMain(3,6,[Sprites.get("sprites/disparoa.jpg"),Sprites.get("sprites/disparob.jpg")],100,xIni,yIni,"d");
        this.juego = juego;
        this.dy = this.velocidadMovimiento;
    };

    this.mover = function(delta){
        this.moverMain(delta);
        if (this.y<-100)
        {
            this.juego.eliminarEntidad(this);
        }
    };
    
    this.logica=function(){
    };
    
    this.colosionadoCon = function(otro){
        if (this.usado)
        {
            return;
        }
        
        if (otro instanceof EntidadAsteroide)
        {
            this.usado=true;
            this.juego.eliminarEntidad(this);
            otro.destruir();
            this.juego.notificarAsteroideDestruido();
        }
    };
}
EntidadDisparo.prototype = new Entidad();