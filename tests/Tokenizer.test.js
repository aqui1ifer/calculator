import assert from 'assert';
import Tokenizer from '../src/js/Tokenizer';

describe('Test for "isValidNumber" static method', () => {
  describe('Should match correct numbers', () => {
    it('Matches zero', () => {
      assert.ok(Tokenizer.isValidNumber('0'));
    });

    it('Matches integer numbers', () => {
      assert.ok(Tokenizer.isValidNumber('1'));
      assert.ok(Tokenizer.isValidNumber('100'));
    });

    it('Matches integer with decimal dot', () => {
      assert.ok(Tokenizer.isValidNumber('2.'));
    });

    it('Matches non integer numbers', () => {
      assert.ok(Tokenizer.isValidNumber('0.1'));
      assert.ok(Tokenizer.isValidNumber('1.001'));
      assert.ok(Tokenizer.isValidNumber('100.555'));
    });

    it('Matches numbers in scientific form', () => {
      assert.ok(Tokenizer.isValidNumber('2e+2'));
      assert.ok(Tokenizer.isValidNumber('2e-2'));
      assert.ok(Tokenizer.isValidNumber('2e2'));
      assert.ok(Tokenizer.isValidNumber('2.e2'));
      assert.ok(Tokenizer.isValidNumber('2.34e+2'));
      assert.ok(Tokenizer.isValidNumber('2.34e-2'));
      assert.ok(Tokenizer.isValidNumber('2.34e-0'));
      assert.ok(Tokenizer.isValidNumber('2.34e56'));
      assert.ok(Tokenizer.isValidNumber('2.34e+100'));
    });
  });

  describe('should ignore incorrect numbers', () => {
    it('Ignores -0', () => {
      assert.ok(!Tokenizer.isValidNumber('-0'));
    });

    it('Ignores numbers with multiple zeros in the beginning', () => {
      assert.ok(!Tokenizer.isValidNumber('00.1'));
      assert.ok(!Tokenizer.isValidNumber('001'));
      assert.ok(!Tokenizer.isValidNumber('07'));
    });

    it('Ignores numbers with insignificant zeros', () => {
      assert.ok(!Tokenizer.isValidNumber('100.500'));
      assert.ok(!Tokenizer.isValidNumber('0.0'));
    });

    it('Ignores number without integer part', () => {
      assert.ok(!Tokenizer.isValidNumber('.2'));
    });

    it('Ignores incorrect scientific form', () => {
      assert.ok(!Tokenizer.isValidNumber('2e00'));
    });
  });
});