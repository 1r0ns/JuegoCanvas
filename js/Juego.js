/**********************************/
/* Juan Gabriel Rodríguez Carrión */
/*    jlabstudio.com       2011   */
/**********************************/

/**
* Ésta clase será la que arranque y gestione la lógica del juego, y de
* preparar el contexto gráfico donde dibujarlo. Además también se encargará
* de leer los eventos del teclado para controlar al jugador.
*
* El bucle principal del juego se encargará de hacer que cada entidad se mueva,
* y luego de que se dibuje en el lugar adecuado. También controlará los movimientos
* de la nave del jugador.
*
* Como clase mediadora, recibirá información de algunos eventos que ocurran
* (por ejemplo, la destrucción de un alien, o la muerte del jugador) y realizará
* las acciones apropiadas.
*/
function Juego(){
    //Div creado donde mostraremos los mensajes de final de partida
    this.panel;
    //El canvas en el que se va a dibujar
    this.canvas;
    //El contexto gráfico donde dibujar todo el juego
    this.ctx;
    //Lista de entidades (aliens y disparos) a gestionar
    this.listaEntidades=[];
    //Lista de entidades a eliminar en el siguiente ciclo del bucle principal
    this.listaEntidadesEliminar=[];
    //Nave del jugador
    this.nave;
    //Velocidad de movimiento horizontal del jugador (pixels/segundo)
    this.velocidadMovimiento=300;
    //Tiempo transcurrido desde el últimio disparo
    this.ultimoDisparo=0;
    //Intervalor de tiempo que tiene que pasar entre disparos en milisegundos
    this.intervaloDisparo=500;
    //El número de alines que quedan
    this.contadorAliens;
    this.AsteroidesNoDestruidos = 0;
    this.AsteroidesDestruidos = 0;
    this.disparot = false;
    
    //True si el juego está funcionando
    this.gameRunning=false;
    //True si en la siguiente ciclo del bucle debe hacerse alguna comprobación lógica
    this.logicaRequerida=false; 
    
    //True si el juego está detenido por algún motivo (game over, pantalla completada, etc)
    this.esperandoTecla=false;
    //Teclas pulsadas en un momento dado
    this.izquierdoPulsado=false;
    this.derechoPulsado=false;
    this.espacioPulsado=false;
    this.tiempoTranscurrido;
    
    this.puntuacion=0;
    this.vidas=2;

    var lvl = {
        intime: 500,
        lvAstD: 3000,
        lvAstE: 3000
    }

    this.constructor=function(idCanvas){
        //Recuperamos el contexto gráfico donde dibujar
        this.canvas=document.getElementById(idCanvas);
        this.canvas.width=500;
        this.canvas.height=600;
        this.canvas.style.backgroundColor="black";
        this.ctx=this.canvas.getContext('2d');
        
        //Creamos y posicionamos el panel de los mensajes justo encima del canvas
        this.panel=document.createElement("div");
        this.panel.style.display="none";
        this.panel.style.position="absolute";
        this.panel.style.top=this.canvas.offsetTop;
        this.panel.style.left=this.canvas.offsetLeft;
        this.panel.style.width=this.canvas.width;
        this.panel.style.height=this.canvas.height;
        this.panel.style.marginTop="250px";
        this.panel.style.textAlign="center";
        this.panel.style.color="yellow";
        this.panel.style.fontSize="x-large";
        
        document.body.appendChild(this.panel);
        this.iniciarEntidades();
    };
    
    this.getAnchuraCanvas=function(){
        return this.canvas.width;
    };
    this.getAlturaCanvas=function(){
        return this.canvas.height;
    };
    this.empezarJuego=function(){
        this.listaEntidades=[];
        this.listaEntidadesEliminar=[];
        this.iniciarEntidades();
        this.intervalo1 = setInterval("juego.IniciarAsteroide();", lvl.intime);
        this.intervalo2 = setInterval("juego.IniciarBasuraEspacial();", 3000);  
        this.izquierdoPulsado=false;
        this.derechoPulsado=false;
        this.espacioPulsado=false;
        this.AsteroidesNoDestruidos = 0;
        this.velocidadMovimiento=300;
        this.AsteroidesDestruidos = 0;
        this.tiempoTranscurrido=new Date().getTime();
        this.esperandoTecla=false;
        this.disparot = false;
        
        if(this.vidas<=0)
        {
            this.vidas=2;
            this.puntuacion=0;
        }
        
    };
    
    /**
    * Resetea las entidades al estado de inicio (nave y aliens).
    */
    this.iniciarEntidades=function(){
        //Crea la nave del jugador en el centro de la pantalla. 
        this.nave=new EntidadNave();
        this.nave.constructor(this,370,550);
        this.listaEntidades.push(this.nave);
    }; 

    this.IniciarAsteroide = function(){
        this.ast = new EntidadAsteroide();
        this.ast.constructor(this,40,25,aleatorio(10,450),0,aleatorio(0,2));
        this.listaEntidades.push(this.ast);
    };
    this.intervalo1 = setInterval("juego.IniciarAsteroide();", lvl.intime);   

    this.IniciarBasuraEspacial = function(){
        this.basura = new BasuraEspacial();
        this.basura.constructor(this,40,25,aleatorio(10,450),0,aleatorio(0,2));
        this.listaEntidades.push(this.basura);
    };
    this.intervalo2 = setInterval("juego.IniciarBasuraEspacial();", 3000);   

    this.efectoExtra = function(efecto){
        switch(efecto){
            case 1:
                var mult = this.velocidadMovimiento * 1.20 ;
                this.velocidadMovimiento = mult;
                console.log(mult);
                break;

            case 2:

                this.disparot = true;
                break;
            case 3:

                this.disparot = false;
                this.velocidadMovimiento = 300;
                console.log(this.disparot);
                console.log(this.velocidadMovimiento);
                break;
        }
        
    };
    this.AsteroidesEscapados = function(){
        this.AsteroidesNoDestruidos ++;
        if(this.puntuacion == 0){}else{this.puntuacion -= 5;}

        if(this.AsteroidesNoDestruidos == lvl.lvAstE){  
            this.notificarMuerte();
        };
    }
    /**
    * Notificaciones de las entidades del juego que requieren comprobar alguna lógica
    * del juego en la próxima oportunidad (normalmente como resultado de algún evento
    * del juego)
    */
    this.actualizaLogica=function(){
        this.logicaRequerida=true;
    };
    
    
    /**
    * Introduce en la lista de entidades a eliminar, la nueva entidad
    *
    * entidad es la entidad a eliminar
    */
    this.eliminarEntidad=function(entidad){
        this.listaEntidadesEliminar.push(entidad);
    };
    
    /**
    * Notificación de que el jugador ha muerto, y por consiguiente, perdido la partida
    */
    this.notificarMuerte=function(){
        this.vidas--;
        if (this.vidas>0)
        {
            this.panel.innerHTML="No te preocupes, aún quedan naves en el hangar para seguir luchando.<br/>Presiona ENTER para atacarlos.";
        }
        else
        {
            this.panel.innerHTML="La tierra ha sido destruida tras una invasion alienígena por tu culpa.<br/>Presiona ENTER para intentarlo de nuevo.";
        }
        this.esperandoTecla=true;
    };
    /**
    * Notificación de que el jugador ha ganado la partida
    */
    this.notificarVictoria=function(){
        this.panel.innerHTML="¡Felicidades! ¡De momento seguimos vivos, pero se acercan nuevos enemigos!<br/>Presiona ENTER para atacarlos.";
        this.esperandoTecla=true;
    };
    
    /**
    * Notificación de que un Alien ha sido alcanzado por un disparo
    */
    this.notificarAsteroideDestruido=function(){
        //Decrementamos el contador de aliens y sumamos 10 puntos.
        this.puntuacion+=10;
        this.AsteroidesDestruidos ++;
        if (this.AsteroidesDestruidos == lvl.lvAstD){
            this.notificarVictoria();
        }
    };
    
    /**
    * La nave del jugador intenta disparar. Si ha pasado tiempo suficiente desde
    * el último disparo, se procede con el nuevo.
    */
    this.intentarDisparar=function(){
        //Si estamos esperando que se pulse la tecla ENTER, es que estamos en el final de una partida
        if (this.esperandoTecla)
        {
            return;
        }
        //Comprobamos que se pueda disparar, según el tiempo transcurrido desde el último disparo
        var t=new Date().getTime();
        if (t-this.ultimoDisparo<this.intervaloDisparo)
        {
            return;
        }
        this.ultimoDisparo=t;

        if (this.disparot){
            var disparo=new EntidadDisparo();
            disparo.constructor(this,this.nave.getX(), this.nave.getY());
            this.listaEntidades.push(disparo);

            var disparo2=new EntidadDisparo();
            disparo2.constructor(this,this.nave.getX()+39, this.nave.getY());
            this.listaEntidades.push(disparo2);

        }else{
            var disparo=new EntidadDisparo();
            disparo.constructor(this,this.nave.getX()+19, this.nave.getY());
            this.listaEntidades.push(disparo);            
        }
        
    };
    
    /**
    * Bucle principal del juego
    */
    this.loop=function(){
        if (this.gameRunning)
        {
            //Calculamos el tiempo delta
            var delta=(new Date().getTime()) - this.tiempoTranscurrido;
            this.tiempoTranscurrido=new Date().getTime();
            //Borramos todo lo que haya en el canvas.
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            
            //Movemos cada entidad según el tiempo delta transcurrido
            var n=this.listaEntidades.length;
            if (!this.esperandoTecla)
            {
                for (var i=0;i<n;i++)
                {
                    this.listaEntidades[i].mover(delta);
                }
            }
            //Dibujamos todas las entidades
            for (var i=0;i<n;i++)
            {
                this.listaEntidades[i].dibujar(this.ctx);
            }
            //Detección de las colisiones de las entidades
            if (!this.esperandoTecla)
            {
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
            }
            //Eliminamos las entidades que estén en la lista a eliminar
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
            this.listaEntidadesEliminar=[];
            //Si algun alien ha llegado a algún margen del mapa, le decimos a cada alien que cambie
            //sentido de movimiento y se deplace un poco hacia abajo, según su lógica de movimientos
            if (this.logicaRequerida)
            {
                var n=this.listaEntidades.length;
                for (var i=0;i<n;i++)
                {
                    this.listaEntidades[i].logica();
                }
                this.logicaRequerida=false;
            }
            //Si se está esperando que se pulse ENTER, es que estamos en el final de una partida, y hay que mostrar
            //el panel de mensajes por HTML
            if (this.esperandoTecla)
            {

                clearInterval(this.intervalo1);
                clearInterval(this.intervalo2);
                this.panel.style.display="block";
            }
            else
            {
                this.panel.style.display="none";
            }
            
            //Dibuamos una GUI básica
            this.ctx.fillStyle="yellow";
            this.ctx.font = "bold 20px monospace";
            this.ctx.fillText(this.puntuacion+" Puntos",20,30);
            this.ctx.fillText(this.AsteroidesDestruidos+"/15",20,60);
            this.ctx.fillText(this.vidas+" Vidas",this.canvas.width-110,30);
            this.ctx.fillText(this.AsteroidesNoDestruidos+"/3",this.canvas.width-110,60);
            
            //Resolvemos los movimientos y disparos de la nave según las teclas pulsadas
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
    
    /**
    * Método de control para hacer que cuando se arranque el juego, el 
    * tiempo delta tenga un valor apropiado
    */
    this.controlLoop=function(){
        if (this.gameRunning)
        {
            this.loop();
        }
        else
        {
            this.tiempoTranscurrido=new Date().getTime();
            this.gameRunning=true;
        }
    };
    
    /**
    * Notificación de tecla pulsada
    *
    * e tecla pulsada
    */
    this.pulsarTecla=function(e){
        //Anulamos las acciones por defecto de la tecla
        e.preventDefault();

        //Si estamos en el dinal de una partida, se espera la pulsación ENTER
        if (this.esperandoTecla && e.keyCode==13)
        {
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
        else if (e.keyCode==32)
        {
            //espacio
            this.espacioPulsado=true;
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
    /**
    *
    */
    this.soltarTecla=function(e){
        e.preventDefault();
        if (e.keyCode==37)
        {
            //Cursor izquierdo
            this.izquierdoPulsado=false;
            
        }
        else if (e.keyCode==39)
        {
            //Cursor derecho
            this.derechoPulsado=false;
        }
        else if (e.keyCode==32)
        {
            //espacio
            this.espacioPulsado=false;
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
}

function aleatorio(inferior,superior){ 
    numPosibilidades = superior - inferior 
    aleat = Math.random() * numPosibilidades 
    aleat = Math.floor(aleat) 
    return parseInt(inferior) + aleat;
} 