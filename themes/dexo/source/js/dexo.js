
function boot() {
  resizeLayout();
  window.onresize = function() {
    resizeLayout();
  }

  function resizeLayout() {
    var width = document.body.clientWidth;
    var navbar = document.getElementById("navbar-menu");
    if (width <= 767) {
      navbar.style.display = "none";
    } else {
      navbar.style.display = "block";
    }
  }
}

function hideShowMenu() {
  var navbar = document.getElementById("navbar-menu");
  var display = getStyle(navbar, "display");
  if (display == "block") {
    navbar.style.display = "none";
  } else {
    navbar.style.display = "block";
  }
}

function getStyle(obj, attr) {
  return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

boot();
