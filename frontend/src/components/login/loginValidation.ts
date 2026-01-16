const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return passwordRegex.test(password);
};
export { isValidEmail, isValidPassword };