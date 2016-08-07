# Lambda

An effort to create the perfect programming language. **Currently in alpha stage**.

## Technical Description

Lambda is an [eagerly evaluated](https://en.wikipedia.org/wiki/Eager_evaluation) [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) with [static Hindley-Milner type system](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system) and a few additions.

The main addition is the [Z combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Strict_fixed_point_combinator) provided as a global predefined term called `fix`. Without this, the language would not be Turing-complete because the type system would prevent some types of computations.

The definition of the Z combinator can't be typed, as it would cause infinite recursion of the typing rules. `fix` is arbitrarily typed as _∀T . (T → T) → T_, which is the most generic type that satisfies the fix-point equation.

The value domain is similar to JavaScript's: other than closures it contains `undefined`, `null`, booleans, strings, numbers, arrays, and even objects. In this way interaction with JavaScript APIs provided by the underlying platform is possible. Lambda automatically marshals and unmarshals values so as to compensate for differences between the two domains.

## Example

The following Fibonacci implementation gives an idea of several implementation choices:

```lambda
let fibonacci = fix fn f, n: integer ->
  if < n 2
  then 1
  else + (f (- n 1)) (f (- n 2)) in

{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}.map fibonacci
```

The program will output `{1, 1, 2, 3, 5, 8, 13, 21, 34, 55}`.

For more information see the [Wiki](https://github.com/71104/lambda/wiki).

## Prerequisites

[Node.js](https://nodejs.org/).

## Installing

`$ npm i -g lambda`

## Getting Started

```
$ lambda
> "Hello, world!"
"Hello, world!"
>
```

## More Information

See the [Wiki](https://github.com/71104/lambda/wiki).
