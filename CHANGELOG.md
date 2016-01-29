# Waterline Adapter Tests Changelog

### 0.10.17

* [STABILITY] Skip failing binary test that isn't compatible with Waterline feature set. This was hiding actual patches that break core or another adapter. See [#98](https://github.com/balderdashy/waterline-adapter-tests/pull/98) for more details.

* [STABILITY] Skip incorrect auto-increment test. See [#99](https://github.com/balderdashy/waterline-adapter-tests/pull/99) for more details.

* [ENHANCEMENT] Update Travis config to add Node 4.0 and 5.0. See [#97](https://github.com/balderdashy/waterline-adapter-tests/pull/97) for more details.

* [ENHANCEMENT] Added test for `migrate: 'create'` in the migratable interface. See [#34](https://github.com/balderdashy/waterline-adapter-tests/pull/34) for more details. Thanks [@dmarcelino](https://github.com/dmarcelino)!
