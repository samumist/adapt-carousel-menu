define([
    'coreJS/adapt',
    'coreViews/menuView'
], function(Adapt, MenuView) {

    var BoxMenuView = MenuView.extend({

        postRender: function() {
            var nthChild = 0;
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
            var add80px = this.model.get("_nthChild") * 80 - 80;
            var add40px = 32 - totalnthchild * 40;

            if (graphic && graphic.src && graphic.src.length > 0) {
                this.$el.imageready(_.bind(function() {
                    this.setReadyStatus();
                }, this));
            } else {
                this.setReadyStatus();
            }
            $('.menu-container').css({'width' : '' + this.model.get("_nthChild") + '00%','display' : 'inline-block','position' : 'relative'});
            $('.nth-child-'+ nthChild ).css({'background' : 'url('+ graphic.src +')'}).attr('name', 'nth-child-' + nthChild);
            $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px'});
            $('.menu-item.nth-child-'+ nthChild + ' .numberspot').text('' + nthChild );

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

            //CIRCLE NUMBERS SPOT LINKS FUNCTIONALITY
            var circlecount = nthChild+1;
            if (nthChild === 0) {
               $('a.numspotlink:eq(' + nthChild + ')').click(function(){      
                    $('.menu-container').animate({'margin-left':'-' + nthChild + '00%'});//.stop(false, true);
                    $('a.menu-item-control-left').addClass('menu-item-control-hide');
                    $('.menu-item' ).removeClass('active');
                    $('.nth-child-' + circlecount ).addClass('active');
               });
            }else{
                $('a.numspotlink:eq(' + nthChild + ')').click(function(){      
                    $('.menu-container').animate({'margin-left':'-' + nthChild + '00%'});//.stop(false, true);
                    $('a.menu-item-control-left').removeClass('menu-item-control-hide');
                    $('.menu-item' ).removeClass('active');
                    $('.nth-child-' + circlecount ).addClass('active');
                });
            } 
            if (totalnthchild <= 10) {
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
            } else {
                alert('This Menu Only Allows 30 Pages! Please use the BoxMenu Otherwise...');
            } 
            

            //PRESS RIGHT BUTTON
            $('a.menu-item-control-right').click(function(){
                $item.animate({'left':'-=' + $( window ).width() + 'px'});
                
                var mycount = count+1;
                count += 1;
                mycount += 1;

                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ mycount ).addClass('active');

                if (count === 0) {
                    $('a.menu-item-control-left').addClass('menu-item-control-hide');
                }else{
                    $('a.menu-item-control-left').removeClass('menu-item-control-hide');
                }
                
                if (count === nthChild- 1) {
                    $('a.menu-item-control-right').addClass('menu-item-control-hide');
                }else{
                    $('a.menu-item-control-right').removeClass('menu-item-control-hide');
                }

            });
            //PRESS LEFT BUTTON
            $('a.menu-item-control-left').click(function(){      
                $item.animate({'left':'+=' + $( window ).width() + 'px'});

                var mycount = count+1;
                count -= 1;
                mycount -= 1;

                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ mycount ).addClass('active');

                if (count === 0) {
                    $('a.menu-item-control-left').addClass('menu-item-control-hide');
                }else{
                    $('a.menu-item-control-left').removeClass('menu-item-control-hide');
                }
                
                if (count === nthChild - 1) {
                    $('a.menu-item-control-right').addClass('menu-item-control-hide');
                }else{
                    $('a.menu-item-control-right').removeClass('menu-item-control-hide');
                }

            });

            //GET BACKGROUND TO MATCH BROWSER ON RESIZE
            $('.menu-item' ).css({'width' : $( window ).width() + 'px', 'height' : $( window ).height() + 'px'});
            $(window).resize(function() {
                $('.menu-item' ).css({'width' : $( window ).width() + 'px', 'height' : $( window ).height() + 'px'});
                $('.menu-item' ).css({'left':'-' + count * $( window ).width() + 'px'});
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
