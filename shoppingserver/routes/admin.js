var express = require('express');
var router = express.Router();

var adminController = require('../controllers/admin.js')


router.use((req,res,next)=>{
	if(req.session.userName && req.session.isAdmin){
		next();
	}else{
		res.send({
			msg:'不是admin',
			status:-1
		})
	}
})


router.get('/',adminController.index);
router.get('/usersList',adminController.usersList);
router.post('/updateFreeze',adminController.updateFreeze);
router.post('/deleteUser',adminController.deleteUser);


module.exports = router;
