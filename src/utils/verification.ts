/**
 * Gera um código de verificação numérico de 6 dígitos.
 * @returns {string} Uma string contendo o código de 6 dígitos.
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
