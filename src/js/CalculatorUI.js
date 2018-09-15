import { leftColumnBtns, rightColumnBtns, ATTRIBUTE_NAME } from './buttonOptions';
import { KEY_CODES } from './constants';
import { operations, constants } from './operations';
import Calculator from './Calculator';
import style from'../style.css';

class CalculatorUI {
  constructor() {
    this.container = null;
    this.invMark = null;
    this.hypMark = null;
    this.drgMark = null;
    this.statusBar = null;
    this.display = null;
    this.historyPanel = null;

    this.trigBlock = new Map();
    this.functionBlock = new Map();

    this.inverseFunc = false;
    this.hyperbolic = false;

    this.calculator = new Calculator();
  }

  calculate(expression) {
    if (typeof expression != 'string') throw new Error('Input expression should be a string');
    return this.calculator.calculate(expression);   
  }

  render(container = document.body) {
    if (this.container) throw new Error('Calculator UI already been created');
    if (!(container instanceof HTMLElement)) throw new Error('Container should be a DOM element');

    let displayContainer, historyList, historyToggleBtn, historyClearBtn, panel, column, btnGroup, btn;
    
    this.container = document.createElement('div');
    this.container.className = style.container;
    
    displayContainer = document.createElement('div');
    displayContainer.className = style.displayContainer;
    this.container.appendChild(displayContainer);
    
    this.invMark = document.createElement('div');
    this.invMark.className = style.mark;
    displayContainer.appendChild(this.invMark);
    this.hypMark = displayContainer.appendChild(this.invMark.cloneNode(true));
    this.drgMark = displayContainer.appendChild(this.invMark.cloneNode(true));
    this.drgMark.innerHTML = this.calculator.currentAngleMeasure;

    historyToggleBtn = document.createElement('button');
    historyToggleBtn.className = style.toggler;
    historyToggleBtn.title = 'Открыть журнал';
    displayContainer.appendChild(historyToggleBtn);

    this.historyPanel = document.createElement('div');
    this.historyPanel.className = style.history;
    displayContainer.appendChild(this.historyPanel);

    historyList = document.createElement('ol');
    historyList.className = style.hList;
    this.historyPanel.appendChild(historyList);
    
    historyClearBtn = document.createElement('button');
    historyClearBtn.className = style.hClear;
    historyClearBtn.textContent = 'Очистить журнал';
    this.historyPanel.appendChild(historyClearBtn);
    
    this.statusBar = document.createElement('div');
    this.statusBar.className = style.statusBar;
    displayContainer.appendChild(this.statusBar);
    
    this.display = document.createElement('div');
    this.display.className = style.display;
    this.display.innerHTML = this.calculator.inputString;
    displayContainer.appendChild(this.display);
    
    panel = document.createElement('div');
    panel.className = style.panel;
    this.container.appendChild(panel);

    column = document.createElement('div');
    column.className = style.column;
    leftColumnBtns.forEach(group => {
      btnGroup = document.createElement('div');
      btnGroup.className = style.btnGroup;
      group.forEach(({ attrValue, HTML }) => {
        btn = document.createElement('button');
        btn.className = style.btn;
        btn.setAttribute(ATTRIBUTE_NAME, attrValue);

        if (Array.isArray(HTML)) {
          if (HTML.length > 2) {
            this.trigBlock.set(btn, HTML);
          } else {
            this.functionBlock.set(btn, HTML);
          }
          btn.innerHTML = HTML[0];
        } else {
          btn.innerHTML = HTML;
        }

        btnGroup.appendChild(btn);
      });
      column.appendChild(btnGroup);
    });
    panel.appendChild(column);

    column = document.createElement('div');
    column.className = style.column;
    btnGroup = document.createElement('div');
    btnGroup.className = style.btnGroup;
    rightColumnBtns.forEach(({ attrValue, HTML }) => {
      btn = document.createElement('button');
      btn.className = style.btn;
      btn.setAttribute(ATTRIBUTE_NAME, attrValue);
      btn.innerHTML = HTML;
      btnGroup.appendChild(btn);
    });
    column.appendChild(btnGroup);
    panel.appendChild(column);
    
    container.appendChild(this.container);

    //event handlers
    const historyToggleHandler = (e) => {
      const hideAnimationEnd = () => {
        this.historyPanel.classList.remove(style.historyActive);
        this.historyPanel.removeEventListener('animationend', hideAnimationEnd);
      }

      const scrollAfterOpenAnimation = () => {
        let activeItem = this.historyPanel.querySelector(`.${style.hItemSelected}`);
        if (activeItem) {
          let list = activeItem.parentElement;
          let itemRectObj = activeItem.getBoundingClientRect();
          let listRectObj = list.getBoundingClientRect();
          let top = itemRectObj.top - listRectObj.top + list.scrollTop;
          list.scrollTop = top - (listRectObj.bottom - listRectObj.top)/2 + (itemRectObj.bottom - itemRectObj.top)/2;
        }
        this.historyPanel.removeEventListener('animationend', scrollAfterOpenAnimation);
      }

      e.currentTarget.classList.toggle(style.togglerActive);
      this.historyPanel.classList.toggle(style.historyShow);
      if (this.historyPanel.classList.contains(style.historyActive)) {
        e.currentTarget.title = 'Открыть журнал';
        this.historyPanel.addEventListener('animationend', hideAnimationEnd);
      } else {
        this.historyPanel.classList.add(style.historyActive);
        e.currentTarget.title = 'Закрыть журнал';
        this.historyPanel.addEventListener('animationend', scrollAfterOpenAnimation);
      }
    }

    const historyClearHandler = (e) => {
      this.historyPanel.firstElementChild.innerHTML = '';
      this.calculator.clearHistory();
      this.update();
    }

    const selectListItemHandler = (e) => {
      let target = e.target;
      let idx, lis;
      while (target !== e.currentTarget) {
        if (target.tagName === 'LI') {
          lis = target.parentNode.children;
          idx = Array.prototype.indexOf.call(lis, target);
          target.parentNode.querySelector(`.${style.hItemSelected}`).classList.remove(style.hItemSelected);
          target.classList.add(style.hItemSelected);
          this.calculator.setLastAnswer(idx);
          this.update();
          return;
        } else {
          target = target.parentNode;
        }
      }
    }

    const keydownHandler = (e) => {
      let keyCode = e.keyCode;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.shiftKey) {
        switch (keyCode) {
          case KEY_CODES.digit0:
            this.calculator.addRightBracket();
            this.update();
            break;
          
          case KEY_CODES.digit9:
            this.calculator.addLeftBracket();
            this.update();
            break;
        }
        return
      }

      switch (keyCode) {
        case KEY_CODES.keyI:
          this.inverseToggle();
          break;

        case KEY_CODES.keyH:
          this.hyperbolicToggle();
          break;

        case KEY_CODES.keyU:
          this.calculator.changeAngleUnit();
          this.drgMark.textContent = this.calculator.currentAngleMeasure;
          break;

        case KEY_CODES.digit0:
        case KEY_CODES.numpad0:
          this.calculator.addDigit('0');
          this.update();
          break;

        case KEY_CODES.digit1:
        case KEY_CODES.numpad1:
          this.calculator.addDigit('1');
          this.update();
          break;

        case KEY_CODES.digit2:
        case KEY_CODES.numpad2:
          this.calculator.addDigit('2');
          this.update();
          break;

        case KEY_CODES.digit3:
        case KEY_CODES.numpad3:
          this.calculator.addDigit('3');
          this.update();
          break;

        case KEY_CODES.digit4:
        case KEY_CODES.numpad4:
          this.calculator.addDigit('4');
          this.update();
          break;

        case KEY_CODES.digit5:
        case KEY_CODES.numpad5:
          this.calculator.addDigit('5');
          this.update();
          break;

        case KEY_CODES.digit6:
        case KEY_CODES.numpad6:
          this.calculator.addDigit('6');
          this.update();
          break;

        case KEY_CODES.digit7:
        case KEY_CODES.numpad7:
          this.calculator.addDigit('7');
          this.update();
          break;

        case KEY_CODES.digit8:
        case KEY_CODES.numpad8:
          this.calculator.addDigit('8');
          this.update();
          break;

        case KEY_CODES.digit9:
        case KEY_CODES.numpad9:
          this.calculator.addDigit('9');
          this.update();
          break;

        case KEY_CODES.backslash:
          this.calculator.signToggle();
          this.update();
          break;

        case KEY_CODES.numpadDecimal:
          this.calculator.addDecimalDot();
          this.update();
          break;

        case KEY_CODES.numpadAdd:
          this.calculator.addOperator(operations.addition.token);
          this.update();
          break;

        case KEY_CODES.numpadSubtract:
          this.calculator.addOperator(operations.subtracktion.token);
          this.update();
          break;

        case KEY_CODES.numpadMultiply:
          this.calculator.addOperator(operations.multiplication.token);
          this.update();
          break;

        case KEY_CODES.numpadDivide:
          this.calculator.addOperator(operations.division.token);
          this.update();
          break;

        case KEY_CODES.keyM:
          this.calculator.addOperator(operations.modulo.token);
          this.update();
          break;

        case KEY_CODES.backspace:
          this.calculator.clearEntry();
          this.update();
          break;

        case KEY_CODES.escape:
          this.calculator.reset();
          this.update();
          break;

        case KEY_CODES.enter:
        case KEY_CODES.equal:
          this.executeHandler();
          break;

        case KEY_CODES.keyS:
          this.trigBlockBtnHandler(operations.sine.token,
                                   operations.arcsine.token,
                                   operations.hypSine.token,
                                   operations.invHypSine.token);
          break;

        case KEY_CODES.keyC:
          this.trigBlockBtnHandler(operations.cosine.token,
                                   operations.arccosine.token,
                                   operations.hypCosine.token,
                                   operations.invHypCosine.token);
          break;

        case KEY_CODES.keyT:
          this.trigBlockBtnHandler(operations.tangent.token,
                                   operations.arctangent.token,
                                   operations.hypTangent.token,
                                   operations.invHypTangent.token);
          break;

        case KEY_CODES.keyA:
          this.calculator.addConstant();
          this.update();
          break;

        case KEY_CODES.keyF:
          this.calculator.addFunction(operations.factorial.token);
          this.update();
          break;

        case KEY_CODES.keyP:
          this.calculator.addConstant(this.inverseFunc ? constants.eulersNumber.token : constants.pi.token);
          this.update();
          break;

        case KEY_CODES.keyL:
          this.calculator.addFunction(this.inverseFunc ? operations.naturalLog.token
                                                      : operations.expFunction.token);
          this.update();
          break;

        case KEY_CODES.keyG:
          if (this.inverseFunc) {
            this.calculator.addFunction(operations.decimalLog.token);
          } else {
            this.calculator.addConstant('10');
            this.calculator.addOperator(operations.exponentiation.token);
          }
          this.update();
          break;

        case KEY_CODES.keyQ:
          if (this.inverseFunc) {
            this.calculator.addOperator(operations.rootExtraction.token);
            this.calculator.addConstant('2');
          } else {
            this.calculator.addOperator(operations.exponentiation.token);
            this.calculator.addConstant('2');
          }
          this.update();
          break;

        case KEY_CODES.keyB:
          if (this.inverseFunc) {
            this.calculator.addOperator(operations.rootExtraction.token);
            this.calculator.addConstant('3');
          } else {
            this.calculator.addOperator(operations.exponentiation.token);
            this.calculator.addConstant('3');
          }
          this.update();
          break;

        case KEY_CODES.keyY:
          this.calculator.addOperator(this.inverseFunc ? operations.rootExtraction.token
                                                      : operations.exponentiation.token);
          this.update();
          break;
      }
    }

