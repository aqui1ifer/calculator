import { DEG, RAD, GRAD, MAX_DIGITS_AMOUNT } from './constants';
import Interpreter from './Interpreter';
import Tokenizer from './Tokenizer';
import { operations } from './operations';
import { getFormattedValue } from './utils';

const measurements = [DEG, RAD, GRAD];

class Calculator {
  constructor() {
    this.currentAngleMeasure = DEG;
    this.isInitialState = true;

    this.inputString = '0';
    this.digitBuffer = '';
    this.constBuffer = '';
    this.lastAnswer = '0';
    this.bracketStack = [];
    this.history = [];

    this.tokenizer = new Tokenizer();
    this.interpreter = new Interpreter();
  }

  calculate(expression) {
    let tokens = this.tokenizer.parse(expression);
    let rpn = this.interpreter.getRPN(tokens);
    let answer = this.interpreter.calculateRPN(rpn);
    return getFormattedValue(answer);    
  }

  prepareInputStr() {
    if (this.isInitialState) {
      this.isInitialState = false;
      this.inputString = '';
    }
  }

  clearBuffers() {
    if (~this.digitBuffer.indexOf('.')) {
      this.inputString = this.inputString.replace(/\.?0*$/, '');
    }
    this.digitBuffer = '';
    this.constBuffer = '';
  }

  changeAngleUnit(unit) {
    if (!arguments.length) {
      let idx = measurements.indexOf(this.currentAngleMeasure);
      idx = (idx + 1) % measurements.length;
      this.currentAngleMeasure = measurements[idx];
      return;
    }

    if (~measurements.indexOf(unit)) {
      this.currentAngleMeasure = unit;
    } else {
      throw new Error(`One of the following values was expected\n${measurements}`);
    }
  }

  addDigit(digit) {
    let amountOfDigits = this.digitBuffer.replace(/\D+/g, '').length;

    if (amountOfDigits >= MAX_DIGITS_AMOUNT) return;
    this.prepareInputStr();
    if (/\)$/.test(this.inputString) || this.constBuffer) {
      this.inputString += ` ${operations.multiplication.token} `;
      this.constBuffer = '';
    }

