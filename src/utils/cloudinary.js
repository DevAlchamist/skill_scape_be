require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// TO upload the file to cloudinay

const uploadOnCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      resolve(null);
      return;
    }

    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          reject(error);  // Reject the promise on error
        } else {
          // console.log("Upload result:", result);
          resolve(result);  // Resolve the promise with the result
        }
      }
    ).end(fileBuffer); // Send the buffer
  });
};


// To delete the file from cloudinary

const deleteOnCloudinary = async (uploadFileId) => {
  try {
    if (!uploadFileId) return null;
    const response = await cloudinary.api.delete_resources(
      [`${uploadFileId}`],
      {
        type: "upload",
        resource_type: "auto",
      }
    );
    try {
      return response;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    return null;
  }
};

module.exports = { uploadOnCloudinary, deleteOnCloudinary };
