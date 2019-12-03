(function ($) {
  // When to show the scroll link
  // higher number = scroll link appears further down the page   
  var upperLimit = $(window).height();

  // Our scroll link element
  var scrollElem = $('#totop');

  // Scroll to top speed
  var scrollSpeed = 500;

  // 是否需要显示返回顶部按钮
  var showTop = ($(window).width() > 1190);

  // Show and hide the scroll to top link based on scroll position   
  scrollElem.hide();
  $(window).scroll(function () {
    if (!showTop) {
      $(scrollElem).hide();
      return;
    }
    var scrollTop = $(document).scrollTop();

    if (scrollTop > upperLimit) {
      $(scrollElem).show();
      $(scrollElem).stop().fadeTo(300, 1); // fade back in           
    } else {
      $(scrollElem).stop().fadeTo(300, 0); // fade out
      $(scrollElem).hide();
    }
  });

  $(window).resize(function () { //当浏览器大小变化时
    var width = $(window).width();
    if (width > 1190) {
      showTop = true;
      $(scrollElem).show();
    } else {
      showTop = false;
      $(scrollElem).hide();
    }
  });

  // Scroll to top animation on click
  $(scrollElem).click(function () {
    $('html, body').animate({ scrollTop: 0 }, scrollSpeed); return false;
  });
})(jQuery);