# Abstract Syntax

Let \f$M\f$ be the generic Lambda term, \f$n\f$ the generic unsigned integer
literal, \f$\alpha\f$ the generic unsigned floating point literal, and \f$s\f$
the generic string literal.

\f[\begin{array}{rcl}
  M & := & true \\
    &    & false \\
    &    & n \\
    &    & \alpha \\
    &    & \alpha i \\
    &    & s \\
    &    & \{\ M_1,\ M_2, \ldots \} \\
    &    & x \\
    &    & fix \\
    &    & M.x \\
    &    & fn\ x \rightarrow M \\
    &    & fn\ x:\sigma \rightarrow M \\
    &    & M\ N \\
    &    & let\ x_1.x_2. \ldots = M\ in\ N \\
    &    & if\ M_1\ then\ M_2\ else\ M_3 \\
    &    & throw\ M \\
    &    & try\ M_1\ catch\ M_2 \\
    &    & try\ M_1\ finally\ M_2 \\
    &    & try\ M_1\ catch\ M_2\ finally\ M_3 \\
    &    & error \\
\end{array}\f]

Syntax sugar:

\f[\begin{array}{l}
  fn\ x_1,\ x_2,\ \ldots \rightarrow M \equiv fn\ x_1 \rightarrow fn\ x_2 \rightarrow \ldots \rightarrow M \\
  fn\ x_1:\sigma_1,\ x_2:\sigma_2,\ \ldots \rightarrow M \equiv fn\ x_1:\sigma_1 \rightarrow fn\ x_2:\sigma_2 \rightarrow \ldots \rightarrow M
\end{array}\f]

Application associativity is left-most, i.e. the following are equivalent:

\f[\begin{array}{l}
  A\ B\ C \\
  (A\ B)\ C
\end{array}\f]
