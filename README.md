SPA based on http://www.dnd5eapi.co/
=======

Currently supports next routers:
--------

*	#classes/ - shows DND classes with their icons (12 symbols)
*	#classes/:id - shows DND class description based on ID
*	#races/ - shows DND races' list
*	#races/:id - shows DND race description based on ID
*	#monsters/ - shows DND monsters' list
*	#monsters/:id - shows DND monster description based on ID

Installation
--------

No need to install anything. It needs only webserver for static files (imports/exports in JS don't work for local files).  
For example: `SimpleHTTPServer`

```
python -m SimpleHTTPServer 8000
``` 

This SPA hosts on [mshushakov.github.io](http://mshushakov.github.io)

Helpers
--------

`tools.js` contains few helpers:

*	`create(tagName :string, properties :object, ...childNode(s) :node)` - creates DOM element
*	`createIcon(tagName :string, properties :object, ...childNode(s) :node)` - creates SVG element
*	`asyncrender(url :string, render :function, fail :function)` - creates DOM element wrapper, fetches data, adds `render` element as a childNode or call fail function


TODO
--------

*	~~Add subclasses section on description page~~
*	Add modal behaviour for description page to prevent calling API again when user comes back to classes page
*	Add catching of network errors and showing notifications
*	~~Add main navigation drawer~~
*	~~Add back button in the toolbar~~
*	~~Add preloaders between pages and inside of modal pages~~
*	~~Add more pages (races, monsters)~~
*	Add more pages (equipment, spells)
*	Add animation for class icons (similar to the icons animation on Google Play)
*	Add lazy loading for images


Progressive Rendering
--------

![Progressive Rendering](https://image.ibb.co/cuQo1m/Jan_11_2018_22_59_13.gif)
