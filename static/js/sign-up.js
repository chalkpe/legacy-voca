$(function(){
    $('.ui.checkbox').checkbox();

    $('.ui.form').form({
        inline: true, on: 'blur',
        fields: {
            email: 'email',
            password: 'minLength[8]',
            confirm: 'match[password]',

            name: 'minLength[2]',
            grade: ['exactLength[1]', 'integer[1..9]'],
            class: ['exactLength[1]', 'integer[1..9]'],
            number: ['minLength[1]', 'maxLength[2]', 'integer[1..99]']
        }
    });

    $('.message .close').on('click', function(){
        $(this).closest('.message').transition('fade');
    });
});
