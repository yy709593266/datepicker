(function($, window){
	if (typeof $ === 'undefined') {
		throw new Error('datepicker requires jQuery');
	}

	// 默认参数
	var defaults = { 
		dateWidth: 80, 				// 每个日期的小框的宽度
		dateHeight: 50, 			// 每个日期的小框的高度
		theme: 'primary',			// 整体的主题 primary|success|info|warning|danger
		left: 0, 					// 日历相对于input框的左边距离(不可选)
		top: 0, 
		separator: '-' 					// 日历相对于input框的上边距离(不可选)
	};

	function init(options){
		createMainEle.call(this, options);
		this.renderByDate(this.date);
	}

	// 创建一个日历整体框架
	function createMainEle(options){
		this.options = $.extend({}, defaults, options);
		this.mainEle = $('<div id="datePicker"></div>')
					.addClass('dp-main-ele-' + this.options.theme)
					.css('width', this.options.dateWidth * 7 + 'px')
					.css('height', this.options.dateHeight * 7 + 50 + 'px')
					.css('left', this.options.left + 'px')
					.css('top', this.options.top + 'px')
					.appendTo('body');
		var p = $('<p></p>')
				.addClass('dp-header-' + this.options.theme)
				.appendTo(this.mainEle);
		var title = $('<strong></strong>').addClass('dp-title-text').appendTo(p);
		var _this = this;
		var btnLeft = $('<strong><-</strong>')
					.addClass('dp-btn-left')
					.appendTo(p)
					.on('click', function(){
						_this.prevMonth();
					});
		var btnRight = $('<strong>-></strong>')
					.addClass('dp-btn-right')
					.appendTo(p)
					.on('click', function(){
						_this.nextMonth();
					});
		// 星期
		for (var i = 0; i < 7; i++) {
			var weekEle = createEle.call(this).html(this.days[i]).appendTo(this.mainEle);
			if (i == 0 || i == 6) {
				weekEle.addClass('dp-week-style-' + this.options.theme);
			}
		}
		// 创建日期框
		for (var i = 0; i < 42; i++) {
			var dateSpan = createEle.call(this).css('cursor', 'pointer').appendTo(this.mainEle);
		}
		// 点击选中某个日期
		var _this = this;
		this.mainEle.on('click', function(e){
			if (e.target.nodeName == 'SPAN') {
				var _allSpan = $('span');
				var _clickIndex = _allSpan.index($(e.target));
				if (_clickIndex > 6) {
					var _selectedIndex = _allSpan.index(_this.selectedEle);
					var _date = new Date(_this.date);
					_date.setDate(_date.getDate() + _clickIndex - _selectedIndex);
					_this.gotoDate(_date);
				}
			}
		});
	}

	// 创建日历中的所有span，包括星期和日期框
	function createEle(){
		var spanEle = $('<span></span>')
					.addClass('dp-date-ele')
					.css('width', this.options.dateWidth + 'px')
					.css('height', this.options.dateHeight + 'px')
					.css('line-height', this.options.dateHeight + 'px');
		return spanEle;
	}

	// 构造日历插件函数
	function DatePicker($ele, options){
		this.$ele = $ele;
		this.judge(options);
	}

	DatePicker.prototype = {
		date: new Date(),
		days: ['日', '一', '二', '三', '四', '五', '六'],	// 星期
		// 渲染日期元素到框架中
		renderByDate: function(date){
			var _titleText = date.getFullYear() + this.options.separator + (date.getMonth() + 1) + this.options.separator + date.getDate() + this.options.separator + '周' + this.days[date.getDay()];
			$('.dp-title-text').html(_titleText);
			this.$ele.val(_titleText);
			var _date = new Date(date);
			_date.setDate(1); // 找到该月的一号
			_date.setDate(_date.getDate() - _date.getDay()); // 找到该页的第一个日期是上个月的几号,_date现在是这一页的第一个日期
			var allSpan = $('span');
			for (var i = 0; i < 42; i++) {
				var ele = $(allSpan.get(i + 7)).html(_date.getDate());
				ele.removeClass('dp-other-month').removeClass('dp-week-style-' + this.options.theme).removeClass('dp-active-' + this.options.theme);
				// 不是当月的样式，以及周末的样式
				if (_date.getMonth() !== date.getMonth()) {
					ele.addClass('dp-other-month');
				}else if(_date.getDay() == 0 || _date.getDay() == 6) {
					ele.addClass('dp-week-style-' + this.options.theme);
				}
				// 选中当天样式
				// getTime()时间戳毫秒数
				if (_date.getTime() == date.getTime()) {
					ele.addClass('dp-active-' + this.options.theme);
					this.selectedEle = ele;
				}
				_date.setDate(_date.getDate() + 1);
			}
		}, 
		prevMonth: function(){
			var _date = new Date(this.date);
			_date.setMonth(_date.getMonth() - 1);
			this.gotoDate(_date);
		},
		nextMonth: function(){
			var _date = new Date(this.date);
			_date.setMonth(_date.getMonth() + 1);
			this.gotoDate(_date);
		}, 
		gotoDate: function(date){
			this.selectedEle.removeClass('dp-active-' + this.options.theme);
			// 如果点选的是本月的日期就直接改变样式就行了
			// 如果点选的是灰色即不是本月的就重新渲染整个日历
			// (当然，也可以不用这个函数，直接每次选择都重新渲染日历)
			if (date.getMonth() == this.date.getMonth()) {
				var _allSpan = $('span');
				var _selectedIndex = _allSpan.index(this.selectedEle);
				var _temp = _allSpan.get(_selectedIndex + date.getDate() - this.date.getDate());
				this.selectedEle = $(_temp).addClass('dp-active-' + this.options.theme);
				var _dateText = date.getFullYear() + this.options.separator + (date.getMonth() + 1) + this.options.separator + date.getDate() + this.options.separator + '周' + this.days[date.getDay()];
				$('.dp-title-text').html(_dateText);
				this.$ele.val(_dateText);
			}else {
				this.renderByDate(date);
			}
			this.date = date;
		},
		judge: function(options){
			var _this = this;
			$(document).on('click', function(e){
				if(_this.$ele.attr('id') == $(e.target).attr('id') && !$('#datePicker')[0]) {
					var position = {
						left: _this.$ele.offset().left + _this.$ele.width() + 5,
						top: _this.$ele.offset().top + _this.$ele.height() + 5
					}
					// 如果自定义了参数就合并自定义参数和位置参数给init合并默认参数
					// 如果没有自定义参数就不用合并直接将位置参数给init合并默认参数
					if(options){
						$.extend(options, position);
					}else{
						options = position;
					}
					init.call(_this, options);
				}else if($('#datePicker')[0] && !/^dp-/.test($(e.target).attr('class'))){
					$('#datePicker').remove();
				}
			});
		}
	}

	$.fn.datePicker = function(options){
		new DatePicker(this, options);
		return this;
	}
})(jQuery, window);