XForum
======

## Current Version: v0.0.1 (Released 24th Sep 2012)

A real-time forum system created using Node.js, Socket.io and MongoDB

Up-to-date demo at http://xforum.slashmanx.com

### WORK IN PROGRESS!

Features So Far (v0.0.1)
------------------------
* User Registration and Login (encrypted with bcrypt)
* Category & Forum & Topic Creation
* Posting Functionality
* Read/Unread Topic/Forum functionality
* Real-Time Features
	* Instant posting in topics
	* New posts appended to topic as you read
* Styled Twitter Bootstrap layout

Coming Soon (v0.0.2)
--------------------
* Role-based access (Administrators, moderators etc.)
* Admin panel to delete items
* Ability to edit posts

Coming Later
-------------
* Proper subforum support
* Moderators per forum

Required Modules
-------------
* npm install express
* npm install socket.io
* npm install connect
* npm install mongoose
* npm install moment
* npm install less-middleware
* npm install mongodb
* npm install connect-mongodb
* npm install bcrypt *** - you may need to install OpenSSL and Python (if you don't have them already), more information is available at [the bcrypt repository](https://github.com/ncb000gt/node.bcrypt.js/#dependencies) ***
* npm install async
* npm install jade
* npm install cookie

One line install:

        npm install express socket.io connect mongoose moment less-middleware mongodb connect-mongodb bcrypt async jade cookie
