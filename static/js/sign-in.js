$(function(){
    $('.ui.form').form({
        fields: {
            email: 'email',
            password: 'minLength[8]'
        }
    });

    $('.message .close').on('click', function(){
        $(this).closest('.message').transition('fade');
    });
});
