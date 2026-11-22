import { useEffect, useMemo } from "react";

// Chuni hui file ka preview URL banata hai (file na ho to fallback URL)
export const useImagePreview = (files, fallback) => {
  const file = files?.[0];
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : fallback), [file, fallback]);

  useEffect(() => () => {
    if (file) URL.revokeObjectURL(preview);
  }, [file, preview]);

  return preview;
};
