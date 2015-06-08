Feature: unique
===============

Enable this test in `package.json` with: `"features": ["unique"]`

Ensures no two records will be allowed with the same value. This is a database level constraint 
so in most cases a unique index will be created in the underlying data-store.

Usage on Waterline models:

```
attributes: {
  username: {
    type: 'string',
    unique: true
  }
}
```
