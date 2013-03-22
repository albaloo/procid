// ==UserScript==
// @name           Procid
// @description    Interactive system supporting consensus building.
// @icon           https://raw.github.com/albaloo/procid/master/icon.jpg
// @author         Roshanak Zilouchian
// @version        1.0
// @grant          none
// @include        http://drupal.org/*
// @include        https://drupal.org/*
// @include        http://*.drupal.org/*
// @include        https://*.drupal.org/*
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
	//Jquery Script
	var script = document.createElement("script");
	//script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js");
	script.setAttribute("src", "//headjs.com/media/libs/headjs/0.99/head.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		//script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
		script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
		var body = document.getElementsByTagName('head')[0];
		body.appendChild(script);
	}, false);

	//D3 script
	/*var scriptd3 = document.createElement("script");
	scriptd3.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/d3/3.0.8/d3.min.js");
	scriptd3.addEventListener('load', function() {
		var scriptd3 = document.createElement("script");
		var body = document.getElementsByTagName('head')[0];
		body.appendChild(scriptd3);
	}, false);*/

	var body1 = document.getElementsByTagName('head')[0];
	body1.appendChild(script);
	//body1.appendChild(scriptd3);
};
	

// the main function of this userscript
function main() {

head.js("//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js", "//cdnjs.cloudflare.com/ajax/libs/d3/3.0.8/d3.min.js", function() {
	console.log("begin");
	var ABSOLUTEPATH = 'http://raw.github.com/albaloo/procid/master/client';
	var CSSSERVERPATH = 'http://web.engr.illinois.edu/~rzilouc2/procid';
	//'http://web.engr.illinois.edu/~rzilouc2/procid';
	var commentInfos = [];
	var criteria = [];
	var allCriteria = [];
	var issue = {
				title : "",
				link : "",
				author : "",
				authorLink : "",
				status : ""
			};

	if (!window.d3) { 
		loadScript("//cdnjs.cloudflare.com/ajax/libs/d3/3.0.8/d3.min.js"); 
		}

	var addCSSToHeader = function() {
		var header = document.getElementsByTagName('head')[0];
		var csslink = document.createElement('link');
		csslink.setAttribute('href', CSSSERVERPATH + '/style.css');
		csslink.setAttribute('rel', 'stylesheet');
		csslink.setAttribute('type', 'text/css');
		header.appendChild(csslink);
	};

	var addLeftPanel = function() {
		var leftPanel = document.createElement('div');
		leftPanel.setAttribute('id', 'procid-left-panel');
		leftPanel.innerHTML = ' ';

		var leftPanelHeader = document.createElement('div');
		leftPanelHeader.setAttribute('id', 'procid-left-panel-header');
		leftPanelHeader.innerHTML = ' ';

		var leftPanelBody = document.createElement('div');
		leftPanelBody.setAttribute('id', 'procid-left-panel-body');
		leftPanelBody.innerHTML = ' ';

		leftPanel.appendChild(leftPanelHeader);
		leftPanel.appendChild(leftPanelBody);

		return leftPanel;
	}
	//StatusVar
	var createStatusVar = function() {
		var statusVar = document.createElement('div');
		statusVar.setAttribute('id', 'procid-status-var');
		statusVar.innerHTML = 'home';
		$('#footer').append(statusVar);
		$('#procid-status-var').toggle(false);
	}
	var getStatusVar = function() {
		return $('#procid-status-var').text();
	}
	var setStatusVar = function(status) {
		$('#procid-status-var').text(status);
	}
	var changePage = function(destination) {
		var map = {
			home : ['procid-left-panel-body', 'procid-page-wrapper'],
			idea : ['procid-idea-page-wrapper'],
			invite : ['procid-invite-page-wrapper']
		};

		var sourceDivIds = map[getStatusVar()];
		$.each(sourceDivIds, function() {
			$("#" + this).toggle();
		});

		var destionationDivIds = map[destination];
		$.each(destionationDivIds, function() {
			$("#" + this).toggle();
		});

		setStatusVar(destination);

	}
	var createProcidHeader = function() {
		//Menu
		$('<ul />').attr({
			id : 'procid-menus',
		}).appendTo("#procid-left-panel-header");

		//Procid Label
		$('<h3 />').attr({
			id : 'procid-label',
		}).text('Procid').appendTo("#procid-menus");

		//Home
		$('<li />').attr({
			id : 'procid-home',
		}).appendTo("#procid-menus");

		$('<a />').attr({
			id : 'procid-home-link',
			href : '#',
			rel : 'tooltip',
			title : 'Home'
		}).click(function goHome(evt) {
			changePage('home');
		}).appendTo("#procid-home");

		$('<img />').attr({
			id : 'procid-home-image',
			src : ABSOLUTEPATH + '/images/home.png',
		}).appendTo("#procid-home-link");

		//Idea-based
		$('<li />').attr({
			id : 'procid-ideaBased',
		}).appendTo("#procid-menus");

		$('<a />').attr({
			id : 'procid-ideaBased-link',
			href : '#',
			rel : 'tooltip',
			title : 'View the List of Ideas'
		}).click(function goIdeaBased(evt) {
			changePage('idea');
		}).appendTo("#procid-ideaBased");

		$('<img />').attr({
			id : 'procid-ideaBased-image',
			src : ABSOLUTEPATH + '/images/ideaBased.png',
		}).appendTo("#procid-ideaBased-link");

		//Invite
		$('<li />').attr({
			id : 'procid-invite',
		}).appendTo("#procid-menus");

		$('<a />').attr({
			id : 'procid-invite-link',
			href : '#',
			rel : 'tooltip',
			title : 'Invite New Participants'
		}).click(function goInvite(evt) {
			changePage('invite');
		}).appendTo("#procid-invite");

		$('<img />').attr({
			id : 'procid-invite-image',
			src : ABSOLUTEPATH + '/images/invite.png',
		}).appendTo("#procid-invite-link");

		//Setting
		$('<a />').attr({
			id : 'procid-setting-link',
			href : '#',
			rel : 'tooltip',
			title : 'Settings'
		}).click(function goSetting(evt) {

		}).appendTo("#procid-menus");

		$('<img />').attr({
			id : 'procid-setting-image',
			src : ABSOLUTEPATH + '/images/setting.png',
		}).appendTo("#procid-setting-link");
	}
	var addSearchPanel = function(name, parent) {
		$('<form />').attr({
			id : name,
			class : 'searchForm',
			method : 'get',
			action : '/search',
		}).appendTo("#" + parent);

		$('<input type="text" />').attr({
			name : 'q',
			class : 'searchFormInput',
			size : '40',
			placeholder : 'Search...',
		}).appendTo("#" + name);

	}
	var createLense = function(name, parent, tooltipText) {
		//Must read
		$('<li />').attr({
			id : "procid-" + name,
		}).appendTo("#" + parent);

		$('<a />').attr({
			id : 'procid-' + name + '-link',
			href : '#',
			rel : 'tooltip',
			title : tooltipText
		}).click(function highlightMustRead(evt) {
			if ($("div[id='procid-comment-" + name + "'] a").hasClass('unselected')) {
				$("div[id='procid-comment-" + name + "'] a").attr('class', 'selected');
				$("div[id='procid-comment-" + name + "'] img").attr('class', 'image-selected');
				$("div[id='procid-comment-" + name + "'] img").attr('src', ABSOLUTEPATH + '/images/' + name + '.png');
			} else {
				$("div[id='procid-comment-" + name + "'] a").attr('class', 'unselected');
				$("div[id='procid-comment-" + name + "'] img").attr('class', 'image-unselected');
			}
			return true;

		}).appendTo("#procid-" + name);

		$('<img />').attr({
			id : 'procid-' + name + '-image',
			src : ABSOLUTEPATH + '/images/' + name + '.png',
		}).appendTo("#procid-" + name + '-link');

	}
	var initializeIssueInfo = function(){
		var issueAuthor = $("#content-inner div[class='submitted'] a").first().text();
		var issueAuthorLink = $("#comments div[class='submitted'] a").first().attr('href');
		
		var issueStatus = $("#project-issue-summary-table tr:contains('Status:') td").last().text();
		
		var issueTitle = $("#page-subtitle").first().text();
		
		var path = window.location.pathname;
		if(path.indexOf("node") >= 0)
			var issueLink = window.location.href;
		else{
			var link = $("h3[class='comment-title'] a").first().attr('href');
			var index = link.indexOf("#")
			issueLink = link.substring(0, index);
		}
		
		issue.title = issueTitle;
		issue.link = issueLink;
		issue.author = issueAuthor;
		issue.authorLink = issueAuthorLink;
		issue.status = issueStatus;
  
	}
	var initializeCommentInfo = function() {
		//CommentTitle: <h3 class="comment-title"><a href="/node/331893#comment-1098877" class="active">#1</a></h3>
		var array_title = $("h3[class='comment-title']").map(function() {
			return $(this).text();
		});
		var array_links = $("h3[class='comment-title'] a").map(function() {
			return $(this).attr('href');
		});
		//CommentAuthor: <div class="submitted">Posted by <a href="/user/24967" title="View user profile.">webchick</a> on <em>November 8, 2008 at 8:20pm</em></div>
		var array_author = $("#comments div[class='submitted'] a").map(function() {
			return $(this).text();
		});
		var array_author_hrefs = $("#comments div[class='submitted'] a").map(function() {
			return $(this).attr('href');
		});
		var array_contents = $("div[class='content'] div[class='clear-block']").map(function() {
			var contents = $(this).children("p");
			var returnValue = "";
			$.each(contents, function() {
				returnValue += $(this).text();
			});
			return returnValue;
		});
		//<tr class=" even"><td><a href="http://drupal.org/files/issues/password-strength-meter.png">password-strength-meter.png</a></td><td>30.69 KB</td><td><em>Ignored:  Check issue status.</td><td><em>None</em></td><td><em>None</em></td> </tr>
		//<img src="http://drupal.org/files/issues/ms-passport.png" alt="MS Password Strength Meter" />
		var array_images = $("div[class='content'] div[class='clear-block']").map(function() {
			var returnValue = " ";
			var contents = $(this).find("a");
			$.each(contents, function() {
				var link = $(this).attr("href");
				if (link.match(/png$/) || link.match(/jpg$/)) {
					returnValue = link;
				}
			});

			var imgs = $(this).find("img");
			$.each(imgs, function() {
				var link = $(this).attr("src");
				if (link.match(/png$/) || link.match(/jpg$/)) {
					returnValue = link;
				}
			});
			return returnValue;
		});

		var len = array_title.length;
		for (var i = 0; i < len; i++) {
			var comment = {
				title : array_title[i],
				link : array_links[i],
				author : array_author[i],
				authorLink : array_author_hrefs[i],
				content : array_contents[i],
				tags : [],
				status : "Ongoing",
				comments : [],
				idea : "#1",
				criteria : [],
				tone: "",
				image : array_images[i]
			};
			commentInfos.push(comment);
		}
		return commentInfos;
	}
	var findTags = function(commentInfo) {

		var randomMust = Math.floor(Math.random() * 4);
		var randomIdea = Math.floor(Math.random() * 7);
		var randomConv = Math.floor(Math.random() * 5);
		var randomExprt = Math.floor(Math.random() * 3);
		var randomPatch = Math.floor(Math.random() * 2);

		if (randomMust == 1) {
			commentInfo.tags.push('must-read')
		}
		if (randomIdea == 1) {
			commentInfo.tags.push('idea')
		}
		if (randomConv == 1) {
			commentInfo.tags.push('conversation')
		}
		if (randomExprt == 1) {
			commentInfo.tags.push('expert')
		}
		if (randomPatch == 1) {
			commentInfo.tags.push('patch')
		}

		return commentInfo;
	}
	var applyTags = function(commentInfo) {

		var div1 = document.createElement('div');
		div1.setAttribute('id', 'procid-comment');
		var divinner = div1;

		$.each(commentInfo.tags, function() {
			var divTag = document.createElement('div');
			divTag.setAttribute('id', 'procid-comment-' + this);
			divinner.appendChild(divTag);
			divinner = divTag;
		});

		$('<img />').attr({
			id : 'procid-selected-comment-image',
			class : 'image-unselected',
			src : ABSOLUTEPATH + '/images/patch.png',
		}).appendTo(divinner);

		$('<a />').attr({
			id : 'procid-comment-link',
			href : commentInfo.link,
			class : 'unselected',
			rel : 'tooltip',
			title : 'see comment'
		}).text(commentInfo.title + "\t" + commentInfo.author).appendTo(divinner);

		$("#procid-left-panel-body").append(div1);
	}
	var createHomePageBody = function() {
		//Procid Home Body
		addSearchPanel('procid-search', "procid-left-panel-body");

		var lenses = document.createElement('ul');
		lenses.setAttribute('id', 'procid-lenses');
		$("#procid-left-panel-body").append(lenses);

		createLense('must-read', 'procid-lenses', 'View Must Read Comments');
		createLense('idea', 'procid-lenses', 'View Ideas');
		createLense('conversation', 'procid-lenses', 'View Conversation Comments');
		createLense('expert', 'procid-lenses', 'View Comments Posted by Experts');
		createLense('patch', 'procid-lenses', 'View Patches');

		initializeCommentInfo();
		initializeIssueInfo();
		
		$.ajaxSetup({
			'async' : false
		});

		

		$.post("http://0.0.0.0:3000/postcomments", {
			"issue" : JSON.stringify(issue),
			"commentInfos" : JSON.stringify(commentInfos)
		});

		url = "http://localhost:3000/input";
		// + '?' + $.param(commentInfos);
		//url = "./input.json"
		$.getJSON(url, function(data) {
			$.each(data.issueComments, function(i, comment) {
				commentInfos[i].tags = comment.tags;
				commentInfos[i].tone = comment.tone;
				commentInfos[i].comments = comment.comments;
				applyTags(commentInfos[i]);
			});
		});

	}
	var createOverlay = function() {
		var overlay = document.createElement("div");
		overlay.setAttribute("id", "procid-overlay");
		overlay.onclick = function(e) {
			document.body.removeChild(document.getElementById("procid-overlay"));
			document.body.removeChild(document.getElementById("procid-overlay-div"));
		};
		$('body').append(overlay);

		var overlayDiv = document.createElement("div");
		overlayDiv.setAttribute("id", "procid-overlay-div");
		$('body').append(overlayDiv);

		//<a id="close" href="#"></a>
		var overlayDivClose = document.createElement("img");
		overlayDivClose.setAttribute("id", "procid-overlay-div-close");
		overlayDivClose.setAttribute("src", ABSOLUTEPATH + '/images/closeButton.png');
		overlayDivClose.onclick = function(e) {
			document.body.removeChild(document.getElementById("procid-overlay"));
			document.body.removeChild(document.getElementById("procid-overlay-div"));
		};
		$("#procid-overlay-div").append(overlayDivClose);

		var label = document.createElement('h3');
		label.setAttribute('id', 'procid-overlay-header-label');
		label.innerHTML = "Edit Criteria";
		$("#procid-overlay-div").append(label);

		var hr = document.createElement('hr');
		hr.style.background = "url(" + ABSOLUTEPATH + "/images/sidebar_divider.png) repeat-x";
		$("#procid-overlay-div").append(hr);

		var tempCriteria = [];
		$.each(criteria, function() {
			//<input type='text' name='txt'>
			var divCriteria = document.createElement('div');
			divCriteria.setAttribute('id', 'procid-overlay-div-block');
			$("#procid-overlay-div").append(divCriteria);

			tempCriteria.push(this);

			var lowerLabel = document.createElement('label');
			lowerLabel.setAttribute('id', 'procid-criteria-lower-label');
			lowerLabel.innerHTML = "Lower";
			divCriteria.appendChild(lowerLabel);

			var lower = document.createElement('input');
			lower.setAttribute('id', 'procid-criteria-lower' + this.id);
			lower.setAttribute('type', 'text');
			lower.setAttribute('name', 'lower');
			lower.value = this.lower;
			$("#procid-criteria-lower" + this.id).bind("keyup change", function() {
				//tempCriteria[i].lower = this.value; i is the last i
			});
			divCriteria.appendChild(lower);

			var upperLabel = document.createElement('label');
			upperLabel.setAttribute('id', 'procid-criteria-upper-label');
			upperLabel.innerHTML = "Upper";
			divCriteria.appendChild(upperLabel);

			var upper = document.createElement('input');
			upper.setAttribute('id', 'procid-criteria-upper' + this.id);
			upper.setAttribute('type', 'text');
			upper.setAttribute('name', 'higher');
			upper.value = this.upper;
			$("#procid-criteria-upper" + this.id).bind("keyup change", function() {
				//tempCriteria[i].upper = this.value;
			});
			divCriteria.appendChild(upper);

			var descriptionLabel = document.createElement('label');
			descriptionLabel.setAttribute('id', 'procid-criteria-description-label');
			descriptionLabel.innerHTML = "Description";
			divCriteria.appendChild(descriptionLabel);

			var description = document.createElement('input');
			description.setAttribute('id', 'procid-criteria-description' + this.id);
			description.setAttribute('type', 'text');
			description.setAttribute('name', 'description');
			description.value = this.description;
			$("#procid-criteria-description" + this.id).bind("keyup change", function() {
				//tempCriteria[i].description = this.value;
			});
			divCriteria.appendChild(description);

		});

		var saveButton = document.createElement('input');
		saveButton.setAttribute('id', 'procid-criteria-save');
		saveButton.setAttribute('type', 'button');
		saveButton.value = "Save";
		saveButton.onclick = function(e) {
			var i = 0;
			$.each(tempCriteria, function() {
				criteria[i].lower = $("#procid-criteria-lower" + this.id).val();
				$(".procid-svg-criteria-lower" + this.id).map(function() {
					this.text(criteria[i].lower);

				});

				console.log("this.te" + $(".procid-svg-criteria-lower1")[0].text());
				//$(".procid-svg-criteria-lower1")[1].text("Salam,");
				i++;
			});

			document.body.removeChild(document.getElementById("procid-overlay"));
			document.body.removeChild(document.getElementById("procid-overlay-div"));
		};
		$("#procid-overlay-div").append(saveButton);

		//<input type="button" onclick="save()" value="Save" /><br/>

	}
	var enableAddcomment = function() {
		if ($("div[id='procid-idea-comments'] a").hasClass('show')) {
			$("div[id='procid-idea-comments'] a").attr('class', 'hide');
		} else {
			$("div[id='procid-idea-comments'] a").attr('class', 'show');
		}
		return true;
	}
	var createLabel = function(name, link) {
		var label = document.createElement('h3');
		label.setAttribute('id', 'procid-' + name + '-label');
		label.setAttribute('class', 'ideaPage-header-label');
		label.innerHTML = name;
		$("#procid-ideaPage-header").append(label);

		var link1 = document.createElement('a');
		link1.setAttribute('id', 'procid-edit-link');
		link1.setAttribute('href', "#");
		link1.innerHTML = link;
		link1.onclick = function(e) {
			if (link === "(edit)") {
				createOverlay();
			} else if (link === "(add)") {
				enableAddcomment();
			}
		};
		label.appendChild(link1);
	}
	var createIdeaImage = function(divIdeaBlock, commentInfo) {
		var divIdea = document.createElement('div');
		divIdea.setAttribute('id', 'procid-idea');
		divIdea.setAttribute('class', 'procid-idea-block-outer-cell');
		divIdeaBlock.appendChild(divIdea);

		var link1 = document.createElement('a');
		link1.setAttribute('id', 'procid-author-link');
		link1.setAttribute('href', commentInfo.authorLink);
		link1.setAttribute('class', 'ideaPage-link');
		link1.innerHTML = commentInfo.author;

		var divIdeaImage = document.createElement('div');
		divIdeaImage.setAttribute('id', 'procid-idea-div-image');

		if (commentInfo.image != " ") {//image attachment
			var image1 = document.createElement('img');
			image1.setAttribute('id', 'procid-ideaPage-image');
			image1.setAttribute('src', commentInfo.image);
			divIdeaImage.appendChild(image1);
		} else {
			divIdeaImage.textContent = commentInfo.content;
		}
		divIdea.appendChild(link1);
		divIdea.appendChild(divIdeaImage);

	}
	var createIdeaStatus = function(divIdeaBlock, commentInfo) {
		var divStatus = document.createElement('div');
		divStatus.setAttribute('id', 'procid-status');
		divStatus.setAttribute('class', 'procid-idea-block-inner-cell');
		divIdeaBlock.appendChild(divStatus);

		/*<div id="dd" class="wrapper-dropdown-3" tabindex="1">
		 <span>Transport</span>
		 <ul class="dropdown">
		 <li><a href="#"><i class="icon-envelope icon-large"></i>Classic mail</a></li>
		 <li><a href="#"><i class="icon-truck icon-large"></i>UPS Delivery</a></li>
		 <li><a href="#"><i class="icon-plane icon-large"></i>Private jet</a></li>
		 </ul>
		 </div>*/

		var wrapperDropdown = document.createElement('div');
		wrapperDropdown.setAttribute('id', 'procid-status-inner-div' + commentInfo.title.substr(1));
		wrapperDropdown.setAttribute('class', 'wrapper-dropdown');
		wrapperDropdown.setAttribute('tabindex', '1');
		wrapperDropdown.onclick = function(event) {
			$(this).toggleClass('active');
			return false;
		};
		divStatus.appendChild(wrapperDropdown);

		var wrapperDropdownText = document.createElement('span');
		wrapperDropdownText.setAttribute('id', 'procid-status-text' + commentInfo.title.substr(1));
		wrapperDropdownText.innerHTML = "Ongoing"
		wrapperDropdown.appendChild(wrapperDropdownText);

		var wrapperDropdownList = document.createElement('ul');
		wrapperDropdownList.setAttribute('class', 'dropdown');
		wrapperDropdown.appendChild(wrapperDropdownList);

		var obj = {
			placeholder : 'ongoing',
			val : '',
			index : -1
		};

		var statusArray = ["Ongoing", "Implemented", "Dropped"];
		$.each(statusArray, function() {
			var wrapperDropdownListOption = document.createElement('li');
			wrapperDropdownList.appendChild(wrapperDropdownListOption);
			wrapperDropdownListOption.onclick = function() {
				var opt = $(this);
				obj.val = opt.text();
				obj.index = opt.index();
				wrapperDropdownText.innerHTML = obj.val;
			};

			var wrapperDropdownListOptionLink = document.createElement('a');
			wrapperDropdownListOptionLink.setAttribute('href', '#');
			wrapperDropdownListOptionLink.innerHTML = "" + this;
			wrapperDropdownListOption.appendChild(wrapperDropdownListOptionLink);

			var wrapperDropdownListOptionLinkIcon = document.createElement('i');
			wrapperDropdownListOptionLinkIcon.setAttribute('class', this + " icon-large");
			wrapperDropdownListOptionLink.appendChild(wrapperDropdownListOptionLinkIcon);

		});
	}
	var addIcon = function(divParent, iconPath, divId, iconId) {		
		var divIcon = document.createElement('div');
		divIcon.setAttribute('id', divId);
		divParent.appendChild(divIcon);
		
		addImage(divIcon, iconPath, iconId);
	}
	
	var addImage = function(divParent, iconPath, iconId) {
		var icon = document.createElement('img');
		icon.setAttribute('id', iconId);
		icon.setAttribute('src', iconPath);
		divParent.appendChild(icon);
	}
	
	var findComment = function(number){
		
		var result = $.grep(commentInfos, function(e) {
			return e.title == number;
		});
		if (result.length == 0)
			return -1;
		else
			return result[0];
		//var num = "#" + number;
		/*$.each(commentInfos, function() {
			//console.log("title: " + this.title);
			//console.log("num: " + number);
			var title = this.title;
			if(new String(title).valueOf() === new String(number).valueOf())
				return this;
		});
		
		return -1;*/
	}
	var createIdeaComments = function(divIdeaBlock, commentInfo) {
		//comments on an idea
		var divComments = document.createElement('div');
		divComments.setAttribute('id', 'procid-idea-comments');
		divComments.setAttribute('class', 'procid-idea-block-outer-cell');
		divIdeaBlock.appendChild(divComments);

		var divCommentHeader = document.createElement('div');
		divCommentHeader.setAttribute('id', 'procid-idea-comment-header');
		divComments.appendChild(divCommentHeader);
		
		addIcon(divCommentHeader, ABSOLUTEPATH + "/images/pros.png", 'procid-idea-comment-div-icon', "procid-idea-comment-icon");
		addIcon(divCommentHeader, ABSOLUTEPATH + "/images/nuetral.png", 'procid-idea-comment-div-icon', "procid-idea-comment-icon");
		addIcon(divCommentHeader, ABSOLUTEPATH + "/images/cons.png", 'procid-idea-comment-div-icon', "procid-idea-comment-icon");

		var divCommentColumns = document.createElement('div');
		divCommentColumns.setAttribute('id', 'procid-idea-comment-columns');
		divComments.appendChild(divCommentColumns);
		
		var divProsColumn = document.createElement('div');
		divProsColumn.setAttribute('id', 'procid-idea-comment-column');
		divCommentColumns.appendChild(divProsColumn);
		
		addIcon(divCommentColumns, ABSOLUTEPATH + "/images/sidebar_divider.png", 'procid-idea-comment-div-divider', "procid-idea-comment-divider");
		
		var divNuetralColumn = document.createElement('div');
		divNuetralColumn.setAttribute('id', 'procid-idea-comment-column');
		divCommentColumns.appendChild(divNuetralColumn);
		
		addIcon(divCommentColumns, ABSOLUTEPATH + "/images/sidebar_divider.png", 'procid-idea-comment-div-divider', "procid-idea-comment-divider");
		
		var divConsColumn = document.createElement('div');
		divConsColumn.setAttribute('id', 'procid-idea-comment-column');
		divCommentColumns.appendChild(divConsColumn);
		
		var srcPath = ABSOLUTEPATH + "/images/comment.png";
		//console.log("here: " + commentInfo.comments);
		$.each(commentInfo.comments, function() {
			var string = "#"+this;
			var comment = findComment(string);
			if(comment.tone == "positive"){
				addImage(divProsColumn, srcPath, 'procid-idea-comment-img');
			}else if(comment.tone == "nuetral"){
				addImage(divNuetralColumn, srcPath, 'procid-idea-comment-img');
			}else if(comment.tone == "negative"){
				addImage(divConsColumn, srcPath, 'procid-idea-comment-img');
			}
		});

		/*var addComment = document.createElement('a');
		addComment.setAttribute('id', 'procid-addcomment-link');
		addComment.setAttribute('href', "#");
		addComment.setAttribute('rel', "tooltip");
		addComment.setAttribute('class', "hide");
		addComment.setAttribute('title', "Add a new comment");
		addComment.onclick = function(e) {
			//TODO: add a new comment;
		};
		divComments.appendChild(addComment);

		var addCommentImg = document.createElement('img');
		addCommentImg.setAttribute('id', 'procid-addcomment-image');
		addCommentImg.setAttribute('src', ABSOLUTEPATH + '/images/blue-plus.png');
		addComment.appendChild(addCommentImg);

		addComment.innerHTML += "Comment";*/
	}

	var createCriterion = function(lower_, upper_, id_, description_) {
		var criterion = {
			id : id_,
			lower : lower_,
			upper : upper_,
			description : description_
		};
		criteria.push(criterion);
		return criterion;
	}
	
	var addCriterionValue = function(commentInfo, value_, comment_, id_) {
		var criterion = {
			value : value_,
			comment : comment_,
			id : id_
		};
		commentInfo.criteria.push(criterion);
		var criterion_track = {
			value : value_,
			comment : comment_,
			id : id_,
			title : commentInfo.title
		};
		allCriteria.push(criterion_track);
		return criterion;
	}
	var findCriterion = function(commentInfo, id_) {
		var result = $.grep(commentInfo.criteria, function(e) {
			return e.id == id_;
		});
		if (result.length == 0)
			return -1;
		else
			return result[0];
	}
	var editCriterionValue = function(commentInfo, criterion) {
		if ($.inArray(criterion, commentInfos.criteria) != -1)
			//TODO: remove criterion
			return commentInfo;
	}
	
	var createCriterionSelectors = function(){
		var color = "lightgray";

		//y function works for both plots
		var x = d3.scale.quantize().domain([0, 8]).range([40, 60, 80, 100, 120, 140, 160, 180, 200]);

		var mySvg = d3.selectAll('#procid-idea-criterion').append("svg:svg").attr("width", '260').attr("height", '50').attr("class", "selector").attr("viewBox", "0 0 260 50");
		
		d3.selectAll(".selector").append("image")
    		.attr("xlink:href", ABSOLUTEPATH + "/images/slider.png")
    		.attr("width", "240")
    		.attr("x", "5")
    		.attr('y', "15")
    		.attr("height", "30");	

		d3.selectAll(".selector").data(allCriteria).append("svg:circle")
			.attr("class", "selectorCircle")
			.attr("fill", "white")
			.attr("stroke", color)
			.attr("stroke-width", '3')
			.attr("style", "cursor: pointer")
			.attr("cy", "30")
			.attr("cx", function(d) {
				return x(d.value);
			}).attr("r", "8")
			.on("mouseover", function() {
				d3.select(this).style("fill-opacity", .7);
			}).on("mouseout", function() {
				d3.select(this).style("fill-opacity", 1);
			}).call(d3.behavior.drag().on("dragstart", function(d) {
				this.__origin__ = [x(d.value), 30];
				//mySvg.select(".tooltiptext").remove();
				//mySvg.append("svg:text").attr("class", "tooltiptext").text().attr("x", x(d.value)).attr("y", 30 + 10);
			}).on("drag", function(d) {
				var cx = Math.min(200, Math.max(40, this.__origin__[0] += d3.event.dx));
				//var cy = Math.min(50, Math.max(0, this.__origin__[1] += d3.event.dy));
				cx = Math.floor(cx/10)*10;
				var firstNum = x.range()[0];
				var diff = x.range()[1] - firstNum;
				var value = Math.floor((cx-firstNum)/diff);
				
				//updating the value
				d.value = value;//Math.floor(x.invert(cx));
				//TODO: save to database		
		
				d3.select(this).attr("cx", cx).attr("fill", function(d) {
					return "blue";
				});

				//Tooltip next to the moving dot
				//mySvg.select(".tooltiptext").text(d.value.toFixed(0)).attr("x", x(d.value));

			}).on("dragend", function() {
				//mySvg.select(".tooltiptext").remove();
				delete this.__origin__;
			}));
		
	}
	
	var createIdeaCriteria = function(divIdeaBlock, commentInfo) {
		//criteris
		var divCriteria = document.createElement('div');
		divCriteria.setAttribute('id', 'procid-idea-criteria');
		divCriteria.setAttribute('class', 'procid-idea-block-inner-cell');
		divIdeaBlock.appendChild(divCriteria);
		var counter = 0;

		$.each(criteria, function() {
			var divCriterion = document.createElement('div');
			divCriterion.setAttribute('id', 'procid-idea-criterion');
			divCriterion.setAttribute('class', 'procid-criteria-block-cell');
			divCriteria.appendChild(divCriterion);

			var criterion = findCriterion(commentInfo, this.id);
			if(criterion == -1)
				criterion = addCriterionValue(commentInfo, 0, "", this.id);
		});
	}
	var createIdeaPageBody = function() {
		//Header
		var ideaPageHeader = document.createElement('div');
		ideaPageHeader.setAttribute('id', 'procid-ideaPage-header');
		$("#procid-idea-page-wrapper").append(ideaPageHeader);

		createLabel('Idea', "");
		createLabel('Status', "");
		createLabel('Criteria ', "(edit)");
		createLabel('Comments ', "(add)");

		//<hr/>
		var hr2 = document.createElement('hr');
		hr2.style.background = "url(" + ABSOLUTEPATH + "/images/sidebar_divider.png) repeat-x";
		$("#procid-idea-page-wrapper").append(hr2);

		console.log("numComments:" + commentInfos.length);

		//Body
		for (var i = 0; i < commentInfos.length; i++) {

			if ($.inArray("idea", commentInfos[i].tags) != -1 && commentInfos[i].content != "") {
				var divIdeaBlock = document.createElement('div');
				divIdeaBlock.setAttribute('id', 'procid-idea-block');

				createIdeaImage(divIdeaBlock, commentInfos[i]);
				createIdeaStatus(divIdeaBlock, commentInfos[i]);
				createIdeaCriteria(divIdeaBlock, commentInfos[i]);
				createIdeaComments(divIdeaBlock, commentInfos[i]);

			}
			$("#procid-idea-page-wrapper").append(divIdeaBlock);		
		}
		
		createCriterionSelectors();

	}
	var findPeopletoInvite = function() {
		var suggestedAuthors = [];
		$.getJSON("invite.json", function(data) {
			$.each(data.invitedAuthors, function(i, author) {
				suggestedAuthors[i] = author;
			});
		});
		return suggestedAuthors;
	}
	var createInvitePageBody = function() {
		//Procid Invite Page Body
		//Search
		addSearchPanel('procid-search-invite', 'procid-invite-page-wrapper');

		var suggestedPeaple = findPeopletoInvite();
		for (var i = 0; i < suggestedPeaple.length; i++) {

			var divInviteBlock = document.createElement('div');
			divInviteBlock.setAttribute('id', 'procid-invite-block');

			var divAuthorName = document.createElement('div');
			divAuthorName.setAttribute('id', 'procid-author-name');
			divAuthorName.setAttribute('class', 'procid-invite-block-cell');
			divAuthorName.textContent = suggestedPeaple[i].author;
			divInviteBlock.appendChild(divAuthorName);

			var divAuthorDescription = document.createElement('div');
			divAuthorDescription.setAttribute('id', 'procid-author-description');
			divAuthorDescription.setAttribute('class', 'procid-invite-block-cell');
			divAuthorDescription.textContent = suggestedPeaple[i].description;
			divInviteBlock.appendChild(divAuthorDescription);

			var divInviteLink = document.createElement('a');
			divInviteLink.setAttribute('id', 'procid-invite-invitationlink');
			divInviteLink.setAttribute('class', 'procid-invite-block-cell');
			divInviteLink.setAttribute('href', '#');
			divInviteLink.setAttribute('rel', 'tooltip')
			divInviteLink.setAttribute('title', 'Invite this person');
			divInviteLink.innerHTML = "Invite";
			divInviteLink.onclick = function invitePerson(evt) {
				//alert('do something cool');
				return true;
			};

			divInviteBlock.appendChild(divInviteLink);
			$("#procid-invite-page-wrapper").append(divInviteBlock);

		}
	}
	//Program Starts From here
	addCSSToHeader();

	//HomePage
	var page = document.getElementsByClassName('container-12 clear-block')[1];
	page.setAttribute('class', 'clear-block');

	createStatusVar();

	//Add the left panel
	var leftPanel = addLeftPanel();

	var pageWrapper = document.createElement('div');
	pageWrapper.setAttribute('id', 'procid-page-wrapper');

	$("#page").wrap(pageWrapper);

	var outerPageWrapper = document.createElement('div');
	outerPageWrapper.setAttribute('id', 'procid-outer-page-wrapper');
	outerPageWrapper.appendChild(leftPanel);

	$("#procid-page-wrapper").wrap(outerPageWrapper);

	//IdeaPageWrapper
	var ideaPageWrapper = document.createElement('div');
	ideaPageWrapper.setAttribute('id', 'procid-idea-page-wrapper');
	//$("#procid-idea-page-wrapper").toggle(false);

	$("#procid-page-wrapper").after(ideaPageWrapper);

	//InvitePageWrapper
	var invitePageWrapper = document.createElement('div');
	invitePageWrapper.setAttribute('id', 'procid-invite-page-wrapper');
	//$("#procid-invite-page-wrapper").toggle(false);

	$("#procid-page-wrapper").after(invitePageWrapper);

	//Procid Header
	createProcidHeader();

	var hr = document.createElement('hr');
	hr.style.background = "url(" + ABSOLUTEPATH + "/images/sidebar_divider.png) repeat-x";
	$("#procid-left-panel-header").append(hr);

	createCriterion("Simple", "Complex", "1", "The text should be simple.");
	createCriterion("Explains", "Doesn't Explain", "2", "The text should be explanatory.");
	createCriterion("Less", "More", "3", "We need less information.");

	createHomePageBody();
	createIdeaPageBody();
	createInvitePageBody();

	console.log("done");
	});
};

// load jQuery and execute the main function
addJQuery(main);
