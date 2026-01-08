import multer from "multer";

const upload = multer({
  dest: "uploads/events",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export const uploadEventMedia = upload.array("files", 5);
