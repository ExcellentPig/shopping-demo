
var UserModel = require('../model/users.js');

var index = async (req,res,next)=>{
	res.send({
		msg:'admin',
		status:0
	})
}

var usersList = async (req,res,next)=>{
	var result = await UserModel.usersList();
	if(result){
		res.send({
			msg:'用户信息',
			status:0,
			data:{
				usersList:result
			}
		})
	}else{
		res.send({
			msg:'获取失败',
			status:-1
		})
	}
}

var updateFreeze = async (req,res,next)=>{
	var {email,isFreeze} = req.body;
	var result = await UserModel.updateFreeze(email,isFreeze);
	if(result){
		res.send({
			msg:'冻结操作成功',
			status:0
		})
	}else{
		res.send({
			msg:'冻结操作失败',
			status:-1
		})
	}
	
}

var deleteUser = async (req,res,next)=>{
	var {email} = req.body;
	var result = await UserModel.deleteUser(email);
	if(result){
		res.send({
			msg:'刪除成功',
			status:0
		})
	}else{
		res.send({
			msg:'刪除失败',
			status:-1
		})
	}
}

module.exports = {
	index,
	usersList,
	updateFreeze,
	deleteUser
}