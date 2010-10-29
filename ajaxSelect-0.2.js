/*
 * AJAX select 0.2
 * Ast Derek
 * 19/10/2010
 */
(function($){
    var methods = {
        init: function (options) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxSelect'),
                settings = {
                    target: $this,
                    url: '/ajax.php',
                    class: 'ajaxSelect-element',
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
                    $this.data('ajaxSelect',settings);
                    $this.bind('change keyup keydown',function(){
                        $this.ajaxSelect('createNext',$(this).val());
                    });
                }
            });
        },
        
       destroy: function () {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxSelect');
                $(window).unbind('.ajaxSelect');
                data.tabnavigation.remove();
                $this.removeData('ajaxSelect');
            });
        },
        
        createNext: function (caller) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxSelect'),
                loadingClass = '.'+data.loadingClass;
                
                $this.nextAll('.'+data.class).remove();
                $(
                    data.loader
                    .replace(/\{caller\}/ig,caller)
                    .replace(/\{class\}/ig,data.class)
                    .replace(/\{loading\}/ig,data.loadingClass)
                ).insertAfter($this);
                
                $.extend(data,{ajax:caller});
                $this.data('ajaxSelect',data);
                
                $.ajax({
                    url: data.url,
                    data: {caller: caller},
                    dataType: 'json',
                    error: function(){
                        var p
                        $.extend(data,{caller:false});
                        
                        if (data.ajax === caller) {
                            if ($this.next(loadingClass).length) {
                                $this.next(loadingClass).after(
                                    data.error
                                    .replace(/\{class\}/ig,data.class)
                                    .replace(/\{loading\}/ig,data.loadingClass)
                                    .replace(/\{error\}/ig,data.errorClass)
                                );
                                $this.next(loadingClass).remove();
                            }
                        }
                    },
                    complete: function(response,textStatus,XMLHttpRequest){
                        var m, n, fields = $.parseJSON(response['responseText']);
                        $.extend(data,{caller:fields});
                        
                        if (data.ajax === caller) {
                            if ($this.next(loadingClass).length) {
                                $this.next(loadingClass).after(
                                    data.wrapper
                                    .replace(/\{caller\}/ig,caller)
                                    .replace(/\{class\}/ig,data.class)
                                );
                                $this.next(loadingClass).remove();
                                
                                m = $this.next('.'+data.class);
                                
                                if (fields !== false) {
                                    if (data.keypair) {
                                        for (n in fields) {
                                            m.append(data.children.replace(/\{attribute\}/ig,n).replace(/\{value\}/ig,fields[n]));
                                        }
                                    }
                                    else {
                                        for (n in fields) {
                                            m.append(data.children.replace(/\{attribute\}/ig,fields[n]['attribute']).replace(/\{value\}/ig,fields[n]['value']));
                                        }
                                    }
                                    
                                    if (data.depth < data.maxdepth) {
                                        m.ajaxSelect({url:data.url,depth:data.depth+1}).change();
                                    }
                                }
                                else {
                                    m.remove();
                                }
                            }
                        }
                    }
                });
            });
        },
        
        // Meant for empty lists
        populate: function (caller) {
            return this.each(function(){
                var $this = $(this),
                data = $this.data('ajaxSelect'),
                m, n;
                
                if ((typeof(a.caller) !== 'undefined') && (a.caller !== false)) {
                    if (data.keypair) {
                        for (m in a.caller) {
                            $this.append(data.children.replace(/\{attribute\}/ig,m).replace(/\{value\}/ig,a.caller[m]));
                        }
                    }
                    else {
                        for (m in a.caller) {
                            $this.append(data.children.replace(/\{attribute\}/ig,a.caller[m]['attribute']).replace(/\{value\}/ig,a.caller[m]['value']));
                        }
                    }
                }
            });
        },
    };
    
    $.fn.ajaxSelect = function (method) {
        if (methods[method]) {
            return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        }
        else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this,arguments);
        }
        else {
            $.error('Method ' +  method + ' does not exist on jQuery.ajaxSelect');
        }
    };
})(jQuery);