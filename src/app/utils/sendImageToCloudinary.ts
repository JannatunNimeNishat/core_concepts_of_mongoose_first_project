import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

/**
 * step 1: install multer and ts multer
 * step 2: install cloudinary -> npm install cloudinary
 * step 3:cloudinary.config , cloudinary.uploader.upload
 * step 4:
 */

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_secret,
});

export const sendImageToCloudinary = (imageName:string,path: string) => {
  // local e je jaigai image ta save hoye ase saitar path

  return new Promise((resolve,reject)=>{
    cloudinary.uploader.upload(
      path,  // local e je jaigai image ta save hoye ase saitar path
      { public_id: imageName }, // je nam e image save hobe
      function (error, result) {
        if(error){
          reject(error)
        }
        console.log(result);
        resolve(result);

        //image cloudinary te upload hoar pore delete kore dibo
    //delete a file asynchronously
    fs.unlink(path,(err)=>{ // amader file er path
      if(err){
        reject(err);
      }else{
        console.log('file is deleted');
      }
    })
      },
    );

    

  })
  
  /*old
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_secret,
  });

  cloudinary.uploader.upload(
    path,  // local e je jaigai image ta save hoye ase saitar path
    { public_id: imageName }, // je nam e image save hobe
    function (error, result) {
      console.log(result);
    },
  );*/
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/'); // amra incoming file ta locally je jaigai save korte cai tar path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
