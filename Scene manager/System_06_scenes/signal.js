class SignalAnalyzer{

    constructor(w, h, id){
        this.width = w;
        this.height = h;
        this.history = [];
        this.historyDampened = [];
        this.currentValue = 0;
        this.currentValueDampened = 0;
        this.historyLength = int(w);
        this.dampenFactor = CONFIG.signalDampenFactor;
        this.id = id;
        this.textSize = 14;
        this.yScaleFactor = 2;
    }

    update(newValue){
        this.history.push(newValue);
        let newDamp = 0;
        if(this.history.length > 1){
            newDamp = (this.dampenFactor*newValue) + ((1-this.dampenFactor) * this.historyDampened[this.historyDampened.length-1]);  
        }
        this.historyDampened.push(newDamp);
       
        this.currentValue = newValue;
        this.currentValueDampened = newDamp;
    
        if(this.history.length > this.historyLength){
            this.history.splice(0,1);
            this.historyDampened.splice(0,1);
        }
    }

    getValue(){
        return this.currentValue;
    }

    getValueDampened(){
        return this.currentValueDampened;
    }

    render(x, y){
        push();
        translate(x,y);
        textSize(this.textSize);
        fill(10,128);
        noStroke();
        rect(0,0,this.width, this.height);
        noFill();
        push();
        translate(this.width, this.height);  
        stroke(255,40);
        line(0,0,-this.width,0);
        push();
        stroke(255,100,100);
        translate(-this.history.length, 0);
        for(let i = 0 ; i < this.history.length - 1 ; i++){
            let x1 = i;
            let y1 = -constrain(this.history[i] * this.height * this.yScaleFactor, 0, this.height);
            let x2 = (i + 1);
            let y2 = -constrain(this.history[i+1] * this.height * this.yScaleFactor, 0, this.height);
            line(x1,y1,x2,y2);
        }
        pop();
        push();
        stroke(255,255,100);
        translate(-this.historyDampened.length, 0);
        for(let i = 0 ; i < this.historyDampened.length - 1 ; i++){
            let x1 = i;
            let y1 = -constrain(this.historyDampened[i] * this.height * this.yScaleFactor, 0, this.height);
            let x2 = (i + 1);
            let y2 = -constrain(this.historyDampened[i+1] * this.height * this.yScaleFactor, 0, this.height);
            line(x1,y1,x2,y2);
        }
        pop();
        pop();
        fill(255);
        noStroke();
        textAlign(LEFT, TOP);
        text(this.id + " (f " + this.dampenFactor + ")", 0, 0);
        textAlign(RIGHT, TOP);
        fill(255,255,100);
        if(this.historyDampened.length > 0){
            let s = nfc(this.historyDampened[this.historyDampened.length-1],3);
            text(s, this.width, this.textSize*1);
        }
        fill(255,100,100);
        if(this.history.length > 0){
            let s = nfc(this.history[this.history.length-1],3);
            text(s, this.width, 0);
        }
        pop();
    }
}