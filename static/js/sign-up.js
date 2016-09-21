$(function(){
    $('.ui.checkbox').checkbox();

    $('.ui.form').form({
        inline: true, on: 'blur',
        fields: {
            email: 'email',
            password: 'minLength[8]',
            confirm: 'match[password]',

            name: 'minLength[2]',
            studentId: ['integer', 'minLength[4]', 'maxLength[5]']
        }
    });

    $('.message .close').on('click', function(){
        $(this).closest('.message').transition('fade');
    });
});
