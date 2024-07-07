export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const Initials = (name) => {
  if (!name) {
    return "";
  }
  const words = name.split(" ");
  let ini = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    ini = ini + words[i][0];
  }
  return ini.toUpperCase();
};
