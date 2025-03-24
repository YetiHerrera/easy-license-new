export default {
  onboarding: {
    title: 'Easy License',
    next: 'Siguiente',
    getStarted: 'Comencemos',
    steps: {
      one: {
        title: 'Bienvenido Guatemalteco en el extranjero',
        description: 'Easy License es una aplicación que te permite gestionar tus licencias y certificaciones de manera fácil y segura.'
      },
      two: {
        title: 'Renueva tu licencia de conducir',
        description: 'Con una simple y sencilla interfaz, podrás renovar tu licencia de conducir sin complicaciones.'
      },
      three: {
        title: 'Sin salir de casa',
        description: 'Puedes hacer el proceso de renovación de tu licencia de conducir a tu ritmo y conveniencia.'
      }
    }
  },
  auth: {
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    phoneNumber: 'Número de Teléfono',
    forgotPassword: '¿Olvidó su Contraseña?',
    noAccount: "¿No tiene una cuenta?",
    haveAccount: "¿Ya tiene una cuenta?",
    createAccount: "Crear Cuenta",
    createAccountSubtitle: "Crea una cuenta para que puedas empezar a usar Easy License",
    signIn: "Ingresar",
    signInSubtitle: "Inicia sesión para acceder a tu cuenta y ver tu proceso",
    countryCode: "Código de País",
    emailRequired: "El correo electrónico es requerido",
    passwordRequired: "La contraseña es requerida",
    phoneRequired: "El número de teléfono es requerido",
    invalidEmail: "Por favor ingrese un correo electrónico válido",
    invalidPhone: "Por favor ingrese un número de teléfono válido",
    verifyCode: "Verificar Código",
    verifyCodeSubtitle: "Ingrese el código de 6 dígitos enviado a su correo electrónico",
    verify: "Verificar",
    didntReceiveCode: "¿No recibió el código?",
    resendCode: "Reenviar Código",
    invalidCode: "Por favor ingrese un código válido de 6 dígitos",
    verificationFailed: "La verificación falló. Por favor intente de nuevo.",
    signupFailed: "El registro falló. Por favor intente de nuevo.",
    sending: "Enviando..."
  },
  common: {
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    continue: 'Continuar',
    confirm: 'Confirmar'
  },
  home: {
    emptyState: {
      title: 'Sin Proceso Activo',
      description: 'Actualmente no tienes ningún proceso de licencia activo. Inicia uno nuevo para comenzar tu proceso de renovación.',
      startButton: 'Iniciar Nuevo Proceso'
    },
    withProcess: 'Proceso Activo',
    activeProcesses: 'Tus Procesos Activos',
    newProcess: 'Nuevo Proceso',
    viewDetails: 'Ver Detalles',
    welcome: 'Usuario',
    greeting: '¡Hola, {{name}}!',
    welcomeBack: '¡Bienvenido de nuevo!'
  },
  process: {
    licenseType: 'Tipo de Licencia',
    paymentDate: 'Fecha de Pago',
    deliveryDate: 'Entrega Estimada',
    statusPending: 'Pendiente',
    statusProcessing: 'En Proceso',
    statusCompleted: 'Completado',
    trackProcess: 'Seguir Proceso',
    viewDetails: 'Ver Detalles',
    steps: {
      title: 'Pasos del Proceso',
      visualTest: 'Prueba Visual',
      transitVerification: 'Verificación del Departamento de Tránsito',
      visualTestDescription: 'Visite un centro de pruebas para completar su examen visual',
      transitVerificationDescription: 'Este proceso es automatizado por el Departamento de Tránsito',
      helpText: 'Toque cualquier paso para ver detalles y estado'
    }
  },
  userInformation: {
    title: 'Información Personal',
    subtitle: 'Para iniciar la renovación de tu licencia es necesario que tengas a la mano los siguientes datos y documentos',
    documentTypes: {
      identity: 'Documento de identidad',
      currentLicense: 'Licencia Actual',
      addressProof: 'Comprobante de domicilio'
    },
    optional: '(opcional)',
    startProcess: 'Iniciar mi trámite',
    requirements: {
      title: 'Requisitos',
      description: 'Asegúrate de tener todos los documentos necesarios antes de continuar'
    }
  },
  documentUpload: {
    title: 'Tud Documentos',
    subtitle: 'Sube los documentos requeridos para continuar con el proceso de renovación de tu licencia',
    uploadButton: 'Subir documento',
    uploadInstructions: 'Toca para subir o tomar una foto',
    documentTypes: {
      identity: 'Documento de identidad',
      currentLicense: 'Licencia Actual',
      addressProof: 'Comprobante de domicilio',
      passport: 'Pasaporte'
    },
    selectOption: 'Seleccionar opción',
    captureMethod: '¿Cómo deseas agregar tu documento?',
    takePhoto: 'Tomar foto',
    chooseFromLibrary: 'Elegir de la galería',
    error: 'Error',
    captureError: 'Hubo un error al capturar el documento. Inténtalo de nuevo.',
    cameraError: 'Hubo un error al abrir la cámara. Inténtalo de nuevo.',
    permissionRequired: 'Permiso requerido',
    cameraPermissionMessage: 'Necesitamos acceso a tu cámara para tomar fotos de tus documentos.',
    settings: 'Configuración',
    continue: 'Continuar',
    tapToChange: 'Toca para cambiar',
    documentTypeSelector: 'Tipo de documento',
    dpi: 'DPI',
    passport: 'Pasaporte',
    bothDocuments: 'Ambos documentos',
    recommended: '(recomendado)',
    frontSide: 'Parte frontal',
    backSide: 'Parte posterior',
    dpiFullName: 'Documento Personal de Identidad',
    currentLicenseQuestion: '¿Tienes tu licencia anterior?',
    delete: 'Eliminar documento',
    submit: 'Enviar documentos'
  },
  reviewDocuments: {
    title: 'Revisar Documentos',
    subtitle: 'Revisa tus documentos antes de enviarlos',
    uploadedDocuments: 'Documentos subidos',
    submit: 'Enviar documentos',
    submitSuccess: 'Documentos enviados con éxito',
    documentError: 'Hubo un problema con el documento. Por favor, inténtalo de nuevo.'
  },
  licenseUpload: {
    title: 'Licencia Anterior',
    subtitle: 'Sube tu licencia anterior para facilitar el proceso de renovación',
    optionalDocument: 'Este documento es opcional. Si no cuentas con tu licencia anterior, puedes continuar sin ella.',
    previousLicense: 'Licencia de conducir anterior',
    frontSide: 'Parte frontal',
    backSide: 'Parte posterior',
    uploadInstructions: 'Toca para subir o tomar una foto',
    delete: 'Eliminar',
    continueWithLicense: 'Continuar con licencia',
    continueWithoutLicense: 'No tengo mi licencia anterior',
    permissionRequired: 'Permiso requerido',
    cameraPermissionMessage: 'Necesitamos acceso a tu cámara para tomar fotos de tu licencia.',
    settings: 'Configuración',
    selectOption: 'Seleccionar opción',
    captureMethod: '¿Cómo deseas agregar tu licencia?',
    takePhoto: 'Tomar foto',
    chooseFromLibrary: 'Elegir de la galería',
    error: 'Error',
    captureError: 'Hubo un error al capturar la licencia. Inténtalo de nuevo.',
    cameraError: 'Hubo un error al abrir la cámara. Inténtalo de nuevo.'
  },
  livenessVerification: {
    title: 'Verificación de Identidad',
    subtitle: 'Necesitamos realizar una verificación en vivo. Sigue las instrucciones a continuación.',
    instruction1: 'Asegúrate de estar en un lugar bien iluminado.',
    instruction2: 'Mantén tu rostro dentro del marco durante todo el proceso.',
    instruction3: 'Sigue las instrucciones de movimiento que aparecerán en pantalla.',
    instruction4: 'Asegúrate de tener tu documento de identidad visible junto a tu rostro durante la grabación.',
    startVerification: 'Iniciar verificación',
    verificationComplete: 'Verificación completada',
    verificationFailed: 'Verificación fallida',
    tryAgain: 'Intentar de nuevo',
    showDocument: 'Por favor, ten tu documento de identidad visible junto a tu rostro durante la grabación.',
    moveHeadSideToSide: 'Gira lentamente tu cabeza de lado a lado durante la grabación para una verificación adecuada.',
    startRecording: 'Iniciar grabación',
    finishRecording: 'Finalizar grabación',
    verifyRecording: 'Enviar verificación',
    verificationSuccessMessage: 'Tu identidad prueba de verificación fue enviada con éxito y sera revisada por nuestros agentes.'
  },
  licenseInformation: {
    title: 'Información de Licencia',
    subtitle: 'Por favor, complete toda la información requerida para la renovación de su licencia',
    dpi: 'DPI o Pasaporte',
    dpiOrPassportPlaceholder: 'Ingrese su DPI (13 dígitos) o número de pasaporte',
    dpiRequired: 'El DPI o Pasaporte es requerido',
    invalidDpi: 'Por favor ingrese un DPI válido (13 dígitos) o número de pasaporte (8-12 caracteres)',
    names: 'Nombres',
    namesPlaceholder: 'Ingrese su(s) nombre(s)',
    lastNames: 'Apellidos',
    lastNamesPlaceholder: 'Ingrese su(s) apellido(s)',
    licenseType: 'Tipo de Licencia',
    selectLicenseType: 'Seleccione tipo de licencia',
    renewalYears: 'Años a Renovar',
    selectRenewalYears: 'Seleccione años a renovar',
    years: 'años',
    bornDate: 'Fecha de Nacimiento',
    nameRequired: 'Los nombres son requeridos',
    lastNameRequired: 'Los apellidos son requeridos',
    invalidDate: 'Por favor ingrese una fecha de nacimiento válida',
    ageRestriction: 'Debe tener al menos 18 años de edad',
    selectDate: 'Seleccionar Fecha',
    year: 'Año',
    month: 'Mes',
    day: 'Día'
  },
  licenseDelivery: {
    title: 'Dirección de Entrega',
    subtitle: 'Por favor, proporcione su dirección en Estados Unidos donde desea recibir su licencia',
    streetAddress: 'Dirección',
    streetAddressPlaceholder: 'Ingrese su dirección',
    streetAddressRequired: 'La dirección es requerida',
    apartment: 'Apartamento/Suite',
    apartmentPlaceholder: 'Ingrese número de apartamento o suite (opcional)',
    city: 'Ciudad',
    cityPlaceholder: 'Ingrese su ciudad',
    cityRequired: 'La ciudad es requerida',
    state: 'Estado',
    statePlaceholder: 'Ingrese su estado',
    stateRequired: 'El estado es requerido',
    zipCode: 'Código Postal',
    zipCodePlaceholder: 'Ingrese su código postal',
    zipCodeRequired: 'El código postal es requerido',
    invalidZipCode: 'Por favor ingrese un código postal válido de Estados Unidos (5 dígitos o formato 5+4)'
  },
  processType: {
    title: 'Elije tu tipo de trámite',
    subtitle: 'Ahora selecciona tu proceso, puedes tramitar tu renovación de licencia o bien la reposición de la misma, también puedes hacer ambos trámites al mismo tiempo',
    renewal: 'Renovación',
    renewalDescription: 'Renueva tu licencia, recuerda que vas a necesitar todos los documentos necesarios',
    replacement: 'Reposición',
    replacementDescription: 'Reposición la licencia que perdiste, recuerda que vas a necesitar todos los documentos requeridos'
  },
  processResume: {
    title: 'Resumen de tu trámite',
    subtitle: 'Acá podrás ver el resumen para el pago de tu trámite por favor asegurate de que todos los datos sean correctos',
    processSummaryTitle: 'Resumen de trámite',
    renewalAndReplacement: 'Renovación y Reposición de licencia',
    address: 'Dirección',
    postalCode: 'Codigo Postal',
    phoneNumber: 'Número celular',
    name: 'Nombre',
    licenseType: 'Licencia Tipo',
    paymentSummaryTitle: 'Resumen de pago',
    paymentDescription: 'Detalle de todo el proceso de pagos que tendrás a continuación',
    visualTest: 'Exámen de la vista',
    expiredLicense: 'Multa por licencia vencida',
    delivery: 'Envio a domicilio',
    total: 'Total',
    confirmAndPay: 'Confirmar y proceder al pago'
  },
  payment: {
    title: 'Pago',
    subtitle: 'Ingresa los detalles de tu tarjeta para completar el pago',
    cardNumber: 'Número de tarjeta',
    cardNumberPlaceholder: 'Ingresa tu número de tarjeta',
    cardNumberRequired: 'El número de tarjeta es requerido',
    invalidCardNumber: 'Por favor ingresa un número de tarjeta válido',
    expiryDate: 'Vencimiento',
    expiryDateRequired: 'La fecha de vencimiento es requerida',
    invalidExpiryDate: 'Por favor ingresa una fecha de vencimiento válida (MM/AA)',
    expiredCard: 'Esta tarjeta ha expirado',
    cvv: 'CVV',
    cvvRequired: 'El CVV es requerido',
    invalidCvv: 'Por favor ingresa un CVV válido (3-4 dígitos)',
    cardholderName: 'Nombre del titular',
    cardholderNamePlaceholder: 'Nombre en la tarjeta',
    cardholderNameRequired: 'El nombre del titular es requerido',
    securityNote: 'Tu información de pago está segura y encriptada',
    payNow: 'Pagar Ahora',
    processing: 'Procesando...',
    paymentSuccessTitle: 'Pago Exitoso',
    paymentSuccessMessage: 'Tu proceso de renovación de licencia ha sido completado con éxito.',
    paymentFailedTitle: 'Pago Fallido',
    paymentFailedMessage: 'Hubo un error al procesar tu pago. Por favor intenta de nuevo.',
    ok: 'OK'
  }
}; 