var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../model/shopping-goods');


//get goodslist
router.get('/list', function(req, res, next) {
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	let sort = req.param("sort");
	let skip = (page - 1) * pageSize;
	let priceLeavel = req.param("priceLeavel");
	let params = {};
	var priceGt = '',
		priceLte = ''
	if (priceLeavel != "all") {
		switch (priceLeavel) {
			case '0':
				priceGt = 0;
				priceLte = 100;
				break;
			case '1':
				priceGt = 100;
				priceLte = 500;
				break;
			case '2':
				priceGt = 500;
				priceLte = 1000;
				break;
			case '3':
				priceGt = 1000;
				priceLte = 5000;
				break;
			case '4':
				priceGt = 5000;
				priceLte = 9999999999999999999999999999999999;
				break;
		}
		params = {
			salePrice: {
				$gt: priceGt,
				$lte: priceLte
			}
		}
	}

	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({
		'salePrice': sort
	});
	goodsModel.exec({}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message
			});
		} else {
			res.json({
				status: '0',
				msg: '',
				result: {
					count: doc.length,
					list: doc
				}
			});
		}
	})
})

router.post("/addCart", function (req,res,next) {
  var userId = req.session.userId,productId = req.body.productId;
  var User = require('../model/users');
  console.log(User.UserModel)
  User.UserModel.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
		if(!userDoc){
			res.json({
			  status:'-1',
			  msg:'未找到用户请先登录',
			})
		}
        if(userDoc){
          var goodsItem = '';
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            Goods.findOne({productId:productId}, function (err1,doc) {
              if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if(doc){
                  doc.productNum = 1;
                  doc.checked = true;
                  userDoc.cartList.push(doc);
                  userDoc.save(function (err2,doc2) {
                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});


module.exports = router;
