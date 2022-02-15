function handleStains(control){
    stainTexture.push();
    stainTexture.translate(stainTexture.width/2- img.width/2, stainTexture.height/2 - img.height/2);
    for (let i = 0; i < stains.length; i++) {
        stains[i].update();
        stains[i].render(stainTexture);
    }
    stainTexture.pop();

    if(stains.length < CONFIG.targetStainCount){
        let difference = CONFIG.targetStainCount - stains.length;
        for (let i = 0; i < difference; i++) {
            let aux = new Stain(random(img.width), random(img.height), control);
                stains.push(aux);
            }
    }

    for(let i = stains.length-1 ; i > 0 ; i--){
        if(!stains[i].growing){
            stains.splice(i,1);
        }
    }

    
}