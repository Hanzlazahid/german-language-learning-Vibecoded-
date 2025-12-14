// lib/numberUtils.js
// Algorithmic conversion between numbers and German words

const numberToGermanMap = {
  0: 'null',
  1: 'eins',
  2: 'zwei',
  3: 'drei',
  4: 'vier',
  5: 'fünf',
  6: 'sechs',
  7: 'sieben',
  8: 'acht',
  9: 'neun',
  10: 'zehn',
  11: 'elf',
  12: 'zwölf',
  13: 'dreizehn',
  14: 'vierzehn',
  15: 'fünfzehn',
  16: 'sechzehn',
  17: 'siebzehn',
  18: 'achtzehn',
  19: 'neunzehn',
  20: 'zwanzig',
  30: 'dreißig',
  40: 'vierzig',
  50: 'fünfzig',
  60: 'sechzig',
  70: 'siebzig',
  80: 'achtzig',
  90: 'neunzig',
  100: 'hundert',
};

const germanToNumberMap = {
  null: 0,
  eins: 1,
  ein: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  elf: 11,
  zwölf: 12,
  dreizehn: 13,
  vierzehn: 14,
  fünfzehn: 15,
  sechzehn: 16,
  siebzehn: 17,
  achtzehn: 18,
  neunzehn: 19,
  zwanzig: 20,
  dreißig: 30,
  vierzig: 40,
  fünfzig: 50,
  sechzig: 60,
  siebzig: 70,
  achtzig: 80,
  neunzig: 90,
  hundert: 100,
};

// Convert number to German word (algorithmic)
export function numberToGerman(num) {
  if (num < 0) {
    return 'minus ' + numberToGerman(-num);
  }
  
  if (numberToGermanMap[num]) {
    return numberToGermanMap[num];
  }
  
  if (num < 100) {
    const ones = num % 10;
    const tens = Math.floor(num / 10) * 10;
    
    if (ones === 0) {
      return numberToGermanMap[tens];
    }
    
    // German numbers: "einundzwanzig" (21 = "one and twenty")
    const onesWord = ones === 1 ? 'ein' : numberToGermanMap[ones];
    const tensWord = numberToGermanMap[tens];
    
    return `${onesWord}und${tensWord}`;
  }
  
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    
    if (remainder === 0) {
      return hundreds === 1 ? 'hundert' : `${numberToGermanMap[hundreds]}hundert`;
    }
    
    const hundredsWord = hundreds === 1 ? 'hundert' : `${numberToGermanMap[hundreds]}hundert`;
    return `${hundredsWord}${numberToGerman(remainder)}`;
  }
  
  return num.toString(); // Fallback for numbers > 999
}

// Convert German word to number (algorithmic)
export function germanToNumber(germanWord) {
  const normalized = germanWord.toLowerCase().trim();
  
  // Direct mapping
  if (germanToNumberMap[normalized]) {
    return germanToNumberMap[normalized];
  }
  
  // Handle compound numbers (e.g., "einundzwanzig" = 21)
  if (normalized.includes('und')) {
    const parts = normalized.split('und');
    if (parts.length === 2) {
      const first = germanToNumber(parts[0]);
      const second = germanToNumber(parts[1]);
      
      // Pattern: "einundzwanzig" = 1 + 20 = 21
      if (first < 10 && second >= 20 && second % 10 === 0) {
        return first + second;
      }
    }
  }
  
  // Handle hundreds (e.g., "zweihundert" = 200)
  if (normalized.includes('hundert')) {
    const parts = normalized.split('hundert');
    const hundreds = parts[0] ? germanToNumber(parts[0]) : 1;
    const remainder = parts[1] ? germanToNumber(parts[1]) : 0;
    return hundreds * 100 + remainder;
  }
  
  // Try to parse as number directly
  const parsed = parseInt(normalized, 10);
  if (!isNaN(parsed)) {
    return parsed;
  }
  
  return null;
}

// Normalize user input (handles various formats)
export function normalizeGermanNumber(input) {
  if (!input) return null;
  
  const trimmed = input.trim();
  
  // Try parsing as number first
  const asNumber = parseInt(trimmed, 10);
  if (!isNaN(asNumber)) {
    return asNumber;
  }
  
  // Try converting German word to number
  const asGerman = germanToNumber(trimmed);
  if (asGerman !== null) {
    return asGerman;
  }
  
  return null;
}

// Get operator in German
export function operatorToGerman(operator) {
  const operators = {
    '+': 'plus',
    '-': 'minus',
    '*': 'mal',
    '/': 'geteilt durch',
  };
  return operators[operator] || operator;
}

