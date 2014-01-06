/**
 * author: oldj
 * blog: http://oldj.net
 */


$(document).ready(function () {

	var libra = new Libra($("#libra")),
		BALL_COUNT = 12,
		r = Math.floor(Math.random() * BALL_COUNT),
		ball, idx, i,
		result_ball_list = [
			"<option value='0'>Select...</option>"
		];

	for (i = 0; i < BALL_COUNT; i ++) {
		idx = i + 1;
		ball = new Ball(libra, $("#balls ul"), idx);
		if (i == r) {
			ball.rndWeight();
			libra.r_ball = ball;
		}

		result_ball_list.push([
			"<option value='" + idx + "'>",
			idx,
			"</option>"
		].join(""));
	}
	$("#ball-idx").html(result_ball_list.join("\n"));

	$("#btn-submit").click(function () {
		libra.doSubmit();
	});

	var imgs = [
		"img/blance_1.png",
		"img/blance_2.png"
	], tmp_img;

	for (i = 0; i < imgs.length; i ++) {
		window["_rnd_" + Math.random()] = tmp_img = new Image();
		tmp_img.src = imgs[i];
	}
	tmp_img = null;
});