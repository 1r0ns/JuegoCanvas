function Juego(){   

    this.panel;
    this.canvas;
    this.contexto;
    this.listaEntidades=[];
    this.listaEntidadesEliminar=[];
    this.nave;
    this.velocidadMovimiento=300;
    this.ultimoDisparo=0;
    this.intervaloDisparo=500;
    this.gameRunning=false;
    this.logicaRequerida=false; 
    this.esperandoTecla=false;
    this.izquierdoPulsado=false;
    this.derechoPulsado=false;
    this.espacioPulsado=false;
    this.tiempoTranscurrido;
    this.puntuacion=0;
    this.vida=2;

    this.AsteroidesDestruidos = 0;
    this.AsteroidesNoDestruidos = 0;

    var lvl = {
        intime: 3000,
        lvAstD: 15,
        lvAstE: 3
    }

	this.constructor = function(idCanvas){
		this.canvas = document.getElementById(idCanvas);
		this.canvas.width = 500;
		this.canvas.height = 600;
		this.canvas.style.backgroundColor = "black";
		this.ctx = this.canvas.getContext("2d");

        this.panel=document.createElement("div");
        this.panel.style.display="none";
        this.panel.style.position="absolute";
        this.panel.style.top=this.canvas.offsetTop;
        this.panel.style.left=this.canvas.offsetLeft;
        this.panel.style.width=this.canvas.width;
        this.panel.style.height=this.canvas.height;
        this.panel.style.paddingTop="250px";
        this.panel.style.textAlign="center";
        this.panel.style.color="white";
        this.panel.style.fontSize="x-large";

        document.body.appendChild(this.panel);

        this.InciarNave();
        this.IniciarAsteroide();
	};

    this.empezarJuego=function(){
        this.listaEntidades=[];
        this.listaEntidadesEliminar=[];
        this.IniciarAsteroide();
        this.InciarNave();
        this.intervalo = setInterval("juego.IniciarAsteroide();", lvl.intime);
        this.izquierdoPulsado=false;
        this.derechoPulsado=false;
        this.espacioPulsado=false;
        this.tiempoTranscurrido=new Date().getTime();
        this.esperandoTecla=false;
        this.AsteroidesDestruidos = 0;
        this.AsteroidesNoDestruidos = 0;
        if(this.vida <= 0){
            this.vida = 2;
            this.puntuacion = 0;
        }
        
    };
    this.IniciarAsteroide = function(){
        this.ast = new EntidadAsteroide();
        this.ast.constructor(this,aleatorio(10,50),aleatorio(10,50),aleatorio(10,480),0,aleatorio(0,2));
        this.listaEntidades.push(this.ast);
    };
    this.intervalo = setInterval("juego.IniciarAsteroide();", lvl.intime);

    function aleatorio(inferior,superior){ 
        numPosibilidades = superior - inferior 
        aleat = Math.random() * numPosibilidades 
        aleat = Math.floor(aleat) 
        return parseInt(inferior) + aleat;
    } 
    //Dibujar la Nave
	this.InciarNave = function(){
		this.nave = new EntidadNave();
		this.nave.constructor(this,230,550);
		this.listaEntidades.push(this.nave);
	};

	this.getAlturaCanvas = function(){
        return this.canvas.height;
    };
    this.getAnchuraCanvas = function(){
        return this.canvas.width;
    };
    this.actualizaLogica = function(){
        this.logicaRequerida = true;
    };
    this.eliminarEntidad=function(entidad){
        this.listaEntidadesEliminar.push(entidad);
    };
    this.notificarVictoria=function(){
        this.panel.innerHTML="Nivel superado! <br/>Presiona ENTER para pasar al siguiente nivel.";
        this.esperandoTecla=true;
    };
    this.notificarMuerte = function(){
        this.vida--;
        if (this.vida>0){
            this.panel.innerHTML="No te preocupes, aun quedan naves en el hangar para seguir luchando.<br/>Presiona ENTER para atacarlos.";
        }else{
            this.panel.innerHTML="La tierra ha sido destruida tras una invasion alienigena por tu culpa.<br/>Presiona ENTER para intentarlo de nuevo.";
        }
        this.esperandoTecla=true;
    };
    /*
    this.notificarDerrota = function(){
        this.vidas --;
        if (this.vidas>0){
            this.panel.innerHTML = "No pudiste detener la lluvia de Asteroides, tu planeta a defender fue destruido. <br/>Presiona ENTER para intentar de nuevo. ";
        }else{
            this.panel.innerHTML = "No pudiste detener la lluvia de Asteroides, tu planeta a defender fue destruido. <br/>Presiona ENTER para intentarlo de nuevo.";
        }
        this.esperandoTecla=true;
    }
    */
    this.AsteroidesEscapados = function(){
        this.AsteroidesNoDestruidos ++;
        if(this.puntuacion == 0){}else{this.puntuacion -= 5;}

        if(this.AsteroidesNoDestruidos == lvl.lvAstE){  
            this.notificarMuerte();
        };
    }
    this.notificarAsteroideDestruido=function(){
        this.puntuacion += 10;
        this.AsteroidesDestruidos ++;
        if (this.AsteroidesDestruidos == lvl.lvAstD){
            this.notificarVictoria();
        }
    };
    this.intentarDisparar=function(){
        var t = new Date().getTime();
        if (t-this.ultimoDisparo < this.intervaloDisparo){
            return;
        }
        this.ultimoDisparo = t;
        this.disparo = new EntidadDisparo();
        this.disparo.constructor(this,this.nave.getX()+19, this.nave.getY());
        this.listaEntidades.push(this.disparo);
    };

    this.pulsarTecla=function(e){
        e.preventDefault();

        if (e.keyCode==32)
        {
            //espacio
            this.espacioPulsado=true;
        }
        if (this.esperandoTecla && e.keyCode==13)
        {
            //Enter
            this.empezarJuego();
            return;
        }
        if (e.keyCode==37)
        {
            //Cursor izquierdo
            this.izquierdoPulsado=true;
        }
        else if (e.keyCode==39)
        {
            //Cursor derecho
            this.derechoPulsado=true;
        }
        else if (e.keyCode==38)
        {
            //Cursor Arriba
            this.ArribaPulsado=true;
        }
        else if (e.keyCode==40)
        {
            //Cursor Abajo
            this.AbajoPulsado=true;
        }
        
    };
    
    this.soltarTecla=function(e){
        e.preventDefault();

        if (e.keyCode==32)
        {
            this.espacioPulsado=false;
        }
        else if (e.keyCode==37)
        {
            //Cursor izquierdo
            this.izquierdoPulsado=false;
            
        }
        else if (e.keyCode==39)
        {
            //Cursor derecho
            this.derechoPulsado=false;
        }
        else if (e.keyCode==38)
        {
            //Cursor Arriba
            this.ArribaPulsado=false;
        }
        else if (e.keyCode==40)
        {
            //Cursor Abajo
            this.AbajoPulsado=false;
        }
    };
	this.loop = function(){
		if(this.gameRunning){
			var delta = (new Date().getTime()) - this.tiempoTranscurrido;
			this.tiempoTranscurrido = new Date().getTime();

			this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

            var n=this.listaEntidades.length;
            if(!this.esperandoTecla){
    			for (var i = 0; i <n; i++) {
                    this.listaEntidades[i].mover(delta);
                }
            };
			for (var i = 0; i <n; i++) {
				this.listaEntidades[i].dibujar(this.ctx);
			};
			if (this.logicaRequerida)
            {
                var n=this.listaEntidades.length;
                for (var i=0;i<n;i++)
                {
                    this.listaEntidades[i].logica();
                }
                this.logicaRequerida=false;
            }
            for(var i=0;i<n-1;i++)
            {
                for(var j=i+1;j<n;j++)
                {
                    var uno=this.listaEntidades[i];
                    var otro=this.listaEntidades[j];
                    if (uno.getTipo()!=otro.getTipo() && uno.colision(otro))
                    {
                        uno.colosionadoCon(otro);
                        otro.colosionadoCon(uno);
                    }
                }
            }

            var m=this.listaEntidadesEliminar.length;
            for(var i=0;i<m;i++)
            {
                var n=this.listaEntidades.length;
                for(var j=0;j<n;j++)
                {
                    if (this.listaEntidadesEliminar[i]==this.listaEntidades[j])
                    {
                        this.listaEntidades.splice(j,1);
                        break;
                    }
                }
            }

            if (this.esperandoTecla){
                clearInterval(this.intervalo);
                this.panel.style.display = "block";    
                            
            }else{
                this.panel.style.display="none";
            }

            this.listaEntidadesEliminar=[];
            this.ctx.fillStyle="white";
            this.ctx.font = "bold 20px arial";
            this.ctx.fillText(this.puntuacion+" Puntos",20,30);
            this.ctx.fillText(this.AsteroidesDestruidos+"/15",20,60);
            this.ctx.fillText(this.vida+" Vidas",this.canvas.width-110,30);
            this.ctx.fillText(this.AsteroidesNoDestruidos+"/3",this.canvas.width-110,60);

            this.nave.setVelocidadHorizontal(0);
            if (this.izquierdoPulsado && !this.derechoPulsado)
            {
                this.nave.setVelocidadHorizontal(-this.velocidadMovimiento);
            }
            else if (!this.izquierdoPulsado && this.derechoPulsado)
            {
                this.nave.setVelocidadHorizontal(this.velocidadMovimiento);
            }
            this.nave.setVelocidadVertical(0);
            if (this.ArribaPulsado && !this.AbajoPulsado)
            {
                this.nave.setVelocidadVertical(-this.velocidadMovimiento);
            }
            else if (!this.ArribaPulsado && this.AbajoPulsado)
            {
                this.nave.setVelocidadVertical(this.velocidadMovimiento);
            }
            if (this.espacioPulsado)
            {
                this.intentarDisparar();
            }
		}
		
		
	};
	this.controlLoop = function(){
		if(this.gameRunning){
			this.loop();	
		}else{
			this.tiempoTranscurrido = new Date().getTime();
			this.gameRunning = true;
		}
        
	};
    

}