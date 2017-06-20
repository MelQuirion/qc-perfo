// DEVKIT 2.0.0

window.ieDebug = 0;  
window.ieFlag = false;
window.kitAttr  = 'dkit-';
window.kitAttrs = kitAttr;  
window._ROOT = '';  

var $models = $('div, pre, blockquote, dl, dt, dd, p, ol, ul, li, br, hr, figcaption, figure, body, aside, adress, h1, h2, h3, h4, h5, h6, nav, main, section, header, article, footer, col, colgroup, caption, table, tr, td, th, tbody, thead, tfoot, img, area, map, embed, object, param, source, iframe, canvas, track, audio, video, strong');

$(document).ready(function(){
	 
	checkIeSupport();
	getRootURL();
	checkTouchPatch();
	
});


function msieversion(){ 
	var ua = window.navigator.userAgent
	var msie = ua.indexOf ( "MSIE " )

	if ( msie > 0 ) {  
		return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
		ieFlag = true;
	}
	else {                 
		return ieDebug
	}
} 

function checkIeSupport(){
	version = msieversion();   
	if (version != 0){
		window.kitAttr = 'data-';
		$models.each(function(){
			var attrArray = [], attrValArray = [], attrOldArray = [], attrs = [];
			attrs = this.attributes;
			for (var i=0; i<attrs.length; i++) {
					if (attrs[i].name.indexOf(kitAttrs)==0){
						attrOldArray[i] = (attrs[i].name);
						attrArray[i] = 'data-' + attrOldArray[i].split('-')[1]; // attr name
						attrValArray[i] = $(this).attr(attrs[i].name);
					}
			}
			for (var i=0; i<attrArray.length; i++) {
				$(this).attr(attrArray[i], attrValArray[i]);
				$(this).removeAttr(attrOldArray[i]);
			}
		});
	}
} 
 
function getRootURL(){
	if (_ROOT == '') window._ROOT = $('['+ kitAttr +'root]').attr(kitAttr +'root');
}

function checkTouchPatch(){
	var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

	if (isTouch){
		$("<link/>", {
		   rel: "stylesheet",
		   type: "text/css",
		   href: "patch/patch-touch.min.css"
		}).appendTo("head");
	}
}


