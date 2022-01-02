class SVGScene{
    let shapeData;
    let shapes = [];
    let img;
    let font;

    let SVGScale = 0.7;
    let imageRelativeScale;

    let generalControl = 0;

    let midiVerbose = false;
    let maxDisplace = 0;
    let maxNoiseDisplace = 0;
    let generalNoiseScale = 0;

    function preload(){
        shapeData = loadStrings("assets/arielfabiana.badshape");
        img = loadImage("assets/arielfabiana0.jpg");
        font = loadFont("assets/SourceCodePro-BoldItalic.ttf");
        }

        function setup() {
        createCanvas(windowWidth, windowHeight, WEBGL);
        parseShapes(shapeData);
        console.log("LOADED " + shapes.length + " SHAPES");

        initMidi();

    
    }

    function draw() {
        push();
        background(0);
        //translate(width/2, height/2);
        noFill();
        stroke(255,128,0);
        // image(img,-img.width/2, -img.height/2);
        // ellipse(0,0,40,40);
        noStroke();
        for(let i = 0 ; i < shapes.length ; i ++){
        // if(i==70)
            shapes[i].render();
            shapes[i].update();
            //console.log("---")
            
        }
        for(let i = 0 ; i < shapes.length ; i ++){
        // if(i%2==0)
            //shapes[i].renderDebug();
            
        }

        let index = int(map(mouseX,0,width,0,shapes.length));
        // shapes[index].render(8);
        // shapes[index].renderDebug(8);
        stroke(255,0,0);
        //  ellipse(0,0,50,50);
        rectMode(CENTER);
        // rect(0,0,img.width, img.height);
        pop();
        renderDebugInfo();

        // texture(img);
        // beginShape();
        // vertex(0,0,0,0);
        // vertex(100,0,img.width,0);
        // vertex(100,100,img.width,img.height);
        // vertex(0,100,0,img.height);

        // endShape();
    }

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

        //  console.log(w)

        let targetHeight = height * SVGScale;
        // console.log(height);
        // console.log(targetHeight);
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

    function renderDebugInfo(){
        push();
        let w = 150;
        let h = 30;
        textFont(font);
        translate(width/2-w,height/2-h-20);
        fill(0);
        rect(0,0,w,h);
        fill(255);
        text("SHAPE COUNT: " + shapes.length, 5, 13);
        text("FPS:         " + int(frameRate()), 5, 23);
        pop();
    }   
}