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

    update(){
        if(this.scenes.length >= this.index){
            this.scenes[this.index].render();
        }
    }

    addScene(scene){
        this.scenes.push(scene);
    }

    getCurrentTexture(){
        return this.scenes[this.index].getCurrentTexture();
    }
}