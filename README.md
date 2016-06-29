# datepicker
jQuery日历选择插件

#### jQuery插件制作
```
$.fn.datePicker = function(options){
	new DatePicker(this, options);
	return this;
}
```

#### 创建日历插件构造函数
```
function DatePicker(){
	this.$ele = $ele; // 点击出现日历的元素
	this.judge(options); 
	// 判断当前页面是否存在datepicker
	// 判断时，如果点击该元素并且页面中没有datepicker就创建
	// 同时将位置参数合并到options中传递给init，然后再执行初始化init函数渲染日历
	// 如果现在页面中有datepicker，点击页面其他地方日历消失
}
```

#### 初始化工作
* 创建整个的日历框架
* 根据当时的日期来渲染整个日历
```
function init(options){
	createMainEle.call(this, options);
	this.renderByDate(this.date);
}
```

#### 作用域问题
例如：judge函数是挂在datepicker的原型上的方法，judge中调用init方法时，需要改变作用域，因为init函数中用到很多的参数其实都是挂在datepicker上的，而init中this指向的是window。
```
init.call(_this, options);
```
其他地方原理也是一样

#### 参数
默认参数
```
var defaults = { 
		dateWidth: 80, 				// 每个日期的小框的宽度
		dateHeight: 50, 			// 每个日期的小框的高度
		theme: 'primary',			// 整体的主题 primary|success|info|warning|danger
		separator: '-' 				// 日期分隔符形式
	};
```
位置参数
```
var position = {
	left: _this.$ele.offset().left + _this.$ele.width() + 5,
	top: _this.$ele.offset().top + _this.$ele.height() + 5
}
```
自定义参数
options

渲染日历时是需要将这几个参数进行合并,`$.extend()`方法

[demo展示](https://yy709593266.github.io/datepicker/)