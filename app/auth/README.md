# Authentication Screens

This directory contains the authentication screens for the Easy License application:

## Screens

1. **Login Screen** (`login.tsx`): Allows users to sign in with their email and password.

2. **Signup Screen** (`signup.tsx`): Allows users to create a new account by providing:
   - Email
   - Phone number (with country code selection for Guatemala +502 and United States +1)
   - Password

## Implementation Details

### Custom Components

- **PhoneInput**: A custom component that handles phone input with country code selection.
  - Supports Guatemala (+502) and United States (+1) as per requirements.
  - Shows a modal with country selection when tapped.

- **FormInput**: A reusable component for form fields like email and password.
  - Supports password visibility toggle.
  - Handles input validation and error display.

### Internationalization

- All UI text is managed through the i18n system.
- Translations are available in English and Spanish.
- Translation keys are found in `constants/i18n/en.ts` and `constants/i18n/es.ts`.

### Navigation

- Uses Expo Router for navigation between screens.
- The default route (`index.tsx`) redirects to the login screen.
- Navigation between login and signup is handled with `Link` components.

### Validation

- Form validation is performed before submission:
  - Email must be valid format
  - Phone number must be provided
  - Password is required

## TODO

- Connect to actual authentication API
- Implement account recovery flow for forgotten passwords
- Add loading states during authentication processes
- Add persistence of authentication state 