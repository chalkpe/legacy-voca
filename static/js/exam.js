function capitalize(text){
    return text.replace(/\b\w/g , function(m){ return m.toUpperCase(); });
}

$(function(){
    $('.ui.rating').rating('disable');
    $('.ui.radio.checkbox').checkbox();

    var inputs = {};
    $('.ui.form').find('input:radio').each(function(){
        var name = $(this).attr('name');

        inputs[name] = {
            identifier: name,
            rules: [{ type: 'checked', prompt: 'The word "' + capitalize(name) + '" must be checked' }]
        };
    });

    $('.ui.form').form({ fields: inputs, on: 'blur' });
    $('#submit').click(function(){ $('.ui.form').submit(); });
});
