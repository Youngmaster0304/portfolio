(function ($) {
    "use strict";

    $(window).on('load', function () {
        $("#loader").fadeOut("slow", function () {
            $("#preloader").delay(300).fadeOut("slow");
        });
    });

    $(".smoothscroll").on('click', function (e) {
        e.preventDefault();
        var target = this.hash,
            $target = $(target);
        $("html, body").stop().animate({
            scrollTop: $target.offset().top - 70
        }, 800, 'swing', function () {
            window.location.hash = target;
        });
    });

    const currentTheme = localStorage.getItem('theme') || 'dark';
    const htmlEl = document.documentElement;
    if (currentTheme === 'light') {
        htmlEl.classList.remove('dark-mode');
    } else {
        htmlEl.classList.add('dark-mode');
    }

    $('#theme-toggle-btn').on('click', function () {
        const html = document.documentElement;
        const isDarkMode = html.classList.contains('dark-mode');
        if (isDarkMode) {
            html.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
        window.dispatchEvent(new Event('themeChanged'));
    });

    $('#nav-toggle').on('click', function () {
        $(this).toggleClass('active');
        $('#nav-menu').toggleClass('active');
    });

    $('.nav-link').on('click', function () {
        $('#nav-toggle').removeClass('active');
        $('#nav-menu').removeClass('active');
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.nav-container').length) {
            $('#nav-toggle').removeClass('active');
            $('#nav-menu').removeClass('active');
        }
    });

    var lastScroll = 0;
    $(window).scroll(function () {
        var st = $(this).scrollTop();
        if (st > 200) {
            $('header').addClass('header-scrolled');
        } else {
            $('header').removeClass('header-scrolled');
        }
        if (st > lastScroll && st > 300) {
            $('header').addClass('header-hidden');
        } else {
            $('header').removeClass('header-hidden');
        }
        lastScroll = st;

        if (st >= 300) {
            $("#go-top").fadeIn(400);
        } else {
            $("#go-top").fadeOut(400);
        }
    });

    $('.item-wrap a').on('click', function (e) {
        e.preventDefault();
        var modalId = $(this).attr('href');
        var modal = $(modalId);
        if (modal.length) {
            $('<div class="mfp-bg"></div>').appendTo('body');
            var wrap = $('<div class="mfp-wrap"><div class="mfp-content"><button class="mfp-close">&times;</button></div></div>');
            wrap.find('.mfp-content').append(modal.clone().show());
            wrap.appendTo('body');
            wrap.find('.mfp-close').on('click', function () {
                wrap.remove();
                $('.mfp-bg').remove();
            });
            wrap.find('.popup-modal-dismiss').on('click', function (e) {
                e.preventDefault();
                wrap.remove();
                $('.mfp-bg').remove();
            });
            wrap.on('click', function (e) {
                if ($(e.target).is('.mfp-wrap')) {
                    wrap.remove();
                    $('.mfp-bg').remove();
                }
            });
            $(document).on('keydown.modal', function (e) {
                if (e.key === 'Escape') {
                    wrap.remove();
                    $('.mfp-bg').remove();
                    $(document).off('keydown.modal');
                }
            });
        }
    });

    $('#moreAboutBtn').on('click', function (e) {
        e.preventDefault();
        $('#aboutModal').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    $('.about-modal-close').on('click', function () {
        $('#aboutModal').removeClass('active');
        $('body').css('overflow', '');
    });

    $(document).on('click', function (e) {
        if ($(e.target).is('#aboutModal')) {
            $('#aboutModal').removeClass('active');
            $('body').css('overflow', '');
        }
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#aboutModal').hasClass('active')) {
            $('#aboutModal').removeClass('active');
            $('body').css('overflow', '');
        }
    });

    function animateCounters() {
        $('.stat-count').each(function () {
            var $this = $(this);
            if ($this.hasClass('counted')) return;
            $this.addClass('counted');
            var countTo = parseInt($this.text());
            $({ count: 0 }).animate({ count: countTo }, {
                duration: 2000,
                easing: 'swing',
                step: function () {
                    $this.text(Math.floor(this.count));
                },
                complete: function () {
                    $this.text(this.count);
                }
            });
        });
    }

    var counterObserved = false;
    var counterObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !counterObserved) {
            counterObserved = true;
            animateCounters();
            counterObserver.disconnect();
        }
    }, { threshold: 0.3 });
    var statsEl = document.querySelector('#stats');
    if (statsEl) counterObserver.observe(statsEl);

    function animateSkillBars() {
        $('.skill-bar-fill').each(function () {
            var $bar = $(this);
            if ($bar.hasClass('animated')) return;
            $bar.addClass('animated');
            var width = $bar.parent().parent().css('--skill-width');
            $bar.css('width', '0%');
            setTimeout(function () {
                $bar.css('width', width);
            }, 200);
        });
    }

    var skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillObserver.disconnect();
            }
        });
    }, { threshold: 0.2 });
    var skillsEl = document.querySelector('#skills-visualization');
    if (skillsEl) skillObserver.observe(skillsEl);

    $('.click-to-copy').on('click', function () {
        var text = $(this).data('copy');
        var $el = $(this);
        var $icon = $el.find('.copy-icon');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                $icon.removeClass('fa-regular fa-copy').addClass('fa-solid fa-check');
                $el.addClass('copied');
                setTimeout(function () {
                    $icon.removeClass('fa-solid fa-check').addClass('fa-regular fa-copy');
                    $el.removeClass('copied');
                }, 2000);
            });
        } else {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            $icon.removeClass('fa-regular fa-copy').addClass('fa-solid fa-check');
            $el.addClass('copied');
            setTimeout(function () {
                $icon.removeClass('fa-solid fa-check').addClass('fa-regular fa-copy');
                $el.removeClass('copied');
            }, 2000);
        }
    });

    $('.click-to-copy').each(function () {
        var $el = $(this);
        if (!$el.find('.copy-tooltip').length) {
            $el.append('<span class="copy-tooltip">Click to copy</span>');
        }
    });

})(jQuery);
