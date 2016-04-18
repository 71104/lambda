# Abstract Syntax

Let \f$M\f$ be the generic Lambda term, \f$n\f$ the generic unsigned integer
literal, \f$\alpha\f$ the generic unsigned floating point literal, and \f$s\f$
the generic string literal.

Curly braces indicate optional parts.

\f[\begin{align}
  M\ :=\ & undefined \\
         & true \\
         & false \\
         & n \\
         & \alpha \\
         & s \\
         & \left[\ M_1,\ M_2,\ ...\ \right] \\
         & x \\
         & fix \\
         & this \\
         & fn\ x_1\{,\ x_2\{\ ...\ \}\}\ \rightarrow\ M \\
         & M\ N \\
         & let\ x_1\{.x_2\{\ ...\ \}\}\ =\ M\ in\ N \\
         & if\ M_1\ then\ M_2\ else\ M_3 \\
         & throw\ M \\
         & try\ M_1\ catch\ M_2 \\
         & try\ M_1\ finally\ M_2 \\
         & try\ M_1\ catch\ M_2\ finally\ M_3 \\
         & error
\end{align}\f]

Application associativity is left-most, i.e. the following are equivalent:

\f[\begin{align}
  & A\ B\ C \\
  & (A\ B)\ C \\
\end{align}\f]
