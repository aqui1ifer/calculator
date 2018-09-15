import assert from 'assert';
import { tangent, trigFuncHandler, getFormattedValue } from '../src/js/utils';
import { RAD } from '../src/js/constants';

describe('trigonometric function tests', () => {
  const sin = trigFuncHandler(Math.sin);
  const tg = trigFuncHandler(tangent);

  it('Sine Pi * k should be equal zero', () => {
    assert.strictEqual(sin(0, RAD), 0);
    assert.strictEqual(sin(Math.PI, RAD), 0);
    assert.strictEqual(sin(-Math.PI, RAD), 0);
  });

  it('Tangent Pi/2 should be Infinity', () => {
    assert.strictEqual(tg(Math.PI/2, RAD), Infinity);
  });

  it('Tangent Pi should be equal zero', () => {
    assert.strictEqual(tg(Math.PI, RAD), 0);    
  });
});

describe('getFormattedValue function tests', () => {
  it('Should not change special values', () => {
    assert.strictEqual(getFormattedValue(NaN), 'NaN');
    assert.strictEqual(getFormattedValue(Infinity), 'Infinity');
    assert.strictEqual(getFormattedValue(-Infinity), '-Infinity');
  });

  it('Should return normal form for number corresponding to specified precision', () => {
    assert.strictEqual(getFormattedValue(-0.00000123456789), '-0.00000123456789');
    assert.strictEqual(getFormattedValue(1e3), '1000');
    assert.strictEqual(getFormattedValue(1e-9), '0.000000001')
    assert.strictEqual(getFormattedValue(0.0000000000001), '0.0000000000001');
  });

  it('Should return rounded value according to specified precision', () => {
    assert.strictEqual(getFormattedValue(111222333444555.67), '111222333444556');
    assert.strictEqual(getFormattedValue(111222.0123456789), '111222.012345679');
  });

  it('Should return scientific form for number exceeding specified precision', () => {
    assert.strictEqual(getFormattedValue(1e16), '1e+16');
    assert.strictEqual(getFormattedValue(9998887776665554), '9.99888777667e+15');
    assert.strictEqual(getFormattedValue(9.111112222233333e+15), '9.11111222223e+15');
  });
});