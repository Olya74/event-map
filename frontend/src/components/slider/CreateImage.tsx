
type CreateImageProps = {
  src: string;
  alt?: string;
};

function CreateImage({ src, alt ="Image"}: CreateImageProps) {
  return <img src={src} alt={alt}  className="object-cover object-center w-full h-full" draggable={false} />;
}

export default CreateImage;