class StainScene{

    constructor(){
        this.generalControl = 1;
        this.maxDisplace = 0;
        this.maxNoiseDisplace = 0;
        this.generalNoiseScale = 0;
        this.renderTexture = createGraphics(width, height);
        this.stains = [];
        this.targetStainCount = 150;

    }

    render() {
        this.renderTexture.push();
       // this.renderTexture.background(0);
        this.renderTexture.translate(this.renderTexture.width/2- img.width/2, this.renderTexture.height/2 - img.height/2);
      
        for (let i = 0; i < this.stains.length; i++) {
            this.stains[i].render(this.renderTexture);
        }
        this.renderTexture.pop();
    }

    update(){
        
        for (let i = 0; i < this.stains.length; i++) {
            this.stains[i].update();
        }

        if(this.stains.length < this.targetStainCount){
            let difference = this.targetStainCount - this.stains.length;
            for (let i = 0; i < difference; i++) {
                let aux = new Stain(random(img.width), random(img.height), this.generalControl);
                this.stains.push(aux);
                }
        }
    
        for(let i = this.stains.length-1 ; i > 0 ; i--){
            if(!this.stains[i].growing){
                this.stains.splice(i,1);
            }
        }
    }

    getCurrentTexture(){
        return this.renderTexture;
    }

}