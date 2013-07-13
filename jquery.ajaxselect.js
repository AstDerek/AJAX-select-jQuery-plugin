(function($){
    var renderer = $('<p/>'),
    escape = function (text) {
        renderer.text(text);
        return renderer.text();
    },
    methods = {
        init: function (options) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxselect'),
                settings = {
                    target: $this,
                    url: '/index.php',
                    class: 'ajaxselect-element',
                    loadingClass: 'still-loading',
                    errorClass: 'load-error',
                    loader: '<div class="{class} {loading}">Loading...</div>',
                    error: '<div class="{class} {loading} {error}">There was an error while trying to retrieve this content</div>',
                    wrapper: '<select name="{caller}" class="{class}"></select>',
                    children: '<option value="{attribute}">{value}</option>',
                    keypair: true,
                    maxdepth: 2,
                    depth: 1
                };
                
                if (options) { 
                    $.extend(settings, options);
                }
                
                if (!data) {
                    $this.data('ajaxselect',settings);
                    $this.on('change keyup keydown',function(){
                        $this.ajaxselect('createNext',$(this).val());
                    });
                }
            });
        },
        
       destroy: function () {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxselect');
                
                $(window).off('.ajaxselect');
                data.tabnavigation.remove();
                $this.removeData('ajaxselect');
            });
        },
        
        createNext: function (caller) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxselect'),
                loadingClass = '.' + data.loadingClass;
                
                $this.nextAll('.' + data.class).remove();
                $(
                    data.loader
                    .replace(/\{caller\}/ig,escape(caller))
                    .replace(/\{class\}/ig,escape(data.class))
                    .replace(/\{loading\}/ig,escape(data.loadingClass))
                ).insertAfter($this);
                
                $.extend(data,{ ajax: caller });
                $this.data('ajaxselect',data);
                
                $.ajax({
                    url: data.url,
                    data: { caller: caller },
                    dataType: 'json',
                    error: function(){
                        var p
                        $.extend(data,{ caller: false });
                        
                        if (data.ajax === caller) {
                            if ($this.next(loadingClass).length) {
                                $this.next(loadingClass).after(
                                    data.error
                                    .replace(/\{class\}/ig,escape(data.class))
                                    .replace(/\{loading\}/ig,escape(data.loadingClass))
                                    .replace(/\{error\}/ig,escape(data.errorClass))
                                );
                                $this.next(loadingClass).remove();
                            }
                        }
                    },
                    complete: function(response,textStatus,XMLHttpRequest){
                        var next, current,
                        attribute, value,
                        fields = $.parseJSON(response['responseText']);
                        
                        $.extend(data,{ caller: fields });
                        
                        if (data.ajax === caller) {
                            if ($this.next(loadingClass).length) {
                                $this.next(loadingClass).after(
                                    data.wrapper
                                    .replace(/\{caller\}/ig,escape(caller))
                                    .replace(/\{class\}/ig,escape(data.class))
                                );
                                $this.next(loadingClass).remove();
                                
                                next = $this.next('.' + data.class);
                                
                                if (fields !== false) {
                                    if (data.keypair) {
                                        for (current in fields) {
                                            attribute = escape(current);
                                            value = escape(fields[current]);
                                            
                                            next.append(
                                                data.children
                                                .replace(/\{attribute\}/ig,attribute)
                                                .replace(/\{value\}/ig,value)
                                            );
                                        }
                                    }
                                    else {
                                        for (current in fields) {
                                            attribute = escape(fields[current]['attribute']);
                                            value = escape(fields[current]['value']);
                                            
                                            next.append(
                                                data.children
                                                .replace(/\{attribute\}/ig,attribute)
                                                .replace(/\{value\}/ig,value)
                                            );
                                        }
                                    }
                                    
                                    if (data.depth < data.maxdepth) {
                                        next.ajaxselect({
                                            url: data.url,
                                            depth: data.depth + 1
                                        })
                                        .change();
                                    }
                                }
                                else {
                                    next.remove();
                                }
                            }
                        }
                    }
                });
            });
        }
    };
    
    $.fn.ajaxselect = function (method) {
        if (methods[method]) {
            return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        }
        else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this,arguments);
        }
        else {
            $.error('Method ' +  method + ' does not exist on jQuery.ajaxselect');
        }
    };
})(jQuery);