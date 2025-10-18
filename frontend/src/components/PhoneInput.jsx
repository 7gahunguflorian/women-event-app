import React, { useState } from 'react';

const PhoneInput = ({ value, onChange, required }) => {
  const countries = [
    { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮', pattern: /^[67]\d{7}$/ },
    { code: 'CD', name: 'RD Congo', dialCode: '+243', flag: '🇨🇩', pattern: /^[89]\d{8}$/ },
    { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', pattern: /^[7]\d{8}$/ },
    { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', pattern: /^[7]\d{8}$/ },
    { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', pattern: /^[67]\d{8}$/ },
    { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', pattern: /^[7]\d{8}$/ },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', pattern: /^[67]\d{8}$/ },
    { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', pattern: /^4\d{8}$/ },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', pattern: /^\d{10}$/ },
    { code: 'US', name: 'USA', dialCode: '+1', flag: '🇺🇸', pattern: /^\d{10}$/ },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Burundi par défaut
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleCountryChange = (e) => {
    const country = countries.find(c => c.code === e.target.value);
    setSelectedCountry(country);
    validateAndUpdate(phoneNumber, country);
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/\D/g, ''); // Garder seulement les chiffres
    setPhoneNumber(number);
    validateAndUpdate(number, selectedCountry);
  };

  const validateAndUpdate = (number, country) => {
    const fullNumber = number ? `${country.dialCode}${number}` : '';
    const valid = number === '' || country.pattern.test(number);
    setIsValid(valid);
    onChange({ target: { name: 'phone', value: fullNumber } });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Country Selector */}
        <div className="relative w-32 sm:w-40">
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-smooth appearance-none text-sm sm:text-base"
            style={{ paddingRight: '2rem' }}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
            {selectedCountry.dialCode}
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={selectedCountry.code === 'BI' ? '79123456' : 'Numéro'}
            className={`w-full pl-14 sm:pl-16 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-smooth text-sm sm:text-base ${
              !isValid && phoneNumber !== ''
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            required={required}
          />
        </div>
      </div>
      
      {!isValid && phoneNumber !== '' && (
        <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm">
          Numéro invalide pour {selectedCountry.name}
        </p>
      )}
      
      <p className="text-gray-500 dark:text-gray-400 text-xs">
        Format attendu pour {selectedCountry.name}: {selectedCountry.dialCode} + {
          selectedCountry.code === 'BI' ? '7/6 + 7 chiffres' :
          selectedCountry.code === 'CD' ? '8/9 + 8 chiffres' :
          selectedCountry.code === 'RW' ? '7 + 8 chiffres' :
          selectedCountry.code === 'FR' ? '6/7 + 8 chiffres' :
          selectedCountry.code === 'BE' ? '4 + 8 chiffres' :
          selectedCountry.code === 'CA' || selectedCountry.code === 'US' ? '10 chiffres' :
          '7 + 8 chiffres'
        }
      </p>
    </div>
  );
};

export default PhoneInput;
