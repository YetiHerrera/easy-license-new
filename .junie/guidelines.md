# EasyLicence Project Overview

## Introduction
EasyLicence is a mobile application built with Expo/React Native that streamlines the process of obtaining and managing driver's licenses. The application provides a user-friendly interface for users to complete various steps in the licensing process, including document uploads, identity verification, and visual tests.

## Project Structure
- **app/(authenticated)**: Contains authenticated user flows and screens
  - **home.tsx**: Main dashboard for users
  - **document-upload**: Document upload functionality
  - **license-upload**: License upload functionality
  - **liveness-verification**: User identity verification through liveness checks
  - **process-steps**: Various steps in the licensing process
  - **user-information**: User profile and information management
  - **visual-test**: Vision testing functionality

- **components**: Reusable UI components
- **constants**: Application constants including internationalization (i18n)
- **contexts**: React contexts for state management
- **hooks**: Custom React hooks
- **types**: TypeScript type definitions

## Key Features
1. **User Authentication**: Secure login and registration system
2. **Document Management**: Upload and manage required documents
3. **Identity Verification**: Liveness verification to confirm user identity
4. **Visual Testing**: Tools for conducting vision tests required for licensing
5. **Multi-language Support**: Internationalization with English and Spanish support
6. **Step-by-step Process**: Guided workflow for completing license requirements

## Development Guidelines
1. Follow the existing project structure when adding new features
2. Maintain internationalization support for all user-facing text
3. Ensure responsive design for various device sizes
4. Write clean, maintainable code with appropriate comments
5. Test thoroughly on both iOS and Android platforms

## Getting Started
1. Install dependencies: `npm install`
2. Start the app: `npx expo start`
3. Use Android emulator, iOS simulator, or Expo Go for development testing

## Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)