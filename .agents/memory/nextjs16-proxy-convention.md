---
name: Next.js 16 proxy convention
description: How to replace deprecated middleware.ts with proxy.ts in Next.js 16+
---

## Rule
In Next.js 16, `src/middleware.ts` is deprecated. Replace with `src/proxy.ts`.

**Why:** Next.js 16 renamed the file convention from "middleware" to "proxy". Both can coexist and cause a build error.

**How to apply:**
- File must be `src/proxy.ts` (or root `proxy.ts`)
- Export must be named `proxy` (not `middleware`) OR a default export
- `config` with `matcher` still works identically
- Delete `middleware.ts` — having both files causes an unhandled rejection build error

```ts
// src/proxy.ts
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: ['/admin/:path*'] };
```
