# Marshalling

## Introduction

Assumptions:

\f[\begin{array}{l}
  \alpha,\ \beta \in R \\
  n \in N \\
  i \in Z \\
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
          & Closure(this,\ x_1,\ x_2,\ \ldots) \\
          & Object(x_1:V_{JS 1},\ x_2:V_{JS 2},\ \ldots) \\
          & List(V_{JS 1},\ V_{JS 2},\ \ldots)
\end{array}\f]

\f$V_{\Lambda}\f$ is the generic element of the \f$Lambda\f$ set.

Lambda values:

\f[\begin{array}{rl}
  V_{\Lambda} := & Object \\
                 & false \\
                 & true \\
                 & Natural(n) \\
                 & Integer(i) \\
                 & Real(\alpha) \\
                 & Complex(\alpha + i\beta) \\
                 & String(s) \\
                 & Closure(x_1,\ x_2,\ \ldots) \\
                 & List(V_{\Lambda 1},\ V_{\Lambda 2},\ \ldots)
\end{array}\f]

Functions:

\f[\begin{array}{l}
  marshal:\ Lambda \to JavaScript \\
  unmarshal:\ JavaScript \to Lambda
\end{array}\f]

## marshal

\f[\begin{array}{rl}
  marshal(false) & = false \\
  marshal(true) & = true \\
  marshal(Natural(n)) & = Number(n) \\
  marshal(Integer(i)) & = Number(i) \\
  marshal(Real(\alpha)) & = Number(\alpha) \\
  marshal(Complex(\alpha + i \beta)) & = Object(r:\alpha,\ i:\beta) \\
  marshal(String(s)) & = String(s) \\
  marshal(List(V_{\Lambda 1},\ V_{\Lambda 2},\ \ldots) & = List(marshal(V_{\Lambda 1}),\ marshal(V_{\Lambda 2}),\ \ldots)
\end{array}\f]

TODO

## unmarshal

TODO
