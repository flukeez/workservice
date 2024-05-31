import fastifyMulter from "fastify-multer";

const storage = fastifyMulter.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "./uploads/user/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = fastifyMulter({ storage: storage });
