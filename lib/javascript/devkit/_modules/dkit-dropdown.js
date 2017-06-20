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