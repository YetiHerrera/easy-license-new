export default {
  onboarding: {
    title: 'Easy License',
    next: 'Next',
    getStarted: 'Get Started',
    steps: {
      one: {
        title: 'Welcome Guatemalan Abroad',
        description: 'Easy License is an application that allows you to manage your licenses and certifications easily and securely.'
      },
      two: {
        title: 'Renew Your Driver\'s License',
        description: 'With a simple and easy interface, you can renew your driver\'s license without complications.'
      },
      three: {
        title: 'From Home',
        description: 'You can complete the driver\'s license renewal process at your own pace and convenience.'
      }
    }
  },
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    phoneNumber: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccount: "Create Account",
    createAccountSubtitle: "Create an account so you can start using Easy License",
    signIn: "Sign In",
    signInSubtitle: "Sign in to access your account and see your process",
    countryCode: "Country Code",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    phoneRequired: "Phone number is required",
    invalidEmail: "Please enter a valid email",
    invalidPhone: "Please enter a valid phone number",
    verifyCode: "Verify Code",
    verifyCodeSubtitle: "Enter the 6-digit code sent to your email",
    verify: "Verify",
    didntReceiveCode: "Didn't receive the code?",
    resendCode: "Resend Code",
    invalidCode: "Please enter a valid 6-digit code",
    verificationFailed: "Verification failed. Please try again.",
    signupFailed: "Signup failed. Please try again.",
    sending: "Sending..."
  },
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    continue: 'Continue',
    confirm: 'Confirm'
  },
  home: {
    emptyState: {
      title: 'No Active Process',
      description: 'You currently don\'t have any active license process. Start a new one to begin your license renewal journey.',
      startButton: 'Start New Process'
    },
    withProcess: 'Active Process'
  },
  userInformation: {
    title: 'Personal Information',
    subtitle: 'To start your license renewal, you need to have the following data and documents at hand',
    documentTypes: {
      identity: 'Identity document',
      currentLicense: 'Current License',
      addressProof: 'Proof of address'
    },
    optional: '(optional)',
    startProcess: 'Start my process',
    requirements: {
      title: 'Requirements',
      description: 'Make sure you have all the necessary documents before continuing'
    }
  },
  documentUpload: {
    title: 'Your Documents',
    subtitle: 'Upload the required documents to continue with your license renewal process',
    uploadButton: 'Upload document',
    uploadInstructions: 'Tap to upload or take a photo',
    documentTypes: {
      identity: 'Identity document',
      currentLicense: 'Current License',
      addressProof: 'Proof of address',
      passport: 'Passport'
    },
    selectOption: 'Select Option',
    captureMethod: 'How would you like to add your document?',
    takePhoto: 'Take Photo',
    chooseFromLibrary: 'Choose from Library',
    error: 'Error',
    captureError: 'There was an error capturing the document. Please try again.',
    cameraError: 'There was an error opening the camera. Please try again.',
    permissionRequired: 'Permission Required',
    cameraPermissionMessage: 'We need access to your camera to take photos of your documents.',
    settings: 'Settings',
    continue: 'Continue',
    tapToChange: 'Tap to change',
    documentTypeSelector: 'Document Type',
    dpi: 'DPI',
    passport: 'Passport',
    bothDocuments: 'Both documents',
    recommended: '(recommended)',
    frontSide: 'Front side',
    backSide: 'Back side',
    dpiFullName: 'Personal Identification Document',
    currentLicenseQuestion: 'Do you have your previous license?',
    delete: 'Delete document',
    submit: 'Submit documents'
  },
  reviewDocuments: {
    title: 'Review Documents',
    subtitle: 'Review your documents before submitting',
    uploadedDocuments: 'Uploaded documents',
    submit: 'Submit documents',
    submitSuccess: 'Documents submitted successfully',
    documentError: 'There was an issue with the document. Please try again.'
  },
  licenseUpload: {
    title: 'Previous License',
    subtitle: 'Upload your previous license to facilitate the renewal process',
    optionalDocument: "This document is optional. If you don't have your previous license, you can continue without it.",
    previousLicense: 'Previous driver\'s license',
    frontSide: 'Front side',
    backSide: 'Back side',
    uploadInstructions: 'Tap to upload or take a photo',
    delete: 'Delete',
    continueWithLicense: 'Continue with license',
    continueWithoutLicense: 'I don\'t have my previous license',
    permissionRequired: 'Permission Required',
    cameraPermissionMessage: 'We need access to your camera to take photos of your license.',
    settings: 'Settings',
    selectOption: 'Select Option',
    captureMethod: 'How would you like to add your license?',
    takePhoto: 'Take Photo',
    chooseFromLibrary: 'Choose from Library',
    error: 'Error',
    captureError: 'There was an error capturing the license. Please try again.',
    cameraError: 'There was an error opening the camera. Please try again.'
  },
  livenessVerification: {
    title: 'Identity Verification',
    subtitle: 'We need to perform a live video verification. Follow the instructions below.',
    instruction1: 'Make sure you are in a well-lit place.',
    instruction2: 'Keep your face within the frame throughout the process.',
    instruction3: 'Follow the movement instructions that will appear on screen.',
    instruction4: 'Make sure you have your identity document visible beside your face during the recording.',
    startVerification: 'Start verification',
    verificationComplete: 'Verification complete',
    verificationFailed: 'Verification failed',
    tryAgain: 'Try again',
    showDocument: 'Please have your identification document visible beside your face during the recording.',
    moveHeadSideToSide: 'Slowly turn your head from side to side during the recording for proper verification.',
    startRecording: 'Start recording',
    finishRecording: 'Finish recording',
    verifyRecording: 'Submit verification',
    verificationSuccessMessage: 'Your identity verification has been sent successfully and will be reviewed by our agents.'
  },
  licenseInformation: {
    title: 'License Information',
    subtitle: 'Please fill in all the required information for your license renewal',
    dpi: 'DPI or Passport',
    dpiOrPassportPlaceholder: 'Enter your DPI (13 digits) or Passport number',
    dpiRequired: 'DPI or Passport is required',
    invalidDpi: 'Please enter a valid DPI (13 digits) or Passport number (8-12 characters)',
    names: 'Names',
    namesPlaceholder: 'Enter your first name(s)',
    lastNames: 'Last Names',
    lastNamesPlaceholder: 'Enter your last name(s)',
    licenseType: 'License Type',
    selectLicenseType: 'Select license type',
    renewalYears: 'Years to Renew',
    selectRenewalYears: 'Select years to renew',
    years: 'years',
    bornDate: 'Date of Birth',
    invalidDate: 'Please enter a valid date of birth',
    ageRestriction: 'You must be at least 18 years old',
    selectDate: 'Select Date',
    year: 'Year',
    month: 'Month',
    day: 'Day'
  },
  licenseDelivery: {
    title: 'Delivery Address',
    subtitle: 'Please provide your US address where you want to receive your license',
    streetAddress: 'Street Address',
    streetAddressPlaceholder: 'Enter your street address',
    streetAddressRequired: 'Street address is required',
    apartment: 'Apartment/Suite',
    apartmentPlaceholder: 'Enter apartment or suite number (optional)',
    city: 'City',
    cityPlaceholder: 'Enter your city',
    cityRequired: 'City is required',
    state: 'State',
    statePlaceholder: 'Enter your state',
    stateRequired: 'State is required',
    zipCode: 'ZIP Code',
    zipCodePlaceholder: 'Enter your ZIP code',
    zipCodeRequired: 'ZIP code is required',
    invalidZipCode: 'Please enter a valid US ZIP code (5 digits or 5+4 format)'
  },
  processType: {
    title: 'Choose Your Process Type',
    subtitle: 'Now select your process, you can process your license renewal or replacement, you can also do both processes at the same time',
    renewal: 'Renewal',
    renewalDescription: 'Renew your license, remember you will need all necessary documents',
    replacement: 'Replacement',
    replacementDescription: 'Replace the license you lost, remember you will need all required documents'
  }
}; 