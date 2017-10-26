export class ImageLoader {

  constructor() {
    this.imageList = [];
    this.loadNum = 0;
  }

  ready(callback) {
    this.imageList.forEach(img => {
      this.loadImg(img);
    });
    const timer = setInterval(() => {
      if(this.loadNum === this.imageList.length){
        clearInterval(timer);
        callback && callback();
      }
    }, 50);
  }

  loadImg(img) {
    const timer = setInterval(() => {
      if(img.complete === true){
        this.loadNum++;
        clearInterval(timer);
      }
    }, 50);
  }

  addImg(imageArray) {
    imageArray.forEach((src) => {
      let img = new Image();
      img.src = src;
      img.name = src;
      img.loaded = false;
      this.imageList.push(img);
    });
  }

  getImg(name) {
    let target;
    this.imageList.forEach((img) => {
      if(img.name == name){
        target = img;
      }
    });
    return target;
  }

}