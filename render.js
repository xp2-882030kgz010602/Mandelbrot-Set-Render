var size=eval(prompt("Size of render","625"));
function setup() {
	createCanvas(size,size);
};
var x=eval(prompt("Center X","0"));
var y=eval(prompt("Center Y","0"));
var zoom=eval(prompt("Zoom","0.5"));
var points=[];
var row;
var iterated=false;
var x_=0;
for(var i=0;i<size;i++){
	row=[];
	for(var j=0;j<size;j++){
		row.push([0,0,0])
	}
	points.push(row);
}
var iteration_to_color=function(n){
	var n_=Math.sqrt(n);
	var r;
	var g;
	//I'm not using blue to make it more sleep-friendly.
	n_=n_%4;
	n_=Math.min(n_,4-n_);
	if(n_<=1){
		r=255;
		g=n_*255;
	}else{// if(n_>1&&n_<=2){
		r=510-n_*255;
		g=255;
	}
	return [r,g];
};
function draw() {
	for(var y_=0;y_<size;y_++){
		if(points[y_][x_][0]*points[y_][x_][0]+points[y_][x_][1]*points[y_][x_][1]<=4){
			var x2=x+2*(x_-(size-1)/2)/(zoom*(size-1));
			var y2=y+2*(y_-(size-1)/2)/(zoom*(size-1));
			var x3=points[y_][x_][0];
			var y3=points[y_][x_][1];
			//z=z^2+c
			if(iterated){
				points[y_][x_][0]=x3*x3-y3*y3+x2;
				points[y_][x_][1]=2*x3*y3+y2;
				points[y_][x_][2]+=1;
			}
			iterated=true;
			stroke(0,0,0);
			point(x_,y_);
		}else{
			stroke(iteration_to_color(points[y_][x_][2]-1)[0],iteration_to_color(points[y_][x_][2]-1)[1],0);
			point(x_,y_);
		}
	}
	x_+=1;
	if(x_===size){
		x_=0;
	}
	//console.log(x_);
};