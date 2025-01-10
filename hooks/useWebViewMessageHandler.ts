import { useState, useCallback } from 'react';

const useWebViewMessageHandler = () => {
  const [isDone, setIsDone] = useState(false);

  const handleWebViewMessage = useCallback((event: { nativeEvent: any }) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.success) {
        const relevantElements = message.elements.filter(
          (el: any) => el.text && el.text.includes("You're done!") || el.text && el.text.includes("¡Listo!")
        );

        setIsDone(relevantElements.length > 0);
      } else {
        console.error("Error desde el script:", message.error);
      }
    } catch (error) {
      console.error("Error al procesar el mensaje:", event.nativeEvent.data);
    }
  }, []);

  return { isDone, handleWebViewMessage };
};

export default useWebViewMessageHandler;
