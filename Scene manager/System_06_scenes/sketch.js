let img;
let font;
let bgColor;
let stains = [];
let shapes = [];
let sceneManager;
let stainTexture;
let blurShader;
let soundManager;
let timeline;
let midiVerbose = false;
let svgShapeData;


//----------------------------------------

this.SVGScale = 0.7;
this.imageRelativeScale;

//-----------------------------------------


function preload(){
  svgShapeData = loadStrings("assets/arielfabiana.badshape");
  img = loadImage("assets/arielfabiana9.jpg");
  font = loadFont("assets/SourceCodePro-BoldItalic.ttf");
  let blurHorizontalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  let blurVerticalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  let soundFile = loadSound('assets/ariel_intro.mp3');
  soundManager = new SoundManager(soundFile);
  blurShader = new Blur(blurHorizontalShader, blurVerticalShader);
  let timecodes = loadStrings('assets/distortion.srt');
  let subs = loadStrings('assets/ariel_intro.srt');
  timeline = new Timeline(timecodes, subs);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  parseShapes(svgShapeData);
  console.log("LOADED " + shapes.length + " SHAPES");
  bg = color(0);
  sceneManager = new SceneManager();
  sceneManager.addScene(new SVGScene(shapes));
  sceneManager.addScene(new StainScene());
  blurShader.init();
  soundManager.init();
  timeline.init(soundManager.soundFile.duration());
  textFont(font);
  textSize(12); 
}

function draw() {
  timeline.update(soundManager.currentTime());
  soundManager.update(timeline.currentValue);

  

  let currentAmp = soundManager.soundFileSignal.getValueDampened();
  if(currentAmp > CONFIG.blurAmplitudeThreshold){
    blurShader.setBlurAmount(0);
  }else{
    blurShader.setBlurAmount(map(currentAmp, 0, CONFIG.blurAmplitudeThreshold, 1, 0));
  }

  sceneManager.update(currentAmp, timeline.currentValue);
  sceneManager.render();
  
  blurShader.apply(sceneManager.getCurrentTexture());
  image(blurShader.texturePass2, 0,0, width, height);
  
  renderDebug();
  if(CONFIG.renderSubtitles){
    timeline.renderSubs();
  }
}

function mouseReleased() {
}

function mousePressed(){
  soundManager.click();
}

function keyPressed() {
  if(key === 'D' || key === 'd'){
    CONFIG.renderDebug = ! CONFIG.renderDebug;
  }
  else if(key === 's' || key === 'S'){
    sceneManager.nextScene();
  }
}

