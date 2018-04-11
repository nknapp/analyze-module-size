# Release notes for `analyze-module-size`

<a name="current-release"></a>
# Version 1.4.0 (Wed, 11 Apr 2018 22:02:39 GMT)

* [fb3b72a](https://github.com/nknapp/analyze-module-size/commit/fb3b72a) chore: configure travis to run on node 6,8 and 9 (not 7 anymore) - Nils Knappmeier
* [d6b2d6f](https://github.com/nknapp/analyze-module-size/commit/d6b2d6f) feat: support for missing modules with existing dependls Knappmeier
* [414ada7](https://github.com/nknapp/analyze-module-size/commit/414ada7) fix: Handle dependency cycles gracefully - Nils Knappmeier
* [fb80e13](https://github.com/nknapp/analyze-module-size/commit/fb80e13) fix: Reserve more space for the dependency count in the progress bar - Nils Knappmeier

# Version 1.3.5 (Thu, 05 Apr 2018 19:54:26 GMT)

* [282d1fa](https://github.com/nknapp/analyze-module-size/commit/282d1fa) fix: handle NaN-blocksize on windows file-system (#5) - Nils Knappmeier

# Version 1.3.4 (Wed, 17 May 2017 22:04:31 GMT)

* [60dc68f](https://github.com/nknapp/analyze-module-size/commit/60dc68f) Make lodash.sortby a regular dependency - Nils Knappmeier


# Version 1.3.3 (Mon, 08 May 2017 11:00:26 GMT)

* [92c0493](https://github.com/nknapp/analyze-module-size/commit/92c0493) Revert: Sort tree-nodes of the same size by name - Nils Knappmeier

# Version 1.3.2 (Mon, 08 May 2017 10:55:26 GMT)

* [e4f8fb2](https://github.com/nknapp/analyze-module-size/commit/e4f8fb2) Sort tree-nodes of the same size by name - Nils Knappmeier
* [cefa825](https://github.com/nknapp/analyze-module-size/commit/cefa825) Support for scoped packages - Nils Knappmeier

# Version 1.3.1 (Sun, 07 May 2017 20:47:23 GMT)

* [7584946](https://github.com/nknapp/analyze-module-size/commit/7584946) More documentation - Nils Knappmeier

# Version 1.3.0 (Sun, 07 May 2017 20:05:50 GMT)

* [59b48f4](https://github.com/nknapp/analyze-module-size/commit/59b48f4) Reduce package size by using "p-map" rather than "bluebird" - Nils Knappmeier
* [f820acb](https://github.com/nknapp/analyze-module-size/commit/f820acb) New option "-d, depth <levels>" to cut off the dependency tree display - Nils Knappmeier

# Version 1.2.2 (Sun, 07 May 2017 19:39:45 GMT)

* [cc9677b](https://github.com/nknapp/analyze-module-size/commit/cc9677b) Check for cycles when traversing the dependency tree - Nils Knappmeier

# Version 1.2.1 (Sun, 07 May 2017 15:29:43 GMT)

* [be3a3e4](https://github.com/nknapp/analyze-module-size/commit/be3a3e4) Progress-Bar refactoring - Nils Knappmeier

# Version 1.2.0 (Sat, 06 May 2017 21:51:50 GMT)

* [bc3c191](https://github.com/nknapp/analyze-module-size/commit/bc3c191) Add progress-bar when loading dependencies - Nils Knappmeier

# Version 1.1.1 (Fri, 05 May 2017 20:02:52 GMT)

* [f751bd6](https://github.com/nknapp/analyze-module-size/commit/f751bd6) Add test for "depth"-parameter - Nils Knappmeier
* [73788b7](https://github.com/nknapp/analyze-module-size/commit/73788b7) Include .dot-files in the statistics - Nils Knappmeier

# Version 1.1.0 (Fri, 05 May 2017 19:44:33 GMT)

* [4773afa](https://github.com/nknapp/analyze-module-size/commit/4773afa) Use files-property in package.json to be more precise about the size... - Nils Knappmeier
* [184d2d6](https://github.com/nknapp/analyze-module-size/commit/184d2d6) Fix tests on TravisCI (#1) - Nils Knappmeier
* [beb3e84](https://github.com/nknapp/analyze-module-size/commit/beb3e84) Added missing file for test - Nils Knappmeier

# Version 1.0.0 (Fri, 28 Apr 2017 21:46:54 GMT)

* [c4a4ba7](https://github.com/nknapp/analyze-module-size/commit/c4a4ba7) Finalize first working version - Nils Knappmeier
* [d01d875](https://github.com/nknapp/analyze-module-size/commit/d01d875) DependencyTree-class with tests - Nils Knappmeier
* [ee8b1c1](https://github.com/nknapp/analyze-module-size/commit/ee8b1c1) Package-class that represents npm-package - Nils Knappmeier
* [14ce7d4](https://github.com/nknapp/analyze-module-size/commit/14ce7d4) Add PackageStats class... - Nils Knappmeier
* [ad6ddae](https://github.com/nknapp/analyze-module-size/commit/ad6ddae) Initial check-in - Nils Knappmeier
