function toggleNavBar() {
    if ($('body').hasClass('nav-md')) {
        $('#sidebar-menu').find('li.active ul').hide();
        $('#sidebar-menu').find('li.active').addClass('active-sm').removeClass('active');
    } else {
        $('#sidebar-menu').find('li.active-sm ul').show();
        $('#sidebar-menu').find('li.active-sm').addClass('active').removeClass('active-sm');
    }
    $('body').toggleClass('nav-md nav-sm');
    setContentHeight();
    $('.dataTable').each(function () {
        $(this).dataTable().fnDraw();
    });
    window.dispatchEvent(new Event('resize'));
}

function collapseBox(_this) {
    var $BOX_PANEL = $(_this).closest('.x_panel'),
        $ICON = $(_this).find('i'),
        $BOX_CONTENT = $BOX_PANEL.find('.x_content');
    if ($BOX_PANEL.attr('style')) {
        $BOX_CONTENT.slideToggle(200, function () {
            $BOX_PANEL.removeAttr('style');
        });
    } else {
        $BOX_CONTENT.slideToggle(200);
        $BOX_PANEL.css('height', 'auto');
    }
    $ICON.toggleClass('fa-chevron-up fa-chevron-down');
}

function closeBox(_this) {
    var $BOX_PANEL = $(_this).closest('.x_panel');
    $BOX_PANEL.remove();
}

function setFullScreen() {
    if ($('body').hasClass('nav-md')) {
        $('#sidebar-menu').find('li.active ul').hide();
        $('#sidebar-menu').find('li.active').addClass('active-sm').removeClass('active');
    } else {
        $('#sidebar-menu').find('li.active-sm ul').show();
        $('#sidebar-menu').find('li.active-sm').addClass('active').removeClass('active-sm');
    }
    $('body').toggleClass('nav-md nav-sm');
    setContentHeight();
    $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
}

function clickParentMenu(_this) {
    var $li = $(_this).parent();
    if ($li.is('.active')) {
        $li.removeClass('active active-sm');
        $('ul:first', $li).slideUp(function () {
            setContentHeight();
        });
    } else {
        if (!$li.parent().is('.child_menu')) {
            $('#sidebar-menu').find('li').removeClass('active active-sm');
            $('#sidebar-menu').find('li ul').slideUp();
        } else {
            if ($('body').is(".nav-sm")) {
                $('#sidebar-menu').find("li").removeClass("active active-sm");
                $('#sidebar-menu').find("li ul").slideUp();
            }
        }
        $li.addClass('active');
        $('ul:first', $li).slideDown(function () {
            setContentHeight();
        });
    }
}

function clickItemMenu(_this) {
    $('.child_menu li').removeClass('active active-sm');
    $(_this).addClass('active');
    if ($('body').is(".nav-sm")) {
        $('#sidebar-menu').find('li').removeClass('active active-sm');
        $('#sidebar-menu').find("li ul").slideUp();
    }
}

function setContentHeight() {
    $('.right_col').css('min-height', $(window).height());
    var bodyHeight = $('body').outerHeight(),
        footerHeight = $('body').hasClass('footer_fixed') ? -10 : $('footer').height(),
        leftColHeight = $('.left_col').eq(1).height() + $('.sidebar-footer').height(),
        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;
    contentHeight -= $('.nav_menu').height() + footerHeight;
    $('.right_col').css('min-height', contentHeight);
};

$(document).ready(function () {
    window.dispatchEvent(new Event('resize'));
});