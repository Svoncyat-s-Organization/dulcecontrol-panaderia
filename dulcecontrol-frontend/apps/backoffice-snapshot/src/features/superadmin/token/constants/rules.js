const nameRules = [
    {required: true, message: 'Por favor ingrese su nombre completo.'}
];

const emailRules = [
    {required: true, message: 'Por favor ingrese un correo electrónico.'},
    {type: 'email', message: 'Correo electrónico inválido.'}
];

const passwordRules = [
    {required: true, message: 'Por favor ingrese una contraseña.'},
    {min: 8, message: 'La contraseña debe tener al menos 8 caracteres.'}
]

export {nameRules, emailRules, passwordRules};