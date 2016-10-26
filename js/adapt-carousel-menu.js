define([
    'coreJS/adapt',
    'coreViews/menuView'
], function(Adapt, MenuView) {

    var BoxMenuView = MenuView.extend({

        postRender: function() {
            var nthChild = 0;
            //SHOW INTRO HOME PAGE OR NOT
            $('.homespot').click( function(){
                if ( $(this).hasClass('isDown') ) {
                    $('.menu-header').stop().animate({'top':'-100px'}, 1000);                        
                } else {
                    $('.menu-header').stop().animate({'top':'-100%'}, 1000);
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

            $('.menu-container').css({'width' : '' + nthChild + '00%','display' : 'inline-block','position' : 'relative'});
            $('.nth-child-'+ nthChild ).css({'background' : 'url('+ graphic.src +')'}).attr('name', 'nth-child-' + nthChild);
            $('.menu-item.nth-child-'+ nthChild + ' .numberspot').text('' + nthChild );

            if ($(window).width() <= 1024) {
                $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px', 'padding-left': '' + paddingcal + '%' });
            }else{
                $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px', 'padding-left': '40px' });
            }

            //REMOVE HTML NO SCROLL ON BUTTON CLICK
            $('.menu-item .menu-item-button button').click(function(){
                $('html').css({'overflow-y' : 'scroll'});
            });

            $('.locked .menu-item-button button').click(function(){
                $('html').css({'overflow-y' : 'hidden'});
            }); 

            //ANIMATE SLIDER LEFT OR RIGHT
            var count = 0;
            var $item = $('.nth-child-'+ nthChild );

            $('.nth-child-1' ).addClass('active');

            //SHOW INTRO HOME PAGE OR NOT
            var homecal = $( window ).width() / 2 - 40;
            var durhome = totalnthchild / 2 * 80;
            var totaldurhome = homecal - durhome - 40;
            $('.duration-bar-home').css({'margin-left': '' + totaldurhome + 'px'});

            $('.menu-item-control').click( function(){
                $('.menu-header').stop().animate({'top':'-100%'}, 1000);
                $('.duration-bar-home .homespot').addClass('isDown');
            });

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
                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ nthChild ).addClass('active');
                $('.nth-child-'+ nthChild + ' .numspotlink .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                $('.duration-bar-home .numspotlink .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
                $('.menu-header').stop().animate({'top':'-100%'}, 1000);
                $('.duration-bar-home .homespot').addClass('isDown');
            });

            //IF ONLY 1 OR 2 ITEMS
            if ($('.duration-bar').length <= 2) {
                $('.menu-item-control').hide();
            } else {
                $('.menu-item-control').show();
            } 
            
            //Hide LEFT arrow if number 1 is clicked
            $('a.numspotlink:eq(0)').click(function(){     
                $('a.menu-item-control-left').addClass('menu-item-control-hide');
            });
            
            //Hide RIGHT arrow if last number is clicked
            $('.menu-item:last-child a.numspotlink').click(function(){      
                $('a.menu-item-control-right').addClass('menu-item-control-hide');
            });


            if (totalnthchild <= 13) {
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
            } else {
                alert('This Menu Only Allows 13 Pages! Please use the BoxMenu Otherwise...');
            } 
            

            //PRESS RIGHT BUTTON
            $('.menu-item-control-right').click(function(){
                $('.duration-bar').css('margin-left');
                $('.duration-bar').animate({'margin-left':'+=' + $( window ).width() /totalnthchild + 'px'}).stop(false,true);
                $item.css('left');
                $item.animate({'left':'-=' + $( window ).width() + 'px'});
                $('.numspotlink .menu-tooltip').css({'opacity':'0','-webkit-animation-name': '','animation-name': ''});

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
                }else{
                    $('.menu-item-control-left').removeClass('menu-item-control-hide');
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
                }else{
                    $('.menu-item-control-left').removeClass('menu-item-control-hide');
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

            $('.navigation-back-button').click(function(){
                $('html').css({'overflow-y' : 'hidden'});
            });

        }

    }, {
        template: 'boxmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new BoxMenuView({model: model}).$el);

    });

});
