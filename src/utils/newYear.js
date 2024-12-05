import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);
import { convertHeicToJpg } from './heifConverter.js'; // Ensure the correct file extension for your module


export const generateCard = async ({ photoPath, templatePath, name, state, city, phone }, outputDir) => {
    // Canvas dimensions
    const fallBackPhoto= path.join(__dirname, '../../public/templates/akhilesh.png');
    console.log("----------------------------------------")
     console.log(fallBackPhoto)
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    

    try {
        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            console.log("file created",outputDir)
            fs.mkdirSync(outputDir, { recursive: true });
        }
        

        // Handle HEIC/HEIF image conversion
        const fileExtension = path.extname(photoPath).toLowerCase();
        if (fileExtension === '.heic' || fileExtension === '.heif') {
            console.log("HEIC/HEIF image detected. Converting...");
            
            try {
                photoPath = await convertHeicToJpg(photoPath);
            } catch (error) {
                photoPath  = fallBackPhoto;
                console.error("Error during HEIC/HEIF conversion:", error.message);
                throw new Error('Failed to process HEIC/HEIF image.');
            }
        }

        // Load template image
        const templateImage = await loadImage(templatePath);
        ctx.drawImage(templateImage, 0, 0, width, height);

        // Load and place user photo
        if (photoPath) {
            try {
                const userPhoto = await loadImage(photoPath);
                ctx.drawImage(userPhoto, 40, 800, 400, 400); // Adjust position and size as needed
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'white';
                ctx.strokeRect(40, 800, 400, 400); // Border around photo
            } catch (error) {
                console.error("Failed to load user photo. Skipping photo placement.");
            }
            finally {
                // Delete the uploaded or converted photo after processing
                fs.unlink(photoPath, (err) => {
                    if (err) console.error('Failed to delete processed photo:', err);
                });
            }
        }
        else{
            try {
                const userPhoto = await loadImage(fallBackPhoto);
                ctx.drawImage(userPhoto, 40, 800, 400, 400); // Adjust position and size as needed
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'white';
                ctx.strokeRect(40, 800, 400, 400); // Border around photo
            } catch (error) {
                console.error("------------------------------------------------------");
                console.error("Failed to load fallback photo. Skipping photo placement.");
            }
        }
        

        // Add user details (name, address, phone)
        ctx.font = 'bold 60px "Sans-serif"';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillText(name, 800, 1050);

        ctx.font = '500 50px "Sans-serif"';
        ctx.fillStyle = 'lightgray';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.fillText(`${city}, ${state}`, 800, 1110);
        if(phone){
        ctx.font = '500 50px "Sans-serif"';
        ctx.fillText(phone, 800, 1170);
            }
        // Save the generated card
        const imageId = uuidv4();
        const outputPath = path.join(outputDir, `${imageId}.png`);
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        return new Promise((resolve, reject) => {
            out.on('finish', () => resolve(outputPath));
            out.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error("Error generating card:", error.message);
        throw new Error('Card generation failed.');
    }
};
