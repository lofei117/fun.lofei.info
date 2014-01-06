/**
 * author: oldj
 * blog: http://oldj.net
 */

function Ball(libra, parent, idx) {

	this.libra = libra;
	this.parent = parent;
	this.idx = idx;
	this.weight = 10;

	this.is_draging = false;

	this.init();

	/*if (!Ball.all) {
		Ball.all = [];
	}
	Ball.all.push(this);*/
}

Ball.r = 30; // 小球半径

Ball.prototype = {

	init: function () {
		var html = $("<li class='ball-placeholder'><div class='ball'><span>" + this.idx + "</span></div></li>"),
			_this = this,
			pos;

		this.parent.append(html);
		this.placeholder = html.find("li");
		this.jel = html.find(".ball");
		this.jel.css({
			height: Ball.r * 2 + "px",
			width: Ball.r * 2 + "px",
//			borderRadius: Ball.r * 2 + "px",
			lineHeight: Ball.r * 2 + "px"
		});

		this.jel.mousedown(function (e) {
			_this.onDragStart(e);
		}).mouseup(function () {
			_this.onDragEnd();
		});

		$(document).mouseup(function () {
			_this.onDragEnd();
		});

		this.jel.on({
			"touchstart" : _this.onDragStart,
			"touchend" : _this.onDragEnd,
			"touchmove" : _this.onDrag
		});


		pos = this.jel.position();
		this.x = this.x0 = pos.left;
		this.y = this.y0 = pos.top;

		this.jel.css({
			position: "absolute",
			top: this.y + "px",
			left: this.x + "px",
			zIndex: 10
		});
	},

	onDragStart: function (e) {
		if (this.is_draging) return;

		this.is_draging = true;
		document.onselectstart = function () {
			return false;
		};
		$("body").addClass("is-moving");

		this.ox = e.offsetX||Ball.r;
		this.oy = e.offsetY||Ball.r;
		this.jel.css("zIndex", 100);

		var _this = this;
		this._df = function (e) {
			_this.onDrag(e);
		};
		$(document).bind("mousemove", this._df);
		$(document).bind("touchmove", this._df);
	},

	onDrag: function (e) {

		var px = e.pageX,
			py = e.pageY;

		this.jel.css({
			top: py - this.oy + "px",
			left: px - this.ox + "px"
		});
	},

	onDragEnd: function () {
		if (!this.is_draging) return;

		this.is_draging = false;
		this.jel.css("zIndex", 10);
		$(document).unbind("mousemove", this._df);
		$(document).unbind("touchmove", this._df);
		document.onselectstart = null;
		$("body").removeClass("is-moving");

		if (!this.libra.current_platform) {
			this.backToBallList();
		} else {
			this.addToPlatform();
		}
	},

	backToBallList: function () {
		var _this = this;

		this.jel.animate({
			top: this.y0,
			left: this.x0
		}, 300);

		this.libra.eachPlatform(function (platform) {
			platform.removeBall(_this);
		});
	},

	addToPlatform: function () {
		this.libra.current_platform.addBall(this);
	},

	rndWeight: function () {

		this.weight += Math.random() < 0.5 ? 1 : -1;
	}
};
