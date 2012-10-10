!function($, wysi) {
    "use strict";

    var templates = {
        "font-styles": "<li class='dropdown'>" +
                           "<a class='btn dropdown-toggle' data-toggle='dropdown' href='#'>" +
                               "<i class='icon-font toolbar-icon'></i>&nbsp;<span class='current-font'>Normal text</span>&nbsp;<b class='caret'></b>" +
                           "</a>" +
                           "<ul class='dropdown-menu'>" +
                               "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div'>Normal text</a></li>" +
                               "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1'>Heading 1</a></li>" +
                               "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2'>Heading 2</a></li>" +
                           "</ul>" +
                       "</li>",
        "emphasis":    "<li>" +
                           "<div class='btn-group'>" +
                               "<a class='btn' data-wysihtml5-command='bold' title='CTRL+B'><i class ='icon-bold toolbar-icon'></i></a>" +
                               "<a class='btn' data-wysihtml5-command='italic' title='CTRL+I'><i class ='icon-italic toolbar-icon'></i></a>" +
                               "<a class='btn' data-wysihtml5-command='underline' title='CTRL+U'><i class ='icon-underline toolbar-icon'></i></a>" +
                           "</div>" +
                       "</li>",

		"extras": 	"<div class='bootstrap-wysihtml5-insert-media-modal modal hide fade'>" +
                          "<div class='modal-header'>" +
                              "<a class='close' data-dismiss='modal'>&times;</a>" +
                              "<h3>Insert Media</h3>" +
                          "</div>" +
                          "<div class='modal-body'>" +
							   "<form class = 'form-horizontal'>" + 
								   "<div class = 'control-group'>" +
									   "<label class = 'control-label' for = 'insertMedia_URL'>Link:</label>" +
									   "<div class = 'controls'>" +
                              	   		   "<input id = 'insertMedia_URL' value='http://' type = 'url' class='bootstrap-wysihtml5-insert-media-url input-xlarge'>" +
										"</div>" +
									"</div>" +
							   "</form>" +
                          "</div>" +
                          "<div class='modal-footer'>" +
                              "<a class='btn' data-dismiss='modal'>Cancel</a>" +
                              "<a class='btn btn-primary'>Insert Media</a>" +
                          "</div>" +
                      "</div>" +
					"<li>" +
						"<div class='btn-group'>" +
								"<a class='btn' data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='blockquote' title='Quote'><i class ='icon-comment toolbar-icon'></i></a>" +
								"<a class='btn' data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='pre' title='Code'><i class ='icon-file toolbar-icon'></i></a>" +
								"<a class='btn' id = 'mediaLink' data-wysihtml5-command='insertMedia' title='Media'><i class ='icon-film toolbar-icon'></i></a>" +
                           "</div>" +
                       "</li>",
        "lists":       "<li>" +
                           "<div class='btn-group'>" +
                               "<a class='btn' data-wysihtml5-command='insertUnorderedList' title='Unordered List'><i class='icon-list-ul toolbar-icon'></i></a>" +
                               "<a class='btn' data-wysihtml5-command='insertOrderedList' title='Ordered List'><i class='icon-list-ol toolbar-icon'></i></a>" +
                               "<a class='btn' data-wysihtml5-command='Outdent' title='Outdent'><i class='icon-indent-right toolbar-icon'></i></a>" +
                               "<a class='btn' data-wysihtml5-command='Indent' title='Indent'><i class='icon-indent-left toolbar-icon'></i></a>",
        "link":        "<li>" +
                           "<div class='bootstrap-wysihtml5-insert-link-modal modal hide fade'>" +
                               "<div class='modal-header'>" +
                                   "<a class='close' data-dismiss='modal'>&times;</a>" +
                                   "<h3>Insert Link</h3>" +
                               "</div>" +
                               "<div class='modal-body'>" +
								   "<form class = 'form-horizontal'>" + 
									   "<div class = 'control-group'>" +
										   "<label class = 'control-label' for = 'insertLink_URL'>Link:</label>" +
										   "<div class = 'controls'>" +
                                   	   		   "<input id = 'insertLink_URL' value='http://' type = 'url' class='bootstrap-wysihtml5-insert-link-url input-xlarge'>" +
											"</div>" +
										"</div>" +
										"<div class = 'control-group'>" +
											   "<label class = 'control-label' for = 'insertLink_Text'>Text:</label>" +
											   "<div class = 'controls'>" +
								   	   			   "<input id = 'insertLink_Text' placeholder='Link Text' type = 'text' class='bootstrap-wysihtml5-insert-link-text input-xlarge'>" +
												"</div>" +
											"</div>" +
								   "</form>" +
                               "</div>" +
                               "<div class='modal-footer'>" +
                                   "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>" +
                                   "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert link</a>" +
                               "</div>" +
                           "</div>" +
                           "<a class='btn' data-wysihtml5-command='createLink' title='Link'><i class='icon-share toolbar-icon'></i></a>" +
                       "</li>",
        "image":       "<li>" +
                           "<div class='bootstrap-wysihtml5-insert-image-modal modal hide fade'>" +
                               "<div class='modal-header'>" +
                                   "<a class='close' data-dismiss='modal'>&times;</a>" +
                                   "<h3>Insert An Image</h3>" +
                               "</div>" +
                               "<div class='modal-body'>" +
									"<form class = 'form-horizontal'>" + 
									   "<div class = 'control-group'>" +
										   "<label class = 'control-label' for = 'insertImage_URL'>Link:</label>" +
										   "<div class = 'controls'>" +
                                   				"<input type = 'url' id = 'insertImage_URL' value='http://' class='bootstrap-wysihtml5-insert-image-url input-xlarge'>" +
											"</div>" +
										"</div>" +
					   				"</form>" +
                               "</div>" +
                               "<div class='modal-footer'>" +
                                   "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>" +
                                   "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert image</a>" +
                               "</div>" +
                           "</div>" +
                           "<a class='btn' data-wysihtml5-command='insertImage' title='Insert image'><i class='icon-picture toolbar-icon'></i></a>" +
                       "</li>",

        "html":
                       "<li>" +
                           "<div class='btn-group'>" +
                               "<a class='btn' data-wysihtml5-action='change_view' title='Edit HTML'><i class='icon-pencil toolbar-icon'></i></a>" +
                           "</div>" +
                       "</li>"
    };

    var defaultOptions = {
        "font-styles": true,
        "emphasis": true,
        "lists": true,
        "html": false,
        "link": true,
        "image": true,
		"extras": true,
        events: {},
        parserRules: {
            tags: {
                "b":  {},
                "i":  {},
                "br": {},
                "ol": {},
                "ul": {},
                "li": {},
                "h1": {},
                "h2": {},
                "blockquote": {},
                "u": 1,
                "img": {
                    "check_attributes": {
                        "width": "numbers",
                        "alt": "alt",
                        "src": "url",
                        "height": "numbers"
                    }
                },
                "a":  {
                    set_attributes: {
                        target: "_blank",
                        rel:    "nofollow"
                    },
                    check_attributes: {
                        href:   "url" // important to avoid XSS
                    }
                }
            }
        },
        stylesheets: []
    };

    var Wysihtml5 = function(el, options) {
        this.el = el;
        this.toolbar = this.createToolbar(el, options || defaultOptions);
        this.editor =  this.createEditor(options);

        window.editor = this.editor;

        $('iframe.wysihtml5-sandbox').each(function(i, el){
            $(el.contentWindow).off('focus.wysihtml5').on({
              'focus.wysihtml5' : function(){
                 $('li.dropdown').removeClass('open');
               }
            });
        });
    };

    Wysihtml5.prototype = {

        constructor: Wysihtml5,

        createEditor: function(options) {
            options = $.extend(defaultOptions, options || {});
		    options.toolbar = this.toolbar[0];

		    var editor = new wysi.Editor(this.el[0], options);

            if(options && options.events) {
                for(var eventName in options.events) {
                    editor.on(eventName, options.events[eventName]);
                }
            }

			editor.focus();

            return editor;
        },

        createToolbar: function(el, options) {
            var self = this;
            var toolbar = $("<ul/>", {
                'class' : "wysihtml5-toolbar",
                'style': "display:none"
            });

            for(var key in defaultOptions) {
                var value = false;

                if(options[key] !== undefined) {
                    if(options[key] === true) {
                        value = true;
                    }
                } else {
                    value = defaultOptions[key];
                }

                if(value === true) {
                    toolbar.append(templates[key]);

                    if(key === "html") {
                        this.initHtml(toolbar);
                    }

                    if(key === "link") {
                        this.initInsertLink(toolbar);
                    }

                    if(key === "image") {
                        this.initInsertImage(toolbar);
                    }

					if(key === 'extras') {
						this.initInsertMedia(toolbar);
					}
                }
            }

            if(options.toolbar) {
                for(key in options.toolbar) {
                   toolbar.append(options.toolbar[key]);
                }
            }

            toolbar.find("a[data-wysihtml5-command='formatBlock']:not(a[data-wysihtml5-command-value='blockquote']):not(a[data-wysihtml5-command-value='pre'])").click(function(e) {
                var el = $(e.srcElement);
                self.toolbar.find('.current-font').text(el.html());
            });

            this.el.before(toolbar);

            return toolbar;
        },

        initHtml: function(toolbar) {
            var changeViewSelector = "a[data-wysihtml5-action='change_view']";
            toolbar.find(changeViewSelector).click(function(e) {
                toolbar.find('a.btn').not(changeViewSelector).toggleClass('disabled');
            });
        },

        initInsertImage: function(toolbar) {
            var self = this;
            var insertImageModal = toolbar.find('.bootstrap-wysihtml5-insert-image-modal');
            var urlInput = insertImageModal.find('.bootstrap-wysihtml5-insert-image-url');
            var insertButton = insertImageModal.find('a.btn-primary');
            var initialValue = urlInput.val();

            var insertImage = function() {
                var url = urlInput.val();
                urlInput.val(initialValue);
                self.editor.composer.commands.exec("insertImage", url);
            };

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertImage();
                    insertImageModal.modal('hide');
                }
            });

            insertButton.click(insertImage);

            insertImageModal.on('shown', function() {
                urlInput.focus();
            });

            insertImageModal.on('hide', function() {
                self.editor.currentView.element.focus();
            });

            toolbar.find('a[data-wysihtml5-command=insertImage]').click(function() {
                insertImageModal.modal('show');
                insertImageModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
					e.stopPropagation();
				});
                return false;
            });
        },

        initInsertLink: function(toolbar) {
            var self = this;
            var insertLinkModal = toolbar.find('.bootstrap-wysihtml5-insert-link-modal');
            var urlInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-url');
			var textInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-text');
            var insertButton = insertLinkModal.find('a.btn-primary');
            var initialValue = urlInput.val();
			var initialTValue = textInput.val();

            var insertLink = function() {
                var url = urlInput.val();
                urlInput.val(initialValue);
				var text = textInput.val();
                textInput.val(initialTValue);
                self.editor.composer.commands.exec("createLink", {
                    href: url,
                    target: "_blank",
					text: text,
                    rel: "nofollow"
                });
            };
            var pressedEnter = false;

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertLink();
                    insertLinkModal.modal('hide');
                }
            });

			textInput.keypress(function(e) {
                if(e.which == 13) {
                    insertLink();
                    insertLinkModal.modal('hide');
                }
            });

            insertButton.click(insertLink);

            insertLinkModal.on('shown', function() {
                urlInput.focus();
            });

            insertLinkModal.on('hide', function() {
                self.editor.currentView.element.focus();
            });

            toolbar.find('a[data-wysihtml5-command=createLink]').click(function() {
                insertLinkModal.modal('show');
                insertLinkModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
					e.stopPropagation();
				});
                return false;
            });
        },
		initInsertMedia: function(toolbar) {
            var self = this;
            var insertMediaModal = toolbar.find('.bootstrap-wysihtml5-insert-media-modal');
			console.log(insertMediaModal);
            var urlInput = insertMediaModal.find('.bootstrap-wysihtml5-insert-media-url');
            var insertButton = insertMediaModal.find('a.btn-primary');
            var initialValue = urlInput.val();

            var insertMedia = function() {
				console.log('here');
                var url = urlInput.val();
				socket.emit('getEmbedCode', url, function(err, result){
					if(!err) {
						urlInput.val(initialValue);
		                self.editor.composer.commands.exec("insertHTML", result.html);
		                insertMediaModal.modal('hide');
					}
				});
                
            };

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertMedia();
                }
            });

            insertButton.click(insertMedia);

            insertMediaModal.on('shown', function() {
                urlInput.focus();
            });

            insertMediaModal.on('hide', function() {
                self.editor.currentView.element.focus();
            });

            toolbar.find('a[data-wysihtml5-command=insertMedia]').click(function() {
				console.log('clicked');
                insertMediaModal.modal('show');
                insertMediaModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
					e.stopPropagation();
				});
                return false;
            });
        },

    };

    $.fn.wysihtml5 = function (options) {
        return this.each(function () {
            var $this = $(this);
            $this.data('wysihtml5', new Wysihtml5($this, options));
        });
    };

    $.fn.wysihtml5.Constructor = Wysihtml5;

}(window.jQuery, window.wysihtml5);