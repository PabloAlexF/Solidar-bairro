# Onboarding "Não mostrar novamente" Fix

## Task
Make the "Não mostrar novamente" button work in the onboarding modal.

## Requirements
- Onboarding modal should appear every time user loads the landing page
- Only if user checks "Não mostrar novamente" should it not appear again

## Analysis
- The Onboarding component has a checkbox for "Não mostrar novamente" that sets `dontShowAgain` state
- This state is passed to `onComplete` and `onSkip` callbacks when user finishes or skips onboarding
- The `useOnboarding` hook manages showing/hiding onboarding based on localStorage

## Changes Made
- [x] Fixed `useOnboarding` hook to properly check localStorage on initialization
- [x] Now reads 'solidar-bairro-onboarding-dont-show' from localStorage to determine if onboarding should be shown
- [x] When user checks "Não mostrar novamente" and completes/skips, it saves 'true' to localStorage
- [x] Onboarding shows by default for all users, unless they previously opted out
- [x] Fixed logic issue where onboarding wasn't showing at all

## Files Modified
- `Frontend/src/hooks/useOnboarding.js` - Fixed localStorage checking logic and renamed key

## How It Works
1. **Default behavior**: Onboarding modal appears on every landing page load
2. **Opt-out**: Only when user checks "Não mostrar novamente" and completes/skips does it save preference
3. **Persistence**: Once opted out, modal won't show again until localStorage is cleared

## Testing
- Checkbox state is properly managed in Onboarding component
- localStorage is correctly set when dontShowAgain is true
- Onboarding shows by default for all users
- Onboarding is permanently hidden only after user explicitly opts out
