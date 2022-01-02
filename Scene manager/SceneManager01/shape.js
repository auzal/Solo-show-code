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
    }

    addVertex(x,y){
        this.vertices.push(createVector(x,y));
     //   this.process();
    }

    setFill(f){
        this.fill = f;
    }

    update(){
        if(generalControl === 0){
            this.ang = random(TWO_PI);
        }
    }
    
    render(){
      //  console.log(scale);
       // let displace = map(sin(frameCount*0.01),-1,1,0,200);
       // displace = constrain(displace,,3);
        push();
     //   let control = map(sin(frameCount*0.01),-1,1,0,1); 
        let control = generalControl;
        
        let scaleOffset = 0;
        translate(this.x , this.y);
       // rotate(map(sin(frameCount*0.01),-1,1,0,3));
      //  fill(this.fill);
       
        stroke(255,255,0);
        noFill();
        texture(img); 
        beginShape();
       
        let noiseScale = generalNoiseScale;

        let noiseDisplace =  noise((this.x + frameCount) * noiseScale, this.y 
         * noiseScale) * control;

        let displacement =( maxDisplace * control
         ) + (noiseDisplace * maxNoiseDisplace);
        
        // noise((this.x + frameCount) * noiseScale, this.y 
        // * noiseScale) * control;
       
       
        for(let i = 0 ; i < this.vertices.length ; i++){

            let x = this.vertices[i].x;
            let y = this.vertices[i].y;

            let tX = this.x + x + (img.width/2);
            let tY = this.y + y + (img.height/2);

            tX = constrain(tX, 0, img.width-1);
            tY = constrain(tY, 0, img.height-1);


           // console.log(tX + ", " + tY) 
           
          //  let ang = atan2(y,  x);

           //  let ang = atan2(this.y, this.x);

            
            
           
            let movement = displacement;

            x += cos(this.ang) * movement;
            y += sin(this.ang) * movement;

            // push();
            // translate(x,y);
            // rotate(ang);
            // stroke(255,0,0);
            // line(0,0,10,0);    
            // pop();

            if(tY < 0 || tY > img.height){
                console.log("a");
            }
          


           vertex(x, y, tX, tY);
         // vertex(x, y   );
        }
        endShape(CLOSE);

        pop();

        noLoop
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
     //   console.log(this.x);

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