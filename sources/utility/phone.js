import DeviceCountry, { TYPE_TELEPHONY } from "react-native-device-country";

export const getFlagEmojiForCountryCode = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
};

export const getCurrentPhoneDialCode = (callback) => {
  const countries = require("../json/countries.json");

  DeviceCountry.getCountryCode(TYPE_TELEPHONY)
    .then(({ code }) => {
      const normalisedCode = code.toUpperCase();

      countries.filter((country) => {
        if (normalisedCode == country.code) {
          const result = {
            ...country,
            code: country.dial_code,
            flag: getFlagEmojiForCountryCode(country.code),
          };
          callback(result);
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
