(function() {
  var DURATION = 900;

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
        $new
          .removeClass('flip-in')
          .css({
            position: 'relative',
            top: 'auto',
            left: 'auto'
          });
        $old.remove();
        cb();
      })
      .addClass('flip-out');
  }
})();