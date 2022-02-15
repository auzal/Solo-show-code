class Shape{

    constructor(fill, vertices){
        this.x = 0 ;
        this.y = 0 ;
        this.z = 0 ;
        this.width = 0;
        this.height = 0;
        this.vertices = vertices;
        this.fill = fill;
        this.process();
        this.noiseOffset = random(0,500);
        this.ang = random(TWO_PI);
        this.angChangeFlag = false;
    }

    addVertex(x,y){
        this.vertices.push(createVector(x,y));
    }

    setFill(f){
        this.fill = f;
    }

    update(generalControl){
        // if(generalControl === 0){
        //     if(!this.angChangeFlag){
        //         this.ang = random(TWO_PI);
        //         this.angChangeFlag = true;
        //     }
        // }else{
        //     this.angChangeFlag = false;
        // }
    }
    
    render(){
        push();
        stroke(255,255,0);
        noFill();
        beginShape();
        for(let i = 0 ; i < this.vertices.length ; i++){
            let x = this.vertices[i].x;
            let y = this.vertices[i].y;
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    renderDebug(){
        push();
        rectMode(CENTER);
        stroke(255,128,0,90);
        noFill();
        translate(this.x , this.y );
        ellipse(0,0,2,2);
        rect(0,0,this.width,this.height);
        pop();
    }

    process(){
        let west = this.vertices[0].x;
        let east = this.vertices[0].x;
        let north = this.vertices[0].y;
        let south = this.vertices[0].y;
        for(let i = 0 ; i < this.vertices.length ; i++){
            let x = this.vertices[i].x;
            let y = this.vertices[i].y;
            if(x <= west){
                west = x;
            }else if(x > east){
                east = x;
            }
            if(y <= north){
                north = y;
            }else if(y > south){
                south = y;
            }
        }
        this.width = east - west;
        this.height = south - north;
        this.x = east-  (this.width/2);
        this.y = south - (this.height/2);
        for(let i = 0 ; i < this.vertices.length ; i++){
            this.vertices[i].x -= this.x;
            this.vertices[i].y -= this.y;
        }

    }

    adjustScale(scale){
        this.x *= scale;
        this.y *= scale;
        this.width *= scale;
        this.height *= scale;
        for(let i = 0 ; i < this.vertices.length ; i++){
            this.vertices[i].x *= scale;
            this.vertices[i].y *= scale;
        }
    }
}

//-----------------------------------------------------

function parseShapes(data){

    let north;
    let south;
    let east;
    let west;
    let init = false;
  
    let points = [];
    let fill = "";
    for(let i = 0 ; i < data.length ; i++){
        if(data[i] === "---"){
        if(points.length > 0){
            createShape(fill, points);
        }
        points = [];
        i++;
        fill = '#'+data[i];
        // console.log(fill);
        }else if(data[i].includes(',')){
        let coords = data[i].split(',');
        let x = parseFloat(coords[0]);
        let y = parseFloat(coords[1]);
        points.push(createVector(x,y));
  
        if(!init){
            north = y;
            south = y;
            west = x;
            east = x;
            init = true;
        }else{
            if(y < north){
            north = y;
            }else if(y > south){
            south = y;
            }
  
            if(x < west){
            west = x;
            }else if(x > east){
            east = x;
            }
        }
        }
    }
    if(points.length > 0){
      createShape(fill, points);
    }
  
    let h = south - north;
    let w = east - west;
  
    let targetHeight = height * SVGScale;
  
    let tempScale = targetHeight/h;
  
    if(w * tempScale > width * SVGScale){
        tempScale = height / targetHeight;
    }
  
    SVGScale = tempScale;
    console.log("SCALE : " + SVGScale);
  
    img.resize(0, h * SVGScale);
  
    for(let i = 0 ; i < shapes.length ; i++){
        shapes[i].adjustScale(SVGScale);
    }
  } 
  
  function createShape(fill, points){
    shapes.push(new Shape(fill, points));
  }