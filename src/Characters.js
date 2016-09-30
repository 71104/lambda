var Character = {
  UNDEFINED: 0,
  COMPLEX: 1,
  REAL: 2,
  INTEGER: 3,
  NATURAL: 4,
  BOOLEAN: 5,
  STRING: 6,
  LIST: 7,
  TUPLE: 8,
  LAMBDA: 9,
  UNKNOWN: 10,
  JS: {
    UNDEFINED: 11,
    NULL: 12,
  },
};

exports.Character = Character;


// eslint-disable-next-line no-unused-vars
function characterToString(character) {
  return [
    'undefined',
    'complex',
    'real',
    'integer',
    'natural',
    'boolean',
    'string',
    'list',
    'tuple',
    'lambda',
    'unknown',
    'JavaScript.UNDEFINED',
    'JavaScript.NULL',
  ][character];
}
