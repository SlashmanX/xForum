XForum
======
A real-time forum system created using Node.js, Socket.io and MongooseJS

Up-to-date demo at http://xforum.slashmanx.com. Simply login as 'admin' with password 'admin1'.

Current Version: v0.0.2 (Released 21st Oct 2012)
================================================

### WORK IN PROGRESS!

Features So Far (v0.0.2)
------------------------
* Role based access per forum (Administrators, moderators etc.)
* Topic/Forum pagination
* WYSIWYG text editor
* Ability to embed Youtube videos, Twitter statuses, Google Maps and more into posts
* Real-Time Features
	* Instant posting in topics
	* New posts appended to topic as you read
	* Instant editing of posts
* User Registration and Login (encrypted with bcrypt)
* Styled Twitter Bootstrap layout
* Google+ style admin panel

Coming Soon
--------------------
* Subforum support
* Private Messaging system
* imgur uploader - Upload and embed your images into your post without leaving the site
* Email validation
* Global & Per User Settings
* Avatar support
* Notification system
* Forum moderation (i.e. ability to delete topics and posts)

Note regarding install
=====================
* Please look at [this issue](https://github.com/SlashmanX/xForum/issues/20) which will contain information on how to get this set up on your server. The only issue you should have is with roles not being prefilled in the database. This will be sorted in the v0.0.3 release

* You must use the custom version of forms-mongoose included in the node_modules folder as I have made a vast number of changes to it.

Note regarding bcrypt
=====================
* You may need to install OpenSSL and Python (if you don't have them already), more information is available at [the bcrypt repository](https://github.com/ncb000gt/node.bcrypt.js/#dependencies) (Thanks to @WhiteaglePT)