    if (this.digitBuffer == '0') {
      this.digitBuffer = digit;
      this.inputString = this.inputString.slice(0, -1) + digit;
    } else {
      this.digitBuffer += digit;
      this.inputString += digit;
    }
  }

  addConstant(value) {
    if (!arguments.length) {
      value = this.lastAnswer;
    }
    if (!value) return;
    if (this.isInitialState) {
      this.isInitialState = false;
      this.inputString = '';
    } else if (/[\w)]$/.test(this.inputString)) {
      this.inputString += ` ${operations.multiplication.token} `;
    }
    
    this.clearBuffers();
    if (isFinite(value)) {
      this.constBuffer = getFormattedValue(Number(value));
    } else {
      this.constBuffer = /^[a-z]\w*$/i.test(value) ? value : 'NaN';
    }
    this.inputString += this.constBuffer;
  }

  signToggle() {
    if (this.digitBuffer === '0') return;
    if (/[)-]$/.test(this.inputString)) return;
    this.prepareInputStr();

    let entry = this.digitBuffer || this.constBuffer;
    if (entry) {
      this.inputString = this.inputString.substr(0, this.inputString.length - entry.length);
      this.inputString = (this.inputString[this.inputString.length - 1] == '-')
                       ? this.inputString.slice(0, -1) + entry 
                       : `${this.inputString}-${entry}`;
    } else {
      this.inputString += '-';
    }
  }

  addDecimalDot() {
    let amountOfDigits = this.digitBuffer.replace(/\D+/g, '').length;

    if (~this.digitBuffer.indexOf('.')) return;
    if (amountOfDigits >= MAX_DIGITS_AMOUNT) return;
    this.prepareInputStr();
    if (this.digitBuffer) {
      this.digitBuffer += '.';
      this.inputString += '.';
    } else {
      this.digitBuffer = '0.';
      this.constBuffer = '';
      this.inputString += /[\w)]$/.test(this.inputString) ? ` ${operations.multiplication.token} 0.` : '0.';
    }
  }

  clearEntry() {
    let char = this.inputString[this.inputString.length - 1];
    if (this.isInitialState) {
      this.isInitialState = false;
      this.inputString = '';
    } else if (char == '(') {
      this.inputString = this.inputString.replace(/\w*\($/, '');
      this.bracketStack.pop();
    } else if (char == ')') {
      this.inputString = this.inputString.replace(/(?:,\s\w+)?\)$/, (str) => {
        this.bracketStack.push(str.length > 1);
        return '';
      });
    } else if (char == ' ') {
      this.inputString = this.inputString.replace(/\s\S+\s$/, '');
    } else {
      this.inputString = this.constBuffer ? this.inputString.slice(0, -this.constBuffer.length)
                                          : this.inputString.slice(0, -1);
    }

    if (!this.inputString) {
      this.isInitialState = true;
      this.inputString = '0';
      this.digitBuffer = '';
      this.constBuffer = '';
    } else {
      let matchRes = this.inputString.match(/[a-z]\w*$/i);
      if (matchRes) {
        this.constBuffer = matchRes[0];
        this.digitBuffer = '';
        return;
      }
      matchRes = this.inputString.match(/\d+(?:\.\d*)?(?:e[+-]?\d+)?$/i);
      if (matchRes) {
        this.constBuffer = '';
        this.digitBuffer = matchRes[0];
        return;
      }
      this.digitBuffer = this.constBuffer = '';
    }
  }

  reset(initialInput = '0') {
    this.isInitialState = true;
    this.inputString = initialInput;
    this.digitBuffer = '';
    this.constBuffer = '';
    this.bracketStack = [];
  }

  addOperator(token) {
    this.isInitialState = false;
    this.clearBuffers();
    if (/[(-]$/.test(this.inputString)) return;
    if (/\s$/.test(this.inputString)) {
      this.inputString = this.inputString.replace(/\S+(?=\s$)/, token);
    } else  {
      this.inputString += ` ${token} `;
    }
  }

  addFunction(token, isTrig = false) {
    this.prepareInputStr();
    this.clearBuffers();
    this.bracketStack.push(isTrig);
    if (/[\w)]$/.test(this.inputString)) {
      this.inputString += ` ${operations.multiplication.token} ${token}(`;
    } else {
      this.inputString += `${token}(`;
    }
  }

  addLeftBracket() {
    this.prepareInputStr();
    this.clearBuffers();
    this.bracketStack.push(false);
    if (/[\w)]$/.test(this.inputString)) {
      this.inputString += ` ${operations.multiplication.token} (`;
    } else {
      this.inputString += '(';
    }
  }

  addRightBracket() {
    if (!this.bracketStack.length) return;
    if (/[^\w)]$/.test(this.inputString)) return;
    this.clearBuffers();

    this.inputString += this.bracketStack.pop() ? `, ${this.currentAngleMeasure})` : ')';
  }

  execute() {
    let expression = '';
    let answer;
    for (let i = this.bracketStack.length - 1; i >= 0; i--) {
      expression += this.bracketStack[i] ? `, ${this.currentAngleMeasure})` : ')';
    }
    if (~this.digitBuffer.indexOf('.')) {
      this.inputString = this.inputString.replace(/\.?0*$/, '');
    }
    expression = this.inputString + expression;

    try {
      answer = this.calculate(expression);
      if (!isFinite(answer)) {
        this.reset(answer);
        throw new Error(`Incorrect input: ${expression}`);
      }
    } catch(e) {
      return { error: e.message };
    }

    this.history.push({ expression, answer });
    this.lastAnswer = answer;
    this.reset(answer);

    return { expression, answer };
  }

  setLastAnswer(idx) {
    this.lastAnswer = this.history[idx].answer;
  }

  clearHistory() {
    this.history = [];
    this.lastAnswer = '0';
  }
}

export default Calculator;