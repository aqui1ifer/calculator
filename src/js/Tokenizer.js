import Token from './Token';
import {
  NUM_LITERAL,
  STR_LITERAL,
  OPERATOR,
  FUNCTION,
  LEFT_BRACKET,
  RIGHT_BRACKET,
  ARGUMENT_SEPARATOR
} from './constants';

class Tokenizer {
  constructor() {
    this.unaryFlag = true;
    this.pos = 0;
    this.singleBracketsAmount = 0;
  }

  parse(expression) {
    this.unaryFlag = true;
    this.pos = 0;
    this.singleBracketsAmount = 0;
    let token;
    let result = [];
    while (this.pos < expression.length) {
      if (expression[this.pos] === ' ') {
        this.pos++;
      } else {
        token = this.getToken(expression.slice(this.pos));
        this.changeUnaryFlag(token);
        result.push(token);
      }
    }
    if (this.singleBracketsAmount) {
      throw new Error('Mismatched brackets in input expression');
    }
    return result;
  }

  getToken(str) {
    let char = str[0];
    let token, matchRes;
    
    matchRes = str.match(Token.numberPattern);
    if (matchRes) {
      token = matchRes[0];
      this.pos = this.pos + token.length;

      if (Tokenizer.isValidNumber(token)) {
        return new Token(NUM_LITERAL, token);
      } else {
        throw new Error(`got invalid number: ${token}`);
      }
    }

    matchRes = str.match(Token.operatorPattern);
    if (matchRes) {
      token = matchRes[0];
      this.pos = this.pos + token.length;
      return (this.unaryFlag && Token.isUnaryOperator(token)) ? new Token(OPERATOR, Token.getTokenForRPN(token))
                                                              : new Token(OPERATOR, token);
    }

    matchRes = str.match(Token.functionPattern);
    if (matchRes) {
      this.pos = this.pos + matchRes[0].length;
      return new Token(FUNCTION, matchRes[0]);
    }

    matchRes = str.match(Token.strLiteralPattern);
    if (matchRes) {
      this.pos = this.pos + matchRes[0].length;
      return new Token(STR_LITERAL, matchRes[0]);
    }

    if (char === "(") {
      this.pos++;
      this.singleBracketsAmount++;
      return new Token(LEFT_BRACKET, char);
    }

    if (char === ")") {
      this.pos++;
      this.singleBracketsAmount--;
      return new Token(RIGHT_BRACKET, char);
    }

    if (char === ",") {
      this.pos++;
      return new Token(ARGUMENT_SEPARATOR, char);
    }

    let i = 0;
    while (i < str.length && /[^\s(),]/.test(str[i])) i++;
    token = str.slice(0, i);
    throw new Error(`got undefined symbol ${token}`);
  }

  changeUnaryFlag(prevToken) {
    this.unaryFlag = (prevToken.type == OPERATOR || prevToken.type == LEFT_BRACKET
                                                 || prevToken.type == ARGUMENT_SEPARATOR);
  }

  static isValidNumber(str) {
    const VALID_NUMBER_REGEXP = /^(?:0$|-?[1-9]\d*\.?|-?0\.)(?:\d*[1-9])?(?:e[+-]?(?:0$|[1-9])\d*)?$/i;
    return VALID_NUMBER_REGEXP.test(str);
  }
}

export default Tokenizer;