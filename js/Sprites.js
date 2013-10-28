/**********************************/
/* Juan Gabriel Rodríguez Carrión */
/*    jlabstudio.com       2011   */
/**********************************/

/**
 * Esta clase es el almacén de imágenes de nuestro juego.
 * Seguiremos una simulación de patrón singleton muy simplificado
*/

function SpritesClase(){
	//La lista de objetos Image
	this.lista=[];
	
	/**
	* Este método devolverá un puntero a la imagen cuya SRC coincida con
	* la ruta que nos solicitan.
	*
	* ruta es la SRC de la imagen solicitada
	*/
	this.get=function(ruta){
		var img;
		for (var i=0;i<this.lista.lenght;i++)
		{
			img=this.lista[i];
			if (img.src==ruta)
			{
				return img;
			}
		}
		img=new Image();
		img.src=ruta;
		this.lista.push(img);
		return img;
	};
}
//Creamos una instancia de la clase Sprite, que será global a todo el programa
//No es exactamente un Singleton, pero la idea y la forma de uso es la misma.
var Sprites = new SpritesClase();