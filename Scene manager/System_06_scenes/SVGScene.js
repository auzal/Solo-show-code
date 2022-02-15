class SVGScene{

    constructor(shapes){
        this.shapes = shapes;
        this.generalControl = 0;
        this.maxDisplace = 100;
        this.maxNoiseDisplace = 50;
        this.generalNoiseScale = 0.5;
        this.renderTexture = createGraphics(width, height, WEBGL);

    }

    render() {
        this.renderTexture.push();
        this.renderTexture.background(0);
        this.renderTexture.fill(255);
        this.renderTexture.noStroke();
        for(let i = 0 ; i < this.shapes.length ; i ++){
            this.renderShape(this.shapes[i]);          
        }
        this.renderTexture.pop();
    }

    update(amp, ramp){
        this.generalControl = ramp;
        for(let i = 0 ; i < this.shapes.length ; i ++){
            this.shapes[i].update(this.generalControl);
        }
    }

    renderShape(shape){
        //  console.log(scale);
        //  let displace = map(sin(frameCount*0.01),-1,1,0,200);
        //  displace = constrain(displace,,3);
        this.renderTexture.push();
        let control = this.generalControl;
       // let control = generalControl;
          
        let scaleOffset = 0;
        this.renderTexture.translate(shape.x , shape.y);
        // rotate(map(sin(frameCount*0.01),-1,1,0,3));
        //  fill(this.fill);
         
        this.renderTexture.stroke(255,255,0);
        this.renderTexture.noFill();
        this.renderTexture.texture(img); 
        this.renderTexture.beginShape();
        
        let noiseScale = this.generalNoiseScale;

        let noiseDisplace =  noise((shape.x + frameCount) * noiseScale, shape.y * noiseScale) * control;

        let displacement =( this.maxDisplace * control) + (noiseDisplace * this.maxNoiseDisplace);
        
        // noise((this.x + frameCount) * noiseScale, this.y 
        // * noiseScale) * control;
        
        for(let i = 0 ; i < shape.vertices.length ; i++){

            let x = shape.vertices[i].x;
            let y = shape.vertices[i].y;

            let tX = shape.x + x + (img.width/2);
            let tY = shape.y + y + (img.height/2);

            tX = constrain(tX, 0, img.width-1);
            tY = constrain(tY, 0, img.height-1);
            
            let movement = displacement;

            x += cos(shape.ang) * movement;
            y += sin(shape.ang) * movement;

            this.renderTexture.vertex(x, y, tX, tY);
           //  this.renderTexture.vertex(x, y);
        }
        this.renderTexture.endShape(CLOSE);

        this.renderTexture.pop();
    }


    getCurrentTexture(){
        return this.renderTexture;
    }

}