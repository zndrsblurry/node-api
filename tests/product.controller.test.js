'use strict';
const assert = require('node:assert');
const { test } = require('node:test');
const sinon = require('sinon');
const Product = require('../models/product.model.js');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller.js');

//mock implementation of Mongoose methods
Product.find = async () => [{ name: 'Product 1' }, { name: 'Product 2' }];
Product.findById = async (id) =>
  id === '12345' ? { name: 'Product 1' } : null;
Product.create = async (data) => data;
Product.findByIdAndUpdate = async (id, data) => (id === '12345' ? data : null);
Product.findByIdAndDelete = async (id) =>
  id === '12345' ? { name: 'Product to delete' } : null;

//mock express response object
const createMockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

test('getProducts fetches all products', async () => {
  const req = {};
  const res = createMockResponse();

  await getProducts(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, [
    { name: 'Product 1' },
    { name: 'Product 2' },
  ]);
});

test('getProducts handles errors', async () => {
  sinon.stub(Product, 'find').throws(new Error('Database error'));

  const req = {};
  const res = createMockResponse();

  await getProducts(req, res);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { message: 'Database error' });

  Product.find.restore();
});

test('getProduct fetches a product by ID', async () => {
  const req = { params: { id: '12345' } };
  const res = createMockResponse();

  await getProduct(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { name: 'Product 1' });
});

test('getProduct handles errors', async () => {
  sinon.stub(Product, 'findById').throws(new Error('Database error'));

  const req = { params: { id: '12345' } };
  const res = createMockResponse();

  await getProduct(req, res);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { message: 'Database error' });

  Product.findById.restore();
});

test('createProduct creates a new product', async () => {
  const req = { body: { name: 'Product 1' } };
  const res = createMockResponse();

  await createProduct(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { name: 'Product 1' });
});

test('createProduct handles errors', async () => {
  sinon.stub(Product, 'create').throws(new Error('Database error'));

  const req = { body: { name: 'Product 1' } };
  const res = createMockResponse();

  await createProduct(req, res);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { message: 'Database error' });

  Product.create.restore();
});

test('updateProduct updates a product', async () => {
  const req = { params: { id: '12345' }, body: { name: 'Product 1' } };
  const res = createMockResponse();

  await updateProduct(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { name: 'Product 1' });
});

test('updateProduct handles errors', async () => {
  sinon.stub(Product, 'findByIdAndUpdate').throws(new Error('Database error'));

  const req = { params: { id: '12345' }, body: { name: 'Product 1' } };
  const res = createMockResponse();

  await updateProduct(req, res);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { message: 'Database error' });

  Product.findByIdAndUpdate.restore();
});

test('deleteProduct deletes a product', async () => {
  const req = { params: { id: '12345' } };
  const res = createMockResponse();

  await deleteProduct(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { message: 'Product deleted successfully' });
});

test('deleteProduct handles errors', async () => {
  sinon.stub(Product, 'findByIdAndDelete').throws(new Error('Database error'));

  const req = { params: { id: '12345' } };
  const res = createMockResponse();

  await deleteProduct(req, res);

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { message: 'Database error' });

  Product.findByIdAndDelete.restore();
});

test('returns 404 if product not found for update', async () => {
  const req = { params: { id: '67890' }, body: { name: 'Updated Product' } };
  const res = createMockResponse();

  await updateProduct(req, res);

  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { message: 'Product not found' });
});

test('returns 404 if product not found for delete', async () => {
  const req = { params: { id: '67890' } };
  const res = createMockResponse();

  await deleteProduct(req, res);

  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { message: 'Product not found' });
});
