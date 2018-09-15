import { RAD, DEG, GRAD, MAX_DIGITS_AMOUNT } from './constants';

export function degToRad(a) {
  return a*Math.PI/180;
}
  
export function degToGrade(a) {
  return a/0.9;
}
  
export function radToDeg(a) {
  return 180*a/Math.PI;
}
  
export function radToGrade(a) {
  return a*200/Math.PI;
}
  
export function gradeToDeg(a) {
  return 0.9*a;
}
  
export function gradeToRad(a) {
  return a*Math.PI/200;
}

export function exponentiation(a, b) {
  if (a < 0 && b % 1 != 0) {
    const k1 = 1/(2 * b) - 0.5;
    if (k1 % 1 == 0) return -Math.pow(Math.abs(a), b);
    const k2 = 1/b - 0.5;
    if (k2 % 1 == 0) return Math.pow(Math.abs(a), b);
    return NaN;
  }
  return Math.pow(a, b);
}

export function rootExtraction(a, b) {
  if (a < 0 && b % 2 == 0) return NaN;
  let result = Math.exp(Math.log(Math.abs(a))/b);
  return a > 0 ? result : -result;
}

export function tangent(a) {
  let result = Math.tan(a);
  return Math.abs(result) > Number.MAX_SAFE_INTEGER ? Math.sign(result) * Infinity : result;
}

export function trigFuncHandler(func) {
  return (a, angleMeasure) => {
    let result = NaN;
    switch (angleMeasure) {
      case RAD:
        result = func(a);
        break;
      case DEG:
        result = func(degToRad(a));
        break;
      case GRAD:
        result = func(gradeToRad(a));
        break;
    }
    return Math.abs(result) < Number.EPSILON ? 0 : result;
  }
}

export function invTrigFuncHandler(func) {
  return (a, angleMeasure) => {
    switch (angleMeasure) {
      case RAD:
        return func(a);
      case DEG:
        return radToDeg(func(a));
      case GRAD:
        return radToGrade(func(a));
      default:
        return NaN;
    }
  }
}

export function getFormattedValue(value, precision = MAX_DIGITS_AMOUNT) {
  let digitsAmount, result;
  let str = value.toString();

  if (!isFinite(value)) return str;

  let matchRes = str.match(/^-?(\d+\.?\d*)e[+-]?(\d+)$/i);
  if (matchRes) {
    let mantDigitsCount = matchRes[1].replace(/\D/g, '').length;
    digitsAmount = mantDigitsCount + Number(matchRes[2]);
    if (digitsAmount > precision) {
      result = (mantDigitsCount > precision - 3)
             ? value.toExponential(precision - 4).replace(/\.?0+e/, 'e')
             : str;
    } else {
      result = value.toFixed(precision).replace(/\.?0+$/, '');
    }
  } else {
    digitsAmount = str.replace(/\D/g, '').length;
    if (digitsAmount > precision) {
      let intDigitsCount = value.toFixed().length;
      result = intDigitsCount > precision
             ? value.toExponential(precision - 4).replace(/\.?0+e/, 'e') 
             : value.toFixed(precision - intDigitsCount).replace(/\.?0+$/, '');
    } else {
      result = str;
    }
  }
  return result;
}