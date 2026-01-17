const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, "-");
export default slugify;