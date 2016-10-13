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
            var minus150per = 150 - this.model.get("_nthChild") * 100;
            var add80px = this.model.get("_nthChild") * 80 - 80;
            var add40px = 32 - this.model.get("_nthChild") * 40;
            var add40pxB = 64 - this.model.get("_nthChild") * 40;
            var add40pxC = 96 - this.model.get("_nthChild") * 40;
            var elevenplus = add40px * 2 + this.model.get("_nthChild") * 18.35;
            var elevenplusB = add40px * 2 + this.model.get("_nthChild") * 38.93;
            var nthdivid = 100 / nthChild;
            if (graphic && graphic.src && graphic.src.length > 0) {
                this.$el.imageready(_.bind(function() {
                    this.setReadyStatus();
                }, this));
            } else {
                this.setReadyStatus();
            }
            $('.menu-container').css({'width' : '' + this.model.get("_nthChild") + '00%','display' : 'inline-block','position' : 'relative'});
            $('.nth-child-'+ nthChild ).css({'background' : 'url('+ graphic.src +')'});
            $('.nth-child-'+ nthChild + ' .menu-item-inner').css({'left' : '' + minus150per + '%', 'margin-left' : '' + add80px + 'px'});
            $('.menu-item' ).css({'width' : nthdivid + '%', 'height' : $( window ).height() + 'px'});
            $('.menu-item.nth-child-'+ nthChild + ' .numberspot').text('' + nthChild );
            $(window).resize(function() {
                $('.menu-item' ).css({'width' : nthdivid + '%', 'height' : $( window ).height() + 'px'});
            });

            var totalnthchild = $('.duration-bar').length;
            
            if (totalnthchild <= 10) {
                $('.duration-bar').css({'margin-left' : add40px + 'px'});
            } else if (totalnthchild <= 20) {
                $('.duration-bar').css({'margin-left' : add40pxB / 2 + 'px','bottom' : '80px'});
                $('.duration-bar:eq(10)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(11)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(12)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(13)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(14)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(15)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(16)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(17)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(18)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(19)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
            } else if (totalnthchild <= 30) {
                $('.duration-bar').css({'margin-left' : add40pxC / 3 + 'px','bottom' : '160px'});
                $('.duration-bar:eq(10)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(11)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(12)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(13)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(14)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(15)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(16)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(17)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(18)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(19)').css({'margin-left' : elevenplusB + 'px','bottom' : '80px'});
                $('.duration-bar:eq(20)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(21)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(22)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(23)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(24)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(25)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(26)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(27)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(28)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
                $('.duration-bar:eq(29)').css({'margin-left' : elevenplus + 'px','bottom' : '0px'});
            } else if (totalnthchild >= 31) {
                alert('This Menu Only Allows 30 Pages! Please use the BoxMenu Otherwise...');
            }
            
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
