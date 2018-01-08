SPA based on http://www.dnd5eapi.co/
=======

Currently supports next routers:
--------

*	#classes/ - shows DND classes with their icons (12 symbols)
*	#classes/:id - shows DND class description based on ID
*	#monsters/ - shows DND mosters list

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

*	~~Add subclasses section on description page~~
*	Add modal behaviour for description page to prevent calling API again when user comes back to classes page
*	Add catching of network errors and showing notifications
*	Add main navigation 
*	~~Add back button in the toolbar~~
*	~~Add preloaders between pages and inside of modal pages~~
*	Add animation for class icons (similar to the icons animation on Google Play)
*	Add more pages (equipment, equipment/:id, ...)
*	Add lazy loading for images
