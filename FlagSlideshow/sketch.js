let imgs = [];
let index = 0;

let tempTexture;

let interval = 5000;
let lastChange = 0;

let blurShader;
let opacityControl = 1;




function preload(){
  let blurHorizontalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  let blurVerticalShader = loadShader('assets/base.vert', 'assets/blur.frag');
  for(let i = 0 ; i < 5 ; i++){
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

  blurShader.setBlurAmount(0.0);

}

function draw() {
  controlChange();
  background(255,0,0);
  tempTexture.background(0);
  tempTexture.tint(255,opacityControl*255);
  tempTexture.image(imgs[index],0,0,width,height);
  blurShader.apply(tempTexture);
  image(blurShader.getResult(), 0,0, width, height);
}


function controlChange(){
  
}