import { operations, constants } from './operations';
import { OPERATOR, FUNCTION, STR_LITERAL, SPECIAL_SYMBOLS, RAD, DEG, GRAD, LEFT } from './constants';

let prioritiesMap = {};
let calculationFuncs = {};
let associativeMap = {};

let allowedOperators = [];
let allowedFunctions = [];

let unaryOperatorsMap = {};
let constMap = {};

Object.keys(operations).forEach(key => {
  let {token, tokenRPN, tokenType, priority, associative, calculate} = operations[key];
  if (tokenRPN) {
    unaryOperatorsMap[token] = tokenRPN;
    token = tokenRPN;
  }
  prioritiesMap[token] = priority;
  calculationFuncs[token] = calculate;
  if (tokenType == OPERATOR) {
    allowedOperators.push(token);
    associativeMap[token] = associative;
  }
  if (tokenType == FUNCTION) allowedFunctions.push(token);
});

Object.keys(constants).forEach(key => {
  let {token, value} = constants[key];
  constMap[token.toLowerCase()] = value;
})

allowedOperators = allowedOperators.map((token) => token.replace(SPECIAL_SYMBOLS, '\\$&'));
allowedFunctions = allowedFunctions.map((token) => token.replace(SPECIAL_SYMBOLS, '\\$&'));

const allowedOperatorsPattern = new RegExp(`^(?:${allowedOperators.join('|')})`, 'i');
const allowedFunctionsPattern = new RegExp(`^(?:${allowedFunctions.join('|')})`, 'i');
const allowedStrLiteralsPattern = new RegExp(`^(?:${RAD}|${DEG}|${GRAD}|${Object.keys(constMap).join('|')})`, 'i');

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value.toLowerCase();
  }

  get priority() {
    if (this.type == OPERATOR || this.type == FUNCTION) {
      return prioritiesMap[this.value];
    }
    return 0;
  }

  get operandsCount() {
    if (this.type == OPERATOR || this.type == FUNCTION) {
      return calculationFuncs[this.value].length;
    }
    return 0;
  }

  get constantValue() {
    if (this.type == STR_LITERAL && constMap.hasOwnProperty(this.value)) {
      return constMap[this.value];
    }
    return this.value.toUpperCase();
  }

  get associative() {
    if (this.type == OPERATOR) {
      return associativeMap[this.value];
    }
    return LEFT;
  }

  calculate(argsArray) {
    if (this.type == OPERATOR || this.type == FUNCTION) {
      return calculationFuncs[this.value](...argsArray);
    }
    return NaN;
  }

  static get numberPattern() {
    return /^\d+(?:\.\d*)?(?:e[+-]?\d+)?/i;
  }

  static get operatorPattern() {
    return allowedOperatorsPattern;
  }

  static get functionPattern() {
    return allowedFunctionsPattern;
  }

  static get strLiteralPattern() {
    return allowedStrLiteralsPattern;
  }

  static isUnaryOperator(token) {
    return unaryOperatorsMap.hasOwnProperty(token);
  }

  static getTokenForRPN(token) {
    if (Token.isUnaryOperator(token)) {
      return unaryOperatorsMap[token];
    }
    return token;
  }
}

export default Token;