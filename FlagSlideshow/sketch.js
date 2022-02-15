let imgs = [];
let index = 0;

let tempTexture;

let interval = 5000;
let fadeTime = 2000;
let lastChange = 0;

let blurShader;
let opacityControl = 1;
let blurControl = 0;




function preload(){
  let blurHorizontalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  let blurVerticalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  for(let i = 0 ; i < 11 ; i++){
    let filename = "assets/slide_" + (i+1) + ".jpg";
    imgs[i] = loadImage(filename);
  }
  blurShader = new Blur(blurHorizontalShader, blurVerticalShader);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  tempTexture = createGraphics(width,height);
  lastChange = millis();
  blurShader.init();

  blurShader.setBlurAmount(blurControl);
  fadeTime = constrain(fadeTime,0,interval/2);
  console.log("loaded " + imgs.length + " images");
}

function draw() {
  controlChange();
  blurShader.setBlurAmount(blurControl);
  background(255,0,0);
  tempTexture.background(0);
  tempTexture.tint(255,opacityControl*255);
  tempTexture.image(imgs[index],0,0,width,height);
  blurShader.apply(tempTexture);
  image(blurShader.getResult(), 0,0, width, height);
}


function controlChange(){
  if(millis() - lastChange > interval){
    index ++;
    index = index % imgs.length;
    lastChange = millis();
    opacityControl = 0;
  }

  if(millis() - lastChange < fadeTime){
    opacityControl = map(millis() - lastChange, 0, fadeTime, 0, 1);
  }else if(millis() - lastChange > interval - fadeTime){
    opacityControl = map(millis() - lastChange, interval - fadeTime, interval, 1, 0);
  }

  blurControl = (1-opacityControl) * .5;

}