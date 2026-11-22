import { PhotoIcon } from "@heroicons/react/24/outline";

const ImageField = ({ label, preview, error, ...inputProps }) => {
  return (
    <div>
      <label htmlFor="image" className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <PhotoIcon className="h-7 w-7" aria-hidden="true" />
          )}
        </div>
        <input
          id="image"
          type="file"
          accept="image/*"
          aria-invalid={!!error}
          className="block w-full cursor-pointer text-sm text-subtle file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-xl file:border-0 file:bg-primary-soft file:px-4 file:font-semibold file:text-primary hover:file:bg-line"
          {...inputProps}
        />
      </div>
      <p className="mt-1.5 text-xs text-subtle">JPG or PNG, max 2MB. Images are stored on Cloudinary.</p>
      {error && <p role="alert" className="mt-1 text-sm text-red-700">{error.message}</p>}
    </div>
  );
};

export default ImageField;
