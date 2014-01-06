/**
 * author: oldj
 * blog: http://oldj.net
 */


function Libra_Platform (libra, jel, type) {
	this.libra = libra;
	this.jel = jel;
	this.is_left = type == "left";
	this.jel_region = this.jel.find(".platform-region");
	this.is_hover = false;
	this.balls = [];
	this.status = 0; // -1: lighter; 0: balance； 1: heavier;
	this.init();
}

Libra_Platform.prototype = {

	init: function () {
		var _this = this;
		this.jel.mouseover(function () {
			_this.hover();
		}).mouseout(function () {
			_this.unhover();
		});

		this.getRegion();
		$(document).mousemove(function (e) {
			_this.chkMouseIn(e);
		})
	},

	hover: function () {
		if (this.is_hover) return;
		this.is_hover = true;
		this.jel.addClass("platform-hover");
		this.libra.current_platform = this;
	},

	unhover: function () {
		if (!this.is_hover) return;
		this.is_hover = false;
		this.jel.removeClass("platform-hover");
		this.libra.current_platform = null;
	},

	getRegion: function () {
		var pos = this.jel.offset();
		this.x0 = pos.left + Ball.r + 5;
		this.y0 = pos.top + Ball.r + 5;

//		this.width = this.jel_region.width();
//		this.height = this.jel_region.height();

		this.x1 = this.x0 + this.jel_region[0].offsetWidth - Ball.r * 2;
		this.y1 = this.y0 + this.jel_region[0].offsetHeight - Ball.r * 2;

	},

	chkMouseIn: function (e) {
		var px = e.pageX,
			py = e.pageY;

		if (this.x0 <= px && this.x1 >= px &&
			this.y0 <= py && this.y1 >= py
			) {
			this.hover();
		} else {
			this.unhover();
		}
	},

	addBall: function (ball) {
		if (this.hasBall(ball)) return;
		this.libra.left_platform.removeBall(ball);
		this.libra.right_platform.removeBall(ball);
		this.balls.push(ball);
	},

	hasBall: function (ball) {
		for (var i = 0, l = this.balls.length; i < l; i ++) {
			if (this.balls[i] == ball) return true;
		}
		return false;
	},

	removeBall: function (ball) {
		if (!this.hasBall(ball)) return;
		var i, l, a = [];
		for (i = 0, l = this.balls.length; i < l; i ++) {
			if (this.balls[i] != ball) {
				a.push(this.balls[i]);
			} else {
			}
		}
		this.balls = a;
	},

	eachBall: function (f) {
		var i, l;
		for (i = 0, l = this.balls.length; i < l; i ++) {
			f(this.balls[i]);
		}
	},

	getBallIdx: function () {
		var a = [];
		this.eachBall(function (ball) {
			a.push(ball.idx);
		});
		return a.sort(function(a, b){
			return a - b;
		});
	},

	getWeight: function () {
		var i, l, sum = 0;

		for (i = 0, l = this.balls.length; i < l; i ++) {
			sum += this.balls[i].weight;
		}

		return sum;
	},

	moveTo: function (v) {
		if (this.status == v) return;

		var _this = this,
			distance;
		switch (v) {
			case 1: distance = 80;
				break;
			case 0: distance = 40;
				break;
			case -1: distance = 0;
				break
		}
		this.jel.animate({
			top: distance
		}, function () {
			_this.getRegion();
		});

		var v2 = v - this.status;
		this.eachBall(function (ball) {
			var ball_top = parseInt(ball.jel.css("top"));
			ball.jel.animate({top: ball_top + 40 * v2});
		});
	},

	up: function () {
		this.moveTo(-1);

		this.blanceAnima(-1);
		this.status = -1;
	},

	down: function () {
		this.moveTo(1);

		this.blanceAnima(1);
		this.status = 1;
	},

	blance: function () {
		this.moveTo(0);

		this.blanceAnima(0);
		this.status = 0;
	},

	blanceAnima: function (type) {
		if (!this.is_left) return;

		var bla = $("#libra .blance"),
			from, to, step,
			callback;

		function f() {
			if (from == to) {
				if (callback) callback();
				return;
			}

			bla.css("background-position", "50% " + (120 * from) + "px");

			from += step;
			setTimeout(f, 20);
		}

		if (this.status == -1 && type == 0) {
			from = 0;
			to = -8;
			step = -1;

		} else if (this.status == -1 && type == 1) {
			from = 0;
			to = -8;
			step = -1;

			callback = function () {
				callback = null;
				bla.css("background-image", "url(img/blance_1.png)");
				from = -8;
				to = 0;
				step = 1;

				f();
			};

		} else if (this.status == 0 && type == -1) {
			bla.css("background-image", "url(img/blance_2.png)");
			from = -8;
			to = 0;
			step = 1;

		} else if (this.status == 0 && type == 1) {
			bla.css("background-image", "url(img/blance_1.png)");
			from = -8;
			to = 0;
			step = 1;

		} else if (this.status == 1 && type == -1) {
			from = 0;
			to = -8;
			step = -1;

			callback = function () {
				callback = null;
				bla.css("background-image", "url(img/blance_2.png)");
				from = -8;
				to = 0;
				step = 1;

				f();
			};

		} else if (this.status == 1 && type == 0) {
			from = 0;
			to = -8;
			step = -1;

		} else {
			return;
		}
		f();
	}

};


