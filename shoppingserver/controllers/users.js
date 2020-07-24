var {
	Email,
	Head
} = require('../untils/config.js')
var UserModel = require('../model/users.js');

var fs = require('fs');
var url = require('url');

var {
	setCrypto,
	createVerify
} = require('../untils/base.js');

var login = async (req, res, next) => {

	var {
		userName,
		userPwd,
		verifyImg,
	} = req.body;



	if (verifyImg !== req.session.verifyImg) {
		res.send({
			msg: '验证码输入不正确',
			status: -3
		})
		return;
	}

	var result = await UserModel.findLogin({
		userName,
		userPwd: setCrypto(userPwd),
	});

	if (result) {
		req.session.userName = userName;
		req.session.userHead = result.userHead;
		req.session.userId = result.userId
		req.session.cartList = result.cartList
		req.session.isAdmin = result.isAdmin

		if (result.isFreeze) {
			res.send({
				msg: '账号已冻结',
				status: -2
			});
			return;
		} else {
			res.send({
				msg: '登录成功',
				status: 0
			});
		}
	} else {
		res.send({
			msg: '登录失败',
			status: -1
		});
	}

}

var register = async (req, res, next) => {
	var {
		userName,
		userPwd,
		email,
		verify,
		userId
	} = req.body;
	if (email !== req.session.email || verify !== req.session.verify) {
		res.send({
			msg: '验证码错误',
			status: -1
		});
		return;
	}
	if ((Email.time - req.session.time) / 1000 > 60) {
		res.send({
			msg: '验证码已过期',
			status: -3
		})
		return;
	}
	userId = '202002221719' + Math.random().toString().substring(2, 6)
	var result = await UserModel.save({
		userName,
		userPwd: setCrypto(userPwd),
		email,
		userId
	});
	req.session.userId = result.userId
	if (result) {
		res.send({
			msg: '注册成功',
			status: 0
		});
	} else {
		res.send({
			msg: '注册失败',
			status: -2
		});
	}

}

var verify = async (req, res, next) => {
	var email = req.query.email;
	var verify = Email.verify;

	req.session.verify = verify;
	req.session.email = email;
	req.session.time = Email.time;

	var mailOptions = {
		from: 'shopping_demo 894399743@qq.com',
		to: email,
		subject: 'shopping_demo邮箱验证码',
		text: '验证码：' + verify
	}

	Email.transporter.sendMail(mailOptions, (err) => {
		if (err) {
			res.send({
				msg: '验证码发送失败',
				status: -1
			})
		} else {
			res.send({
				msg: '验证码已发送',
				status: 0
			})
		}
	});
}


var logout = async (req, res, next) => {
	req.session.userName = '';
	req.session.userId = '';
	req.session.cartList = [];
	res.send({
		msg: '退出成功',
		status: 0
	})
}

var getUser = async (req, res, next) => {
	if (req.session.userName) {
		res.send({
			msg: '获取用户信息成功',
			status: 0,
			data: {
				userName: req.session.userName,
				userHead: req.session.userHead,
				userId: req.session.userId,
				cartList: req.session.cartList,
				isAdmin: req.session.isAdmin
			}
		})
	} else {
		res.send({
			msg: '获取用户信息失败',
			status: -1
		})
	}
}

var findPassword = async (req, res, next) => {
	var {
		email,
		userPwd,
		verify
	} = req.body;
	if ((Email.time - req.session.time) / 1000 > 60) {
		res.send({
			msg: '验证码已过期',
			status: -3
		})
		return;
	}
	if (email === req.session.email && verify === req.session.verify) {
		var result = await UserModel.updatePassword(email, setCrypto(userPwd));
		if (result) {
			res.send({
				msg: '修改密码成功',
				status: 0
			})
		} else {
			res.send({
				msg: '修改密码失败',
				status: -1
			})
		}
	} else {
		res.send({
			msg: '验证码失败',
			status: -1
		})
	}
}


var verifyImg = async (req, res, next) => {
	var result = await createVerify(req, res);
	if (result) {
		res.send(result);
	}
}

var uploadUserHead = async (req, res, next) => {
	//console.log(req.file);
	//console.log(req.file.filename);
	//console.log(req.session.userName);
	fs.rename('public/uploads/' + req.file.filename, 'public/uploads/' + req.session.userName + '.jpg', function(err) {
		if (err) {
			throw err;
		}
	});

	var result = await UserModel.updateUserHead(req.session.userName, url.resolve(Head.baseUrl, req.session.userName +
		'.jpg'))

	if (result) {
		res.send({
			msg: '头像修改成功',
			status: 0,
			data: {
				userHead: url.resolve(Head.baseUrl, req.session.userName + '.jpg')
			}
		})
	} else {
		res.send({
			msg: '头像修改失败',
			status: -1
		})
	}
}




module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	findPassword,
	verifyImg,
	uploadUserHead
}
