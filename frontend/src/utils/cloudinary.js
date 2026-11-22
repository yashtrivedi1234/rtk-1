// Cloudinary URL me transform jodta hai: chhoti, face-centered, optimized image
export const thumb = (url, size = 96) =>
  url.replace("/upload/", `/upload/c_fill,w_${size},h_${size},g_auto,f_auto,q_auto/`);
