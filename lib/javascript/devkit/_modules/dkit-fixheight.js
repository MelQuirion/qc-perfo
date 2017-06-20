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
