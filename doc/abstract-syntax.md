# Abstract Syntax

Let \f$M\f$ be the generic Lambda term, \f$n\f$ the generic unsigned integer literal, \f$\alpha\f$ the generic unsigned floating point literal, and \f$s\f$ the generic string literal.

Curly braces indicate optional parts.

\f[\begin{align}
	M\ :=\ 	& undefined \\
		& null \\
		& true \\
		& false \\
		& n \\
		& \alpha \\
		& s \\
		& \left[\ M_1,\ M_2,\ ...\ \right] \\
		& x \\
		& fix \\
		& this \\
		& x_1\{,\ x_2\{\ ...\ \}\}\ \rightarrow\ M \\
		& M\ N \\
		& let\ x_1\{.x_2\{\ ...\ \}\}\ =\ M\ in\ N \\
\end{align}\f]

Application associativity is left-most, i.e. the following are equivalent:

\f[\begin{align}
	& A\ B\ C \\
	& (A\ B)\ C \\
\end{align}\f]
