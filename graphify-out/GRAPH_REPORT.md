# Graph Report - vibe_coding  (2026-05-20)

## Corpus Check
- 66 files · ~11,892 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 513 nodes · 594 edges · 46 communities (16 shown, 30 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `PatientEntity` - 23 edges
2. `request()` - 21 edges
3. `authHeaders()` - 19 edges
4. `CreateDoctorRequest` - 17 edges
5. `UserEntity` - 17 edges
6. `AppointmentEntity` - 17 edges
7. `PrescriptionEntity` - 17 edges
8. `compilerOptions` - 16 edges
9. `DataService` - 16 edges
10. `DoctorEntity` - 15 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/App.tsx → frontend/src/context/AuthContext.tsx
- `AuthView()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AuthView.tsx → frontend/src/context/AuthContext.tsx
- `PatientView()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/PatientView.tsx → frontend/src/context/AuthContext.tsx
- `AdminView()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/AdminView.tsx → frontend/src/context/AuthContext.tsx
- `DoctorView()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/DoctorView.tsx → frontend/src/context/AuthContext.tsx

## Communities (46 total, 30 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (16): dependencies, react, react-dom, devDependencies, autoprefixer, postcss, tailwindcss, @types/react (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (52): AdminView(), defaultDoctors, defaultReportStats, defaultVerifications, doctors, reports, tabs, verifyProfiles (+44 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (4): LabReportEntity, LabReportRepository, PatientRepository, ReportService

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (6): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, include

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (7): DataInitializer, AuthController, LoginRequest, UserRepository, AuthService, UserDetailsServiceImpl, UserDetailsService

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (9): scripts, build, dev, preview, OncePerRequestFilter, JwtAuthenticationFilter, JwtTokenProvider, SecurityConfig (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.10
Nodes (9): analytics, historyRecords, insuranceFiles, PatientView(), prescriptions, reminders, tabs, vaccinations (+1 more)

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (7): Backend, code:bash (cd backend), code:bash (cd frontend), Frontend, MediHistory, Run the project, Stack

## Knowledge Gaps
- **82 isolated node(s):** `composite`, `module`, `moduleResolution`, `allowSyntheticDefaultImports`, `include` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `build` connect `Community 20` to `Community 12`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `DoctorController` connect `Community 8` to `Community 6`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `PatientEntity` connect `Community 19` to `Community 12`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `composite`, `module`, `moduleResolution` to the rest of the system?**
  _82 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._