import multer from "multer";

const storage = multer.memoryStorage(); // store in memory buffer

export const upload = multer({ storage });