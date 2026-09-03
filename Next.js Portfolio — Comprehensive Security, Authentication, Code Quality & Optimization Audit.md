# Next.js Portfolio — Comprehensive Security, Authentication, Code Quality & Optimization Audit

You are performing a **deep security and code-quality audit** of this entire Next.js portfolio project.

Your job is to inspect the repository thoroughly and identify:

1. Security vulnerabilities and insecure design
2. Authentication and authorization weaknesses
3. Admin-login security issues
4. General-user login/authentication issues
5. Session, cookie, token, CSRF, XSS, SSRF, injection, and access-control issues
6. Sensitive-data exposure
7. Dead code and dead features
8. Unnecessary dependencies and potentially dangerous dependencies
9. Duplicated/DRY violations
10. Performance and optimization opportunities
11. Next.js-specific security and architecture issues
12. Server/client boundary mistakes
13. API and route-handler weaknesses
14. Middleware/proxy/security-header issues
15. Database/storage/file-upload weaknesses, if applicable
16. Environment-variable and secret-management problems
17. Error-handling and information-disclosure issues
18. Misconfigured caching/static generation/revalidation
19. Potential abuse/rate-limit/brute-force problems
20. Any other issue that could realistically affect the security, reliability, maintainability, or performance of the application

## IMPORTANT OUTPUT RULE

Do NOT explain your findings in the terminal/console.

Do NOT print a long audit into the console.

After completing the audit, create exactly this file at the project root:

`report_20260901.md`

The report must contain the complete audit findings.

If the file already exists, overwrite it with the new complete report.

The final console output should be minimal — only indicate that the audit is complete and where the report was written.

---

# 1. First Understand the Entire Project

Before identifying issues, inspect the project structure and understand how the application works.

Do not make assumptions based only on filenames.

Inspect, where applicable:

- `package.json`
- lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, etc.)
- `next.config.*`
- `middleware.*`
- `proxy.*`
- `tsconfig.json`
- environment-variable usage
- authentication configuration
- database configuration
- ORM configuration
- API routes
- Route Handlers
- Server Actions
- Server Components
- Client Components
- layouts
- pages
- route groups
- dynamic routes
- authentication pages
- admin pages
- protected pages
- public pages
- upload functionality
- media handling
- external API integrations
- third-party SDKs
- utilities
- hooks
- providers
- context
- state management
- error handling
- logging
- caching
- revalidation
- redirects
- cookies
- headers
- CSP/security headers
- static assets
- scripts
- tests
- configuration files

Search the entire repository rather than auditing only obvious authentication files.

Build a mental model of:

- how users authenticate
- how admins authenticate
- how sessions are created
- where authentication state is stored
- how authentication state is validated
- how authorization is enforced
- how protected routes are protected
- how API endpoints verify identity
- how admin privileges are determined
- how general-user privileges are determined
- how logout works
- how password/token/session expiration works
- how sensitive resources are protected
- how client-side and server-side authentication interact

---

# 2. Authentication Audit — Highest Priority

Authentication is the highest-priority part of this audit.

There are potentially two authentication systems:

## A. Admin authentication

Audit the complete admin authentication flow.

Check:

- login endpoint
- admin credential verification
- password hashing
- password comparison
- session creation
- session persistence
- cookies
- JWTs
- refresh tokens
- access tokens
- session expiration
- logout
- session invalidation
- privilege checks
- admin route protection
- admin API protection
- admin Server Actions
- admin-only data access
- admin-only mutations
- admin-only file operations
- password reset/recovery
- account enumeration
- brute-force resistance
- rate limiting
- login attempt handling
- timing attacks
- session fixation
- session hijacking
- session replay
- privilege escalation
- horizontal privilege escalation
- vertical privilege escalation
- IDOR/BOLA
- insecure direct object references
- authorization performed only on the client
- authorization performed only through middleware
- missing server-side authorization
- inconsistent authorization between pages and APIs
- stale admin sessions
- logout behavior
- concurrent sessions
- token revocation
- cookie configuration
- CSRF protection
- origin validation
- redirect behavior after login
- open redirects
- password policy
- leaked credentials
- hardcoded credentials
- development/test credentials accidentally available in production

Determine whether an attacker could:

