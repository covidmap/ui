# Covid Ui
Frontend for Covid UI tool

## Architecture
* Bootstrapper: Responsible for initializing dependencies, creating the AppMain view, and appending it to the document
* Dispatcher: triggered by a view to dispatch some action to the store
* Store: responsible for storing the state of the application, querying data when triggered, and notifying view observers
* Views: define the template for custom html elements (such as single-hospital-details), listens to store updates, and updates its own contents accordingly

## Views
All custom views extend *BaseView* which itself extends *HTMLElement*.  The *ViewRegistry* class registers all custom elements and their selectors to the window.  For example: the class *SingleHospitalDetails* is registered as *single-hospital-details*.  Note: all view selectors are derived from their class names (pascal case => html-tag format).

All views are given their own randomly generated ID unless one is already specified.

## Views Styling
The *css* folder has multiple css files, *global.css* and one for each view (unless a view does not need one).  When the project is built, the css files are combined into one.

## Building the Project
*npm run-script serve* will build the solution, bundle all js and css, copy the index.html, and launch the site locally.  The dist folder will contain 3 files: *index.html*, *bundle.js*, and *bundle.css*.

In the current setup, the project will rebuild if you make code changes, but if you make changes to css or index.html, you will need to restart the server.