    const btnsHandler = (e) => {
      let target = e.target;

      while (target !== this.container) {
        if (target.hasAttribute(ATTRIBUTE_NAME)) {
          switch (target.getAttribute(ATTRIBUTE_NAME)) {
            case 'inv':
              this.inverseToggle();
              break;
                
            case 'hyp':
              this.hyperbolicToggle();
              break;

            case 'drg':
              this.calculator.changeAngleUnit();
              this.drgMark.textContent = this.calculator.currentAngleMeasure;
              break;

            case 'digit':
              this.calculator.addDigit(target.textContent);
              this.update();
              break;

            case 'sign':
              this.calculator.signToggle();
              this.update();
              break;

            case 'dot':
              this.calculator.addDecimalDot();
              this.update();
              break;

            case 'ce':
              this.calculator.clearEntry();
              this.update()
              break;

            case 'c':
              this.calculator.reset();
              this.update();
              break;

            case 'sin':
              this.trigBlockBtnHandler(operations.sine.token,
                                       operations.arcsine.token,
                                       operations.hypSine.token,
                                       operations.invHypSine.token);
              break;

            case 'cos':
              this.trigBlockBtnHandler(operations.cosine.token,
                                       operations.arccosine.token,
                                       operations.hypCosine.token,
                                       operations.invHypCosine.token);
              break;

            case 'tg':
              this.trigBlockBtnHandler(operations.tangent.token,
                                       operations.arctangent.token,
                                       operations.hypTangent.token,
                                       operations.invHypTangent.token);
              break;

            case 'ans':
              this.calculator.addConstant();
              this.update();
              break;

            case 'fact':
              this.calculator.addFunction(operations.factorial.token);
              this.update();
              break;

            case 'const':
              this.calculator.addConstant(this.inverseFunc ? constants.eulersNumber.token : constants.pi.token);
              this.update();
              break;

            case 'lb':
              this.calculator.addLeftBracket();
              this.update();
              break;

            case 'rb':
              this.calculator.addRightBracket();
              this.update();
              break;

            case 'ln':
              this.calculator.addFunction(this.inverseFunc ? operations.naturalLog.token
                                                          : operations.expFunction.token);
              this.update();
              break;

            case 'lg':
              if (this.inverseFunc) {
                this.calculator.addFunction(operations.decimalLog.token);
              } else {
                this.calculator.addConstant('10');
                this.calculator.addOperator(operations.exponentiation.token);
              }
              this.update();
              break;

            case 'sqr':
              if (this.inverseFunc) {
                this.calculator.addOperator(operations.rootExtraction.token);
                this.calculator.addConstant('2');
              } else {
                this.calculator.addOperator(operations.exponentiation.token);
                this.calculator.addConstant('2');
              }
              this.update();
              break;

            case 'cube':
              if (this.inverseFunc) {
                this.calculator.addOperator(operations.rootExtraction.token);
                this.calculator.addConstant('3');
              } else {
                this.calculator.addOperator(operations.exponentiation.token);
                this.calculator.addConstant('3');
              }
              this.update();
              break;

            case 'pow':
              this.calculator.addOperator(this.inverseFunc ? operations.rootExtraction.token
                                                          : operations.exponentiation.token);
              this.update();
              break;

            case 'add':
              this.calculator.addOperator(operations.addition.token);
              this.update();
              break;

            case 'sub':
              this.calculator.addOperator(operations.subtracktion.token);
              this.update();
              break;

            case 'mul':
              this.calculator.addOperator(operations.multiplication.token);
              this.update();
              break;

            case 'div':
              this.calculator.addOperator(operations.division.token);
              this.update();
              break;

            case 'mod':
              this.calculator.addOperator(operations.modulo.token);
              this.update();
              break;

            case 'equal':
              this.executeHandler();
              break; 
          }
          return;
        } else {
          target = target.parentNode;
        }
      }
    }
    