- access `/admin` without authentication
- access admin APIs without authentication
- invoke admin Server Actions directly
- call protected endpoints manually without using the UI
- modify admin-controlled resources
- bypass middleware
- forge authentication state
- manipulate cookies
- manipulate JWT claims
- escalate a normal account to admin
- reuse an expired session
- reuse a logged-out session
- access another user's resources
- brute-force credentials
- enumerate valid accounts

Do not assume that because a page redirects unauthenticated users, the underlying API/action is secure.

Test the **actual server-side authorization boundary** conceptually by examining the implementation.

---

# 3. General User Authentication Audit

Audit the login system used by normal/general users.

Determine:

- What exactly is being protected?
- Which routes require authentication?
- Which APIs require authentication?
- Which resources require authentication?
- Which actions require authentication?
- Which resources belong to individual users?
- How is user identity derived?
- Can the client provide or manipulate a user ID?
- Is authorization checked against the authenticated session?
- Can one authenticated user access another user's data?
- Can a normal user access admin functionality?
- Can an unauthenticated user invoke protected APIs?
- Are authorization checks duplicated correctly on every sensitive server boundary?

Check specifically for:

- IDOR
- BOLA
- broken access control
- privilege escalation
- insecure object references
- user-ID manipulation
- predictable resource identifiers
- missing ownership checks
- missing role checks
- client-side-only restrictions
- middleware-only restrictions
- API endpoints that trust request body identity
- Server Actions that trust client-provided identity
- insecure redirects
- session fixation
- session reuse
- weak session expiration

---

# 4. Cookies and Sessions

Inspect every authentication-related cookie.

For each important cookie determine whether it appropriately uses:

- `HttpOnly`
- `Secure`
- `SameSite`
- appropriate `Path`
- appropriate domain
- reasonable expiration/max-age
- session vs persistent behavior

Check for:

- authentication cookies accessible to JavaScript unnecessarily
- overly broad cookie scope
- insecure cookies in production
- cross-site request risks
- session tokens exposed in URLs
- tokens exposed through query parameters
- tokens stored in localStorage/sessionStorage when avoidable
- sensitive data stored directly in cookies
- unsigned or weakly protected client-controlled authentication state
- predictable session identifiers

If JWTs are used, inspect:

- signing algorithm
- key management
- secret strength
- expiration
- issuer/audience validation
- claim validation
- algorithm confusion possibilities
- whether client-controlled claims are trusted
- refresh-token handling
- revocation strategy

If database sessions are used, inspect:

- session ID generation
- entropy
- storage
- expiration
- invalidation
- rotation
- cleanup
- lookup behavior

---

# 5. CSRF Audit

Identify every state-changing operation.

Examples:

- POST
- PUT
- PATCH
- DELETE
- Server Actions
- account changes
- admin mutations
- password changes
- profile changes
- media operations
- configuration changes

Determine whether an attacker could cause a victim's browser to perform the operation.

Inspect:

- SameSite cookies
- CSRF tokens
- Origin checks
- Referer checks
- framework protections
- Server Action behavior
- API authentication design

Do not simply report "CSRF protection missing."

Determine whether the current authentication mechanism actually makes the endpoint exploitable.

---

# 6. XSS Audit

Search for all places where untrusted or semi-trusted data can reach HTML.

Pay particular attention to:

- `dangerouslySetInnerHTML`
- raw HTML rendering
- Markdown rendering
- rich text
- user-generated content
- CMS content
- query parameters
- URL parameters
- search parameters
- form inputs
- database content
- admin-created content
- imported content
- SVG
- iframe
- `srcdoc`
- inline scripts
- dynamic script injection
- third-party embeds

Check:

- stored XSS
- reflected XSS
- DOM XSS
- mutation XSS
- unsafe Markdown configuration
- unsafe HTML sanitization
- URL scheme attacks such as `javascript:`
- unsafe SVG handling

Determine whether CSP mitigates the vulnerability.

---

# 7. Injection Audit

Search for:

- SQL injection
- NoSQL injection
- ORM misuse
- command injection
- shell execution
- template injection
- LDAP injection
- path traversal
- filesystem injection
- header injection
- log injection
- unsafe query construction
- dynamic evaluation
- `eval`
- `Function`
- unsafe deserialization

Inspect all user-controlled inputs reaching external systems.

