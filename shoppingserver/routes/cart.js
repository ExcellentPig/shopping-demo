var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../model/shopping-goods');
var User = require('../model/users');
require('./../untils/util.js')


// router.get("/checkLogin",function(req,res,next){
// 	if(req.cookies.userId){
// 		res.json({
// 			status:"0",
// 			msg:'',
// 			result:''
// 		});
// 	}
// })


router.get("/cartList", function(req, res, next) {
	var userId = req.session.userId;
	User.UserModel.findOne({
		userId: userId
	}, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		} else {
			if (doc) {
				req.session.cartList = doc.cartList;
				res.json({
					status: "0",
					msg: '',
					result: doc.cartList
				})
			}
		}
	})
})

router.post("/del", function(req, res, next) {
	var userId = req.session.userId;
	var productId = req.body.productId;
	User.UserModel.update({
		userId: userId
	}, {
		$pull: {
			'cartList': {
				'productId': productId
			}
		}
	}, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		} else {
			res.json({
				status: "0",
				msg: '',
				result: 'suc'
			})
		}
	})
})

router.post("/cartEdit", function(req, res, next) {
	var userId = req.session.userId;
	var productId = req.body.productId;
	var productNum = req.body.productNum;
	var checked = req.body.checked;
	console.log(checked)
	User.UserModel.update({
		"userId": userId,
		"cartList.productId": productId
	}, {
		"cartList.$.productNum": productNum,
		"cartList.$.checked": checked
	}, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		} else {
			res.json({
				status: "0",
				msg: '',
				result: 'suc'
			})
		}
	})
})

router.post('/checkAll', function(req, res, next) {
	var userId = req.session.userId;
	var checkAll = req.body.checkAll ? true : false;
	User.UserModel.findOne({
		userId: userId
	}, function(err, user) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		} else {
			if (user) {
				user.cartList.forEach(item => {
					item.checked = checkAll
				})
				user.save(function(err1, doc) {
					if (err1) {
						res.json({
							status: "1",
							msg: err1.message,
							result: ''
						})
					} else {
						res.json({
							status: "0",
							msg: '',
							result: 'suc'
						})
					}
				})
			}
		}
	})
})

router.post("/payMent", function(req, res, next) {
	var userId = req.session.userId;
	var orderTotal = req.body.orderTotal;
	User.UserModel.findOne({
		userId: userId
	}, function(err, doc) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		} else {
			var goodsList = [];
			doc.cartList.filter(item => {
				if (item.checked == true) {
					goodsList.push(item);
				}
			})

			var platform = '520';
			var r1 = Math.floor(Math.random() * 10);
			var r2 = Math.floor(Math.random() * 10);
			var sysDate = new Date().Format('yyyyMMddhhmmss');
			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
			var orderId = platform + r1 + sysDate + r2;

			var order = {
				orderId: orderId,
				orderTotal: orderTotal,
				goodsList: goodsList,
				orderStatus: '1',
				createDate: createDate
			}

			doc.orderList.push(order);
			doc.save(function(err1, doc1) {
				if (err1) {
					res.json({
						status: "1",
						msg: err1.message,
						result: ''
					})
					return;
				} else {
					res.json({
						status: "0",
						msg: '',
						result: {
							orderId: order.orderId,
							orderTotal: order.orderTotal
						}
					})
				}
			})
		}
	})
})


router.get("/orderDetail", function(req, res, next) {
	var userId = req.session.userId;
	var orderId = req.param("orderId");
	User.UserModel.findOne({
		userId: userId
	}, function(err, userInfo) {
		if (err) {
			res.json({
				status: "1",
				msg: err.message,
				result: ''
			})
		} else {
			var orderList = userInfo.orderList || [];
			if (orderList.length > 0) {
				var orderTotal = 0;
				orderList.forEach((item) => {
					if (item.orderId == orderId) {
						orderTotal = item.orderTotal
					}
				})
				console.log(orderTotal)

				if (orderTotal > 0) {
					res.json({
						status: "0",
						msg: '',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					})
				} else {
					res.json({
						status: "120002",
						msg: '无此订单',
						result: ''
					})
				}
			} else {
				res.json({
					status: "120001",
					msg: '无订单',
					result: ''
				})
			}
		}
	})
})

router.get("/getCartCount", function(req, res, next) {
	if (req.cookies && req.session.userId) {
		var userId = req.session.userId;
		User.UserModel.findOne({
			userId: userId
		}, function(err, doc) {
			if (err) {
				res.json({
					status: "1",
					msg: err.message,
					result: ''
				})
			} else {
				var cartList = doc.cartList;
				var cartCount = 0;
				cartList.map(function(item) {
					cartCount += parseInt(item.productNum)
				})
				res.json({
					status: "0",
					msg: '',
					result: cartCount
				})
			}
		})
	}
})


module.exports = router;
