var mongoose = require('mongoose');
var {
	Head
} = require('../untils/config.js');
var url = require('url');

mongoose.set('useCreateIndex', true);

var userSchema = new mongoose.Schema({
	"userId": String,
	"userName": String,
	"userPwd": String,
	email: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	date: {
		type: Date,
		default: Date.now()
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isFreeze: {
		type: Boolean,
		default: false
	},
	userHead: {
		type: String,
		default: url.resolve(Head.baseUrl, 'default.jpg')
	},
	"orderList": Array,
	"cartList": [{
		"productId": String,
		"productName": String,
		"salePrice": String,
		"productImage": String,
		"checked": Boolean,
		"productNum": String
	}],
	"addressList": [{
		"addressId": String,
		"userName": String,
		"streetName": String,
		"postCode": Number,
		"tel": Number,
		"isDefault": Boolean
	}]
});



var UserModel = mongoose.model('users', userSchema);
UserModel.createIndexes();

var save = (data) => {
	var user = new UserModel(data);
	return user.save()
		.then(() => {
			return true
		}).catch(() => {
			return false;
		})
}

var findLogin = (data) => {
	return UserModel.findOne(data);
}

var findOthers = (data) => {
	return UserModel.findOne(data);
}

var updatePassword = (email, userPwd) => {
	return UserModel.update({
			email
		}, {
			$set: {
				userPwd
			}
		})
		.then(() => {
			return true
		}).catch(() => {
			return false;
		})
}

var updateUserHead = (userName, userHead) => {
	return UserModel.update({
			userName
		}, {
			$set: {
				userHead
			}
		})
		.then(() => {
			return true;
		})
		.catch(() => {
			return false;
		})
}

var usersList = () => {
	return UserModel.find();
}

var updateFreeze = (email, isFreeze) => {
	return UserModel.update({
			email
		}, {
			$set: {
				isFreeze
			}
		})
		.then(() => {
			return true
		}).catch(() => {
			return false;
		})
}

var deleteUser = (email)=>{
	return UserModel.deleteOne({email});
}


module.exports = {
	save,
	findLogin,
	updatePassword,
	updateUserHead,
	findOthers,
	UserModel,
	usersList,
	updateFreeze,
	deleteUser
}
