
function LCL() {
	this.version = '1.2.0';
	this.objects = [1, 2];
}
LCL.prototype.method = function(first_argument) {
	console.log(first_argument);
};

var lcl = new LCL();
lcl.method('aa');