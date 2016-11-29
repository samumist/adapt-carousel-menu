define([
    'coreJS/adapt',
    'coreViews/menuView'
], function(Adapt, MenuView) {

    var BoxMenuView = MenuView.extend({

        postRender: function() {
            var nthChild = 0;
            var whatwinwidth = $( window ).width();
            //SHOW INTRO HOME PAGE OR NOT
            //ARROWS TO TRIIGER HOME BUTTON
            $('.menu-home-control-left').click(function(){
                $( '.active.nth-child-1' ).stop().animate({'left':'0px','background-position-x': ''+ whatwinwidth +'px','background-position-y': '60px'});
                $('.nth-child-1 .numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                $('.menu-item' ).removeClass('active');
                $('.menu-header').animate({'top':'-100px','left':'0px'});
                $('.duration-bar-home .homespot').removeClass('isDown');
                $('.menu-item-control-right').addClass('menu-item-control-hide');
                $('.menu-home-control-right').removeClass('menu-item-control-hide');
                $('.menu-home-control-left').addClass('menu-item-control-hide'); 
            });
            $('.menu-home-control-right').click(function(){
                $('.nth-child-1' ).stop().animate({'left':'0px','background-position-x': '0px','background-position-y': '60px'});
                $('.menu-header').stop().animate({'top':'-100px','left':'-100%'});
                $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.nth-child-1' ).addClass('active');
                $('.menu-item-control-right').removeClass('menu-item-control-hide');
                $('.menu-home-control-right').addClass('menu-item-control-hide');
                $('.menu-home-control-left').removeClass('menu-item-control-hide');
                $('.duration-bar-home .homespot').addClass('isDown'); 

                //IF ONLY 1 OR 2 ITEMS
                if ($('.duration-bar').length == 1) {
                    $('.menu-item-control-right').hide();
                };
                if ($('.duration-bar').length == 2) {
                    $('.menu-item-control-right').show();
                };
            });

            $('.homespot').click( function(){
                if ( $(this).hasClass('isDown') ) {
                    $( '.nth-child-1 .numspotlink' ).trigger( 'click' );
                    $( '.active.nth-child-1' ).stop().animate({'left':'0px','background-position-x': ''+ whatwinwidth +'px','background-position-y': '60px'});
                    $('.nth-child-1 .numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                    $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                    $('.menu-item' ).removeClass('active');
                    $('.menu-header').stop().animate({'top':'-100px','left':'0px'});
                    $('.menu-item-control-right').addClass('menu-item-control-hide');
                    $('.menu-home-control-right').removeClass('menu-item-control-hide');
                    $('.menu-home-control-left').addClass('menu-item-control-hide');             
                } else {
                    $('.nth-child-1' ).stop().animate({'left':'0px','background-position-x': '0px','background-position-y': '60px'});
                    $('.menu-header').stop().animate({'top':'-100px','left':'-100%'});
                    $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                    $('.nth-child-1 .numspotlink .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                    $('.nth-child-1' ).addClass('active');
                    $('.menu-item-control-right').removeClass('menu-item-control-hide');
                    $('.menu-home-control-right').addClass('menu-item-control-hide');
                    $('.menu-home-control-left').removeClass('menu-item-control-hide'); 
                }
                $(this).toggleClass('isDown');
                return false;
            });

            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable')) {
                    nthChild++;
                    item.set("_nthChild", nthChild);
                    this.$('.menu-container-inner').append(new BoxMenuItemView({model: item}).$el);
                }
            });
        }

    }, {
        template: 'boxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        events: {
            'click button' : 'onClickMenuItemButton'
        },

        className: function() {
            var nthChild = this.model.get("_nthChild");
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                this.model.get('_isVisited') ? 'visited' : '',
                this.model.get('_isComplete') ? 'completed' : '',
                this.model.get('_isLocked') ? 'locked' : '',
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
            
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');
            var nthChild = this.model.get("_nthChild");
            var totalnthchild = $('.duration-bar').length;
            
            var minus150per = 150 - this.model.get("_nthChild") * 100;
            var paddingcal = 100 * this.model.get("_nthChild") - 100;
            var add80px = this.model.get("_nthChild") * 80 - 80;
            var add40px = 32 - totalnthchild * 40;

            if (graphic && graphic.src && graphic.src.length > 0) {
                this.$el.imageready(_.bind(function() {
                    this.setReadyStatus();
                }, this));
            } else {
                this.setReadyStatus();
            }

            //TIMER IF NEEDED
            if ($('#timer').is(':contains("02:00:00")')) {
                $('.menu .menu-item').removeClass('locked');
            }

            $('.menu-container').css({'width' : '' + nthChild + '00%','display' : 'inline-block','position' : 'relative'});
            $('.nth-child-'+ nthChild ).css({'background-image' : 'url('+ graphic.src +')'}).attr('name', 'nth-child-' + nthChild);
            $('.menu-item.nth-child-'+ nthChild + ' .numberspot').text('' + nthChild );

            //ANIMATE SLIDER LEFT OR RIGHT
            var count = 0;
            var $item = $('.nth-child-'+ nthChild );

            //SHOW INTRO HOME PAGE OR NOT
            var homecal = $( window ).width() / 2 - 40;
            var durhome = totalnthchild / 2 * 80;
            var totaldurhome = homecal - durhome - 40;
            $('.menu-home-control-right').removeClass('menu-item-control-hide');
            $('.duration-bar-home').css({'margin-left': '' + totaldurhome + 'px'});

            $('.duration-bar-home .homespot').hover(function(){
                $('.numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
            });

            //CLICK ON CIRCLE NUMBERS SPOT LINKS FUNCTIONALITY
            var makezer0 = nthChild-1;
            var moveduration = makezer0 * $( window ).width() + add40px;


            $('a.numspotlink:eq(' + makezer0 + ')').hover(function(){
                $('.numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.duration-bar-home .numspothome .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.nth-child-'+ nthChild + ' .numspotlink .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
            });    

            $('a.numspotlink:eq(' + makezer0 + ')').click(function(){      
                $('.menu-item').animate({'left':'-' + $( window ).width()*makezer0 + 'px'});
                $('.duration-bar').css('margin-left');
                $('.duration-bar').animate({'margin-left':'' + moveduration + 'px'});
                $('a.menu-item-control-left').removeClass('menu-item-control-hide');
                $('a.menu-item-control-right').removeClass('menu-item-control-hide');
                $('a.menu-home-control-left').addClass('menu-item-control-hide');
                $('a.menu-home-control-right').addClass('menu-item-control-hide');
                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ nthChild ).addClass('active');
                $('.nth-child-'+ nthChild + ' .numspotlink .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                $('.duration-bar-home .numspotlink .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                $('.menu-header').stop().animate({'top':'-100px','left':'-100%'});
                $('.duration-bar-home .homespot').addClass('isDown');
            });

            if ($(window).width() <= 1024) {
                $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px', 'padding-left': '' + paddingcal + '%' });
            }else{
                $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px', 'padding-left': '40px' })
            }
            
            //Hide LEFT arrow if number 1 is clicked
            $('a.numspotlink:eq(0)').click(function(){    
                $('a.menu-item-control-left').addClass('menu-item-control-hide');
                $('a.menu-home-control-left').removeClass('menu-item-control-hide');
                $('.nth-child-1' ).stop().animate({'left':'0px','background-position-x': '0px','background-position-y': '60px'});

                //IF ONLY 1 OR 2 ITEMS
                if ($('.duration-bar').length == 1) {
                    $('.menu-item-control-right').hide();
                };
                if ($('.duration-bar').length == 2) {
                    $('.menu-item-control-right').show();
                };
            });
            
            //Hide RIGHT arrow if last number is clicked
            $('.menu-item:last-child a.numspotlink').click(function(){      
                $('a.menu-item-control-right').addClass('menu-item-control-hide');
            });

            //IF LESS THAN OR EQUAL TO 13 OR MORE
            if (totalnthchild <= 13) {
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
                $('.carouselpushLeft').css({'display' : 'none'});
                $('.carouselpushRight').css({'display' : 'none'});
            } else if (totalnthchild === 14 || totalnthchild === 15) {
                $('.carouselpushLeft').click(function(){
                    $('.duration-bar').animate({'margin-left':'+=' + 80 / totalnthchild +'px'}).stop(false,true);
                });
                $('.carouselpushRight').click(function(){
                    $('.duration-bar').animate({'margin-left':'-=' + 80 / totalnthchild +'px'}).stop(false,true);
                });
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
            }else {
                $('.carouselpushLeft').click(function(){
                    $('.duration-bar').animate({'margin-left':'+=' + 80 / totalnthchild +'px'}).stop(false,true);
                });
                $('.carouselpushRight').click(function(){
                    $('.duration-bar').animate({'margin-left':'-=' + 80 / totalnthchild +'px'}).stop(false,true);
                });
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
                $('.menu .duration-bar-home').css({'margin-left':'-90px','left':'50%','bottom':'inherit','top':'-10px'});
                $('.duration-bar-home .numspothome .menu-tooltip').css({'display':'none'});
            }

            //PRESS RIGHT BUTTON
            $('.menu-item-control-right').click(function(){
                $('.duration-bar').css('margin-left');
                $('.duration-bar').animate({'margin-left':'+=' + $( window ).width() /totalnthchild + 'px'}).stop(false,true);
                $item.css('left');
                $item.animate({'left':'-=' + $( window ).width() + 'px'});
                $('.numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.duration-bar-home .homespot').addClass('isDown');

                count += 1;
                
                //SEE WHAT PAGE YOU ARE ON
                var seepgminus = $( window ).width();
                var seepg = $item.css('left');
                var seepgstring =  parseInt(seepg.replace(/px/g, ''), 10);
                var seepgcal = seepgstring - seepgminus;
                var seepgtotal = $( window ).width()-seepgminus*nthChild;
                if ((seepgcal + 'px' ==  seepgtotal + 'px')) {
                    $('.menu-item' ).removeClass('active');
                    $item.addClass('active');
                }else{
                    //alert('seepage is ' + seepgcal + ' seepgtotal is ' + seepgtotal);
                };

                //ON MOUSE MOVE SEE IF ACTIVE ON FIRST PAGE
                var righty = $('.nth-child-1' ).css('left');
                var caldatotal2 = $( window ).width()*nthChild;
                if ((righty ==  '-' + caldatotal2 + 'px')) {
                    $('.menu-item-control-left').addClass('menu-item-control-hide');
                    $('.menu-home-control-left').removeClass('menu-item-control-hide');
                }else{
                    $('.menu-item-control-left').removeClass('menu-item-control-hide');
                    $('.menu-home-control-left').addClass('menu-item-control-hide');
                };

                //IF ONLY 1 OR 2 ITEMS
                if ($('.duration-bar').length == 1) {
                        $('.menu-item-control-right').hide();
                };
                if ($('.duration-bar').length == 2) {
                    if ((righty ==  '0px')) {
                        $('.menu-item-control-right').hide();
                    }
                };

                //ON MOUSE MOVE SEE IF ACTIVE ON LAST PAGE
                var lefty = $('.nth-child-' + nthChild ).css('left');
                var minustwo = nthChild-2;
                var caldatotal = $( window ).width()*minustwo;
                if ((lefty ==  '-' + caldatotal + 'px')) {
                    $('.menu-item-control-right').addClass('menu-item-control-hide');
                }else{
                    $('.menu-item-control-right').removeClass('menu-item-control-hide');
                };

            });
            //PRESS LEFT BUTTON
            $('.menu-item-control-left').click(function(){      
                $('.duration-bar').css('margin-left');
                $('.duration-bar').animate({'margin-left':'-=' + $( window ).width() /totalnthchild + 'px'}).stop(false,true);
                $item.css('left');
                $item.animate({'left':'+=' + $( window ).width() + 'px'});
                $('.numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});
                $('.nth-child-1' ).css({'background-position-x': '0px','background-position-y': '60px'});
                $('.menu-header').stop().animate({'top':'-100px','left':'-100%'});
                $('.duration-bar-home .homespot').addClass('isDown');

                count -= 1;

                //SEE WHAT PAGE YOU ARE ON
                var seepgminus = $( window ).width();
                var seepg = $item.css('left');
                var seepgstring =  parseInt(seepg.replace(/px/g, ''), 10);
                var seepgcal = seepgstring + seepgminus;
                var seepgtotal = $( window ).width()-seepgminus*nthChild;
                if ((seepgcal + 'px' ==  seepgtotal + 'px')) {
                    $('.menu-item' ).removeClass('active');
                    $item.addClass('active');
                }else{
                    //alert('seepage is ' + seepgcal + ' seepgtotal is ' + seepgtotal);
                };

                //ON CLICK SEE IF ACTIVE ON FIRST PAGE
                var righty = $('.nth-child-1' ).css('left');
                var caldatotal2 = $( window ).width();
                if ((righty ==  '-' + caldatotal2 + 'px')) {
                    $('.menu-item-control-left').addClass('menu-item-control-hide');
                    $('.menu-home-control-left').removeClass('menu-item-control-hide');
                }else{
                    $('.menu-item-control-left').removeClass('menu-item-control-hide');
                    $('.menu-home-control-left').addClass('menu-item-control-hide');
                };

                //ON CLICK SEE IF ACTIVE ON LAST PAGE
                var lefty = $('.nth-child-' + nthChild ).css('left');
                var plustwo = nthChild+2;
                var caldatotal = $( window ).width()*plustwo;
                if ((lefty ==  '-' + caldatotal + 'px')) {
                    $('.menu-item-control-right').addClass('menu-item-control-hide');
                }else{
                    $('.menu-item-control-right').removeClass('menu-item-control-hide');
                };

                //IF ONLY 1 OR 2 ITEMS
                var ontheone = $('.nth-child-2' ).css('left');
                if ($('.duration-bar').length == 1) {
                        $('.menu-item-control-right').hide();
                };
                if ($('.duration-bar').length == 2) {
                    if ((ontheone ==  '-' + caldatotal2 + 'px')) {
                        $('.menu-item-control-right').show();
                    }
                };

            });

            //GET BACKGROUND TO MATCH BROWSER ON RESIZE
            $('.menu-item' ).css({'width' : $( window ).width() + 'px', 'height' : $( window ).height() + 'px'});
            $(window).resize(function() {
                var resizewin = count * $( window ).width();
                var add40px2 = 32 - nthChild * 40;
                var calwin40px = add40px2 + resizewin;
                var homecal2 = $( window ).width() / 2 - 40;
                var durhome2 = totalnthchild / 2 * 80;
                var totaldurhome2 = homecal2 - durhome2 - 40;
                $('.menu-item' ).css({'width' : $( window ).width() + 'px', 'height' : $( window ).height() + 'px'});
                $('.nth-child-' + nthChild ).css('left');
                $('.menu-item' ).css({'left':'-' + resizewin + 'px'});
                $('.duration-bar').css('margin-left');
                $('.duration-bar').css({'margin-left':'' + calwin40px + 'px'});
                $('.duration-bar-home').css({'margin-left': '' + totaldurhome2 + 'px'});
                $('.nth-child-1' ).css({'background-position-x': '0px','background-position-y': '60px'});

                //IF LESS THAN OR EQUAL TO 13 OR MORE
                if (totalnthchild <= 13) {
                    $('.carouselpushLeft').css({'display' : 'none'});
                    $('.carouselpushRight').css({'display' : 'none'});
                } else if (totalnthchild === 14 || totalnthchild === 15) {
                    //do nothing
                } else {
                    $('.menu .duration-bar-home').css({'margin-left':'-90px','left':'50%','bottom':'inherit','top':'-10px'});
                }

                if ($(window).width() <= 1024) {
                    $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px', 'padding-left': '' + paddingcal + '%' });
                }else{
                    $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px', 'padding-left': '40px' });
                }

                $('a.numspotlink:eq(' + makezer0 + ')').click(function(){      
                    var makezer0b = nthChild-1;
                    var resizewin2 = makezer0b * $( window ).width();
                    var add40px3 = 40*totalnthchild-32;
                    $('.nth-child-' + nthChild ).css('left');
                    $('.menu-item' ).css({'left':'-' + resizewin2 + 'px'});
                    $('.duration-bar').animate({'margin-left':'' + resizewin2 - add40px3 + 'px'}).stop(false,true);
                });

            });

        },

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            if(this.model.get('_isLocked')) return;
            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});

        }

    }, {
        template: 'boxmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new BoxMenuView({model: model}).$el);

    });

});
