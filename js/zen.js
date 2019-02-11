

/*
 *
 * ZEN - HTML5-CSS3 Audio Player
 * by @simurai (simurai.com)
 * Edited by Nolan Campbell
 *
 * Most of this code by: @maboa (happyworm.com)
 * and: @quinnirill (niiden.com/jussi/)
 *
 */



$(document).ready(function(){

  	var status = "stop";
	var dragging = false;
     var $audio = $('.audio');
    var $audiogallery = $('.audiobox-gallery');
    var $up = $('.up');
    var $left = $('.left');
    var $album = $('.album');
    var $orbitwrapper = $('.orbit-wrapper');
    var $afc = $('.afc');
	
	// init
      $('body').append('<div class="afc"></div>');

            //init activated on first album
            $album.first().addClass('activated');
            	var thiscontent = $('.activated').find('.audio').clone();
     //setup afc content for lighbox
     $afc.html(thiscontent);

        var $this = $('.playfirst');
	    var player = $("#zen .player");



   var $duration = $('.duration');
   var $time = $('.time');

  //get timeleft for count down
   self.update_timer = function (event) {

    var status = event.jPlayer.status;
    var calctime = $.jPlayer.convertTime(status.duration - status.currentTime);
    //set duration text time text
    $duration.text(calctime);
    $time.text(calctime);

    };

	// preload, update, end

	player.bind($.jPlayer.event.progress, function(event) {
			
		var audio = $('#zen audio').get(0);
		var pc = 0;    

		if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
		 	pc = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
		  	displayBuffered(pc);

		  	//console.log(pc);
		  	if(pc >= 99) {
		  		//console.log("loaded");
		  		$('#zen .buffer').addClass("loaded");
		  	}
		}        
		
	});
	
	//player.bind($.jPlayer.event.loadeddata, function(event) {    
		//$('#zen .buffer').addClass("loaded");    
	//});
	
	player.bind($.jPlayer.event.timeupdate, function(event) {
		var pc = event.jPlayer.status.currentPercentAbsolute;

		if (!dragging) { 
	    	displayProgress(pc);
		}
	});
   var $levels = $('.levels');
   var $drawlevels = $('.drawlevels');
	player.bind($.jPlayer.event.ended, function(event) {
     //init repeat bind
     if($('.repeat').hasClass('repeat-on')){
                player.jPlayer("play");
            }else{
              //zen stop events
		$('#zen .circle').removeClass( "rotate" );
		$("#zen").removeClass( "play" );
		$('#zen .progress').css({rotate: '0deg'});
		status = "stop";
         $levels.hide(1000);
         $drawlevels.hide(1000);
         var $afc = $('.afc');




         var parentli = $('.album').has('.playing');
         if($('#fancybox-content').is(':visible')){}else{
         parentli.trigger('click');
         };
          var currentsong = $('.afc').find('.audio').find('.playlist').find('.playing');

         var nextsong = currentsong.next();
          var nextsongeq = nextsong.index();
         var nextlisong = $('#fancybox-content').find('.playlist').find('li:eq('+ nextsongeq +')');
         nextlisong.trigger('click');



         currentsong.removeClass('playing');
         nextsong.addClass('playing');

       };
	});
	


	
	
	// play/pause
   var $zenbutton = $("#zen .button");
	$zenbutton.bind('mousedown', function() {
		// not sure if this can be done in a simpler way.
		// when you click on the edge of the play button, but button scales down and doesn't drigger the click,
		// so mouseleave is added to still catch it.

	   	$(this).bind('mouseleave', function() {
		  	$(this).unbind('mouseleave');
		  	onClick();
	  	});
	});
	
	$zenbutton.bind('mouseup', function() {
		$(this).unbind('mouseleave');
		onClick();
	});



    $audio.append('<div class="currentsong"></div>');
    //playlist li click event

	   $('.playlist').find('li').live('click', function(){
	     var $this = $(this);
         var artistname = $(this).parents('.audio').find('.header-artist').text();
         var albumname = $(this).parents('.audio').find('.header-album').text();

            $('.playlist li').removeClass('playing');

            $(this).addClass('playing');
            $zenbutton.trigger('mousedown');

            var allaudio = $('audio');
            var audio = $(this).find('audio').clone();
            var thistext = $(this).text();
            $('.currentsong').html('<div><h5 class="playlistlabel" >Artist: </h5><h5> '+ artistname + '</h5><h5 class="playlistlabel">Album: </h5><h5>'+ albumname + '</h5><h5 class="playlistlabel">Title: </h5><h5> '+thistext+'</h5><h5 class="time"></h5></div>').css({'color' : '#eee'});
            $('#audiomarquee').html('<marquee class="audiomarquee" behavior="scroll" direction="left" scrollamount="3"><h5 class="playlistlabel" >Artist: </h5><h5> '+ artistname + '</h5><h5 class="playlistlabel">Album: </h5><h5>'+ albumname + '</h5><h5 class="playlistlabel">Title: </h5><h5> '+thistext+'</h5></marquee>').css({'color' : '#eee'});
        // onclick if has play
              if($('#zen').hasClass('play')){
                  onClick();
                };
            //create jplayer
        	var player = $("#zen .player");
            player.jPlayer("destroy");
	        player.jPlayer({
			    ready: function () {
			        var datamp3 = $this.data('mp3');
			        var datam4a = $this.data('m4a');
                    var dataoga = $this.data('oga');

      		    $(this).jPlayer("setMedia", {
    			    m4a: datam4a,
        		    oga: dataoga,
                    mp3: datamp3
      		    });
            onClick();

    	    },
    	    swfPath: "",
		    supplied: "m4a, mp3, oga, ogg"
  	        }).bind($.jPlayer.event.timeupdate, self.update_timer);
          //remove playing from all and add playing to this
          $('.playlist').find('li').removeClass('playing');
          $(this).addClass('playing');

       //add playing class to master audio afc
            var thistext = $(this).text();
            $('.afc').find('.playlist').find('li').removeClass('playing');
            $('.afc').find('.playlist').find('li:contains('+ thistext + ')').addClass('playing');

            $('.activated').find('.playlist').find('li').removeClass('playing');
            $('.activated').find('.playlist').find('li:contains('+ thistext + ')').addClass('playing');

        });

   //next button
     $('.nextbutton').live('click', function(){
        var playing = $('.afc').find('.playlist').find('.playing');
        var playinginbox = $('#fancybox-content').find('.audio').find('.playlist').find('.playing');

        if($('.afc').hasClass('fancyboxopen')){
            playinginbox.next().trigger('click');
        }else{
            playing.next().trigger('click');
        };

     });
     //prev button
      $('.prevbutton').live('click', function(){
        var playing = $('.afc').find('.playlist').find('.playing');
        var playinginbox = $('#fancybox-content').find('.audio').find('.playlist').find('.playing');
        if($('.afc').hasClass('fancyboxopen')){
            playinginbox.prev().trigger('click');
        }else{
            playing.prev().trigger('click');
        };
     });
    //onclick function
	function onClick() {

        if(status != "play") {
			status = "play";
			$("#zen").addClass( "play" );
			player.jPlayer("play");
             $('.levels').stop().hide(1);
            $('.playing').find('.levels').show(1000);
            if($('#levelsbox').is(':checked')){$('.drawlevels').show(1000);}else{$('.drawlevels').hide(1000);}

		} else {
			$('#zen .circle').removeClass( "rotate" );
			$("#zen").removeClass( "play" );
			status = "pause";
			player.jPlayer("pause");
             $('.levels').hide(1000);
              $('.drawlevels').hide(1000);
		}
	};



	
	
	// draggin

	var clickControl = $('#zen .drag');
	
	clickControl.grab({
		onstart: function(){
			dragging = true;
		   $zenbutton.css( "pointer-events", "none" );

		}, onmove: function(event){
			var pc = getArcPc(event.position.x, event.position.y);
			player.jPlayer("playHead", pc).jPlayer("play");
			displayProgress(pc);
			
		}, onfinish: function(event){
			dragging = false;
			var pc = getArcPc(event.position.x, event.position.y);
			player.jPlayer("playHead", pc).jPlayer("play");
			$zenbutton.css( "pointer-events", "auto" );

		}
	});	

	
	
	
	
	
	// functions

	function displayProgress(pc) {
		var degs = pc * 3.6+"deg"; 
		$('#zen .progress').css({rotate: degs}); 		
	}
	function displayBuffered(pc) {
		var degs = pc * 3.6+"deg";
		$('#zen .buffer').css({rotate: degs}); 		
	}
	
	function getArcPc(pageX, pageY) { 
		var	self	= clickControl,
			offset	= self.offset(),
			x	= pageX - offset.left - self.width()/2,
			y	= pageY - offset.top - self.height()/2,
			a	= Math.atan2(y,x);
			
			if (a > -1*Math.PI && a < -0.5*Math.PI) {
		   a = 2*Math.PI+a;
		}

		// a is now value between -0.5PI and 1.5PI 
		// ready to be normalized and applied
		var pc = (a + Math.PI/2) / 2*Math.PI * 10;

		return pc;
	}
  //repeat binds
  $(".repeat").click( function() {
    $(this).toggleClass('repeat-on');
     if($(this).hasClass('repeat-on')){
      	player.bind($.jPlayer.event.ended, function(event) {

        if($('.repeat').hasClass('repeat-on')){
                player.jPlayer("play");
            }else{
		        $('#zen .circle').removeClass( "rotate" );
		        $("#zen").removeClass( "play" );
		        $('#zen .progress').css({rotate: '0deg'});
		        status = "stop";
            };
	});
     }else{
      	player.unbind($.jPlayer.event.ended, function(event) {

        if($('.repeat').hasClass('repeat-on')){
                player.jPlayer("play");
            }else{
		        $('#zen .circle').removeClass( "rotate" );
		        $("#zen").removeClass( "play" );
		        $('#zen .progress').css({rotate: '0deg'});
		        status = "stop";
            };
	    });
     }

        return false;

    });

    //init jplayer
	player.jPlayer({
			ready: function () {

               var datamp3 = $this.data('mp3');
			        var datam4a = $this.data('m4a');
                    var dataoga = $this.data('oga');



      		$(this).jPlayer("setMedia", {
                m4a: datam4a,
        		    oga: dataoga,
                    mp3: datamp3

      		});
            if($('.playfirst').length > 0){
            onStart();
            };
    	},
    	swfPath: "",
		supplied: "m4a, mp3, oga"
  	}).bind($.jPlayer.event.timeupdate, self.update_timer);
  	function onStart() {

        if(status != "play") {
			status = "play";
			$("#zen").addClass( "play" );
			player.jPlayer("play");
             $('.levels').stop().hide(1);
            $('.playing').find('.levels').show(1000);
            if($('#levelsbox').is(':checked')){$('.drawlevels').show(1000);}else{$('.drawlevels').hide(1000);}

		} else {
			$('#zen .circle').removeClass( "rotate" );
			$("#zen").removeClass( "play" );
			status = "pause";
			player.jPlayer("pause");
             $('.levels').hide(1000);
              $('.drawlevels').hide(1000);
		}
	};

});


