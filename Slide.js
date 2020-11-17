export function Slide(init_func){
	this.init = init_func.bind(this);
	
	this.running = false;

	this.open = function(){
		this.running = true;
		this.loop();
	}

	this.close = function(){
		this.running = false;
	}
}