var DROPDOWN = (function($){
	var selector = $('['+ kitAttr +'dropdown]');
	var a_dropdown_is_open = false;
	var active_selector = {};
	
	var check_state = function(target){
		var child = target.next();
		
		if (a_dropdown_is_open) selector.find('span').removeClass('icon-arrow-up').parent().next().fadeOut();
		
		if (child.is(":visible")){
			close_dropdown(target);
		} else {
			target.find('span').addClass('icon-arrow-up');
			child.stop().fadeIn();
			a_dropdown_is_open = true;
			active_selector = target;
		}
	}
	
	var init_selection = function(target){
		var parent = target.parent().parent();
		var box_selector = parent.prev();
		var choice_label = target.text();
		parent.fadeOut();
		box_selector.find('span').removeClass('icon-arrow-up');
		a_dropdown_is_open = false;
		active_selector = {};
		if(box_selector.attr(kitAttr +'dropdown') == 'self'){
			box_selector.html(choice_label+'<span class="icon-arrow-down"></span>')
		}
	}
	
	var close_dropdown = function(target){
		var child = target.next();
		target.find('span').removeClass('icon-arrow-up');
		child.stop().fadeOut();
		a_dropdown_is_open = false;
		active_selector = {};
	}
	
	var prevent_body_scroll = function(target){
		var child = selector.next();
		child.unbind('mouseenter');
		child.on('mouseenter', function(){
			$('body').css({overflow:'hidden'})
		})
		child.on('mouseleave', function(){
			$('body').css({overflow:''})
		})
	}
	
	var click_outside = function(e){
		var left = e.pageX;
		var top = e.pageY;
		
		if (active_selector.length){
			var box_position = active_selector.offset();
			var box_width = active_selector.outerWidth();
			var box_height = active_selector.outerHeight();
			
			if(!(
				(left >= box_position.left) && 
			    (top >= box_position.top) && 
			    (left <= box_position.left + box_width) &&
			    (top <= box_position.top + box_height)
			   )){
				close_dropdown(active_selector);
			}
			
		}
	}
	
	return {
		init: function(){
			selector.on('click', function(){ check_state($(this)) });
			selector.next().find('a').on('click', function(){ init_selection($(this)) })
			$(window).on('scroll', function(){ prevent_body_scroll($(this)) });
			$('html').on('click', function(event){
				click_outside(event);
			})
		}
	}
	

})($).init()
var FIXHEIGHT = (function($){ 
	
	var run = function(){
		var resMax = 0     
		  , expDirect = "top" 
		  , childHeight = []  
		  , highestChild = 0
		  , childNum = 0 
		  , childItem = $('['+ kitAttr +'fixHeight="child"]')
		  , parentItem = $('['+ kitAttr +'fixHeight="parent"]');
		
		childItem.css({paddingBottom: '', paddingTop:'', height:'' });
		
		parentItem.each(function(i, obj){  
			if($(this).find('['+ kitAttr +'fixHeight="child"]').css('padding-top')){
				var checkPadding = (
					parseInt($(this).find('['+ kitAttr +'fixHeight="child"]').css('padding-top').split('px')[0]) 
					+ 
					parseInt($(this).find('['+ kitAttr +'fixHeight="child"]').css('padding-bottom').split('px')[0])
				) /2;
			}
			

			$(this).find('['+ kitAttr +'fixHeight="child"]').each(function(i, obj){
				childHeight.push($(this).height());
				childNum ++
			});
			
			highestChild = (Math.max.apply(Math, childHeight));

			$(this).find('['+ kitAttr +'fixHeight="child"]').each(function(i, obj){				
			
				resMax = $(this).attr(''+ kitAttr +'fixheightstopat') || 0;
				expDirect = $(this).attr(''+ kitAttr +'fixheightorient') || 'top'
				
				if ($(window).width() > resMax){
					
					checkHeight = $(this).height();
					
					if (checkHeight < highestChild){
						if (expDirect == 'top') $(this).css({paddingBottom: (highestChild - checkHeight) + checkPadding});
						if (expDirect == 'bottom') $(this).css({paddingTop: highestChild - checkHeight});
						if (expDirect == 'center') $(this).css({paddingTop: ((highestChild - checkHeight)/2), paddingBottom: ((highestChild - checkHeight)/2) });
					}
				} else {
					$(this).css({paddingBottom: '', paddingTop:'', height:'' });
				}
				resMax = 0;
			});

			childHeight = [];
			highestChild = 0;
			childNum = 0;     

		});
	};
	
	
	return{
		init: function(){
			$(window).resize(run);
			$(window).on('load', run);
		},
		callbackInit: function(){
			run();
		}
	};
	
	
})($);

var FIXVERTICAL = (function($){
	
	var parentNumber = 0 
	  , childNumber = 0
	  , parentArray = []
	  , childArray = []
	  , parentItem = $('['+ kitAttr +'vertical="parent"]')
	  , childItem = $('['+ kitAttr +'vertical="child"]');
	
	var run = function(){
		parentNumber = 0; 
		childNumber = 0;
		parentArray = [];
		childArray = [];
		
		parentItem.each(function(i, obj) {
			parentArray.push($(this).height());
			parentNumber = parentNumber + 1;
		});
		
		childItem.each(function(i, obj) {
			var maxCenter = $(this).attr(''+ kitAttr +'verticalstopat') || 0;
			var windowWidth = $(window).width();

			if (maxCenter != null && maxCenter <= windowWidth){
				setVertical($(this));
			} else if (maxCenter == null) {
				setVertical($(this));
			} else {
				resetVertical($(this));
			}
		});
	};
	
	var resetVertical = function(target){
		childItem.each(function(i, obj) {
			$(target).css( {'margin-top' : 0 } );
		});
	};
	
	var setVertical = function(target){
		childArray.push($(target).height());
		$(target).css( {'margin-top' : ( parentArray[childNumber] / 2 ) - ( childArray[childNumber] / 2 ) } );
		childNumber = childNumber + 1;
	}
	
	return{
		init: function(){
			$(window).load(function(){
				run();
			});

			$(window).on("resize", function(){
				run();
			});
		}
	};
	
})($);


