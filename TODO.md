# TODO: Add Conditional Navigation Links to Desktop Header

## Steps to Complete

1. **Read Full SharedHeader.jsx**: Obtain the complete file content to identify the JSX return structure and where to insert the navigation links.

2. **Edit SharedHeader.jsx**: Add conditional navigation links based on currentPage prop.
   - For currentPage === 'landing': Add links to "Quero Ajudar", "Achados e Perdidos", "Preciso de Ajuda".
   - For currentPage === 'quero-ajudar': Add links to "Preciso de Ajuda", "Perfil", "Conversas".
   - Use Link components from react-router-dom.
   - Place the nav element in the appropriate location within the header (e.g., after the logo).

3. **Verify Changes**: Ensure the navigation renders correctly and links work as expected on the respective pages.

4. **Update Dependent Pages**: If necessary, ensure pages pass the correct currentPage prop to SharedHeader (e.g., Dashboard passes 'landing', QueroAjudar passes 'quero-ajudar').

## Progress
- [ ] Step 1: Read Full SharedHeader.jsx
- [ ] Step 2: Edit SharedHeader.jsx
- [ ] Step 3: Verify Changes
- [ ] Step 4: Update Dependent Pages (if needed)
