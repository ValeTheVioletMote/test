/**@typedef {{id: string, x: number, y: number, type: "text", value: string, hidden: boolean, font: string, font_px: number, color: string, align: "left" | "center" | "right"}} Floater */

var app = {
	//initial variables
	canvas  : null,
	context : null,

	//resizing
	width   : 800,
	height  : 400,

	//nodes
	nodes   : [],

	// Like nodes, but don't interact with the game (no collision checks with nodes, etc)
	// They 'float' atop it.
	/**@type{Array<Floater>} */
	floaters	: [],

	//timing
	timestamp  : 0,
	now        : 0,
	lastUpdate : 0,

	init : function(){
		this.canvas  = document.getElementById('canvas');
		this.context = this.canvas.getContext('2d');

		this.render();
		this.onInit();
	},
	render : function(){
		this.clear();
		this.update();

		window.requestAnimationFrame(this.render.bind(this));
	},
	clear  : function(){
		this.context.clearRect(0, 0, this.width, this.height);
	},
	update : function(){
	    var dt = Date.now() - this.lastUpdate;

		this.onUpdate(dt);

		for(var index in this.nodes){

			var node = this.nodes[index];
			// Assume rectangle by default
			this.context.fillStyle = node.color;
			if(node.shape == "Circle") {
				this.context.beginPath();
				this.context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
				this.context.stroke();
				this.context.fill();
				this.context.closePath();
			}else{
				this.context.fillRect(node.x, node.y, node.width, node.height);
			}
			
		}

		for (var index in this.floaters) {
			/**@type{Floater} */
			let floater = this.floaters[index];

			if(floater.type == "text" && !floater.hidden) {
				this.context.fillStyle = floater.color;
				this.context.textAlign = floater.align;
				this.context.font = floater.font_px+"px "+floater.font;
				this.context.fillText(floater.value, floater.x, floater.y);
			}
		}

		this.lastUpdate = Date.now();
		this.timestamp+=dt;
	},
	getNode : function(id){
		for(var index in this.nodes){
			var node = this.nodes[index];

			if(node.id == id){
				return node;
			}
		}

		return { x : null, y : null, width : null, height : null };
	},
	getFloater (id) {
		return this.floaters.find(f=>f.id==id) ?? /**@type{Floater}*/({x: null, y: null, value: null, align: "left", font_px: 12, font: "Arial", color: "black", type: "text"})
	},
	//events
	onInit   : function(){},
	onUpdate : function(){}
};

window.onload = function(){
	app.init();
};