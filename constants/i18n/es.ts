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
    confirm: 'Confirmar',
    goBack: 'Regresar'
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
      documentVerification: 'Verificación de Documentos',
      transitVerification: 'Verificación del Departamento de Tránsito',
      visualTestDescription: 'Realiza tu examen visual para proceder con el siguiente paso',
      documentVerificationDescription: 'Sube tus documentos para verificación',
      transitVerificationDescription: 'Este proceso es automatizado por el Departamento de Tránsito',
      helpText: 'Toque cualquier paso para ver detalles y estado',
      stepLocked: 'Completa el paso anterior para desbloquear',
      stepAvailable: 'Disponible ahora',
      stepCompleted: 'Paso completado',
      sequentialCompletion: 'Los pasos deben completarse en orden'
    },
    error: {
      notFound: 'Proceso no encontrado'
    },
    referenceNumber: 'Número de Referencia del Proceso',
    visualTest: {
      description: 'Completarás tres pruebas visuales directamente en tu teléfono. Asegúrate de estar en una habitación bien iluminada y coloca tu teléfono a la distancia del brazo extendido para obtener resultados precisos.',
      beforeBegin: 'Antes de Comenzar',
      holdPhone: 'Mantén tu teléfono a la distancia del brazo extendido',
      wellLit: 'Asegúrate de estar en un entorno bien iluminado',
      wearGlasses: 'Usa tus lentes recetados si normalmente los utilizas',
      threeTests: 'Las Tres Pruebas',
      colorblind: {
        title: 'Prueba de Daltonismo',
        description: 'Se te mostrarán varias imágenes con patrones. Identifica los números o formas ocultas dentro de los patrones para evaluar tu visión de colores.',
        instructions: 'Mira la imagen a continuación e ingresa el número que puedes ver en el patrón.',
        question: '¿Qué número ves en la imagen?',
        inputPlaceholder: 'Ingresar número',
        results: 'Resultados de la Prueba de Daltonismo',
        passTitle: '¡Buen trabajo!',
        passDescription: 'Has pasado la prueba de daltonismo. Tu visión de colores parece ser normal.',
        failTitle: 'Problemas de visión de colores detectados',
        failDescription: 'Es posible que tengas algún tipo de deficiencia en la visión de colores. Esto es común y afecta aproximadamente al 8% de los hombres y al 0.5% de las mujeres.'
      },
      depthPerception: {
        title: 'Prueba de Percepción de Profundidad',
        description: 'Identifica qué objetos aparecen más cerca o más lejos en una serie de imágenes para evaluar tus habilidades de percepción de profundidad.',
        instructions: 'Mira las imágenes a continuación y toca la que te parezca más cercana a ti.',
        question: 'Selecciona la letra que te parece más cercana:',
        results: 'Resultados de la Prueba de Percepción de Profundidad',
        passTitle: '¡Buena percepción de profundidad!',
        passDescription: 'Has pasado la prueba de percepción de profundidad. Tu capacidad para percibir la profundidad parece ser normal.',
        failTitle: 'Problemas de percepción de profundidad detectados',
        failDescription: 'Es posible que tengas alguna dificultad con la percepción de profundidad. Esto podría afectar tu capacidad para juzgar distancias mientras conduces.',
        tip: "Intenta sostener tu teléfono a la distancia del brazo extendido y enfócate en el centro de cada imagen. Una imagen debería \"sobresalir\" o parecer más cercana que la otra.",
        cueText: "Ejemplo de indicación visual:",
        closerLabel: "Más cerca",
        furtherLabel: "Más lejos",
        questions: {
          letters: 'Selecciona la letra que te parece más cercana:',
          numbers: '¿Qué número parece flotar sobre la pantalla?',
          symbols: 'Selecciona el símbolo que te parece más cercano:'
        }
      },
      myopia: {
        title: 'Prueba de Miopía',
        description: 'Lee letras de tamaño decreciente para determinar tu agudeza visual y verificar si tienes miopía.',
        instructions: 'Lee la letra a continuación y escribe lo que ves. Si no puedes ver la letra, puedes omitirla y pasar a la siguiente.',
        whatLetterQuestion: '¿Qué letra ves?',
        enterLetterPlaceholder: 'Ingresa la letra',
        emptyAnswer: 'No se proporcionó respuesta',
        enterLetter: 'Por favor ingresa la letra que ves o omite si no puedes verla.',
        results: 'Resultados de la Prueba de Miopía',
        passTitle: '¡Buena agudeza visual!',
        passDescription: 'Has pasado la prueba de miopía. Tu agudeza visual parece estar en el rango normal.',
        failTitle: 'Problemas de agudeza visual detectados',
        failDescription: 'Es posible que tengas dificultad para ver objetos a distancia. Esto es común y puede corregirse con gafas o lentes de contacto.'
      },
      startTests: 'Iniciar Pruebas',
      testsCompleted: 'Pruebas Completadas',
      next: 'Siguiente',
      finish: 'Finalizar',
      skip: 'Omitir',
      skipTitle: '¿Omitir esta pregunta?',
      skipConfirmation: '¿Estás seguro de que deseas omitir esta pregunta? Se marcará como incorrecta.',
      completed: 'Completado',
      nextTest: 'Siguiente Prueba',
      completedDescription: 'Has completado todas las pruebas visuales. Aquí están tus resultados:',
      testResults: 'Resumen de Resultados',
      testsPassed: '{{passed}} de {{total}} pruebas aprobadas',
      allTestsCompleted: 'Todas las pruebas visuales han sido completadas',
      cannotRetake: 'No puedes volver a realizar las pruebas una vez completadas',
      underReview: 'En Revisión',
      reviewNote: 'Tus resultados de las pruebas están siendo revisados por nuestro equipo. Te notificaremos si se requieren pasos adicionales.',
      testSummary: {
        colorblind: 'Prueba de Visión de Color',
        depthPerception: 'Prueba de Percepción de Profundidad',
        myopia: 'Prueba de Agudeza Visual',
        passed: 'Aprobado',
        failed: 'No Aprobado',
        skipped: 'Omitido'
      }
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
