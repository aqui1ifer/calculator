import { LOW, MEDIUM, HIGH, VERY_HIGH, OPERATOR, FUNCTION, LEFT, RIGHT } from './constants';
import { exponentiation, rootExtraction, tangent, trigFuncHandler, invTrigFuncHandler } from './utils';

const operations = {
  negation: {
    token: '-',
    tokenRPN: '\u00b1',
    tokenType: OPERATOR,
    priority: VERY_HIGH,
    associative: RIGHT,
    calculate(a) {
      return -a;
    }
  },

  addition: {
    token: '+',
    tokenType: OPERATOR,
    priority: LOW,
    associative: LEFT,
    calculate(a, b) {
      return a + b;
    }
  },

  subtracktion: {
    token: '-',
    tokenType: OPERATOR,
    priority: LOW,
    associative: LEFT,
    calculate(a, b) {
      return a - b;
    }
  },

  multiplication: {
    token: '*',
    tokenType: OPERATOR,
    priority: MEDIUM,
    associative: LEFT,
    calculate(a, b) {
      return a * b;
    }
  },

  division: {
    token: '/',
    tokenType: OPERATOR,
    priority: MEDIUM,
    associative: LEFT,
    calculate(a, b) {
      return a / b;
    }
  },

  modulo: {
    token: 'mod',
    tokenType: OPERATOR,
    priority: MEDIUM,
    associative: LEFT,
    calculate(a, b) {
      return a % b;
    }
  },

  exponentiation: {
    token: '^',
    tokenType: OPERATOR,
    priority: HIGH,
    associative: LEFT,
    calculate: exponentiation
  },

  rootExtraction: {
    token: 'rt',
    tokenType: OPERATOR,
    priority: HIGH,
    associative: LEFT,
    calculate: rootExtraction
  },

  powerFunction: {
    token: 'pow',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: exponentiation
  },

  rootFunction: {
    token: 'root',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: rootExtraction
  },

  expFunction: {
    token: 'exp',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return Math.exp(a);
    }
  },

  logarithm: {
    token: 'log',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a, b) {
      return Math.log(b)/Math.log(a);
    }
  },

  naturalLog: {
    token: 'ln',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return Math.log(a);
    }
  },

  decimalLog: {
    token: 'lg',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return Math.log(a)/Math.LN10;
    }
  },

  factorial: {
    token: 'fact',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      function getGammaFunc(z) {
        //Lanczos approximation
        let result, t;
        let Sum = 0.99999999999980993;
        const C = [
          676.5203681218851, 
          -1259.1392167224028, 
          771.32342877765313, 
          -176.61502916214059, 
          12.507343278686905, 
          -0.13857109526572012, 
          9.9843695780195716e-6, 
          1.5056327351493116e-7
        ];
    
        if (z < 0.5) {
          result = Math.PI/(Math.sin(Math.PI * z) * getGammaFunc(1 - z)); 
        } else {
          z -= 1;
          for (let i = 0; i < C.length; i++) {
            Sum += C[i] / (z + i + 1);
          }
          t = z + C.length - 0.5;
          result = Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * Sum;
        }
        return result;
      }

      function intFactorial(n) {
        let result = 1;
        for (let i = 1; i <= n; i++) {
          result *= i;
        }
        return result;
      }
          
      if (a % 1 === 0) {
        return (a >= 0) ? intFactorial(a) : NaN;
      } else {
        return getGammaFunc(a + 1);
      }
    }
  },

  sine: {
    token: 'sin',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: trigFuncHandler(Math.sin)
  },

  cosine: {
    token: 'cos',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: trigFuncHandler(Math.cos)
  },

  tangent: {
    token: 'tg',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: trigFuncHandler(tangent)
  },

  arcsine: {
    token: 'arcsin',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: invTrigFuncHandler(Math.asin)
  },

  arccosine: {
    token: 'arccos',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: invTrigFuncHandler(Math.acos)
  },

  arctangent: {
    token: 'arctg',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate: invTrigFuncHandler(Math.atan)
  },

  hypSine: {
    token: 'sh',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return (Math.exp(a) - Math.exp(-a))/2;
    }
  },

  hypCosine: {
    token: 'ch',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return (Math.exp(a) + Math.exp(-a))/2;
    }
  },

  hypTangent: {
    token: 'th',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return (Math.exp(2 * a) - 1)/(Math.exp(2 * a) + 1);
    }
  },

  invHypSine: {
    token: 'arsh',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return Math.log(a + Math.sqrt(a * a + 1));
    }
  },

  invHypCosine: {
    token: 'arch',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return Math.log(a + Math.sqrt(a * a - 1));
    }
  },

  invHypTangent: {
    token: 'arth',
    tokenType: FUNCTION,
    priority: HIGH,
    calculate(a) {
      return 0.5 * Math.log((1 + a)/(1 - a));
    }
  }
}

const constants = {
  infinity: {
    token: 'Infinity',
    value: Infinity
  },

  notNumber: {
    token: 'NaN',
    value: NaN
  },

  pi: {
    token: 'Pi',
    value: Math.PI
  },
  
  eulersNumber: {
    token: 'E',
    value: Math.E
  }
}

export { operations, constants };