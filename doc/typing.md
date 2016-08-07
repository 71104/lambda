# Typing

Types:

\f[\begin{array}{rcl}
  \iota  & := & bool\ |\ string\ |\ complex\ |\ real\ |\ integer\ |\ natural \\
  \tau   & := & \alpha\ |\ \iota\ |\ \tau \rightarrow \tau \\
  \sigma & := & \tau\ |\ \forall \alpha\ .\ \sigma
\end{array}\f]

Typing rules:

\f[\frac{}{E \vdash k \to \iota}\f]

\f[\frac{}{E \vdash x \to \sigma} x \to \sigma \in E\f]

\f[\frac{}{E \vdash fix \to \forall \alpha\ .\ (\alpha \rightarrow \alpha) \rightarrow \alpha}\f]

\f[\frac{\begin{array}{ll}
  E \vdash M \to \sigma_M &
  E_M \vdash x \to \sigma
\end{array}}{E \vdash M.x \to \sigma} E_M = Env(\sigma_M)\f]

\f[\frac{E, x \to \alpha \vdash M \to \sigma}{E \vdash fn\ x \rightarrow M \to \forall \alpha\ .\ \sigma}\f]

\f[\frac{\begin{array}{ll}
  E \vdash M \to \sigma_M &
  E, x \to \sigma_M \vdash N \to \sigma
\end{array}}{E \vdash let\ x = M\ in\ N \to \sigma}\f]

\f[\frac{}{E \vdash error \to \sigma} error \to \sigma \in E\f]

TODO
