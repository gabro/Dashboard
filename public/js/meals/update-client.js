$(document).ready(function() {
  var
    $form = $('#meals-update'),
    outstanding = 0;
  $form.find('input').change(function() {
    var $row = $(this).parents('tr');
    if (!outstanding)
      $row.addClass('pending');
    outstanding++;

    $.post('/meals/update', $form.serialize(), function(result) {
      outstanding--;
      if (!outstanding)
        $row.removeClass('pending');
    }, 'json');
  });
});