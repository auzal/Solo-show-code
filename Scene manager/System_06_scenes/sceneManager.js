class SceneManager{

    constructor(){
        this.scenes = [];
        this.index = 0;
    }

    render(){
        if(this.scenes.length >= this.index){
            this.scenes[this.index].render();
        }
    }

    update(amp, ramp){
        if(this.scenes.length >= this.index){
            this.scenes[this.index].update(amp, ramp);
        }
    }

    addScene(scene){
        this.scenes.push(scene);
    }

    getCurrentTexture(){
        return this.scenes[this.index].getCurrentTexture();
    }

    renderDebugInfo(){
        push();
        let w = 150;
        let h = 30;
        textFont(font);
        translate(width-w,height-h-20);
        fill(0);
        rect(0,0,w,h);
        fill(255);
        text("SHAPE COUNT: " + shapes.length, 5, 13);
        text("FPS:         " + int(frameRate()), 5, 23);
        pop();
    }   

    nextScene(){
        if(this.scenes.length > 1){
            this.index++;
            if(this.index > this.scenes.length -1){
                this.index = 0;
            }
        }
    }
}