import { useCallback } from 'react';

const useInjectJavaScript = () => {
  return useCallback(() => {
    return `
      (function() {
        const extractElements = () => {
          const elements = [];
          
          // Seleccionar todos los elementos del DOM
          document.querySelectorAll('*').forEach(el => {
            const elementData = {
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              class: el.className || null,
              name: el.getAttribute('name') || null,
              text: el.innerText || null,
              value: el.value || null,
            };

            // Filtrar elementos que cumplan las condiciones deseadas
            if (elementData.class || elementData.text) {
              elements.push(elementData);
            }
          });

          // Enviar elementos filtrados al WebView
          window.ReactNativeWebView.postMessage(JSON.stringify({
            success: true,
            elements: elements,
          }));
        };

        // Ejecutar la extracción inicial
        extractElements();

        // Configurar observador para detectar cambios en el DOM
        const observer = new MutationObserver(() => {
          extractElements();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        console.log("Script de extracción configurado.");
      })();
    `;
  }, []);
};

export default useInjectJavaScript;