Do not assume an ORM automatically eliminates all injection risks.

---

# 8. SSRF Audit

Search all server-side functionality that fetches URLs supplied directly or indirectly by users.

Examples:

- image proxy
- URL preview
- metadata fetching
- webhook functionality
- remote media import
- API proxy
- OpenGraph fetching
- URL validation
- server-side image processing

Check whether attackers could make the server access:

- localhost
- `127.0.0.1`
- private IP ranges
- cloud metadata endpoints
- internal services
- Docker/Kubernetes services
- arbitrary internal ports

Check for DNS rebinding and redirect-based SSRF where relevant.

---

# 9. File Upload / Media Security

If the application allows file uploads, inspect:

- file type validation
- MIME validation
- extension validation
- magic-byte validation
- filename handling
- path traversal
- storage location
- public/private bucket configuration
- signed URLs
- object permissions
- image processing
- SVG uploads
- executable uploads
- archive uploads
- size limits
- decompression bombs
- malicious metadata
- access-control checks
- deletion authorization
- overwrite behavior

Determine whether uploaded content can become executable or publicly accessible.

---

# 10. Secrets and Sensitive Information

Search the entire repository for:

- API keys
- tokens
- private keys
- passwords
- database URLs
- credentials
- JWT secrets
- OAuth secrets
- webhook secrets
- encryption keys
- development credentials
- production credentials
- hardcoded admin credentials

Inspect:

- `.env`
- `.env.local`
- `.env.production`
- `.env.example`
- configuration files
- client-side code
- `NEXT_PUBLIC_*`
- build output references where available

Determine whether any server-only secret can reach client bundles.

Pay special attention to:

`NEXT_PUBLIC_*`

and any secret accidentally imported into Client Components.

---

# 11. Next.js-Specific Security Audit

Audit the project according to the architecture/version actually being used.

Inspect:

- App Router / Pages Router
- Server Components
- Client Components
- Server Actions
- Route Handlers
- middleware/proxy
- layouts
- redirects
- rewrites
- headers
- caching
- static rendering
- dynamic rendering
- revalidation
- `fetch()` caching
- cookies API
- headers API
- authentication boundaries

Look for:

### Server/Client boundary problems

- secrets imported into Client Components
- privileged server functions exposed to client code
- server-only modules accidentally bundled
- sensitive data passed as props to Client Components
- excessive data sent to browser
- authorization logic implemented only client-side

### Caching problems

Determine whether private/user-specific data could accidentally be cached and served to another user.

Inspect:

- `fetch`
- route caching
- static generation
- ISR
- `revalidate`
- `unstable_cache`
- cache tags
- CDN behavior
- response headers

Pay special attention to authentication-dependent pages.

A page containing user-specific or admin-specific information must not accidentally become publicly cacheable.

---

# 12. Middleware / Proxy Audit

If middleware/proxy exists, inspect it carefully.

Determine:

- what it protects
- what it does not protect
- whether it performs authentication or only routing
- whether sensitive APIs bypass it
- whether route matching is complete
- whether encoded paths can bypass rules
- whether alternate route forms bypass protection
- whether static/API routes are accidentally excluded
- whether redirects can be manipulated
- whether authorization is incorrectly delegated to middleware

Important:

Never consider middleware protection sufficient by itself.

Verify that the final server-side handler also performs appropriate authorization where necessary.

---

# 13. API Security Audit

Inventory every API endpoint / Route Handler.

For each endpoint determine:

- authentication required?
- authorization required?
- input validation?
- output validation?
- rate limiting?
- CSRF relevance?
- sensitive data returned?
- error leakage?
- ownership checks?
- role checks?
- HTTP method restrictions?
- caching behavior?
- abuse potential?

Look for endpoints that:

- expose internal data
- expose user data
- expose admin data
- accept arbitrary IDs
- accept arbitrary URLs
- perform privileged mutations
- reveal whether an account exists
- expose stack traces
- expose database errors
- accept unexpected HTTP methods

---

# 14. Rate Limiting and Abuse Resistance

Identify security-sensitive endpoints:

- login
- signup
- password reset
- verification
- OTP
- email sending
- contact forms
- search
- expensive API calls
- file uploads
- media processing
- admin APIs
- Server Actions with expensive operations

