class Blur{

    constructor(HShader, VShader){
        this.horizontalShader = HShader;
        this.verticalShader = VShader;
        this.texturePass1;
        this.texturePass2; 
        this.blurAmount;
        this.maxBlur = 4.0;
    }

    init(){
        this.texturePass1 = createGraphics(width, height, WEBGL);
        this.texturePass2 = createGraphics(width, height, WEBGL);
        this.blurAmount = 0;
        this.texturePass1.noStroke();
        this.texturePass2.noStroke();
    }

    setBlurAmount(val){  // 0 to 1
        this.blurAmount = val;
    }

    apply(originalTexture){
        let minVertical = ((1.0/height) * this.maxBlur) * 0.05;
        let minHorizontal = ((1.0/width)*  this.maxBlur) * 0.05;
        let texelVertical = map(this.blurAmount, 0, 1, minVertical, (1.0/height) * this.maxBlur);
        let texelHorizontal = map(this.blurAmount, 0, 1, minHorizontal, (1.0/width) *  this.maxBlur);
        this.texturePass1.shader(this.horizontalShader);

        this.horizontalShader.setUniform('tex0', originalTexture);
        this.horizontalShader.setUniform('texelSize', [texelHorizontal, texelVertical]);
        this.horizontalShader.setUniform('direction', [1.0, 0.0]);

        this.texturePass1.rect(0,0, this.texturePass1.width, this.texturePass1.height);
        
        this.texturePass2.shader(this.verticalShader);

        this.verticalShader.setUniform('tex0', this.texturePass1);
        this.verticalShader.setUniform('texelSize', [texelHorizontal, texelVertical]);
        this.verticalShader.setUniform('direction', [0.0, 1.0]);

        this.texturePass2.rect(0,0,this.texturePass2.width, this.texturePass2.height);
    }


    getResult(){
        return(this.texturePass2);
    }

}