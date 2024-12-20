import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config()

app.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})



connectDB()
.then(() => {
        console.log(`database connected`);
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

