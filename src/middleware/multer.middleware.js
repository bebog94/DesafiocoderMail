import multer from "multer";
import { __dirname } from "../utils/utils.js";

const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    if (file.fieldname === "profiles") { 
      return cb(null, `${__dirname}/docs/profiles`);
    } else if (file.fieldname === "products") {
      return cb(null, `${__dirname}/docs/products`);
    } else {
      return cb(null, `${__dirname}/docs/documents`);
    }
  },
  filename: function (req, file, cb) {  
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;