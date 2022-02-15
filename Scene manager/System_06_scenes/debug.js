
function renderDebug(){
    if(CONFIG.renderDebug){
        renderStainInfo();
        soundManager.renderSignals();
        soundManager.renderFilter();
        soundManager.renderReverb();
        timeline.render();
    }
  }
  
  function renderStainInfo(){
    push();
    let w = 150;
    let h = 30;
    translate(width-w,height-h-20);
    fill(0);
    rect(0,0,w,h);
    fill(255);
    text("STAIN COUNT: " + stains.length, 5, 13);
    text("FPS:         " + int(frameRate()), 5, 23);
    pop();
  }