Determine whether appropriate abuse controls exist.

Consider:

- brute-force attacks
- credential stuffing
- enumeration
- spam
- resource exhaustion
- request flooding
- expensive computation
- upload abuse

If there is no rate limiting, rank the issue according to realistic impact rather than automatically calling everything critical.

---

# 15. Security Headers

Inspect current response headers and configuration.

Check for appropriate use of:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame protection / `frame-ancestors`
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- Cross-Origin-Embedder-Policy where relevant

Do not blindly recommend every possible header.

Evaluate the application's actual requirements and identify headers that would materially improve security.

Also identify headers that are configured incorrectly or create unexpected behavior.

---

# 16. CORS / Origin Security

Inspect:

- CORS configuration
- allowed origins
- credentials mode
- wildcard origins
- origin reflection
- API exposure
- webhook endpoints

Look for configurations such as:

- `Access-Control-Allow-Origin: *`
- wildcard origins with credentials
- trusting arbitrary Origin headers
- unnecessary cross-origin access

---

# 17. Open Redirects

Search for:

- `redirect`
- `redirectTo`
- `callbackUrl`
- `returnUrl`
- `next`
- `continue`
- `from`
- `url`

Determine whether user-controlled values can redirect users to arbitrary external domains.

Pay particular attention to authentication flows.

---

# 18. Dependency Security

Inspect dependencies and lockfiles.

Identify:

- outdated security-sensitive packages
- known vulnerable packages if vulnerability metadata is available locally
- unnecessary dependencies
- duplicated packages
- abandoned packages
- packages with excessive privileges
- packages used only once for functionality that can be removed

Do not claim a dependency is vulnerable unless there is evidence.

If network access or package vulnerability tooling is available, use it where appropriate.

Clearly distinguish:

- confirmed vulnerability
- likely concern
- outdated dependency
- informational recommendation

---

# 19. Dead Code / Dead Features

Perform a repository-wide dead-code investigation.

Look for:

- unused components
- unused hooks
- unused utilities
- unused API routes
- unused Server Actions
- unreachable pages
- abandoned authentication flows
- obsolete feature flags
- unused environment variables
- unused dependencies
- duplicate implementations
- old commented-out code
- legacy code paths
- unreachable branches
- unused types
- unused exports

Do not classify something as dead merely because it is not referenced obviously.

Consider:

- dynamic imports
- route conventions
- framework discovery
- reflection
- configuration-based loading
- external consumers

For each dead-code finding, provide evidence.

---

# 20. DRY / Maintainability Audit

Identify meaningful duplication.

Look for repeated:

- authentication checks
- authorization logic
- validation
- error handling
- API response construction
- database queries
- cookie configuration
- security headers
- data transformation
- UI logic
- utility functions
- constants
- types
- schemas

Do not recommend abstraction simply because two pieces of code look similar.

Only recommend refactoring when it would meaningfully reduce:

- bugs
- security inconsistencies
- maintenance cost
- duplicated business logic
- duplicated authorization logic

Give special attention to duplicated authentication/authorization checks because inconsistent implementations can create security vulnerabilities.

---

# 21. Validation Audit

Inspect all external input.

Check:

- forms
- query parameters
- route parameters
- headers
- cookies
- JSON bodies
- multipart forms
- Server Action arguments
- API requests

Determine whether schemas are used consistently.

Look for:

- missing validation
- weak validation
- type-only validation
- trusting client-provided fields
- excessive input sizes
- unexpected values
- enum bypasses
- prototype pollution
- nested object abuse

If a validation library is already used, inspect whether it is actually applied at security boundaries.

---

# 22. Error Handling / Information Disclosure

Search for:

- stack traces
- database errors
- internal paths
- environment variables
- tokens
- request headers
- cookies
- debug information
- verbose errors
- source maps
- internal service names

Check differences between development and production behavior.

Determine whether attackers can use errors to learn:

- database structure
- user existence
- authentication state
- filesystem paths
- internal URLs
- implementation details

---

# 23. Logging and Monitoring

Inspect logging.

Check whether logs could accidentally contain:

- passwords
- tokens
- cookies
- authorization headers
- personal data
- encryption keys
- sensitive request bodies

Also identify important security events that are not logged where logging would be useful.

