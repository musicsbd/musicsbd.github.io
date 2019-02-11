//http://openrise.com/lab/PlasmaTree/

            (function ($) {

                var Vector = function (x, y) {
                    this.x = x || 0;
                    this.y = y || 0;
                };

                Vector.prototype = {
                    add: function (v) {
                        this.x += v.x;
                        this.y += v.y;
                        return this;
                    },
                    length: function () {
                        return Math.sqrt(this.x * this.x + this.y * this.y);
                    },
                    rotate: function (theta) {
                        var x = this.x;
                        var y = this.y;
                        this.x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
                        this.y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
                        //this.x = Math.cos(theta) * x - Math.sin(theta) * y;
                        //this.y = Math.sin(theta) * x + Math.cos(theta) * y;
                        return this;
                    },
                    mult: function (f) {
                        this.x *= f;
                        this.y *= f;
                        return this;
                    }
                };

                var Leaf = function (p, r, c, ctx) {
                    this.p = p || null;
                    this.r = r || 0;
                    this.c = c || 'rgba(255,255,255,1.0)';
                    this.ctx = ctx;
                }

                Leaf.prototype = {
                    render: function () {
                        var that = this;
                        var ctx = this.ctx;
                        var f = Branch.random(1, 2)
                        for (var i = 0; i < 5; i++) {
                            (function (r) {
                                setTimeout(function () {
                                    ctx.beginPath();
                                    ctx.fillStyle = that.color;
                                    ctx.moveTo(that.p.x, that.p.y);
                                    ctx.arc(that.p.x, that.p.y, r, 0, Branch.circle, true);
                                    ctx.fill();
                                }, r * 60);
                            })(i);
                        }
                    }
                }


                var Branch = function (p, v, r, c, t) {
                    this.p = p || null;
                    this.v = v || null;
                    this.r = r || 0;
                    this.length = 0;
                    this.generation = 1;
                    this.tree = t || null;
                    this.color = c || 'rgba(255,255,255,1.0)';
                    this.register();
                };

                Branch.prototype = {
                    register: function () {
                        this.tree.addBranch(this);
                    },
                    draw: function () {
                        var ctx = this.tree.ctx;
                        ctx.beginPath();
                        ctx.fillStyle = this.color;
                        ctx.moveTo(this.p.x, this.p.y);
                        ctx.arc(this.p.x, this.p.y, this.r, 0, Branch.circle, true);
                        ctx.fill();
                    },
                    modify: function () {
                        var angle = 0.18 - (0.10 / this.generation);
                        this.p.add(this.v);
                        this.length += this.v.length();
                        this.r *= 0.99;
                        this.v.rotate(Branch.random(-angle, angle)); //.mult(0.996);
                        if (this.r < 0.8 || this.generation > 10) {
                            this.tree.removeBranch(this);
                            var l = new Leaf(this.p, 10, this.color, this.tree.ctx);
                            l.render();
                        }
                    },
                    grow: function () {
                        this.draw();
                        this.modify();
                        this.fork();
                    },
                    fork: function () {
                        var p = this.length - Branch.random(100, 200); // + (this.generation * 10);
                        if (p > 0) {
                            var n = Math.round(Branch.random(1, 3));
                            this.tree.stat.fork += n - 1;
                            for (var i = 0; i < n; i++) {
                                Branch.clone(this);
                            }
                            this.tree.removeBranch(this);
                        }
                    }
                };

                Branch.circle = 2 * Math.PI;
                Branch.random = function (min, max) {
                    return Math.random() * (max - min) + min;
                };
                Branch.clone = function (b) {
                    var r = new Branch(new Vector(b.p.x, b.p.y), new Vector(b.v.x, b.v.y), b.r, b.color, b.tree);
                    r.generation = b.generation + 1;
                    return r;
                };
                Branch.rgba = function (r, g, b, a) {
                    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                };
                Branch.randomrgba = function (min, max, a) {
                    return Branch.rgba(Math.round(Branch.random(min, max)), Math.round(Branch.random(min, max)), Math.round(Branch.random(min, max)), a);
                };

                var Tree = function () {
                    var branches = [];
                    var timer;
                    this.stat = {
                        fork: 0,
                        length: 0
                    };
                    this.addBranch = function (b) {
                        branches.push(b);
                    };
                    this.removeBranch = function (b) {
                        for (var i = 0; i < branches.length; i++) {
                            if (branches[i] === b) {
                                branches.splice(i, 1);
                                return;
                            }
                        }
                    };
                    this.render = function (fn) {
                        var that = this;
                        timer = setInterval(function () {
                            fn.apply(that, arguments);
                            if (branches.length > 0) {
                                for (var i = 0; i < branches.length; i++) {
                                    branches[i].grow();
                                }
                            }
                            else {
                                //clearInterval(timer);
                            }
                        }, 1000 / 30);
                    };
                    this.init = function (ctx) {
                        this.ctx = ctx;
                    };
                    this.abort = function () {
                        branches = [];
                        this.stat = {
                            fork: 0,
                            length: 0
                        }
                    };
                };


                function init() {

                    // init

                    var $window = $(window);
                    var $body = $("body");
                    var canvas_width = $window.width();
                    var canvas_height = $window.height() - 30;
                    var center_x = canvas_width / 2;
                    var stretch_factor = 600 / canvas_height;
                    var y_speed = 3 / stretch_factor;
                    var $statMsg = $("#statMsg");

                    // tx

                    var canvas = $('#canvas')[0];
                    canvas.width = canvas_width;
                    canvas.height = canvas_height;
                    var ctx = canvas.getContext("2d");
                    ctx.globalCompositeOperation = "lighter";

                    // tree
                    var randnum = Math.floor((Math.random()*10)+1);

                    var t = new Tree();
                    t.init(ctx);
                    for (var i = 0; i < randnum; i++) {
                        new Branch(new Vector(center_x, canvas_height), new Vector(Math.random(-1, 1), -y_speed), 15 / stretch_factor, Branch.randomrgba(0, 255, 0.3), t);
                    }
                    t.render(function () {
                        $statMsg.html(this.stat.fork);
                    });

                    // events

                    $("#drawArea").click(function (e) {
                        //e.preventDefault();
                        var x, y;
                        x = e.pageX - this.offsetLeft;
                        y = e.pageY - this.offsetTop;
                        new Branch(new Vector(x, canvas_height), new Vector(0, -y_speed), 15 / stretch_factor, Branch.randomrgba( 0, 255,  0.3), t);
                         new Branch(new Vector(x, y), new Vector(0, -y_speed), 15 / stretch_factor, Branch.randomrgba( 0, 1,  1), t);
                          new Branch(new Vector(x, canvas_height), new Vector(0, -y_speed), 20 / stretch_factor, Branch.randomrgba( 0, 0,  0.2), t);
                    });

                    $("#btnClear").click(function (e) {
                        e.stopPropagation();
                        t.abort();
                        ctx.clearRect(0, 0, canvas_width, canvas_height);
                        $statMsg.html("0");
                    });
                    $("#btnReload").click(function (e) {
                        e.stopPropagation();
                        window.location.reload();
                    });
                    $("#btnNewExperiment").click(function (e) {
                        window.location = "http://www.openrise.com/lab/FlowerPower";
                    });
                }


                $(function () {
                   init();
                   $("#btnClear").trigger('click');

                           var randnum = Math.floor((Math.random()*30000)+1);
                               setInterval(function() {

                   var $el = $('#canvas');
            var elwidth = 1800;
            var elheight = 900;
            var offset = $el.offset();
            randnum = Math.floor((Math.random()*5000)+1);

            var randx = Math.floor((Math.random()*elwidth)+1);
             var randy = Math.floor((Math.random()*elheight)+1);


            var event = $.extend( $.Event( "click" ), {

                                                which: 1,

                                                pageX: randx,

                                                pageY: randy

                                        });
                                         if($('#plasmabox').is(':checked')){

                                         if($('#aboverlay').length != 0){
                                         function loopoverlay(){ $('#aboverlay').delay(50000).animate({'width' : '300%', 'left' : '-100%', 'height' : '300%', 'top' : '-50%','opacity' : '0.7'},{duration:60000}).animate({'width' : '100%', 'left' : '0px','height' : '100%', 'top' : '0px','opacity' : '1'},{duration:50000, easing: 'linear', complete:function(){   loopoverlay(); }});};
                                         };

                         if($('#zen').hasClass('play')){   $el.trigger(event); $('#canvas').animate({'opacity' : '1'},2000);  loopoverlay();}else{

                                        $('#aboverlay').stop(false, false).animate({'opacity' : '1', 'width' : '100%', 'height' : '100%', 'left' : '0px', 'top' : '0px'},1000); $('#canvas').animate({'opacity':'0'},{duration:4000, complete: function(){$("#btnClear").trigger('click');}}); };

                                        }else{ $("#btnClear").trigger('click');  };

                        }, 13000);


                });

              $('#plasmabox').live('click', function(){
                if($(this).is(':checked')){}else{$('#canvas').animate({'opacity' : '0'},{duration:2000, complete:function(){ $("#btnClear").trigger('click');}});}
              });
               $('#levelsbox').live('click', function(){
               if($(this).is(':checked')){   if($('#zen').hasClass('play')){$('.drawlevels').show(1000);};}else{$('.drawlevels').hide(1000);}
              });

            })(jQuery);