    historyToggleBtn.addEventListener('click', historyToggleHandler);
    historyClearBtn.addEventListener('click', historyClearHandler);
    historyList.addEventListener('click', selectListItemHandler);
    window.addEventListener('keydown', keydownHandler);
    this.container.addEventListener('click', btnsHandler);
  }

  update(statusText) {
    this.display.textContent = this.calculator.inputString;
    if (statusText) {
      this.statusBar.textContent = statusText;
    } else {
      this.statusBar.textContent = `Last answer = ${this.calculator.lastAnswer}`;
    }
  }

  inverseToggle() {
    this.inverseFunc = !this.inverseFunc;
    this.invMark.textContent = this.inverseFunc ? '2ndF' : '';

    this.trigBlock.forEach((html, btn) => {
      if (this.hyperbolic) {
        btn.innerHTML = this.inverseFunc ? html[3] : html[2];
      } else {
        btn.innerHTML = this.inverseFunc ? html[1] : html[0];
      }
    });
    this.functionBlock.forEach((html, btn) => {
      btn.innerHTML = this.inverseFunc ? html[1] : html[0];
    });
  }

  hyperbolicToggle() {
    this.hyperbolic = !this.hyperbolic;
    this.hypMark.textContent = this.hyperbolic ? 'HYP' : '';

    this.trigBlock.forEach((html, btn) => {
      if (this.hyperbolic) {
        btn.innerHTML = this.inverseFunc ? html[3] : html[2];
      } else {
        btn.innerHTML = this.inverseFunc ? html[1] : html[0];
      }
    });
  }

  trigBlockBtnHandler(func, invFunc, hypFunc, invHyp) {
    if (this.hyperbolic) {
      this.calculator.addFunction(this.inverseFunc ? invHyp : hypFunc);
    } else {
      this.calculator.addFunction(this.inverseFunc ? invFunc : func, true);
    }
    this.update();
  }

  executeHandler() {
    let { error, expression, answer } = this.calculator.execute();
    if (error) {
      this.update(error);
    } else {
      this.update(`${expression} =`);
      this.addToHistoryList(expression, answer);
    }
  }

  addToHistoryList(expression, answer) {
    let lastSelectedLi = this.historyPanel.querySelector(`.${style.hItemSelected}`);
    if (lastSelectedLi) lastSelectedLi.classList.remove(style.hItemSelected);

    let historyList = this.historyPanel.firstElementChild;
    let li = document.createElement('li');
    li.className = `${style.hItem} ${style.hItemSelected}`;
    li.textContent = `${expression} = ${answer}`;
    historyList.appendChild(li);
    historyList.scrollTop = historyList.scrollHeight;
  }
}

export default CalculatorUI;