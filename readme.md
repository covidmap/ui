# COVID Impact Map UI  [![Build status](https://badge.buildkite.com/060d659c55f3601c8834adeed47a8b4c891a1b4b70ac28aa3e.svg)](https://buildkite.com/bloomworks/covid-map-ui)
Frontend for the [COVID Impact Map](https://github.com/covidmap/app)

## Building the Project

### First Install
* Ensure you have [NPM](https://www.npmjs.com/) installed.
* Clone the repo locally.
* In a terminal run `npm install` in the directory where you cloned the repo. You should only have to do this once, unless you or someone else adds a dependency to the project, in which case you'll need to run `npm install` again before continuing to build.

### Building Withought Starting Local Webserver
* In your local clone of the repo's directory, run *npm run-script build* if you're on Windows, or *npm run-script build-nix* if you're on MacOS/Unix. 

### Building & Starting The Server
Windows users, run `npm run-script serve`. Mac/Unix users run `npm run-script serve-nix`. This will build the solution, bundle all js and css, copy the [index.html](index.html), and launch the site locally with [webpack]().  

While the project is running, the dist folder will contain 3 files: `index.html`, `bundle.js`, and `bundle.css`.

*bundle.js* will be automatically rebuilt will the server is running if you change any of the `.ts` files, but any changes made to css files or [index.html](index.html) will not take effect until the server is restarted. 

### Restarting The Server
In your terminal window, press `ctrl+c` to stop the server, then run `npm run-script serve` (or `npm run-script serve-nix`) to rebuild the project and start the server back up. 

## Tech Stack
The UI is written in [Typescript](https://www.typescriptlang.org/) which is compiled to vanilla [Javascript](https://www.w3schools.com/js/default.asp) with [Bazel](https://bazel.build/faq.html).

It is not necessary to clone or build the full [COVID Impact Map](https://github.com/covidmap/app) if you're just looking to work on the UI in development mode. 

For production release, the UI is compiled via TS through [Bazel's rules_nodejs](https://github.com/bazelbuild/rules_nodejs), then [rollup](https://github.com/rollup/rollup), then [terser](https://github.com/terser/terser), but **you don't need to install or understand these parts of the tool chain to work on the UI project!** 

The full app version of the [Covid Impact Map](https://github.com/covidmap/app) that's pushed to production references this UI project as a dependency. (The UI's dependency info is defined in [package.json](package.json), and the dependency is pulled into the main app via its [config/build.bzl](https://github.com/covidmap/app/blob/master/config/build.bzl)).

##Building

it's pulled into app via a Git submodule, and a matching Bazel dependency, which is listed in config/build.bzl


## Architecture
* [Bootstrapper](src/bootstrap/bootstrapper.ts): Responsible for initializing dependencies, creating the AppMain view, and appending it to the document
* [Dispatcher](src/dispatcher/dispatcher.ts): triggered by a view to dispatch some action to the store
* [Store](src/store/store.ts): responsible for storing the state of the application, querying data when triggered, and notifying view observers
* [Views](src/view/views): define the template for custom html elements (such as single-hospital-details), listens to store updates, and updates its own contents accordingly

## Views
All custom views extend [*BaseView*](src/view/baseView.ts) which itself extends *HTMLElement*.  The [*ViewRegistry*](src/view/viewRegistry/viewRegistry.ts) class registers all custom elements and their selectors to the window.  For example: the class [*SingleHospitalDetails*](src/view/views/singleHospitalDetails/singleHospitalDetails.view.ts) is registered as *single-hospital-details*.  Note: all view selectors are derived from their class names (pascal case => html-tag format).

All views are given their own randomly generated ID unless one is already specified.

## Views Styling
The [*css*](css) folder has multiple css files, [*global.css*](css/global.css) and one for each view (unless a view does not need one).  When the project is built, the css files are combined into one.

