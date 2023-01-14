export const isEmailValid = (value: string) => {
  const regexDomains = /\.\b\w{2,5}\b/;
  return value.match(regexDomains);
};
