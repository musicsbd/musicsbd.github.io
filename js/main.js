  $(document).ready(function(){

    var $audio = $('.audio');
    var $audiogallery = $('.audiobox-gallery');
    var $up = $('.up');
    var $left = $('.left');
    var $album = $('.album');
    var $orbitwrapper = $('.orbit-wrapper');
            //wrap all slides for orbit slider
          $audiogallery.wrapAll('<div id="audiobox" />');
           if ( $.browser.mozilla || $.browser.webkit) {
             var $this = $(this);
              $this.find('.artistname').css({'margin-top' : '-30%'});
              //album flips
            $left.hover(function(){
               var $this = $(this);
				$this.addClass('flip');
                $this.find('.artistname').delay(1000).animate({'margin-top' : '40%'},500);

			},function(){
			   var $this = $(this);
				$this.removeClass('flip');
                $this.find('.artistname').animate({'margin-top' : '-30%'},500);
			});
             $up.hover(function(){
                var $this = $(this);
				$this.addClass('flipup');
                $this.find('.artistname').delay(1000).animate({'margin-top' : '40%'},500);
			},function(){
			   var $this = $(this);
				$this.removeClass('flipup');
                $this.find('.artistname').animate({'margin-top' : '-30%'},500);
			});
            }else{
             $left.hover(function(){
                var $this = $(this);
				$this.addClass('flip');
			},function(){
			   var $this = $(this);
				$this.removeClass('flip');
			});
             $up.hover(function(){
                var $this = $(this);
				$this.addClass('flipup');
			},function(){
			   var $this = $(this);
				$this.removeClass('flipup');
			});
            };
            //add activated class for playing purposes
            $album.bind('mousedown', function(){
              $album.removeClass('activated');
               $(this).addClass('activated');
            });

              function multiReplace(str, match, repl) {
             do {
                 str = str.replace(match, repl);
                } while(str.indexOf(match) !== -1);
        return str;
        }
            //add pinterest buttons
            $album.each(function(){
              if($(this).hasClass('social')){
                 var artistname =  $(this).find('.artist').find('.artistname').text();
                var albumname =  $(this).find('.artist').find('.albumname').text();
                var thisimgsrc = $(this).find('.cover').find('img').attr('src');
           var pinimage = document.URL + thisimgsrc;
        var pinurl = window.location.href;
        var pindesc = artistname + ' - ' + albumname;
        var artist = artistname;
        multiReplace(artist, " ", "%20");
       var itunesquery = '<a target="_BLANK" href="http://ax.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?term='+artist+'" title="Find on iTunes"><img class="itunes" src="images/itunes.png" /></a>';




       $(this).find('.playlist').find('li').each(function(){
         var songname = $(this).text();
         var pindesc = artistname + ' - ' + songname;
        multiReplace(pindesc, " ", "%20");
        multiReplace(pinurl, ":", "%3A");
        multiReplace(pinurl, "/", "%2F");
        multiReplace(pinimage, ":", "%3A");
        multiReplace(pinimage, "/", "%2F");
           var pinstring = '<a  href="http://pinterest.com/pin/create/button/?url='+ pinurl +'&media='+ pinimage +'&description='+ pindesc +'" class="pin-it-button" count-layout="horizontal" target="_blank"><img class="pinimg" border="0" src="images/Pinterest_Favicon.png" title="Pin It"   /></a>';
         var tweetbutton = '<div id="custom-tweet-button"><a href="https://twitter.com/share?url='+ pinurl +'&text='+ pindesc +'Listen Now At:" target="_blank" title="Tweet It"></a></div>';
         $(this).append(pinstring);
         $(this).append(itunesquery);
          $(this).append(tweetbutton);
       });

       };
            });

            //add afc

             //album mousedown event
            $album.mousedown( function(){
                var $this = $(this);
                $album.find('.playlist li').removeClass('playing');
                var artistname =  $(this).find('.artist').find('.artistname').text();
                var albumname =  $(this).find('.artist').find('.albumname').text();
                var thisimgsrc = $(this).find('.cover').find('img').attr('src');
                var thiscontent = $('.activated').find('.audio').clone();
                 //setup afc content for lighbox
                $('.afc').html(thiscontent);
                $('.afc').find('.audio').prepend('<img class="bgimg" src="'+ thisimgsrc +'" /><div class="title-header"><img class="header-img" src="'+ thisimgsrc +'" /><h1 class="header-artist">'+  artistname +'</h1><h3 class="header-album">'+ albumname +'</h3></div>');
                $('.afc').find('.audio').find('.playlist').find('li').append('<div class="levels"><div class="level1"></div><div class="level2"></div><div class="level3"></div><div class="level4"></div><div class="level5"></div></div>');
                //set content
                var audioinfocontent = $('.afc').find('.audio').clone();

             //add fancybox per album
             $this.fancybox({

				'overlayShow'	: false,
            	'transitionIn'	: 'elastic',
				'transitionOut'	: 'elastic',
                'content': audioinfocontent,
                'padding' : 1,
                'speedIn' : 500,
                'speedOut' : 1000,
                'onCleanup' : function(){  },
                'onStart': function(){$('.afc').addClass('fancyboxopen');},
                'onClosed' : function(){$('.afc').removeClass('fancyboxopen');}

            	});
            });

   $('.playlist li').live('click', function(){$("#btnClear").trigger('click');});


    //init orbit slider
    $('#audiobox').orbit({
        animation: 'horizontal-push', // fade, horizontal-slide, vertical-slide, horizontal-push
        animationSpeed: 1800, // how fast animtions are
        timer: false, // true or false to have the timer
        resetTimerOnClick: false, // true resets the timer instead of pausing slideshow progress
        advanceSpeed: 4000, // if timer is enabled, time between transitions
        pauseOnHover: false, // if you hover pauses the slider
        startClockOnMouseOut: false, // if clock should start on MouseOut
        startClockOnMouseOutAfter: 1000, // how long after MouseOut should the timer start again
        directionalNav: true, // manual advancing directional navs
        captions: false, // do you want captions?
        captionAnimation: 'fade', // fade, slideOpen, none
        captionAnimationSpeed: 800, // if so how quickly should they animate in
        bullets: false,	// true or false to activate the bullet navigation
        bulletThumbs: false,	// thumbnails for the bullets
        bulletThumbLocation: '',	// location from this file where thumbs will be
        afterSlideChange: function(){}, // empty function
        fluid: true
    });

    //append fancybox color
    $audio.append('<div class="colorspan"></div>');
    //append open/close tab to slider wrapper
    $('.orbit-wrapper').append('<div class="openab" ></div>');
    //open/close tab click event
    $('.openab').live('click', function(){
        $('.orbit-wrapper').toggleClass('larger');
        $(this).toggleClass('opened');
    });



   $('#fancybox-wrap').draggable();

 

   });
