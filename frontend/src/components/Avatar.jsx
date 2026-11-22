import { thumb } from "../utils/cloudinary";

const sizes = { sm: "h-10 w-10", md: "h-12 w-12" };

// Shows the photo, or the first letter of the name when there is no photo
const Avatar = ({ name = "", url, size = "md" }) => {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-bold text-primary ${sizes[size]}`}>
      {url ? (
        <img src={thumb(url)} alt={name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        name[0]?.toUpperCase()
      )}
    </div>
  );
};

export default Avatar;
