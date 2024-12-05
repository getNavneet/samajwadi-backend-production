import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, `../../public/uploads`);
console.log(uploadPath)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Save files in the 'uploads' folder
        console.log("dd 1a")
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname); // Extract original extension
        console.log("dd 2a")
    
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
        cb(null, uniqueName);
         // Save file with unique name and correct extension
         console.log("uniqueName")

    }

});
  
export const upload = multer({ 
    storage
})


