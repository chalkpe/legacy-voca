$(function(){
    $('.ui.rating').rating('disable');
    $('.ui.radio.checkbox').checkbox();

    $('#submit').click(function(){
        $('form').submit();
    });
});
