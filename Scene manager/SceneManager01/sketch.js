let midiVerbose = false;

let svgShapeData;
let img;
let font;
let shapes = [];
let sceneManager;
let blurShader;

//----------------------------------------

this.SVGScale = 0.7;
this.imageRelativeScale;
let maxDisplace = 20;
let maxNoiseDisplace = 10;
let generalNoiseScale = 0.5;

//-----------------------------------------

function preload(){
  svgShapeData = loadStrings("assets/arielfabiana.badshape");
  img = loadImage("assets/arielfabiana9.jpg");
  font = loadFont("assets/SourceCodePro-BoldItalic.ttf");
  let blurHorizontalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  let blurVerticalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  // let soundFile = loadSound('assets/ariel_intro.mp3');
  // soundManager = new SoundManager(soundFile);
  blurShader = new Blur(blurHorizontalShader, blurVerticalShader);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  parseShapes(svgShapeData);
  console.log("LOADED " + shapes.length + " SHAPES");
 // initMidi();
  sceneManager = new SceneManager();
  sceneManager.addScene(new SVGScene(shapes));
  sceneManager.addScene(new StainScene());
  blurShader.init();
}

function draw() {
  background(220);
  sceneManager.update();
  sceneManager.render();


 // blurAmplitudeThreshold : 0.015,

 // image(sceneManager.getCurrentTexture(), 0, 0);

 
  blurShader.setBlurAmount(map(mouseX, 0, width, 0, 1));
  
  
  blurShader.apply(sceneManager.getCurrentTexture());
  image(blurShader.texturePass2, 0,0, width, height);


  sceneManager.renderDebugInfo();
}

function keyPressed(){
  if(key === 's' || key === 'S'){
    sceneManager.nextScene();
  }
}
  