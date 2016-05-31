# Marshalling

## Introduction

Assumptions:

\f[\begin{array}{l}
  \alpha,\ \beta \in \R \\
  n \in \N \\
  i \in \Z \\
  s \in \Sigma^*
\end{array}\f]

\f$V_{JS}\f$ is the generic element of the \f$JavaScript\f$ set.

JavaScript values:

\f[\begin{array}{rl}
  V_{JS} := & undefined \\
          & null \\
          & false \\
          & true \\
          & Number(\alpha) \\
          & String(s) \\
          & function\ (x_1,\ x_2,\ \ldots)\ \{\ \ldots\ \} \\
          & \{\ x_1:\ V_{JS 1},\ x_2:\ V_{JS 2},\ \ldots\ \} \\
          & \left[\ V_{JS 1},\ V_{JS 2},\ \ldots\ \right]
\end{array}\f]

\f$V_{\Lambda}\f$ is the generic element of the \f$Lambda\f$ set.

Lambda values:

\f[\begin{array}{rl}
  V_{\Lambda} := & TODO
\end{array}\f]

Marshalling functions:

\f[\begin{array}{l}
  marshal:\ Lambda \to JavaScript \\
  unmarshal:\ JavaScript \to Lambda
\end{array}\f]

## marshal

\f[marshal(false) = false\f]

\f[marshal(true) = true\f]

\f[marshal(Natural(n)) = Number(n)\f]

\f[marshal(Integer(i)) = Number(i)\f]

\f[marshal(Real(\alpha)) = Number(\alpha)\f]

\f[marshal(Complex(\alpha + i \beta)) = NativeComplexValue(\alpha,\ \beta)\f]

\f[marshal(String(s)) = String(s)\f]

TODO

## unmarshal

TODO
