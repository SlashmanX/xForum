XForum
======
A real-time forum system created using Node.js, ExpressJS,  Socket.io and MongooseJS

Up-to-date demo at http://xforum.slashmanx.com. Simply login as 'admin' with password 'admin1'.

Current Version: v0.0.4 (Released 27th Nov 2012)
================================================



### WORK IN PROGRESS!

Features So Far (v0.0.4)
------------------------
* Install script
* Email validation
* Avatar support
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
* Guest Access
* Forum moderation (e.g. ability to delete topics and posts)

Coming Soon
--------------------
* Subforum support
* Private Messaging system
* imgur uploader - Upload and embed your images into your post without leaving the site
* Global & Per User Settings
* Notification system

Upgrading from 0.0.2
=====================
If you are upgrading from an earlier version, it is a good idea for you to empty your database tables and then install as directed below.

Note regarding install
=====================
* Run `npm install`

* Edit the file `server/modules/db-settings.js` and `server/modules/email-settings.js` with your database and email credentials

* Navigate to `yourhost.com:3000/install/` to create your admin account and setup the forum

* You must use the custom version of forms-mongoose included in the node_modules folder as I have made a vast number of changes to it.

Note regarding bcrypt
=====================
* You may need to install OpenSSL and Python (if you don't have them already), more information is available at [the bcrypt repository](https://github.com/ncb000gt/node.bcrypt.js/#dependencies) (Thanks to @WhiteaglePT)

Credits
=====================
* [Aleksandr Guidrevitch](https://github.com/aguidrevitch/) - A modified version of his [jQuery-file-upload-middleware](https://github.com/aguidrevitch/jquery-file-upload-middleware) is used for avatars.