function Entidad(){
	//Tiempo delta
	this.dx = 0;
	this.dy = 0;
	//Cordenadas
	this.x;
	this.y;
	//Otros punteros.
	this.ancho;
	this.alto;
	this.tipo;

	this.sprites;
    this.spriteActual=0;
    this.tiempoSprite;
    this.tiempoTranscurrido=0;
 
	this.constructorMain = function(anchoConst, altoConst, spritesConst, tiempo, xConst, yConst,tipoIni){
		this.ancho = anchoConst;
		this.alto = altoConst;
		this.sprites = spritesConst;
		this.tiempoSprite = tiempo;
		this.x = xConst;
		this.y = yConst;
		this.tipo = tipoIni;
	};

	this.moverMain = function(delta){
		this.tiempoTranscurrido+=delta;
        if (this.tiempoTranscurrido>=this.tiempoSprite)
        {
            this.tiempoTranscurrido=0;
            this.spriteActual=(this.spriteActual+1)%this.sprites.length;
        }
		this.x += (delta*this.dx)/1000;
		this.y += (delta*this.dy)/1000;
	};
	this.setVelocidadHorizontal = function(dxIni){
        this.dx=dxIni;
    };
    this.setVelocidadVertical = function(dyIni){
        this.dy=dyIni;
    };
    this.getVelocidadHorizontal = function(){
        return this.dx;
    };
    this.getVelocidadVertical = function(){
        return this.dy;
    };
    this.getX = function(){
        return this.x;
    };
    this.getY = function(){
        return this.y;
    };
    this.getTipo = function(){
        return this.tipo;
    }
	this.dibujar = function(ctx){
		ctx.drawImage(this.sprites[this.spriteActual],this.x, this.y, this.ancho, this.alto);
	};
	this.colision=function(otro){
        if (this.x + this.ancho < otro.x) {
            return false;
        }
            if (this.y + this.alto < otro.y) {
            return false;
        }
            if (this.x > otro.x + otro.ancho) {
            return false;
        }
            if (this.y > otro.y + otro.alto) {
            return false;
        }
        return true;
    };
}