const express=require('express');
const {getallbooks,getbyid,createbook,updatebook,deletebookbyid}=require('../controllers/bookController')
const router= express.Router()

router.get('/findall',getallbooks);

router.get('/:id',getbyid);

router.post('/',createbook);

router.patch('/:id',updatebook);

router.delete('/:id',deletebookbyid);

module.exports=router;