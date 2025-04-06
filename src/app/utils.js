import { symbols } from "@/data/symbols";

/**
 * @param {string} upperCaseCurrencyCode
 * @returns {string}
 */
export const getCurrencySymbol = (upperCaseCurrencyCode) => {
  return symbols[upperCaseCurrencyCode]?.symbol || upperCaseCurrencyCode;
};