Examples:

- admin login
- failed admin login
- password changes
- privilege changes
- suspicious authentication failures

Do not recommend excessive logging of sensitive data.

---

# 24. Encryption / Sensitive Data Protection

If the project stores sensitive data or encrypted media, inspect:

- encryption algorithm
- key derivation
- key storage
- IV/nonce generation
- authentication tags
- password-derived keys
- server/client responsibilities
- key exposure
- plaintext lifetime
- access-control boundaries

Look for:

- hardcoded encryption keys
- reused IVs/nonces
- unauthenticated encryption
- weak hashing used as encryption
- client-controlled encryption parameters
- secrets sent unnecessarily to browsers

Do not assume encryption provides security if authorization is broken.

---

# 25. Privacy / Data Exposure

Determine whether the application exposes more data than necessary.

Look for:

- API responses containing unnecessary fields
- internal database objects serialized directly
- private metadata
- internal IDs
- email addresses
- admin information
- tokens
- timestamps or infrastructure metadata
- hidden fields that are still sent to clients

Apply the principle:

> If the browser does not need the data, the server should not send it.

---

# 26. Performance and Optimization Audit

After security, inspect performance.

Look for:

- unnecessary client components
- excessive JavaScript
- large dependencies
- unnecessary hydration
- avoidable client-side state
- duplicate data fetching
- N+1 database queries
- repeated expensive computations
- missing caching where safe
- incorrect caching
- unnecessary re-renders
- oversized images
- unoptimized images
- unnecessary API round trips
- sequential requests that can be parallelized
- expensive Server Actions
- large server responses
- excessive bundle size

For each optimization, estimate the likely impact:

- High
- Medium
- Low

Do not optimize blindly.

---

# 27. SEO / Public Portfolio Safety

Because this is a portfolio project, inspect public-facing pages for:

- accidental indexing of admin pages
- private pages exposed to search engines
- sensitive metadata
- incorrect robots configuration
- leaked internal URLs
- authentication pages unnecessarily indexed
- canonical URL problems
- duplicate content

Security takes priority over SEO.

Do not recommend exposing anything merely for SEO benefits.

---

# 28. Security Boundary Mapping

Create a concise mental model of the application's security boundaries.

Identify:

- Public
- Authenticated user
- Admin
- Server-only
- Client/browser
- Database
- External services
- Object/file storage

Then identify where data crosses those boundaries.

Pay particular attention to transitions such as:

`Browser → API`

`Browser → Server Action`

`Browser → Authentication`

`Authentication → Authorization`

`User → User-owned resource`

`User → Admin resource`

`Server → Database`

`Server → External API`

`Server → Object storage`

`Object storage → Browser`

For every sensitive boundary, verify that authentication and authorization are enforced at the correct location.

---

# 29. Attack-Scenario Thinking

Do not limit the audit to static code smells.

For important findings, think like an attacker.

Consider scenarios such as:

### Unauthenticated attacker

"What can I do without logging in?"

### Normal authenticated user

"What can I access or modify that belongs to another user?"

### Malicious normal user

"Can I become an admin?"

### Logged-out user with an old session

"Can I continue using previously obtained credentials?"

### Attacker controlling request parameters

"What happens if I replace IDs, URLs, roles, usernames, or other values?"

### Attacker controlling uploaded content

"Can I upload something that becomes executable, public, or dangerous?"

### Attacker controlling a redirect

"Can I redirect victims to an attacker-controlled site?"

### Attacker controlling external URLs

"Can I make the server access internal services?"

### Brute-force attacker

"How difficult is it to repeatedly attack authentication endpoints?"

### Browser attacker

"What happens if malicious JavaScript executes on another origin?"

---

# 30. Severity Ranking

Every confirmed or credible issue must receive a severity.

Use:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- INFORMATIONAL

Rank findings primarily by:

1. Exploitability
2. Impact
3. Authentication bypass potential
4. Privilege escalation potential
5. Data exposure
6. Integrity impact
7. Availability impact
8. Number of affected users
9. Whether exploitation requires special conditions

Do not inflate severity.

For example:

- A theoretical hardening opportunity should not be HIGH.
- A missing admin authorization check should likely be HIGH/CRITICAL depending on impact.
- A harmless unused component should not be treated as a security vulnerability.

