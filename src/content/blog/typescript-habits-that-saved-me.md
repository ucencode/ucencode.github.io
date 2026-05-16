---
title: "TypeScript Habits That Actually Saved Me"
description: "A few practical patterns I keep reaching for — not from a style guide, but from bugs I've already shipped."
pubDate: 2026-05-11
tags: ["typescript", "dev"]
---

Most TypeScript advice is about syntax. This is about the habits I've formed after shipping bugs that TypeScript *could* have caught, if I'd used it properly.

## Stop reaching for `any`

When a type is hard to express, `any` is tempting. The problem is that `any` is contagious — it flows through your code silently. The type checker stops tracking the value and you lose all the guarantees downstream.

The better escape hatch is `unknown`. It forces you to narrow the type before using the value, which is exactly what you should be doing anyway.

```ts
// bad — type checker trusts you unconditionally
function parse(data: any) {
  return data.user.name; // no error, but blows up at runtime if shape is wrong
}

// better — forces you to check
function parse(data: unknown) {
  if (typeof data === 'object' && data !== null && 'user' in data) {
    // now you can safely narrow further
  }
}
```

## Narrow with discriminated unions

If a value can be in multiple states, model those states explicitly. A discriminated union makes impossible states unrepresentable and exhaustive switches compiler-checkable.

```ts
type Result<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: T };
```

Now when you switch on `result.status`, TypeScript knows exactly which fields are available in each branch. Forget to handle `'loading'`? The compiler tells you.

## Prefer `satisfies` over explicit typing for config objects

When you have a config object that should match a type but you also want to infer the literal types of its values, `satisfies` is cleaner than a type annotation.

```ts
const routes = {
  home: '/',
  blog: '/blog',
  about: '/#about',
} satisfies Record<string, string>;

// routes.home is typed as '/' not string — literal preserved
```

## The habit that matters most

None of these patterns help if you only apply them when TypeScript yells at you. The shift is writing types before writing implementations — thinking about the shape of data before thinking about how to transform it. That's where TypeScript pays off.
