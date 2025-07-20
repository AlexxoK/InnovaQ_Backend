import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();


export const subirImagenImgbb = async (buffer) => {
    const apiKey = process.env.IMGBB_API_KEY;

    const base64Image = buffer.toString("base64");


     const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        new URLSearchParams({
            image: base64Image
        }),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
    );

    return response.data.data.url;
}