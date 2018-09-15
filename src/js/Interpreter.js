import {
  NUM_LITERAL,
  STR_LITERAL,
  OPERATOR,
  FUNCTION,
  LEFT_BRACKET,
  RIGHT_BRACKET,
  ARGUMENT_SEPARATOR,
  LEFT,
  RIGHT
} from './constants';

class Interpreter {
  getRPN(tokens) {
    let stack = [];
    let output = [];
    let lastStackEl;    

    tokens.forEach((token) => {
      switch (token.type) {
        case NUM_LITERAL:
        case STR_LITERAL:
          output.push(token);
          break;

        case FUNCTION:
        case LEFT_BRACKET:
          stack.push(token);
          break;

        case RIGHT_BRACKET:
          lastStackEl = stack[stack.length - 1];
          while (lastStackEl && lastStackEl.type != LEFT_BRACKET) {
            output.push(stack.pop());
            lastStackEl = stack[stack.length - 1];
          }
          if (!stack.length) throw new Error('Missed of opening bracket');
          stack.pop();
          if (stack.length && stack[stack.length - 1].type == FUNCTION) {
            output.push(stack.pop());
          }
          break;

        case ARGUMENT_SEPARATOR:
          lastStackEl = stack[stack.length - 1];
          while (lastStackEl && lastStackEl.type != LEFT_BRACKET) {
            output.push(stack.pop());
            lastStackEl = stack[stack.length - 1];
          }
          if (!stack.length) throw new Error('Wrong used delimiter or missed of opening bracket');
          break;

        case OPERATOR:
          lastStackEl = stack[stack.length - 1];
          while (stack.length && 
                ((token.associative == LEFT && token.priority <= lastStackEl.priority) || 
                (token.associative == RIGHT && token.priority < lastStackEl.priority))
          ) {
            output.push(stack.pop());
            lastStackEl = stack[stack.length - 1];
          }
          stack.push(token);
          break;
      }
    });

    while (stack.length) {
      lastStackEl = stack.pop();
      if (lastStackEl.type == LEFT_BRACKET) throw new Error('Missed of closing bracket');
      output.push(lastStackEl);
    }
    return output;
  }

  calculateRPN(RPNTokens) {
    let stack = [];

    RPNTokens.forEach((token) => {
      switch (token.type) {
        case NUM_LITERAL:
          stack.push(Number(token.value));
          break;

        case STR_LITERAL:
          stack.push(token.constantValue);
          break;

        case OPERATOR:
        case FUNCTION:
          let operandsCount = token.operandsCount;
          if (stack.length < operandsCount) throw new Error('Not enough operands');
          let operands = stack.splice(-operandsCount, operandsCount);
          let result = token.calculate(operands);
          stack.push(result);
          break;

        default:
          throw new Error(`Unacceptable token: ${token}`);
      }
    });
    if (stack.length != 1) throw new Error('Amount of operators doesn`t match to amount of operands');
    return stack.pop();
  }

  getStringRPN(rpn) {
    return rpn.map((token) => token.value).join(' ');
  }
}

export default Interpreter;