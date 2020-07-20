var size;
var colors;
var x;
var y;
var zoom;
var band_spacing;
var smoothing;
var use_preset=eval(prompt("Use a preset?","false"));
var algorithm;
var threshold;
var preset;
if(!use_preset){
	size=eval(prompt("Size of render","625"));
	colors=eval(prompt("Colors","[[255,0,0],[255,255,0],[0,255,0],[255,255,0]]"));
	x=prompt("Center X","0");
	y=prompt("Center Y","0");
	zoom=prompt("Zoom","0.5");
	band_spacing=prompt("Band spacing","0.5");
	smoothing=prompt("Band smoothing (Kind of broken)","0");
	threshold=prompt("Escape Threshold","2");
	algorithm=prompt("[ADVANCED SETTING] Algorithm","algorithm=function(xpos,ypos,x,y){return [x*x-y*y+xpos,2*x*y+ypos];}");
	preset={size:size,colors:colors,x:x,y:y,zoom:zoom,band_spacing:band_spacing,smoothing:smoothing,threshold:threshold,algorithm:algorithm};
	prompt("You can copy these parameters out as a preset, if you want:",JSON.stringify(preset));
	x=eval(x);
	y=eval(y);
	zoom=eval(zoom);
	band_spacing=eval(band_spacing);
	smoothing=eval(smoothing);
	threshold=eval(threshold);
	algorithm=eval(algorithm);
}else{
	preset=JSON.parse(prompt("Input your preset here:"));
	size=eval(preset.size);
	colors=preset.colors;
	x=eval(preset.x);
	y=eval(preset.y);
	zoom=eval(preset.zoom);
	band_spacing=eval(preset.band_spacing);
	smoothing=eval(preset.smoothing);
	if(!preset.threshold){
		threshold=2;
	}else{
		threshold=eval(preset.threshold);
	}
	if(!preset.algorithm){
		algorithm=function(xpos,ypos,x,y){
			return [x*x-y*y+xpos,2*x*y+ypos];
		};
	}else{
		algorithm=eval(preset.algorithm);
	}
}
y=-y;//Y goes down on a canvas, I don't know why
var speed=eval(prompt("How many points to iterate through per frame?",size));
var points=[];
var row;
var iterated=false;
var create_pixel=function(x,y,x_,y_){
	return {origx:x,origy:y,x:0,y:0,canvasx:x_,canvasy:y_};
};
function setup() {
	createCanvas(size,size);
	background(0);
	for(var x_=0;x_<size;x_++){
		for(var y_=0;y_<size;y_++){
			var x2=x+2*(x_-(size-1)/2)/(zoom*(size-1));
			var y2=y+2*(y_-(size-1)/2)/(zoom*(size-1));
			points.push(create_pixel(x2,y2,x_,y_));
		}
	}
};
/*for(var i=0;i<size;i++){
	row=[];
	for(var j=0;j<size;j++){
		row.push([0,0,0,false])
	}
	points.push(row);
}*/
var iteration_to_color=function(n,m){
	m=(m-threshold)/threshold/(threshold-1);
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
var counter=0;
var iterations=0;
function draw() {
	for(var i=0;i<speed;i++){
		if(counter>=points.length){
			counter=0;
			iterations+=1;
		}
		var point_=points[counter];
		var m=Math.sqrt(point_.x*point_.x+point_.y*point_.y);
		if(m>threshold){
			var color_=iteration_to_color(iterations,m);
			stroke(color_[0],color_[1],color_[2]);
			point(point_.canvasx,point_.canvasy);
			points.splice(counter,1);
			continue;
		}
		var xpos=point_.origx;
		var ypos=point_.origy;
		var x2=point_.x;
		var y2=point_.y;
		var newpos=algorithm(xpos,ypos,x2,y2);
		points[counter].x=newpos[0];
		points[counter].y=newpos[1];
		/*var x2=point_.x*point_.x-point_.y*point_.y+xpos;
		var y2=2*point_.x*point_.y+ypos;
		points[counter].x=x2;
		points[counter].y=y2;*/
		counter+=1;
	}	
	/*for(var y_=0;y_<size;y_++){
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
	}*/
	//console.log(x_);
};
function mouseReleased(){
        if(mouseX<0||mouseY<0||mouseX>size||mouseY>size){
                return;
        }
        if(!eval(prompt("Do you want to save your render? Microsoft Edge allows you to save straight from canvas, but other browsers require you to create an image before it can be saved.","true"))){
                return;
        }
        alert("Creating image that you can right-click/long-press to save. This might take a while.");
        document.getElementById("an_image").src=document.getElementById("defaultCanvas0").toDataURL();
};