# Domain

\f$\Sigma\f$ is the alphabet for Lambda variable and field names.
\f$x \in \Sigma^*\f$.

\f$B\f$ is the Boolean set: \f$B \equiv \{true, false\}\f$.

\f[\begin{array}{l}
  b \in B \\
  \alpha, \beta \in R \\
  n \in N \\
  z \in Z \\
  \alpha+i\beta \in C \\
\end{array}\f]

\f$U\f$ is the Unicode character set. \f$s \in U\f$.

\f$\Lambda\f$ is the set of Lambda programs. \f$\lambda \in \Lambda\f$.

The set \f$D_\Lambda\f$ of Lambda values is defined inductively.

A _prototype_ \f$\mu \in M\f$ is a partial function from Lambda names to Lambda
values:

\f[\mu: \Sigma^* \mapsto D_\Lambda\f]

Every value in \f$D_\Lambda\f$ has an associated prototype. The prototype can be
possibly empty so that values are not infinite, but some Lambda values _are_
indeed infinite.

The inductive constructors that define the \f$D_\Lambda\f$ set always have a
\f$\mu\f$ parameter, which is the prototype associated to the constructed value.

Lambda constructors:

\f[\begin{array}{l}
  Undefined: M \to D_\Lambda \\
  Boolean: B \times M \to D_\Lambda \\
  Natural: N \times M \to D_\Lambda \\
  Integer: Z \times M \to D_\Lambda \\
  Real: R \times M \to D_\Lambda \\
  Complex: R^2 \times M \to D_\Lambda \\
  List: D_\Lambda^* \times M \to D_\Lambda \\
  Closure: \Sigma^* \times \Lambda \times M \times M \to D_\Lambda \\
\end{array}\f]

The \f$Closure\f$ constructor has _two_ prototype-like parameters, but only one
of them is the value prototype. The other one is the set of _captured_
variables. The prototype of a closure will be indicated with \f$\mu\f$, while
the capture will be denoted by \f$\nu\f$.

The letters \f$u, v, \ldots\f$ indicate the generic elements of the set.

\f[\begin{array}{rrl}
  D_\Lambda & := & Undefined(\mu) \\
            & |  & Boolean(b,\ \mu) \\
            & |  & Natural(n,\ \mu) \\
            & |  & Integer(z,\ \mu) \\
            & |  & Real(\alpha,\ \mu) \\
            & |  & Complex(\alpha+i\beta,\ \mu) \\
            & |  & String(s,\ \mu) \\
            & |  & List(v_1,\ v_2,\ \ldots,\ \mu) \\
            & |  & Closure(x,\ \lambda,\ \nu,\ \mu) \\
\end{array}\f]

The \f$proto\f$ function denotes the prototype of a value:

\f$proto: D_\Lambda \to M\f$

\f[\begin{array}{rcl}
  proto(Undefined(\mu)) & = & \mu \\
  proto(Boolean(b,\ \mu)) & = & \mu \\
  proto(Natural(n,\ \mu)) & = & \mu \\
  proto(Integer(z,\ \mu)) & = & \mu \\
  proto(Real(\alpha,\ \mu)) & = & \mu \\
  proto(Complex(\alpha+i\beta,\ \mu)) & = & \mu \\
  proto(String(s,\ \mu)) & = & \mu \\
  proto(List(v_1,\ v_2,\ \ldots,\ \mu)) & = & \mu \\
  proto(Closure(x,\ \lambda,\ \nu,\ \mu)) & = & \mu \\
\end{array}\f]
