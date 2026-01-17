function capitalizeFirstLetter(str: string): string {
  if (!str) { // Проверка на пустую строку
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default capitalizeFirstLetter;