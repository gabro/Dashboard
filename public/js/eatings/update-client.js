$(document).ready(function() {
  var
    $form = $('#eatings-update'),
    outstanding = 0;
  $form.find('input').change(function() {
    var $row = $(this).parents('tr');
    if (!outstanding)
      $row.addClass('pending');
    outstanding++;

    $.post('/eatings/update', $form.serialize(), function(result) {
      outstanding--;
      if (!outstanding)
        $row.removeClass('pending');
    }, 'json');
  });
});