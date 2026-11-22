import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IMAGE_HINT, IMAGE_TYPES } from "../utils/imageSchema";

// onRemove is called when the user clicks the small cross on the image (only shown while a new image is chosen)
const ImageField = ({ label, preview, hasFile, onRemove, error, ...inputProps }) => {
  return (
    <div>
      <label htmlFor="image" className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-primary-soft text-primary">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <PhotoIcon className="h-7 w-7" aria-hidden="true" />
            )}
          </div>
          {hasFile && (
            // The after: element makes the tap area bigger than the small icon
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove image"
              className="absolute -right-1 -top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-colors duration-200 after:absolute after:-inset-2.5 hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            id="image"
            type="file"
            accept={IMAGE_TYPES.join(",")}
            aria-invalid={!!error}
            className="block w-full cursor-pointer text-sm text-subtle file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-xl file:border-0 file:bg-primary-soft file:px-4 file:font-semibold file:text-primary hover:file:bg-line"
            {...inputProps}
          />
        </div>
      </div>
      <p className="mt-1.5 text-xs text-subtle">{IMAGE_HINT} Stored on Cloudinary.</p>
      {error && <p role="alert" className="mt-1 text-sm text-red-700">{error.message}</p>}
    </div>
  );
};

export default ImageField;
