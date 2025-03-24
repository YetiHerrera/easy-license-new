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
    back: 'Atrás'
  },
  home: {
    emptyState: {
      title: 'Sin Proceso Activo',
      description: 'Actualmente no tienes ningún proceso de licencia activo. Inicia uno nuevo para comenzar tu proceso de renovación.',
      startButton: 'Iniciar Nuevo Proceso'
    },
    withProcess: 'Proceso Activo'
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
  }
}; 