var LIGHTBOX = (function($){
  	
	var item = $('['+ kitAttr +'lightbox^="child"]')
	  , Gallery_images = {}
	  , Total_img = 0
	  , lastHeight = 0
      , newHeight = 0
      , lastWidth = 0
      , newWidth = 0  
      , maxHeight = 0
      , resizedHeight = 0
      , heightPadding = 140 // Change the padding for top and bottom
      , isTouch = false
      , mobileDescOpen = false
      , current = 0
      , firstLoad = true;
	
	function ImageItem(url, desc, title) { 
		this.url = url; 
		this.desc = desc;
		this.title = title;
	}
	
	//{
	var lightboxHtml = '<div class="Lightbox">'+
    
						'<div class="Lightbox-mobile_info">'+
						  '<div class="mobile_info" '+ kitAttr +'grid="col-12">'+
							'<span class="mobile_title"></span>'+
							'<span class="mobile_desc"></span>'+
						  '</div>'+
						'</div>'+


						 '<div class="Lightbox-close"><img src="lib/ressources/lightbox/lightbox-close.svg" onerror="lib/ressources/lightbox/lightbox-close.png"></div>'+
						 '<div class="Lightbox-num"></div>'+
						  '<div class="Lightbox-wrapper" '+ kitAttr +'grid="grid-wrapper">'+
							'<div class="Lightbox-view" '+ kitAttr +'grid="col-12">'+

							  '<div class="Lightbox-info">'+
								'<div class="info_wrapper">'+
								  '<span class="info_title"></span><span class="info_desc"></span>'+
								'</div>'+
							  '</div>'+

							  '<div class="Lightbox-back"><img src="lib/ressources/lightbox/lightbox-back.svg" onerror="lib/ressources/lightbox/lightbox-back.png"></div>'+
							  '<div class="Lightbox-next"><img src="lib/ressources/lightbox/lightbox-next.svg" onerror="lib/ressources/lightbox/lightbox-next.png"></div>'+
							  '<div class="Lightbox-image"></div>'+
							'</div>'+
						  '</div>'+

						  '<div class="Lightbox-mobile" '+ kitAttr +'grid="col-12">'+
							'<div class="Lightbox-nav_mobile" '+ kitAttr +'grid="grid-wrapper">'+
							  '<div class="Lightbox-back_mobile" '+ kitAttr +'grid="col-2"><img src="lib/ressources/lightbox/lightbox-back.svg" onerror="lib/ressources/lightbox/lightbox-back.png"></div>'+
							  '<div class="Lightbox-menu" '+ kitAttr +'grid="col-8"><span id="Lightbox-descBtn" class="menu-title">Description <img class="desc" src="lib/ressources/lightbox/lightbox-desc.svg" onerror="lib/ressources/lightbox/lightbox-desc.png"></span></div>'+
							  '<div class="Lightbox-next_mobile" '+ kitAttr +'grid="col-2"><img src="lib/ressources/lightbox/lightbox-next.svg" onerror="lib/ressources/lightbox/lightbox-next.png"></div>'+
							'</div>'+
						  '</div>'+

						'</div>'
	
//}
	
	var initialize = function(){
	  
	  	// Add Lightbox HTML to page
		$('body').prepend(lightboxHtml);

		// Get clicked element data
		current = $(this).attr(''+ kitAttr +'lightboxPos');
		currentImg = $(this).attr(''+ kitAttr +'lightboxUrl');

		// Bind vars to UI elements
		$lightBox = $('.Lightbox');
		$lightBoxView = $('.Lightbox-view');
		$lightBoxNav = $('.Lightbox-back, .Lightbox-next');
		$lightBoxMobileNav = $('.Lightbox-mobile');
		$lightBoxNumDisplay = $('.Lightbox-num');
		$lightBoxCloseBtn = $('.Lightbox-close');
	  	$lightBoxImg = $('.Lightbox-image');
	  	$lightBoxTitle = $('.info_title, .mobile_title');
	  	$lightBoxDesc = $('.info_desc, .mobile_desc');
	  
		// Initialize event listeners
		next(); back(); keyNav(); screenResize();
		$lightBoxCloseBtn.on("click", close);
     
		// If click is outside bounds, close lightbox
		$lightBox.click(close).children().click(function(e) {
			return false;
		});
	  
	  	// Set the current image number ex:(1 of 8)
	  	$lightBoxNumDisplay.text((parseInt(current) + 1) + ' de ' + Total_img);
	  
	  	// Set the current image inside the view
	  	$lightBoxImg.append('<img class="image" src="'+ currentImg +'">');
	  
	  	// Set current text for image
		$lightBoxDesc.text($(this).attr(''+ kitAttr +'-lightboxDesc'));
		$lightBoxTitle.text($(this).attr(''+ kitAttr +'-lightboxTitle'));

	  	// Set body to be unscrollable
	  	$('body').css({overflow:"hidden"});
	  
	  	// Open animation
	  	open();
	  
	};
	
	var open = function(){

		$lightBox.fadeIn(300);

		$lightBoxView.find('.image').load(function(){ 
			checkViewHeight();
			centerView();
			navigationDisplay();
			descriptionDisplay();
			mobileDescriptionDisplay();
			checkEmptyDescription();
			$lightBoxView.css({opacity: 1});
			$lightBox.css({backgroundImage: "none"})
			$(this).animate({opacity: 1}, 200);
			firstLoad = false;
			$lightBoxView.find('.image').unbind('load');
		});
		
	};
  
	var navigationDisplay = function(){ 
		
		if ($(window).width() <= 1025 || LIGHTBOX.isTouch){
			$lightBoxNav.css({display: "none"});
			$lightBoxMobileNav.css({display: "block"});
		} else {
			$lightBoxMobileNav.css({display: "none"});
			view_height = $lightBoxView.height()/2;
			arrow_height = $('.Lightbox-back').outerHeight()/2;
			margin_top = view_height - arrow_height;
			$lightBoxNav.css({top: margin_top});
			$lightBoxNav.delay(300).css({display: "block"});
		}
		
	};
  
	var descriptionDisplay = function(){
		
		if ($(window).width() <= 1025 || LIGHTBOX.isTouch){
			$('.Lightbox-info').css({display:"none"});
		} else {
			$('.Lightbox-info').css({display:"block"});
		}

	};
  
	var centerView = function(){
		window_height = $(window).height()/2;
		view_height = $lightBoxView.height()/2;
		view_top = window_height - view_height;
		$('.Lightbox-wrapper').css({marginTop: view_top});
	}
  
	var checkViewHeight = function(){
		
		window_height = ($(window).height())-heightPadding;
		view_height = $lightBoxView.height();
		img_width = $lightBoxView.find('.image').width();
		$lightBoxView.find('img').css({maxHeight: window_height});
		img_width = $lightBoxView.find('.image').width();
		$('.Lightbox-wrapper').css({maxWidth: img_width}); 
		
	};
  
	var screenResize = function(){
		lastHeight = $(window).height();
		lastWidth = $(window).width();

		var resizeId;
		$(window).resize(function() { 
			clearTimeout(resizeId);
			resizeId = setTimeout(doneResizing, 100);
		});

		function doneResizing(){
			newHeight = $(window).height();
			newWidtht = $(window).width();

			if (newHeight > lastHeight){
				// bigger in height
				window_height = $(window).height()-heightPadding;
				difference = maxHeight - resizedHeight;
				$('.Lightbox-wrapper').css({maxWidth: "100%"});
				$lightBoxView.find('img').css({maxHeight: window_height});
				img_width = $lightBoxView.find('.image').width();
				$('.Lightbox-wrapper').css({maxWidth: img_width});
				centerView();
				navigationDisplay();
				descriptionDisplay();
				lastHeight = newHeight; 
			} else {
				// smaller in height
				checkViewHeight();
				centerView();
				navigationDisplay();
				descriptionDisplay();
				lastHeight = newHeight;
			}
		}
		
	};
  
	var mobileDescriptionDisplay = function(){
		
		$('#Lightbox-descBtn').on("click", function(){
			if (mobileDescOpen == false){
				$lightBoxMobileNav.css({backgroundColor: "rgba(0, 0, 0, 0.75)"});
				$('.Lightbox-mobile_info').fadeIn();
				setImgRoot();
				mobileDescOpen = true;
			} else {
				setImgRoot();
				$('.Lightbox-mobile_info').fadeOut(function(){
					$lightBoxMobileNav.css({backgroundColor: "transparent"},200);
				});
				mobileDescOpen = false;
			}
		}); 
		
	  	var setImgRoot = function(){
			$('.menu-title').find('img').attr('src', 'lib/ressources/lightbox/lightbox-desc.svg');
			$('.menu-title').find('img').attr('onerror', 'lib/ressources/lightbox/lightbox-desc.png');
		};
		
	};
  
	var checkEmptyDescription = function(){
		
		if ((Gallery_images[current].desc == undefined) 
		&& (Gallery_images[current].title == undefined))
		{
			$('.Lightbox-info').css({display: 'none'});
		} 
		else 
		{
			$('.Lightbox-info').css({display: 'block'});
		}

		if ((Gallery_images[current].desc == undefined) 
		&& (Gallery_images[current].title == undefined) 
		&& (mobileDescOpen == false))
		{
			$('.menu-title').css({opacity: 0.2, pointerEvents: 'none'});
		} 
		else if ((Gallery_images[current].desc == undefined) 
		&& (Gallery_images[current].title == undefined) 
		&& (mobileDescOpen == true))
		{
			$('.mobile_desc').text('Aucune description disponible pour cette photo...');
		} 
		else 
		{
			$('.menu-title').css({opacity: 1, pointerEvents: 'all'});
		}
		
	};
  
	var next = function(){
		$('.Lightbox-next, .Lightbox-next_mobile').click(function(){

		if(current < (Total_img)-1){
			current ++;
			changeImage();
		} else {
			current = 0;
			changeImage();
		}

		});
	};
  
	var back = function(){
		$('.Lightbox-back, .Lightbox-back_mobile').click(function(){ 

		if(current == 0) {
			current = Total_img-1;
			changeImage();
		} else {
			current--;
			changeImage();
		}

		});
	};
  
	var changeImage = function(){
		
		$lightBoxImg.animate({opacity: 0},200, function(){
			$(this).find('.image').attr('src', Gallery_images[current].url);
			$(this).find('.image').load(function(){
				$lightBoxView.find('img').css({maxHeight: "100%"});
				$('.Lightbox-wrapper').css({maxWidth: "100%"});
				$lightBoxDesc.empty();
				$lightBoxTitle.empty();
				checkViewHeight();
				centerView();
				navigationDisplay();
				checkEmptyDescription();
				$lightBoxDesc.text(Gallery_images[current].desc);
				$lightBoxTitle.text(Gallery_images[current].title);
				$lightBoxNumDisplay.text((parseInt(current) + 1) + ' de ' + Total_img);
				$lightBoxImg.animate({opacity:1}, 200);
				$lightBoxView.find('.image').unbind('load');
			});
		});
		
	};
  
	var close = function(){
		
		$lightBox.animate({opacity: 0},400, function(){
		$lightBox.remove();
		$('body').css({overflow:"auto"});
		firstLoad == false;
		$(document).unbind('keydown');
		});
		
	};
  
	var keyNav = function(){
		$(document).keydown(function(e) {
			switch(e.which) {
					
				case 37: // left
				if(current == 0) {
					current = Total_img-1;
					changeImage();
				} else {
					current--;
					changeImage();
				} 
				break;

					
				case 39: // right
				if(current < (Total_img)-1){
					current ++;
					changeImage();
				} else {
					current = 0;
					changeImage();
				}
				break;

					
				case 27: // esc
					close();
				break;

				default: return; // exit this handler for other keys
			}
			
		e.preventDefault(); // prevent the default action (scroll / move caret)
			
		});
		
	};
	  
  	return {
	     
		init: function(){  

			// Check if device is touchscreen
			LIGHTBOX.isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

			item.each(function(i){
				$(this).attr(''+ kitAttr +'lightboxPos', i);
				temp_url = $(this).attr(''+ kitAttr +'lightboxurl');
				temp_desc = $(this).attr(''+ kitAttr +'lightboxdesc');
				temp_title = $(this).attr(''+ kitAttr +'lightboxtitle');
				Gallery_images[i] = new ImageItem(temp_url, temp_desc, temp_title);
				Total_img++
			});
			
			// Open the lightbox animations
			item.on("click", initialize);
		
		},
	  
		ajaxInit: function(){
			$('['+ kitAttr +'lightboxPos]').removeAttr(''+ kitAttr +'lightboxPos');
			item.unbind("click", open);
			item.on("click", open);

			item.each(function(i){
				$(this).attr(''+ kitAttr +'lightboxPos', i);
				temp_url = $(this).attr(''+ kitAttr +'lightboxurl');
				temp_desc = $(this).attr(''+ kitAttr +'lightboxdesc');
				temp_title = $(this).attr(''+ kitAttr +'lightboxtitle');
				Gallery_images[i] = new ImageItem(temp_url, temp_desc, temp_title);
				Total_img++
			});
		}  
	  
	  };  
	  
})($);
var MASONRY = (function($){
	
	// Selectors
	var parent = $('['+ kitAttr +'masonry="parent"]')
	, child = $('['+ kitAttr +'masonry^="child"]')
	, gridWidth = parent.width()

	// Evaluation tables
	, itemsWidth = []
	, itemsHeight = []
	, colTable = []
	, colTableAdd = []
 
	// User values
	, itemNum, gutterWidth, colLeftHeight, colRightHeight
	, maxWidth, colNum, childNum, resColNum, resWidth
	, rowNum, parentHeight;
	
	
	var resetValues = function(){
		
		gridWidth = parent.width();

		itemsWidth = [];
		itemsHeight = [];
		colTable = [];
		colTableAdd = [];

		itemNum = gutterWidth = colLeftHeight = colRightHeight = 
		maxWidth = colNum = childNum = resColNum = resWidth = 
		rowNum = parentHeight = 0;
		
		getValues(); // getValues
		
	}
	
	var getValues = function(){
		
		colNum = parent.attr(''+ kitAttr +'masonrynumcol');
		gutterWidth = parent.attr(''+ kitAttr +'masonrygutter');
		maxWidth = parent.attr(''+ kitAttr +'masonrystopat');
		resWidth = parent.attr(''+ kitAttr +'masonryrespat');
		resColNum = parent.attr(''+ kitAttr +'masonryrespnumcol');
		
		evaluateWidths();
	}
	
	var evaluateWidths = function(){
		
		if (($( window ).width() >= maxWidth) && ($( window ).width() >= resWidth )){
			makeGrid(colNum);

		} else if (($( window ).width() <= maxWidth) && ($( window ).width() <= resWidth ))  {
			parent.css({
				height: "auto",
				width: "auto"
			});

			child.css({
				width: "100%",
				left: "0",
				top: "0",
				position: "relative",
				opacity: "1"
			});
		} else {
			makeGrid(resColNum);
		}
		
	}

	var makeGrid = function(colnumber){
		// Set the number of required rows in array
		for(var i = 0; i < colnumber; i++){
			colTableAdd.push(0);
		}

		child.css({position: "absolute"});
		child.each(function(i,obj){
			itemWidth = ( ( (gridWidth) - ((colnumber-1) * gutterWidth) ) /colnumber);
			$(this).css("width", itemWidth);
			$(this).css("top", colTableAdd[childNum] + ( rowNum * gutterWidth ) );
			$(this).css("left", ( (itemWidth * childNum) + (gutterWidth * childNum) ) );		
			colTable[childNum] = ($(this).outerHeight());
			colTableAdd[childNum] = (colTableAdd[childNum] + colTable[childNum]);
			childNum ++;
			if (childNum == colnumber){
				childNum = 0;
				colTable= [];
				rowNum ++;
			}
		});

		parentHeight = (Math.max.apply(Math, colTableAdd) + (rowNum * gutterWidth));
		parent.css({height: parentHeight});
		colTableAdd = [];
		rowNum = 0;
	}
	
	return {
		
		init: function(){
		
			$(window).load(function(){
				resetValues();
			});

			$(window).on("resize", function(){
				resetValues();
			});
		},

		ajaxInit: function(){
			// To be coded here
		},
	}
	
})($);


		

