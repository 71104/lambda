# Evaluation

## Default Prototypes

\f[\mu_\textsc{undefined} = \emptyset\f]

TODO

## Environment

\f$E\f$, or the "environment", indicates the generic set of premises on the
left-hand side of \f$\vdash\f$. Each premise has the form \f$x \to v\f$, where
\f$x\f$ is a Lambda variable name and \f$v \in D_\Lambda\f$ is a Lambda value.
The list of premises is ordered from left to right, so if a premise
\f$x \to v\f$ appears after a premise \f$x \to u\f$ for the same variabe
\f$x\f$, \f$x \to v\f$ holds.

Lambda sometimes uses prototypes as environments and environments as prototypes.
In Lambda, a prototype is a valid environment, and viceversa.

## Rules

\f[\frac{}{E \vdash undefined \to Undefined(\mu_\textsc{undefined})}\f]

\f[\frac{}{E \vdash true \to Boolean(true,\ \mu_\textsc{boolean})}\f]

\f[\frac{}{E \vdash false \to Boolean(false,\ \mu_\textsc{boolean})}\f]

\f[\frac{}{E \vdash n \to Natural(n,\ \mu_\textsc{natural})}\f]

\f[\frac{}{E \vdash z \to Integer(z,\ \mu_\textsc{integer})}\f]

\f[\frac{}{E \vdash \alpha \to Real(\alpha,\ \mu_\textsc{real})}\f]

\f[\frac{}{E \vdash \alpha i \to Complex(0+i\alpha,\ \mu_\textsc{complex})}\f]

\f[\frac{}{E \vdash s \to String(s,\ \mu_\textsc{string})}\f]

\f[\frac{\begin{array}{ccc}
  E \vdash M_1 \to v_1 &
  E \vdash M_2 \to v_2 &
  \ldots
\end{array}}{
  E \vdash \{ M_1,\ M_2,\ \ldots \} \to List(v_1,\ v_2,\ \ldots,\ \mu_\textsc{list})
}\f]

\f[\frac{}{E \vdash x \to v} x \to v \in E\f]

\f[\frac{}{E \vdash fix\ M\ N \to M\ (fix\ M)\ N}\f]

\f[\frac{\begin{array}{cc}
  E \vdash M \to v_M &
  E_M \vdash x \to v
\end{array}}{E \vdash M.x \to v} E_M = proto(v_M)\f]

\f[\frac{}{E \vdash fn\ x \rightarrow M \to Closure(x,\ M,\ E,\ \mu_\textsc{closure})}\f]

\f[\frac{}{E \vdash fn\ x:\sigma \rightarrow M \to Closure(x,\ M,\ E,\ \mu_\textsc{closure})}\f]

\f[\frac{\begin{array}{ccc}
  E \vdash M \to Closure(x,\ M \prime,\ E \prime,\ \mu) &
  E \vdash N \to v_N &
  E\prime, x \to v_N \vdash M \prime \to v
\end{array}}{E \vdash M\ N \to v}\f]

\f[\frac{\begin{array}{cc}
  E \vdash M \to v_M &
  E, x \to v_M \vdash N \to v
\end{array}}{E \vdash let\ x = M\ in\ N \to v}\f]

TODO

\f[\frac{\begin{array}{cc}
  E \vdash M_1 \to Boolean(true,\ \mu) &
  E \vdash M_2 \to v
\end{array}}{E \vdash if\ M_1\ then\ M_2\ else\ M_3 \to v}\f]

\f[\frac{\begin{array}{cc}
  E \vdash M_1 \to Boolean(false,\ \mu) &
  E \vdash M_3 \to v
\end{array}}{E \vdash if\ M_1\ then\ M_2\ else\ M_3 \to v}\f]
