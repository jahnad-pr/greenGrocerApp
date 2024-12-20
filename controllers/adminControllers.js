const Admin = require('../models/Auth/adminModel');
const User = require('../models/Auth/userModel');
const { generateToken } = require('../utils/genarateTocken');
const jwt = require('jsonwebtoken');




// Get admins
module.exports.getAdmins = async (req, res) => {

    const { email, password } = req.body

    try {
        const admins = await Admin.find({email});

        if(admins.length>0){

            if (admins[0].password===password) {
                
                // const token =  generateToken(admins[0]._id,'admin')
                const token = jwt.sign({ id:admins[0]._id,role:'admin' }, 'C33LMATENMU', {
                  expiresIn: "1h",
                });
  
                res.cookie("authkeys", token, {
                  maxAge: 99000000,
                  httpOnly: true,
                  secure: true,
                  sameSite: "None",
                });
    
    
                res.status(200).json(admins);

            }else{

            res.status(500).json({ message: 'wrong password or email' });

            }


        }else{

            res.status(500).json({ message: 'wrong password or email' });

        }
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};


// get the admin
module.exports.getAdmin = async(req,res)=>{


    if (req.admin) {

        const { userId } = req.admin;
        
    
        try {
          const admin = await Admin.find({ _id: userId });
    
          if (!admin || admin.length <= 0) {

            return res.status(404).json({ message: "admin not found" });

          }
    
          if (admin.length>0) {

            res.status(201).json({ verified: true, admin });

          }
    
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }


}

// get limited cutomers
module.exports.getCustomers = async(req,res)=>{

    try {

        const UsersData = await User.find({})

        if(UsersData.length<=0){
            res.status(500).json({mission:false,message:'empty users'})
        }else{
            res.status(200).json({mission:true,message:'successfull',data:UsersData})
        }
        
    } catch (error) {

        res.status(500).json({mission:false,message:error.message})
        
    }
}



// upadte the access of user
module.exports.updateUserAccess = async(req,res)=>{

    const { uniqeID,updateBool } = req.body

    try {
      
      const updatedtatus = await User.updateOne({ _id:uniqeID },{ isListed:updateBool })
      

        if(updatedtatus.modifiedCount>0){

            return res.status(200).json({mission:true,message:'successfully updaed',uniqeID:uniqeID})
        }
          return res.status(500).json({mission:false,message:'nothing updated'}) 

    } catch (error) {

        return res.status(500).json({mission:false,message: error.messgae }) 
    }
}


module.exports.logoutAdmin = async(req,res)=>{

    const { id } = req.body
  
    try {
  
      if(id){
  
        res.clearCookie('authkeys')
  
        res.status(200).json({forWord:true})
  
      }else{
        res.status(401).json('Somethng went wrong')
      }
  
      
    } catch (error) {

      res.status(500).json(error.message)
      
    }
  
  }