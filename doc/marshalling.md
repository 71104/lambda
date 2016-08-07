# Marshalling

## Introduction

The set \f$D_\Lambda\f$ of Lambda values is defined in [Domain](domain).

The following is a simplified view of the \f$D_{JS}\f$ set of JavaScript values:

\f[\begin{array}{rrl}
  D_{JS} & := & undefined \\
         & |  & null \\
         & |  & true \\
         & |  & false \\
         & |  & Number(\alpha) \\
         & |  & String(s) \\
         & |  & Closure(this,\ x_1,\ x_2,\ \ldots) \\
         & |  & Object(x_1: v_1,\ x_2: v_2,\ \ldots) \\
         & |  & Array(v_1,\ v_2,\ \ldots)
\end{array}\f]

\f$u_\Lambda,\ v_\Lambda,\ \ldots\f$ are the generic elements of
\f$D_\Lambda\f$.

\f$u_{JS},\ v_{JS},\ \ldots\f$ are the generic elements of \f$D_{JS}\f$.

\f[\begin{array}{l}
  marshal:\ D_\Lambda \to D_{JS} \\
  unmarshal:\ D_{JS} \to D_\Lambda \\
\end{array}\f]

## marshal

\f[\begin{array}{rcl}
  marshal(Boolean(true,\ \mu)) & = & true \\
  marshal(Boolean(false,\ \mu)) & = & false \\
  marshal(Natural(n,\ \mu)) & = & Number(n) \\
  marshal(Integer(z,\ \mu)) & = & Number(z) \\
  marshal(Real(\alpha,\ \mu)) & = & Number(\alpha) \\
  marshal(Complex(\alpha+i\beta,\ \mu)) & = & Object(r:\alpha,\ i:\beta) \\
  marshal(String(s,\ \mu)) & = & String(s) \\
  marshal(List(v_{\Lambda 1},\ v_{\Lambda 2},\ \ldots,\ \mu)) & = & Array(marshal(v_{\Lambda 1}),\ marshal(v_{\Lambda 2}),\ \ldots) \\
\end{array}\f]

TODO

## unmarshal

TODO
