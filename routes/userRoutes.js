const express=require('express');
const {getImageController, userPasswordReset,registerController, updatecontroller, deletecontroller, getcontroller ,loginController ,resetController, changepassword, getAllby, issueBook, submit_book} =require('../controllers/userController');
const multer = require('multer');
const { validateUserInput } = require('../middlewares/validation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  },
});

const upload = multer({ storage: storage });
const router= express.Router()

router.post('/register',upload.single("Image") ,validateUserInput,registerController);

router.get('/imageinb64/:id',getImageController);

router.put('/:id', updatecontroller);

router.delete('/:name', deletecontroller);

router.get('/:id',getcontroller);

router.post('/login',loginController);

router.post('/reset-password',resetController);

router.post('/changepassword',changepassword);

router.get('/',getAllby);

router.post('/issue',issueBook);

router.post('/submitbook',submit_book)

router.post('/password-updation/:id/:token',userPasswordReset);

module.exports=router;