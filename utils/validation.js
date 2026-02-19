export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const getValidationErrors = (fields) => {
  const errors = {};

  if (fields.name !== undefined && !validateName(fields.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (fields.email !== undefined && !validateEmail(fields.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (fields.password !== undefined && !validatePassword(fields.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (fields.confirmPassword !== undefined && fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
