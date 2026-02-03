# TODO: Fix Authentication State Issue

## Tasks
- [x] Fix AuthContext to clear localStorage on initialization
- [x] Remove stored user data check from LandingHeader admin detection
- [x] Add login/register buttons for unauthenticated users on desktop
- [x] Test authentication state on site entry

## Status
- [x] Identified the real issue: User appears logged in ("vizinho") when not authenticated
- [x] Fixed AuthContext to clear localStorage on app initialization
- [x] Removed stored user data fallback in LandingHeader admin check
- [x] Added login/register buttons for unauthenticated users on desktop
- [x] User should now see proper unauthenticated state on site entry
