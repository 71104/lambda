var Character = {
  UNDEFINED: 0,
  COMPLEX: 1,
  REAL: 2,
  INTEGER: 3,
  NATURAL: 4,
  BOOLEAN: 5,
  STRING: 6,
  LIST: 7,
  LAMBDA: 8,
  UNKNOWN: 9,
  JS: {
    UNDEFINED: 10,
    NULL: 11,
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
    'lambda',
    'unknown',
    'JavaScript.UNDEFINED',
    'JavaScript.NULL',
  ][character];
}
