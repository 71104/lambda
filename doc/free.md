# Free Variables

\f[free(k) = \emptyset\f]

\f[free(\{M_1, M_2, \ldots, M_n\}) = \bigcup_{i = 1}^n free(M_i)\f]

\f[free(x) = \{x\}\f]

\f[free(fix) = \emptyset\f]

\f[free(M.x) = free(M)\f]

\f[free(fn\ x \rightarrow M) = free(M) \setminus \{x\}\f]

\f[free(fn\ x:\sigma \rightarrow M) = free(M) \setminus \{x\}\f]

\f[free(M\ N) = free(M) \cup free(N)\f]

\f[free(let\ x = M\ in\ N) = free(M) \cup (free(N) \setminus \{x\})\f]

\f[free(if\ M_1\ then\ M_2\ else\ M_3) = free(M_1) \cup free(M_2) \cup free(M_3)\f]

\f[free(throw\ M) = free(M)\f]

\f[free(try\ M_1\ catch\ M_2) = free(M_1) \cup free(M_2)\f]

\f[free(try\ M_1\ finally\ M_2) = free(M_1) \cup free(M_2)\f]

\f[free(try\ M_1\ catch\ M_2\ finally\ M_3) = free(M_1) \cup free(M_2) \cup free(M_3)\f]

\f[free(error) = \{error\}\f]