---

# 31. Confidence Level

Every finding should also have:

- CONFIRMED
- HIGH CONFIDENCE
- MEDIUM CONFIDENCE
- LOW CONFIDENCE

Only mark something CONFIRMED when the code provides strong evidence.

Clearly distinguish:

> "This is exploitable"

from:

> "This could become exploitable depending on deployment configuration."

---

# 32. Evidence Requirements

For every meaningful finding, include:

- Severity
- Confidence
- Title
- Category
- Affected file(s)
- Relevant function/component/route
- Approximate line number(s), if available
- Why it is a problem
- Potential attack/impact
- Recommended fix
- Whether the fix is breaking
- Priority

Whenever possible, quote only a **very small relevant code fragment** rather than dumping large amounts of source code into the report.

Do not include secrets in the report.

If you discover an actual secret:

- do NOT reproduce it
- redact it
- report its location
- recommend rotation/revocation

---

# 33. False Positive Control

Be conservative.

Do NOT report something as a vulnerability merely because:

- it looks unusual
- it does not follow your preferred coding style
- a theoretical attack exists but cannot actually reach the code
- a framework feature is unfamiliar
- a security mechanism is implemented differently from your preferred approach

Before reporting an issue, trace the relevant code path.

Ask:

1. Is attacker-controlled input actually able to reach this?
2. Is the vulnerable behavior actually reachable?
3. Is there another security layer that prevents exploitation?
4. Does the framework automatically mitigate it?
5. Is the issue production-relevant?
6. What would the actual attacker gain?

If uncertain, lower the confidence level rather than presenting speculation as fact.

---

# 34. Do Not Modify Application Code

This task is an **audit only**.

Do NOT modify:

- application source code
- configuration
- authentication implementation
- dependencies
- database schema
- environment files
- package files

The only file you should create or modify is:

`report_20260901.md`

If temporary tooling/files are required for analysis, clean them up afterward.

---

# 35. Required Report Structure

Create `report_20260901.md` with this structure:

# Security & Code Audit Report

**Project:** [project name]

**Audit Date:** 2026-09-01

**Framework:** [detected framework/version]

**Overall Risk:** [Critical/High/Medium/Low]

---

## Executive Summary

Briefly summarize:

- overall security posture
- authentication posture
- biggest risks
- most important recommendations
- major architectural concerns

Do not make this overly long.

---

## Risk Summary

Include a table:

| Severity | Count |
|---|---:|
| CRITICAL | |
| HIGH | |
| MEDIUM | |
| LOW | |
| INFORMATIONAL | |

---

## Critical Findings

List all CRITICAL findings.

For each:

### [CRITICAL] Finding title

**Confidence:**  
**Category:**  
**Affected files:**  
**Affected routes/functions:**  

**Problem**

Explain clearly.

**Attack Scenario**

Explain how an attacker could realistically abuse it.

**Impact**

Explain what could happen.

**Recommended Fix**

Give a concrete implementation direction.

**Priority:** Immediate

---

## High Severity Findings

Use the same format.

---

## Medium Severity Findings

Use the same format.

---

## Low Severity Findings

Use the same format.

---

## Informational Findings

Use the same format but keep these concise.

---

# Authentication & Authorization Deep Dive

Provide a dedicated section covering:

## Admin Authentication

Explain:

- login flow
- session flow
- authorization
- route protection
- API protection
- logout
- session invalidation
- brute-force resistance
- cookie security
- CSRF
- privilege escalation risk

Give an overall rating:

**Admin Authentication:** [Secure / Needs Improvement / High Risk / Critical Risk]

## General User Authentication

Same analysis.

**General Authentication:** [Secure / Needs Improvement / High Risk / Critical Risk]

## Authorization Matrix

Create a table similar to:

| Resource | Public | User | Admin | Server-only | Notes |
|---|---:|---:|---:|---:|---|
| Public pages | ✅ | ✅ | ✅ | | |
| User data | ❌ | Own only | ? | | |
| Admin panel | ❌ | ❌ | ✅ | | |
| Admin API | ❌ | ❌ | ✅ | | |
| Sensitive media | ❌ | ? | ? | | |

Only include resources that actually exist in the project.

---

# API Security Inventory

Create a table:

