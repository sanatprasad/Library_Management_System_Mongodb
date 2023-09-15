const libModel = require("../models/library")

const getalllib = async (req, res) => {
    try {
        const libraries = await libModel.find({});
        res.json(libraries);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getbyid = async (req, res) => {
    try {
        const library=await libModel.findOne({_id:req.params.id});
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });

    }
}

const createlib=async(req,res)=>{
    try{
        const libName=req.body.libName;
        const location=req.body.location;
        const CloseTime=req.body.CloseTime;
        const OpeningTime=req.body.OpeningTime;

        const newlibrary = new libModel(
            {
                libName:libName,
                location:location,
                CloseTime:CloseTime,
                OpeningTime:OpeningTime
            }
        );
        await newlibrary.save();
        return res.status(201).json({ message: 'Library Added Successfully', success: true });

    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updatelib=async(req,res)=>{
    try {
        const id = req.params._id;
        const lib = await libModel.findById(id);
        if (lib) {
            if (!req.body.libName && !req.body.location) {
                res.send("Please enter any field to update");
            }
            else{
                lib.libName = req.body.libName;
                lib.location=req.body.location;
                res.send({ status: 'updated' }).status(200);
            }
        }  
        else {
            res.send("Library doesnt exist").status(403);
        }
    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deletelibbyid=async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await libModel.findOneAndDelete({ _id: id });
    
        if (result === null) {
          res.status(404).send('Document not found');
        } 
        else {
          res.status(200).json(result).send({ status: 'deleted' });
        }
      }
      
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports={createlib,deletelibbyid,getalllib,getbyid,updatelib};
