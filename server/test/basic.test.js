import test from 'node:test';
import assert from 'node:assert/strict';
const shippingFor = subtotal => subtotal >= 2999 ? 0 : 99;
test('free shipping threshold is 2999 INR', () => { assert.equal(shippingFor(2999), 0); assert.equal(shippingFor(4000), 0); assert.equal(shippingFor(2998), 99); });
test('zero subtotal uses standard shipping calculation', () => { assert.equal(shippingFor(0), 99); });
