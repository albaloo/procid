// ==UserScript==
// @name           Procid
// @description    Interactive system supporting consensus building.
// @icon           http://web.engr.illinois.edu/~rzilouc2/procid/images/icon.png
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
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
		var body = document.getElementsByTagName('head')[0];
		body.appendChild(script);
	}, false);
	var body1 = document.getElementsByTagName('head')[0];
	//<script type="text/javascript" src="http://dl.dropbox.com/u/40036711/Scripts/ddslick.js"></script>
	body1.appendChild(script);
};

// the main function of this userscript
function main() {

	console.log("begin");
	var ABSOLUTEPATH = 'https://raw.github.com/albaloo/procid/master'; //'http://web.engr.illinois.edu/~rzilouc2/procid';//'./';
	var commentInfos = [];
	var criteria = [];

	var addCSSToHeader = function() {
		var header = document.getElementsByTagName('head')[0];
		var csslink = document.createElement('link');
		csslink.setAttribute('href', ABSOLUTEPATH + '/style.css');
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
	var initializeCommentInfo = function() {
		//CommentTitle: <h3 class="comment-title"><a href="/node/331893#comment-1098877" class="active">#1</a></h3>
		var array_title = $("h3[class='comment-title']").map(function() {
			return $(this).text();
		});
		var array_links = $("h3[class='comment-title'] a").map(function() {
			return $(this).attr('href');
		});
		//CommentAuthor: <div class="submitted">Posted by <a href="/user/24967" title="View user profile.">webchick</a> on <em>November 8, 2008 at 8:20pm</em></div>
		var array_author = $("div[class='submitted'] a").map(function() {
			return $(this).text();
		});
		var array_author_hrefs = $("div[class='submitted'] a").map(function() {
			return $(this).attr('href');
		});
		var array_contents = $("div[class='content'] p").map(function() {
			return $(this).text();
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
				criteria : []
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
		$.each(commentInfos, function() {
			findTags(this);
			applyTags(this);
		});
	}
	var createLabel = function(name) {
		var label = document.createElement('h3');
		label.setAttribute('id', 'procid-' + name + '-label');
		label.setAttribute('class', 'ideaPage-header-label');
		label.innerHTML = name;
		$("#procid-ideaPage-header").append(label);
	}
	var createIdeaImage = function(divIdeaBlock, commentInfo) {
		var divIdea = document.createElement('div');
		divIdea.setAttribute('id', 'procid-idea');
		divIdea.setAttribute('class', 'procid-idea-block-cell');
		divIdeaBlock.appendChild(divIdea);

		var link1 = document.createElement('a');
		link1.setAttribute('id', 'procid-author-link');
		link1.setAttribute('href', commentInfo.authorLink);
		link1.setAttribute('class', 'ideaPage-link');
		link1.innerHTML = "by \t" + commentInfo.author;

		//if image attachment
		/*var image1 = document.createElement('img');
		image1.setAttribute('id', 'procid-idea-image');
		image1.setAttribute('class', 'ideaPage-image');
		image1.setAttribute('src', ABSOLUTEPATH + '/images/patch.png');
		divIdea.appendChild(image1);*/

		//else
		var divIdeaImage = document.createElement('div');
		divIdeaImage.setAttribute('id', 'procid-idea-div-image');
		divIdeaImage.textContent = commentInfo.content;
		divIdea.appendChild(divIdeaImage);
		divIdea.appendChild(link1);
	}
	var createIdeaStatus = function(divIdeaBlock, commentInfo) {
		var divStatus = document.createElement('div');
		divStatus.setAttribute('id', 'procid-status');
		divStatus.setAttribute('class', 'procid-idea-block-cell');
		divIdeaBlock.appendChild(divStatus);

		var selector = document.createElement('select');
		selector.setAttribute('id', 'procid-status-selector' + commentInfo.title.substr(1));
		divStatus.appendChild(selector);

		var statusArray = ["Ongoing", "Implemented", "Dropped"];
		$.each(statusArray, function() {
			$('<option />').attr({
				id : 'procid-status-option',
				value : this,
			}).text("" + this).appendTo(selector);

		});

	}
	var createIdeaComments = function(divIdeaBlock, commentInfo) {
		//comments on an idea
		var divComments = document.createElement('div');
		divComments.setAttribute('id', 'procid-idea-comments');
		divComments.setAttribute('class', 'procid-idea-block-cell');
		divIdeaBlock.appendChild(divComments);

		var randomComments = Math.floor(Math.random() * 10);
		if (randomComments == 1) {
			var comment = document.createElement('img');
			comment.setAttribute('id', 'procid-comment-image');
			comment.setAttribute('src', ABSOLUTEPATH + '/images/sad-face.png');
			divComments.appendChild(comment);

			var comment2 = document.createElement('img');
			comment2.setAttribute('id', 'procid-comment-image');
			comment2.setAttribute('src', ABSOLUTEPATH + '/images/happy-face.png');
			divComments.appendChild(comment2);

		} else if (randomComments == 2) {
			var comment = document.createElement('img');
			comment.setAttribute('id', 'procid-comment-image');
			comment.setAttribute('src', ABSOLUTEPATH + '/images/nuetral-face.png');
			divComments.appendChild(comment);

			var comment2 = document.createElement('img');
			comment2.setAttribute('id', 'procid-comment-image');
			comment2.setAttribute('src', ABSOLUTEPATH + '/images/nuetral-face.png');
			divComments.appendChild(comment2);
		} else if (randomComments == 3) {
			var comment = document.createElement('img');
			comment.setAttribute('id', 'procid-comment-image');
			comment.setAttribute('src', ABSOLUTEPATH + '/images/sad-face.png');
			divComments.appendChild(comment);
		}
	}
	var createCriterion = function(lower_, upper_, id_) {
		var criterion = {
			id: id_,
			lower : lower_,
			upper : upper_,
		};
		criteria.push(criterion);
		return criterion;
	}
	var addCriterionValue = function(commentInfo, value_, comment_, id_) {
		var criterion = {
			value : value_,
			comment : comment_,
			id: id_
		};
		commentInfo.criteria.push(criterion);
		return commentInfo;
	}
	var findCriterion = function(commentInfo, id_){
		var result = $.grep(commentInfo.criteria, function(e){ return e.id == id_; });
		if(result.length == 0)
		   return -1;
		else
		   return result[0];
	}
	var editCriterionValue = function(commentInfo, criterion) {
		if ($.inArray(criterion, commentInfos.criteria) != -1)
			//TODO: remove criterion
			return commentInfo;
	}
	var createIdeaCriteria = function(divIdeaBlock, commentInfo) {
		//criteris
		var divCriteria = document.createElement('div');
		divCriteria.setAttribute('id', 'procid-idea-criteria');
		divCriteria.setAttribute('class', 'procid-idea-block-cell');
		divIdeaBlock.appendChild(divCriteria);

		$.each(criteria, function() {
			var divCriterion = document.createElement('div');
			divCriterion.setAttribute('id', 'procid-idea-criterion');
			divCriterion.setAttribute('class', 'procid-criteria-block-cell');
			divCriteria.appendChild(divCriterion);

			//<svg height=50 width=90 viewBox='0 0 90 50' style='display: block'>
			var mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			//mySvg.setAttribute("version", "1.2");
			mySvg.setAttribute("id", "mysvg");
			mySvg.setAttribute("height", '40');
			mySvg.setAttribute("width", '200');
			//mySvg.setAttribute("style", 'display: block;');
			//mySvg.setAttribute("baseProfile", "tiny");
			mySvg.setAttribute("viewBox", "0 0 200 40");
			mySvg.setAttribute("preserveAspectRatio", "xMinYMin");
			divCriterion.appendChild(mySvg);

			//<text x="0" y="15" fill="red">I love SVG</text>
			var x1 = 0;
			var distance = 10;
			var color = "lightgray";
			//"#0D7DC1";
			//<text x="0" y="15" fill="red">I love SVG</text>
			var lowerLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
			lowerLabel.setAttribute("x", 0);
			lowerLabel.setAttribute("y", 30);
			lowerLabel.setAttribute("fill", "black");
			lowerLabel.textContent = this.lower;
			//"Simple";
			mySvg.appendChild(lowerLabel);

			//<svg:line x1="0" y1="0" x2="170" y2="50" stroke="gray" stroke-width="1"/>
			var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", 20);
			line.setAttribute("y1", 10);
			line.setAttribute("x2", 140);
			line.setAttribute("y2", 10);
			line.setAttribute("stroke", color);
			mySvg.appendChild(line);
			var id = this.id;
			var criteriaValueArray = [0, 1, 2, 3, 4];
			$.each(criteriaValueArray, function() {
				var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				var thisValue = "" + this;
				shape.setAttribute("id", "circle"+commentInfo.title.substr(1)+id+thisValue);
				shape.setAttribute("cx", 20 + this * 30);
				shape.setAttribute("cy", 10);
				shape.setAttribute("r", 4);
				shape.setAttribute("stroke", color);
				shape.setAttribute("fill", color);
				shape.onclick = function(e) {
					var prevValue = findCriterion(commentInfo, id);
					if(prevValue == -1){
						shape.setAttribute("fill", "#0D7DC1");
						addCriterionValue(commentInfo, thisValue, "I think this works", id);
					}else {
						$("#"+"circle"+commentInfo.title.substr(1)+id+prevValue.value).attr("fill", color);
						commentInfo.criteria = $.grep(commentInfo.criteria, function(e){ return e.id != id; });
						shape.setAttribute("fill", "#0D7DC1");
						addCriterionValue(commentInfo, thisValue, "I think this works", id);
					}
				};
				mySvg.appendChild(shape);

			});

			//<text x="0" y="15" fill="red">I love SVG</text>
			var upperLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
			upperLabel.setAttribute("x", 10 + 3.5 * 30);
			upperLabel.setAttribute("y", 30);
			upperLabel.setAttribute("fill", "black");
			upperLabel.textContent = this.upper;
			//"Complex";
			mySvg.appendChild(upperLabel);

			var comment_value = findCriterion(commentInfo, id);
			if (comment_value != -1) {
				var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				polygon.setAttribute("id", "procid-polygon1");
				polygon.setAttribute("points", "37,130 42,140 47,130");
				polygon.setAttribute("stroke", "black");
				polygon.setAttribute("stroke-width", "2");
				polygon.setAttribute("fill", color);
				mySvg.appendChild(polygon);
				//<polygon fill="white" stroke="black" stroke-width="2" points="37,130 42,140 47,130" />
				//<rect x="15" y="100" width="55" height="30" fill="white" stroke="black" stroke-width="1.5" rx="5" ry="5"/>
				//<line x1="38" y1="130" x2="46" y2="130" stroke="white" stroke-width="3"/>
			}
		});
	}
	var createIdeaPageBody = function() {
		//Header
		var ideaPageHeader = document.createElement('div');
		ideaPageHeader.setAttribute('id', 'procid-ideaPage-header');
		$("#procid-idea-page-wrapper").append(ideaPageHeader);

		createLabel('Idea');
		createLabel('Status');
		createLabel('Comments');
		createLabel('Criteria');

		//<hr/>
		var hr2 = document.createElement('hr');
		$("#procid-idea-page-wrapper").append(hr2);

		//Body
		for (var i = 0; i < commentInfos.length; i++) {

			if ($.inArray("idea", commentInfos[i].tags) != -1 && commentInfos[i].content != "") {

				var divIdeaBlock = document.createElement('div');
				divIdeaBlock.setAttribute('id', 'procid-idea-block');

				createIdeaImage(divIdeaBlock, commentInfos[i]);
				createIdeaStatus(divIdeaBlock, commentInfos[i]);
				createIdeaComments(divIdeaBlock, commentInfos[i]);
				createIdeaCriteria(divIdeaBlock, commentInfos[i]);

			}
			$("#procid-idea-page-wrapper").append(divIdeaBlock);
		}

	}
	var findPeopletoInvite = function() {
		var suggestedAuthors = [];
		var len = commentInfos.length;
		for (var i = 0; i < len; i++) {
			var randomAuthor = Math.floor(Math.random() * 9);

			if (randomAuthor == 1) {

				var randomDes = Math.floor(Math.random() * 3);
				var des = "Provided patch and patch reviews in 6 discussions with 4 mutual participants.";
				if (randomDes == 1)
					des = "Participated in 5 discussions that reached consensus.";
				else if (randomDes == 2)
					des = "Participated in previous Discussions with 7 participants.";

				var suggestedAuthor = {
					author : commentInfos[i].author,
					authorLink : commentInfos[i].authorLink,
					description : des,
				};
				suggestedAuthors.push(suggestedAuthor);
			}
		}
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
			$("#procid-invite-block").append(divAuthorName);

			var divAuthorDescription = document.createElement('div');
			divAuthorDescription.setAttribute('id', 'procid-author-description');
			divAuthorDescription.setAttribute('class', 'procid-invite-block-cell');
			divAuthorDescription.textContent = suggestedPeaple[i].description;
			$("#procid-invite-block").append(divAuthorDescription);

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

			$("#procid-invite-block").append(divInviteLink);
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
	$("#procid-left-panel-header").append(hr);

	createCriterion("Simple", "Complex", "1");
	createCriterion("Explains", "Doesn't Explain", "2");
	createCriterion("Less", "More", "3");

	createHomePageBody();
	createIdeaPageBody();
	createInvitePageBody();

	console.log("done");
};

// load jQuery and execute the main function
addJQuery(main);
