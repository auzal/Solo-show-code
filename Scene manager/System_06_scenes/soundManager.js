class SoundManager{
    constructor(file){
        this.soundFile = file;
        this.amplitude;
        this.mic;
        this.micStarted = false;
        this.soundFileSignal;
        this.micSignal;

        this.reverb;
        this.filter;
        this.delay;  // maybe not this one
        this.filterResonance = 50;
        this.filterFrequency = 10000/2;
        this.reverbWetDry;
        this.delayFeedback;
        this.minResonance = 0.001;
        this.maxResonance = 50;
        this.minFrequency = 20;
        this.maxFrequency = 10000;
        this.textSize = 14;
        
    }

    init(){
        this.amplitude = new p5.Amplitude();
        this.soundFileSignal = new SignalAnalyzer(300, 100, "SOUND FILE");
        this.micSignal = new SignalAnalyzer(300, 100, "MIC");

        this.soundFile.disconnect(); // so we'll only hear reverb...

        this.reverb = new p5.Reverb();
        this.reverb.set(3,2);
   

        this.filter = new p5.BandPass();
        this.filter.res(20);
        //from 0.001 to 1000, lower means wider band
        
        this.soundFile.connect(this.filter);
        this.filter.disconnect();
        //filter.disconnect();
        //filter.connect(reverb);
        this.delay = new p5.Delay();

        //delay.process() accepts 4 parameters:
        //source, delayTime (in seconds), feedback, filter frequency
        //this.delay.process(mySound, 0.08, .7, 2300);
        //this.delay.disconnect();
        //this.delay.setType(1);
        this.reverb.process(this.filter, 3, 2);
        console.log("Sound duration " + this.soundFile.duration());
    }

    update(control){
        if(this.micStarted){
            this.micSignal.update(this.mic.getLevel());    
        }
        if(this.soundFile.isPlaying()){
            this.soundFileSignal.update(this.amplitude.getLevel());
        }

        let vol = map(control, 0, 1, 0.3, 2.5); // compensate for filter loss of volume
        this.soundFile.setVolume(vol);

        let reverbNoise = noise(frameCount*0.05);                                                       // HARD CODED !!!!!!!!!
        this.reverbWetDry = map(reverbNoise, 0, 1, 0.2, 0.4) * map(control,0,1,0.3,1);                                 // HARD CODED !!!!!!!!!
        this.reverbWetDry = constrain(this.reverbWetDry, 0, 1);
        // 1 = all reverb, 0 = no reverb
        this.reverb.drywet(this.reverbWetDry);

        // kill reverb for now
      //  this.reverb.drywet(0);

        // set the BandPass frequency based on mouseX
        let frequencyNoise = noise(0,frameCount*0.1); 
        this.filterFrequency = map(frequencyNoise, 0, 1,80/2, 300*2);                                       // HARD CODED !!!!!!!!!
        this.filterFrequency = constrain(this.filterFrequency, 0, 22050);   
        this.filter.freq(this.filterFrequency);
        //  give the filter a narrow band (lower res = wider bandpass)
        this.filterResonance = map(control, 0, 1, this.minResonance, 5.5);                              // HARD CODED !!!!!!!!!
        this.filter.res(this.filterResonance);
    }

    startFilePlayback(){
        if(!this.soundFile.isPlaying()){
            this.soundFile.play();
            //this.soundFile.setLoop(true);
            this.amplitude = new p5.Amplitude();
            this.amplitude.setInput(this.soundFile);
        }
    }

    startMic(){        
        if(!this.micStarted){
            userStartAudio();
            this.mic = new p5.AudioIn();
            this.mic.start();
            this.mic.amp(3.0);
            this.micStarted = true;
        }
    }

    renderSignals(){
        this.soundFileSignal.render(20, height-120);
        this.micSignal.render(20,height-230);
    }

    currentTime(){
        return this.soundFile.currentTime();
    }

    click(){
        if(!this.soundFile.isPlaying()){     
            this.startFilePlayback();
        }else{
            this.soundFile.pause();
        }
        this.startMic();
    }

    renderFilter(){
        let w = 300;
        let h = 100;
        push();
        textSize(this.textSize);
        translate(20,height-350);
        fill(10,128);
        noStroke();
        rect(0,0,w,h);
        noFill();
        stroke(255);
        let x = map(this.filterFrequency, this.minFrequency, this.maxFrequency, 0, w);
        push();
        translate(x, h*.4);
        line(0,-3,0,3);
        pop();
        let bandWidth = map(this.filterResonance, this.minResonance, this.maxResonance, w, 0); 
        bandWidth = constrain(bandWidth,10,w);
        fill(255,255,200,60);
        beginShape();
        vertex(0,h);
        vertex(constrain(x-bandWidth/2,0,w),h);
        vertex(constrain(x-bandWidth/2 + 5,0,w),h*.4);
        vertex(constrain(x+bandWidth/2 - 5,0,w),h*.4);
        vertex(constrain(x+bandWidth/2,0,w),h);
        vertex(w,h);
        endShape();
        fill(255);
        noStroke();
        textAlign(LEFT, TOP);
        text("FILTER", 0, 0);
        text(this.minFrequency + "Hz", 0, h*.4);
        textAlign(RIGHT, TOP);
        text(this.maxFrequency + "Hz", w, h*.4);
        textAlign(CENTER, CENTER);
        fill(255,100,100);
        text(int(this.filterFrequency) + "Hz", x, h*.4 - this.textSize);
        text("RES: " + nfc(this.filterResonance,3), x, h*.6  +3 );
        pop();
    }

    renderReverb(){
        let w = 300;
        let h = 50;
        push();
        textSize(this.textSize);
        translate(20,height-420);
        fill(10,128);
        noStroke();
        rect(0,0,w,h);
        noFill();
        stroke(255);
        let x = map(this.reverbWetDry, 0, 1, 0, w);
        line(0,h-3,w,h-3);
        push();
        translate(x, h);
        fill(255,255,200);
        beginShape();
        vertex(0,0);
        vertex(-3,-3);
        vertex(-3,-10);
        vertex(3, -10);
        vertex(3, -3);
        endShape(CLOSE);
       
        pop();
        fill(255);
        noStroke();
        textAlign(LEFT, TOP);
        text("REVERB", 0, 0);
        textAlign(LEFT, BOTTOM);
        text("DRY", 0, h-3);
        textAlign(RIGHT, BOTTOM);
        text("WET", w, h-3);
        textAlign(CENTER, CENTER);
        fill(255,100,100);
        text(int(this.reverbWetDry*100) + "%", x, h - this.textSize*2);
        pop();
    }
}