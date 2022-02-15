class Timeline{

    constructor(file, subs){
        this.timeCodes = [];
        this.keyFrames = [];
        this.data = file;
        this.subsData = subs;
        this.subs = [];
        this.duration;
        this.position = 0;
        this.currentValue = 0;
        this.width;
        this.height;
        this.margin = 20;
        this.transitionTime = CONFIG.timelineTransitionTime;
        this.textSize = 14;
        
    }

    init(duration){
        this.duration = duration;
        this.parseData();
        this.createKeyFrames();
        this.parseSubtitles();
        this.width = width - this.margin * 2;
        this.height = 100;
    }

    renderSubs(){
        push();
        textSize(CONFIG.subsSize)
        fill(255,255,200);
        stroke(0);
        strokeWeight(3);
        let t = "";
        for(let i = 0 ; i < this.subs.length ; i++){
            
            let start = this.subs[i].start;
            let end = this.subs[i].end;
            
            if(this.position > start && this.position < end){
                t = this.subs[i].text;
                break;
            }
        }
        textAlign(CENTER);
        rectMode(CENTER);
        translate(width/2, height);
        text(t, 0, 0, width*.5, height*.3);
        pop();
    }

    render(){
        push();
        textSize(this.textSize);
        translate(this.margin, this.margin);
        fill(10,128);
        noStroke();
        rect(0,0,this.width, this.height);
        noStroke();
        fill(255);
        textAlign(LEFT, TOP);
        text("TIMELINE", 0, 0);
        stroke(255,255,100);
        let playHeadX = map(this.position, 0, this.duration, 0, this.width);
        line(playHeadX, 0, playHeadX, this.height);
        let valueY = map(this.currentValue, 0, 1, this.height, this.height * 0.4);
        noFill();
        ellipse(playHeadX, valueY, 7, 7);
        line(playHeadX - 5, valueY, playHeadX + 5, valueY);
        
        noStroke();
        textAlign(CENTER, CENTER);
        let textW = textWidth(nfc(this.position,2));
        fill(0,128);
        rectMode(CENTER);
        rect(playHeadX, this.textSize * 1.5 + this.textSize*0.2, textW, this.textSize*1);
        fill(255);
        text(nfc(this.position,2), playHeadX, this.textSize * 1.5);
        fill(0,128);
        textW = textWidth(nfc(this.position,2));
        rect(playHeadX, this.textSize * 3.5 + this.textSize*0.2, textW, this.textSize*1);
        fill(255,100,100);
        text(nfc(this.currentValue,2), playHeadX, this.textSize * 3.5);
        this.renderCurve();
        this.renderSubsLine();
        pop();
    }

    renderSubsLine(){
        push();
        stroke(255,255,0, 128);
        strokeWeight(2);
       
        for(let i = 0 ; i < this.subs.length ; i++){
            //console.log("a");
            let start = this.subs[i].start;
            let end = this.subs[i].end;
            start = map(start, 0, this.duration, 0, width);
            end = map(end, 0, this.duration, 0, width);
            line(start,this.height - 5, end, this.height - 5);
        }
        pop();
    }

    renderCurve(){
        stroke(255);
        noFill();
        beginShape();
        let yPeak = this.height * 0.4;
        for(let i = 0 ; i < this.keyFrames.length ; i++){
            let x = map(this.keyFrames[i].time, 0, this.duration, 0, this.width);
            let y = map(this.keyFrames[i].val, 0, 1, this.height, yPeak);
            vertex(x, y);
            ellipse(x,y,4,4);

        }
        endShape();
    }
    

    update(position){
        this.position = position;
        let currentNode = 0;
        for(let i = 0 ; i < this.keyFrames.length -1 ; i++){
            if(this.position > this.keyFrames[i].time && this.position < this.keyFrames[i+1].time){
                currentNode = i;
                break;
            }
        }
        let innerTime = this.position - this.keyFrames[currentNode].time;
        let interval = this.keyFrames[currentNode + 1].time - this.keyFrames[currentNode].time;
        this.currentValue = lerp(this.keyFrames[currentNode].val, this.keyFrames[currentNode+1].val, innerTime/interval);
                
    }

    parseData(){


        for(let i = 0 ; i < this.data.length -3 ; i+=4){
            let timeData = this.data[i+1];
            let text = this.data[i+2];
           // console.log(timeData);
            let times = timeData.split(" --> ");
            let start = this.getTimeInSeconds(times[0]);
            let end = this.getTimeInSeconds(times[1]);
          //  console.log("aaa");
            console.log(text);
            this.addTimeCode(start, "ON", parseFloat(text)); 
            this.addTimeCode(end, "OFF",  0); 
           
        }
       
        console.log(this.timeCodes);
    }

    addTimeCode(time, type, val){
        this.timeCodes.push({time : time, val : val});
        
    }

    checkLast(){
        if(this.timeCodes[this.timeCodes.length-1].type === 1){
            this.timeCodes.push({time : this.duration, val : 0});
        }
    }

    createKeyFrames(){
        this.keyFrames.push({time : 0, val : 0});
        for(let i = 0 ; i < this.timeCodes.length -1 ; i++){
            if(this.timeCodes[i].val > 0){ // createFadeIn
                let time = this.timeCodes[i].time;
                let val = this.timeCodes[i].val;
                let nextTime = this.timeCodes[i+1].time;
                let transitionTime = this.transitionTime;
                transitionTime = constrain(transitionTime, 0, (nextTime - time)/2);
                this.keyFrames.push({time : time, val : 0});
                this.keyFrames.push({time : time + transitionTime, val : val});
                this.keyFrames.push({time : nextTime - transitionTime, val : val});
                this.keyFrames.push({time : nextTime, val : 0});
                i++;
            }

        }
        this.keyFrames.push({time : this.duration, val : 0});
    }

    parseSubtitles(){
        this.subs = [];
        for(let i = 0 ; i < this.subsData.length -3 ; i+=4){
            let timeData = this.subsData[i+1];
            let text = this.subsData[i+2];
           // console.log(timeData);
            let times = timeData.split(" --> ");
            let start = this.getTimeInSeconds(times[0]);
            let end = this.getTimeInSeconds(times[1]);
           // console.log(start);
           // console.log(end);
            this.subs.push({start : start, end : end, text : text});
        }
    }

    getTimeInSeconds(time){
        // expects string in "00:00:11,275" format
        let times = time.split(":");
        let hoursInSeconds = int(times[0]) * 60 * 60;
        let minutesInSeconds = int(times[1]) * 60;
        let secondsRaw = times[2].split(",");
        let seconds = int(secondsRaw[0]) + int(secondsRaw[1])/1000;
        return(hoursInSeconds + minutesInSeconds + seconds);

    }

}