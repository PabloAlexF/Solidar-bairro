import { useEffect } from 'react';

/**
 * Hook para ajustar layout quando teclado virtual aparece em mobile
 * Resolve problema do input sendo encoberto pela barra do navegador
 */
export const useVisualViewport = () => {
  useEffect(() => {
    // Verificar se visualViewport está disponível (mobile browsers)
    if (!window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport;
      const chatRoot = document.querySelector('.sb-chat-root');
      
      if (chatRoot && viewport) {
        // Ajustar altura do chat para viewport visual (exclui teclado)
        chatRoot.style.height = `${viewport.height}px`;
      }
    };

    // Escutar mudanças no viewport (quando teclado abre/fecha)
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    
    // Executar uma vez no mount
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
      
      // Restaurar altura original
      const chatRoot = document.querySelector('.sb-chat-root');
      if (chatRoot) {
        chatRoot.style.height = '';
      }
    };
  }, []);
};
