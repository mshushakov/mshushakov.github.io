SPA based on http://www.dnd5eapi.co/
=======

Currently supports next routers:
--------

*	#classes - shows DND classes with their icons (12 symbols)
*	#classes/:id - shows DND class description based on ID

Installation
--------

No need to install anything. It needs only webserver for static files (imports/exports in JS don't work for local files).  
For example: `SimpleHTTPServer`

```
python -m SimpleHTTPServer 8000
``` 

This SPA hosts on [mshushakov.github.io](http://mshushakov.github.io)


TODO
--------

*	Add back button in the toolbar
*	Add modal behaviour for description page to prevent calling API again when user comes back to classes page
*	Add animation for class icons (similar to the icons animation on Google Play)
*	Add preloaders between pages and inside of modal pages
*	Add main navigation 
*	Add more pages (equipment, equipment/:id, ...)
*	Add lazy loading for images
