# Evaluation

\f[\frac{}{E \vdash k \to k}\f]

\f[\frac{}{E \vdash x \to v} x = v \in E\f]

\f[\frac{\begin{array}{ll}
  E \vdash M \to v_M &
  E_M \vdash x \to v
\end{array}}{E \vdash M.x \to v} E_M = Env(v_M)\f]

\f[\frac{}{E \vdash fn\ x \rightarrow M \to Closure(x, M, E)}\f]

\f[\frac{\begin{array}{ccc}
  E \vdash M \to Closure(x, M \prime, E \prime) &
  E \vdash N \to v_N &
  E\prime, x = v_N \vdash M \prime \to v
\end{array}}{E \vdash M N \to v}\f]

\f[\frac{\begin{array}{cc}
  E \vdash M \to v_M &
  E, x = v_M \vdash N \to v
\end{array}}{E \vdash let\ x = M\ in\ N \to v}\f]

\f[\frac{\begin{array}{ccc}
  E \vdash M \to v_M &
  E \vdash x_1.x_2. \ldots .x_{n - 1} \to v_{n - 1} &
  E, x_1 = Object(E_1, x_2 = Object(E_2, \ldots x_n = Object(E_n, x_n = v_M) \ldots)) \vdash N \to v
\end{array}}{E \vdash let\ x_1.x_2.\ldots.x_n = M\ in\ N \to v} E_i = Env(v_i),\ i = 1 \ldots n \f]

\f[\frac{\begin{array}{cc}
  E \vdash M_1 \to true &
  E \vdash M_2 \to v
\end{array}}{E \vdash if\ M_1\ then\ M_2\ else\ M_3 \to v}\f]

\f[\frac{\begin{array}{cc}
  E \vdash M_1 \to false &
  E \vdash M_3 \to v
\end{array}}{E \vdash if\ M_1\ then\ M_2\ else\ M_3 \to v}\f]
