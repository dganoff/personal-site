Demetri Ganoff's Personal Website
=======

[Live Site](http://demetridesign.com)

## About This Repo
1. Uses NodeJS and GruntJS to build the `src` folder into the `dist` folder.
2. All NodeJS modules are in `node_modules` folder
3. All Bower packages are in `src\bower-components` folder
4. HTML templates are inside `src\templates`
	- These are .hbs files that get compiled into static .html files via the Assemble Grunt task
5. CSS is written in SASS: `src\scss` 

## To Do
1. Install permalinks assemble plugin and use it to create date-formatted URL paths for blog posts
	- Commented out for now because the links to those pages don't get updated to the new URI path. :(
