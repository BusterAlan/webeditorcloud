// Función de ejemplo para actualizar (podrías pasarla a tu editor)
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const updateText = async (textId, newContent, newTitle) => {
  try {
    const textRef = doc(db, 'textos', textId); // Obtén la referencia al documento por su ID
    await updateDoc(textRef, {
      title: newTitle,
      content: newContent,
      lastUpdated: serverTimestamp() // Actualiza la marca de tiempo
    });
    console.log('Texto actualizado con éxito!');
  } catch (error) {
    console.error('Error al actualizar el texto:', error);
    throw error; // Propaga el error si es necesario
  }
};
