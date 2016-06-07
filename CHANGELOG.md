# Waterline Adapter Tests Changelog

### 0.12.1

* [ENHANCEMENT] Updated Mocha, Should, and NPM dependencies to remove warning messages when installing.

### 0.12.0

* [ENHANCEMENT] Added tests for working with projections in Waterline. See [#106](https://github.com/balderdashy/waterline-adapter-tests/pull/106) for more details.

### 0.11.1

* [BUG] Upgraded the Waterline dependency to the `0.11` version.

### 0.11.0

* [UPGRADE] Add test that checks the new function signature of `.save()` in Waterline 0.11.0
* [ENHANCEMENT] Add a Docker config for getting all the various databases installed and configured to run the tests.

### 0.10.19

* [BUG] Fix previous date test that only checked CST

### 0.10.18

* [ENHANCEMENT] Add a test for querying dates when they are a string. See [#100](https://github.com/balderdashy/waterline-adapter-tests/pull/100) for more details.

### 0.10.17

* [STABILITY] Skip failing binary test that isn't compatible with Waterline feature set. This was hiding actual patches that break core or another adapter. See [#98](https://github.com/balderdashy/waterline-adapter-tests/pull/98) for more details.

* [STABILITY] Skip incorrect auto-increment test. See [#99](https://github.com/balderdashy/waterline-adapter-tests/pull/99) for more details.

* [ENHANCEMENT] Update Travis config to add Node 4.0 and 5.0. See [#97](https://github.com/balderdashy/waterline-adapter-tests/pull/97) for more details.

* [ENHANCEMENT] Added test for `migrate: 'create'` in the migratable interface. See [#34](https://github.com/balderdashy/waterline-adapter-tests/pull/34) for more details. Thanks [@dmarcelino](https://github.com/dmarcelino)!
