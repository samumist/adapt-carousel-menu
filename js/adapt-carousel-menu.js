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
            $('.menu-container').css({'width' : '' + nthChild + '00%','display' : 'inline-block','position' : 'relative'});
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
            var mycount = count+1;
            var $item = $('.nth-child-'+ nthChild );
            var moveduration = makezer0 * $( window ).width() + add40px;

            $('.nth-child-1' ).addClass('active');

            //CIRCLE NUMBERS SPOT LINKS FUNCTIONALITY
            var makezer0 = nthChild-1;
            var moveduration = makezer0 * $( window ).width() + add40px;

            $('a.numspotlink:eq(' + makezer0 + ')').click(function(){      
                $('.menu-item').animate({'left':'-' + $( window ).width()*makezer0 + 'px'});
                $('.duration-bar').css('margin-left');
                $('.duration-bar').animate({'margin-left':'' + moveduration + 'px'});
                $('a.menu-item-control-left').removeClass('menu-item-control-hide');
                $('a.menu-item-control-right').removeClass('menu-item-control-hide');
                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ nthChild ).addClass('active');
                $(window).resize(function() {
                    var makezer0b = nthChild-1;
                    var resizewin2 = makezer0b * $( window ).width();
                    var add40px3 = 32 - nthChild * 40;
                    var calwin40px2 = add40px3 + resizewin2;
                    $('.nth-child-' + nthChild ).css('left');
                    $('.menu-item' ).css({'left':'-' + makezer0b * $( window ).width() + 'px'});
                    $('.duration-bar').css('margin-left');
                    $('.duration-bar').animate({'margin-left':'' + calwin40px2 + 'px'}).stop(false,true);
                });
            });

            //Hide LEFT arrow if number 1 is clicked
            $('a.numspotlink:eq(0)').click(function(){     
                $('a.menu-item-control-left').addClass('menu-item-control-hide');
            });
            
            //Hide RIGHT arrow if last number is clicked
            $('.menu-item:last-child a.numspotlink').click(function(){      
                $('a.menu-item-control-right').addClass('menu-item-control-hide');
            });


            if (totalnthchild <= 10) {
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
            } else {
                alert('This Menu Only Allows 30 Pages! Please use the BoxMenu Otherwise...');
            } 
            

            //PRESS RIGHT BUTTON
            $('.menu-item-control-right').click(function(){
                $('.duration-bar').css('margin-left');
                $('.duration-bar').animate({'margin-left':'+=' + $( window ).width() /totalnthchild + 'px'}).stop(false,true);
                $item.css('left');
                $item.animate({'left':'-=' + $( window ).width() + 'px'});
                
                count += 1;
                mycount += 1;
                
                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ mycount ).addClass('active');

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

                count -= 1;
                mycount -= 1;

                $('.menu-item' ).removeClass('active');
                $('.nth-child-'+ mycount ).addClass('active');

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
                $('.menu-item' ).css({'width' : $( window ).width() + 'px', 'height' : $( window ).height() + 'px'});
                $('.nth-child-' + nthChild ).css('left');
                $('.menu-item' ).css({'left':'-' + resizewin + 'px'});
                $('.duration-bar').css('margin-left');
                $('.duration-bar').css({'margin-left':'' + calwin40px + 'px'});
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