| Endpoint | Auth | Authorization | Input Validation | Rate Limit | Risk | Notes |
|---|---|---|---|---|---|---|

Include all meaningful API/Route Handler endpoints.

---

# Server Action Security Inventory

If Server Actions exist:

| Action | Authentication | Authorization | Input Validation | Risk | Notes |
|---|---|---|---|---|---|

---

# Cookie & Session Security

Inventory relevant cookies/tokens and evaluate their configuration.

---

# Security Headers

Document:

- current configuration
- missing headers
- incorrect headers
- recommended changes

---

# Secrets & Environment Variables

Report:

- potentially exposed secrets
- server/client environment separation
- unsafe `NEXT_PUBLIC_*` usage
- hardcoded credentials

Never expose actual secret values.

---

# Dead Code & Dead Features

For each meaningful item:

| Item | File | Evidence | Confidence | Recommendation |
|---|---|---|---|---|

---

# DRY / Refactoring Opportunities

Focus on meaningful duplication, especially:

- authentication
- authorization
- validation
- API handling
- data access
- security configuration

---

# Performance & Optimization

Organize into:

## High Impact

## Medium Impact

## Low Impact

For each recommendation explain:

- current behavior
- why it matters
- recommended approach
- expected benefit

---

# Dependency Review

Include:

- potentially vulnerable dependencies
- outdated dependencies
- unnecessary dependencies
- suspicious/overprivileged dependencies
- recommended action

Clearly distinguish confirmed vulnerabilities from general maintenance concerns.

---

# Positive Security Practices

Do not make the report purely negative.

Mention security mechanisms that are already implemented correctly, such as:

- secure cookies
- strong password hashing
- server-side authorization
- schema validation
- CSP
- secure session management
- proper secret separation
- safe ORM usage
- etc.

Only mention practices that are actually present.

---

# Recommended Remediation Order

Create a prioritized action plan:

### Phase 1 — Immediate

Issues that could result in:

- authentication bypass
- admin compromise
- sensitive data exposure
- remote code execution
- major authorization failure

### Phase 2 — High Priority

Important security weaknesses that should be addressed soon.

### Phase 3 — Hardening

Security improvements with lower immediate risk.

### Phase 4 — Code Quality

Dead code, DRY improvements, architecture cleanup.

### Phase 5 — Performance

Optimization work.

---

# Final Assessment

End with:

## Overall Security Rating

Choose a realistic rating:

- Excellent
- Good
- Acceptable
- Needs Improvement
- High Risk
- Critical Risk

Then summarize:

- biggest current weakness
- strongest existing security control
- highest-priority fix
- authentication assessment
- authorization assessment
- code quality assessment
- performance assessment

---

# Important Audit Principles

Throughout the audit:

1. **Trace actual execution paths.**
2. **Prioritize authentication and authorization.**
3. **Never assume UI restrictions are security controls.**
4. **Never assume middleware alone provides authorization.**
5. **Treat every API/Server Action as directly callable by an attacker.**
6. **Treat all browser input as untrusted.**
7. **Treat client-side state as attacker-controlled.**
8. **Treat IDs supplied by clients as untrusted.**
9. **Check ownership, not merely authentication.**
10. **Check authorization on the server.**
11. **Do not expose secrets in the report.**
12. **Do not overstate theoretical issues.**
13. **Separate confirmed vulnerabilities from recommendations.**
14. **Look for combinations of individually harmless weaknesses that become dangerous together.**
15. **Pay special attention to differences between development and production behavior.**
16. **Do not change application code.**
17. **Do not stop after finding the first few vulnerabilities.**
18. **Audit the entire repository.**
19. **Focus especially heavily on admin and general-user authentication.**
20. **Create only `report_20260901.md` as the final artifact.**

Before finishing, verify that:

- the entire relevant repository was inspected
- authentication flows were traced
- admin authorization was traced
- general-user authorization was traced
- APIs were inventoried
- Server Actions were inventoried
- cookies/sessions were reviewed
- secrets were reviewed
- security headers were reviewed
- dependencies were reviewed
- dead code was investigated
- DRY opportunities were investigated
- performance was investigated
- all findings have severity and confidence
- no secrets were copied into the report
- `report_20260901.md` exists at the project root

Then stop.