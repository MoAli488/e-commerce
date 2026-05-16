import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  // secure: true,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Click 'API Keys' above to copy your API secret
});

export default cloudinary;
