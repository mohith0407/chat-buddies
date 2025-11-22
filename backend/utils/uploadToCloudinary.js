import cloudinary from "../config/cloudinary.js";
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "chatapp",
      },
      (error, result) => {
        if (error) {
          console.log("UPLOAD FAILED:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    upload.end(fileBuffer);
  });
};
export default uploadToCloudinary