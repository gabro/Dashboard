(function() {
  var DURATION = 1000;

  window.animateTile = function($old, $new, cb) {
    $new
      .css({
        position: 'absolute',
        top: $old.position().top + 'px',
        left: $old.position().left + 'px',
        'z-index': 0
      })
      .addClass('flip-in')
      .insertAfter($old);
    $old
      .bind('webkitAnimationEnd', function() {
        $new.removeClass('flip-in');
        $old.remove();
        cb();
      })
      .addClass('flip-out')
    setTimeout(function() {
      $new.css('z-index', 11);
    }, DURATION/2);
  }
})();