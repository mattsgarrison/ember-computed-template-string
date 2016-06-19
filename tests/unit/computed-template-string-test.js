import Em from 'ember';
import computedTemplateString from 'ember-computed-template-string';
import { module, test } from 'qunit';

module("Computed template string with an import");

var Person = Em.Object.extend({
  name: 'Alex',
  age: 2,
  config: {
    path: '/home'
  },
  greeting: computedTemplateString('Hello ${name}, you are ${age} years old'),
  nested: computedTemplateString('the path is ${config.path}, ok?'),
  multi: computedTemplateString('hi ${name}, bye ${name}'),
  withSingleQuote: computedTemplateString("Single quotes in literal: '' and in property: ${name}"),
  withDoubleQuote: computedTemplateString('Double quotes in literal: "" and in property: ${name}'),
  // es6TemplateString: `You're inside a
  //   multiline template string,`,
  // withMultilineTemplate: computedTemplateString(es6TemplateString),
  withGreeting: computedTemplateString('Hi ${name}, this is your greeting: ${greeting}'),
  isGreetingForAlex: Em.computed.equal('greeting', 'Hello Alex, you are 2 years old'),
  salutation: Em.computed.alias('greeting')

});

test('A template with two properties', function(assert) {
  var person = Person.create({ name: 'Alex', age: 2 });
  assert.equal(person.get('greeting'), 'Hello Alex, you are 2 years old');

  person.setProperties({ name: 'Ben', age: 1 });
  assert.equal(person.get('greeting'), 'Hello Ben, you are 1 years old');
});

test('A template with a nested property', function(assert) {
  var person = Person.create();
  assert.equal(person.get('nested'), 'the path is /home, ok?');

  person.set('config.path', '/garden');
  assert.equal(person.get('nested'), 'the path is /garden, ok?');
});

test('A template with a key used multiple times', function(assert) {
  var person = Person.create({ name: 'Ben' });
  assert.equal(person.get('multi'), 'hi Ben, bye Ben');

  person.set('name', 'Sarah');
  assert.equal(person.get('multi'), 'hi Sarah, bye Sarah');
});

test('A template with a single quote', function(assert) {
  var person = Person.create({ name: 'Ben' });
  assert.equal(person.get('withSingleQuote'), "Single quotes in literal: '' and in property: Ben");
  person.set('name', "Mr O'Shea");
  assert.equal(person.get('withSingleQuote'), "Single quotes in literal: '' and in property: Mr O'Shea");
});

test('A template with a double quote', function(assert) {
  var person = Person.create({ name: 'Ben' });
  assert.equal(person.get('withDoubleQuote'), 'Double quotes in literal: "" and in property: Ben');
  person.set('name', 'Mr O"Shea');
  assert.equal(person.get('withDoubleQuote'), 'Double quotes in literal: "" and in property: Mr O"Shea');
});

// test('A template inside a multiline ES6 template string', function(assert) {
//   var person = Person.create({ name: 'Ben' });
//   debugger;
//   assert.equal(person.get('withMultilineTemplate'), `You\'re inside a
//     multiline template string, Ben`);
// });

test('A chained template', function(assert) {
  var person = Person.create({ name: 'Ben' });
  assert.equal(person.get('withGreeting'), 'Hi Ben, this is your greeting: Hello Ben, you are 2 years old');
  person.set('name', 'Mr O"Shea');
  assert.equal(person.get('withGreeting'), 'Hi Mr O"Shea, this is your greeting: Hello Mr O"Shea, you are 2 years old');
});

test('An equal computed property macro', function(assert) {
  var person = Person.create();
  assert.equal(person.get('isGreetingForAlex'), true);
  person.set('name', 'Ben');
  assert.equal(person.get('isGreetingForAlex'), false);
});

test('A alias computed property macro', function(assert) {
  var person = Person.create();
  assert.equal(person.get('salutation'), person.get('greeting'));
});