function Libra(jel) {

	this.jel = jel;
	this.current_platform = null;
	this.count_left = 3;
	this.idx_count = 0;

	this.init();
}

Libra.prototype = {

	init: function () {
		var _this = this;

		this.left_platform = new Libra_Platform(this, this.jel.find(".platform-left"), "left");
		this.right_platform = new Libra_Platform(this, this.jel.find(".platform-right"), "right");

		this.btn = $("button#do-weight");
		this.btn.click(function () {
			_this.doWeight();
		}).html("Weigh it！(" + this.count_left + " times left)");

	},

	eachPlatform: function (f) {
		f(this.left_platform);
		f(this.right_platform);
	},

	doWeight: function () {
		var lw = this.left_platform.getWeight(),
			rw = this.right_platform.getWeight();

		if (lw == 0 && rw == 0) {
			alert("There is nothing on the dishes.");
			return;
		}

		if (lw > rw) {
			this.left_platform.down();
			this.right_platform.up();
			this.operationResult(-1);
		} else if (lw == rw) {
			this.left_platform.blance();
			this.right_platform.blance();
			this.operationResult(0);
		} else {
			this.left_platform.up();
			this.right_platform.down();
			this.operationResult(1);
		}

		this.count_left --;
		if (this.count_left > 0) {
			this.btn.html("Weigh it！(" + this.count_left + " times left)");
		} else {
			this.btn.html("Can't weigh anymore...")[0].disabled = true;
		}
	},

	operationResult: function (w) {
		var w_msg, li;
		this.idx_count ++;

		switch (w) {
			case -1:
				w_msg = "left is heavier than right.";
				break;

			case 0:
				w_msg = "balanced.";
				break;

			case 1:
				w_msg = "left is lighter than right.";
				break;
		}

		li = $(["<li>",
			"#" + this.idx_count + " ",
			"left：",
			this.left_platform.getBallIdx().join(","),
			" balls, ",
			"right：",
			this.right_platform.getBallIdx().join(","),
			" balls, ",
			w_msg,
		"</li>"].join(""));

		$("#operation-record ul").append(li);
		if ($("#operation-record").is(":hidden")) {
			$("#operation-record").slideDown();
		}
	},

	doSubmit: function () {
		var idx = parseInt($("#ball-idx").val()),
			wl = parseInt($("#result input[name=ball-w-l]:checked").val());

		if (isNaN(idx) || idx < 1 || idx > 12) {
			alert("Please select the correct ball！");
			return;
		}

		if (wl != 0 && wl != 1) {
			alert("Tell me it is heavier or lighter！");
			return;
		}
		var r_wl = this.r_ball.weight>10?1:0;
		if(idx == this.r_ball.idx && wl == r_wl){
			alert("Congratulations, you got it. :)");
		}else{
			alert("I'm sorry, it seems that you are wrong. :(");
		}
		$("#btn-submit").attr("disabled", "true");
		//console.log(this.r_ball);
		//console.log(this.balls);
		//console.log("idx="+idx+"&r_idx="+this.r_ball.idx+"&wl="+wl+"&r_weight="+this.r_ball.weight);
		/*
		$.ajax({
			type:"POST",
			url:"./?action=finish",
			data:"idx="+idx+"&r_idx="+this.r_ball.idx+"&wl="+wl+"&r_weight="+this.r_ball.weight,
			success:function(msg){
				if(msg.indexOf('fail')>-1){
					alert("很遗憾，答案不是这样的… :-(");
					location.reload();
				}else{
					window.location = msg;
				}
			}
		});
		*/
		
	}


};