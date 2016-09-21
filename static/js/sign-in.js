$(function(){
    $('.ui.form').form({
        inline: true, on: 'blur',
        fields: {
            email: 'email',
            password: 'minLength[8]'
        }
    });

    $('.message .close').on('click', function(){
        $(this).closest('.message').transition('fade');
    });
});
