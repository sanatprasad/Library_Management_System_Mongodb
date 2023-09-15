const authModel=require("../models/author");

const getallauthors= async (req,res)=>{
    try {
        const authors = await authModel.find({});
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getbyid=async (req,res)=>{
    try {
        const id = req.params.id;
        const auth = await authModel.findOne({ _id: id });
        res.json(auth);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateauthor=async(req,res)=>{
    try {
        const id = req.params.id;
        const auth = await authModel.findOne({ _id: id });
        if(auth) {
            if (!req.body.authName && !req.body.email) {
                res.send("Please enter any field to update");
            }
            else{
                auth.name = req.body.authName;
                auth.email=req.body.email;
                res.send({ status: 'updated' }).status(200);
            }
        }  
        else {
            res.send("Author doesnt exist").status(403);
        }
        
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createauthor=async(req,res)=>{
    try{
        const authName=req.body.authName;
        const email=req.body.email;
        
        const newauth = new authModel(
            {
                name:authName,
                email:email,
            }
        );
        await newauth.save();
        return res.status(200).json({message:"created author",status:"true"})
    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteauthorbyid=async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await authModel.findOneAndDelete({ _id: id });
    
        if (result === null) {
          res.status(404).send('Document not found');
        } 
        else {
          res.status(200).json(result).send({ status: 'deleted' });
        }
      }
      catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports={deleteauthorbyid,createauthor,updateauthor,getallauthors,getbyid};

