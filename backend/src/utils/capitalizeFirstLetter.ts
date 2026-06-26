function capitalizeFirstLetter(str: string): string {
  if (!str) { // Check if the string is empty or undefined
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default capitalizeFirstLetter;