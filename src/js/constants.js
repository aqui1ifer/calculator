//RegExp special symbols
export const SPECIAL_SYMBOLS = /[\/\.^$*+?]/g;

//Token types
export const NUM_LITERAL = 'NUM_LITERAL';
export const STR_LITERAL = 'STR_LITERAL';
export const OPERATOR = 'OPERATOR';
export const FUNCTION = 'FUNCTION';
export const LEFT_BRACKET = 'LEFT_BRACKET';
export const RIGHT_BRACKET = 'RIGHT_BRACKET';
export const ARGUMENT_SEPARATOR = 'ARGUMENT_SEPARATOR';

//Operation priority
export const LOW = 1;
export const MEDIUM = 2;
export const HIGH = 3;
export const VERY_HIGH = 4;

//Operation associative
export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';

//angle measurement units
export const RAD = 'RAD';
export const DEG = 'DEG';
export const GRAD = 'GRAD';

export const MAX_DIGITS_AMOUNT = 15;

export const KEY_CODES = {
  escape: 27,
  enter: 13,
  backspace: 8,
  digit0: 48,
  digit1: 49,
  digit2: 50,
  digit3: 51,
  digit4: 52,
  digit5: 53,
  digit6: 54,
  digit7: 55,
  digit8: 56,
  digit9: 57,
  numpad0: 96,
  numpad1: 97,
  numpad2: 98,
  numpad3: 99,
  numpad4: 100,
  numpad5: 101,
  numpad6: 102,
  numpad7: 103,
  numpad8: 104,
  numpad9: 105,
  backslash: 220,
  numpadDecimal: 46,
  numpadAdd: 107,
  numpadSubtract: 109,
  numpadMultiply: 106,
  numpadDivide: 111,
  equal: 187,
  minus: 189,
  keyI: 73,
  keyH: 72,
  keyU: 85,
  keyS: 83,
  keyC: 67,
  keyT: 84,
  keyA: 65,
  keyF: 70,
  keyP: 80,
  keyL: 76,
  keyM: 77,
  keyG: 71,
  keyQ: 81,
  keyB: 66,
  keyY: 89
}