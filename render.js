var size;
var colors;
var x;
var y;
var zoom;
var band_spacing;
var smoothing;
var use_preset=eval(prompt("Use a preset?","false"));
var preset;
if(!use_preset){
	size=eval(prompt("Size of render","625"));
	colors=eval(prompt("Colors","[[255,0,0],[255,255,0],[0,255,0],[255,255,0]]"));
	x=eval(prompt("Center X","0"));
	y=eval(prompt("Center Y","0"));
	zoom=eval(prompt("Zoom","0.5"));
	band_spacing=eval(prompt("Band spacing","0.5"));
	smoothing=eval(prompt("Band smoothing (Kind of broken)","0"));
	preset={size:size,colors:colors,x:x,y:y,zoom:zoom,band_spacing:band_spacing,smoothing:smoothing};
	prompt("You can copy these parameters out as a preset, if you want:",JSON.stringify(preset));
}else{
	preset=JSON.parse(prompt("Input your preset here:"));
	size=preset.size;
	colors=preset.colors;
	x=preset.x;
	y=preset.y;
	zoom=preset.zoom;
	band_spacing=preset.band_spacing;
	smoothing=preset.smoothing;
}
function setup() {
	createCanvas(size,size);
};
var points=[];
var row;
var iterated=false;
var x_=0;
for(var i=0;i<size;i++){
	row=[];
	for(var j=0;j<size;j++){
		row.push([0,0,0,false])
	}
	points.push(row);
}
var iteration_to_color=function(n,m){
	m=(m-2)/2;
	m=1-m;
	m*=smoothing;
	if(m<0){
		m=0;
	}
	if(m>1){
		m=1;
	}
	var n_=Math.pow(n+m,band_spacing);
	var r;
	var g;
	var b;
	var c1=colors[Math.floor(n_)%colors.length];
	var c2=colors[Math.ceil(n_)%colors.length];
	n_=n_%1;
	n_=1-n_;
	r=c1[0]*n_+c2[0]*(1-n_);
	g=c1[1]*n_+c2[1]*(1-n_);
	b=c1[2]*n_+c2[2]*(1-n_);
	return [r,g,b];
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
			if(!points[y_][x_][4]){
				points[y_][x_][4]=!points[y_][x_][4];
			}else{
				continue;
			}
			var x2=x+2*(x_-(size-1)/2)/(zoom*(size-1));
			var y2=y+2*(y_-(size-1)/2)/(zoom*(size-1));
			var x3=points[y_][x_][0];
			var y3=points[y_][x_][1];
			var m=Math.sqrt(x3*x3+y3*y3);
			stroke(iteration_to_color(points[y_][x_][2]-1,m)[0],iteration_to_color(points[y_][x_][2]-1,m)[1],iteration_to_color(points[y_][x_][2]-1,m)[2]);
			point(x_,y_);
		}
	}
	x_+=1;
	if(x_===size){
		x_=0;
	}
	//console.log(x_);
};