# Lambda

An effort to create the perfect programming language. **Currently in alpha stage**.

## Technical Description

Lambda is an [eagerly evaluated](https://en.wikipedia.org/wiki/Eager_evaluation) [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) with [static Hindley-Milner type system](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system) and a few additions.

The most relevant additions are:

- a [fixed point combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator) suitable for eager languages (a.k.a. [Z combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed_point_combinator));
- **if**-**then**-**else**;
- infix operators (e.g. `x + y * z`);
- exceptions;
- an expressive value domain that includes closures, booleans, strings, several numeric sets (naturals, integers, reals, complex), lists, and objects;
- all JavaScript APIs exposed by the underlying environment, whether it's [Node.js](https://nodejs.org/), the browser, or anything else.

Recall that Hindley-Milner also requires a [let statement](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system#Let-polymorphism).

## Example

The following Fibonacci implementation gives an idea of several implementation choices:

```lambda
let fibonacci = fix fn f, n ->
  if n < 2
  then 1
  else f (n - 1) + f (n - 2) in

{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}.map fibonacci
```

The above outputs `{1, 1, 2, 3, 5, 8, 13, 21, 34, 55}`.

For more information see the [Wiki](https://github.com/71104/lambda/wiki).

## Prerequisites

[Node.js](https://nodejs.org/).

## Installing

`$ npm i -g lambda`

## Getting Started

```
$ lambda
> 'Hello, world!'
'Hello, world!'
>
```

## More Information

See the [Wiki](https://github.com/71104/lambda/wiki).
