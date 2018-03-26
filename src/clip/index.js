function clip(_this, canvas, scale) {
  if(_this.cliping) {
    const bounding = _this.getBounding();
    if(_this.cliping.column) {
      canvas.rect(bounding.lt[0], bounding.lt[1], bounding.rt[0] - bounding.lt[0], _this.boundingHeight * scale);
    } else {
      canvas.rect(bounding.lt[0], bounding.lt[1], _this.boundingWidth * scale, bounding.rb[1] - bounding.rt[1]);
    }
    canvas.clip();
  }
}

export default clip;
