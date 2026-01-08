import { useState } from "react";

export const useFilePreview = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles(prev => [...prev, ...selectedFiles]);

    Promise.all(
      selectedFiles.map(
        file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then(urls => {
      setPreviews(prev => [...prev, ...urls]);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return {
    files,
    previews,
    handlePreview,
    removeFile,
    reset: () => {
      setFiles([]);
      setPreviews([]);
    },
  };
};
