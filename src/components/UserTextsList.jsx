// components/UserTextsList.jsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';

export default function UserTextsList() {
  const [userTexts, setUserTexts] = useState([]);
  const { user, loading } = useUser();

  useEffect(() => {
    if (!user) {
      setUserTexts([]);
      return;
    }

    // Crea una consulta: colección 'textos', donde 'authorId' sea igual al UID del usuario
    const q = query(
      collection(db, 'textos'),
      where('authorId', '==', user.uid),
      orderBy('lastUpdated', 'desc') // Ordena por fecha de última actualización
    );

    // onSnapshot: Escucha los cambios en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const texts = snapshot.docs.map(doc => ({
        id: doc.id, // El ID único del documento en Firestore
        ...doc.data()
      }));
      setUserTexts(texts);
    }, (error) => {
      console.error("Error al obtener textos:", error);
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, [user]); // Vuelve a ejecutar si el usuario cambia

  const handleDelete = async (textId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este texto?')) return;
    try {
      await deleteDoc(doc(db, 'textos', textId));
      alert('Texto eliminado!');
    } catch (error) {
      console.error('Error al eliminar el texto:', error);
      alert('Error al eliminar el texto.');
    }
  };

  if (loading) return <div>Cargando tus textos...</div>;
  if (!user) return <div>Inicia sesión para ver tus textos.</div>;
  if (userTexts.length === 0) return <div>No tienes textos guardados aún.</div>;

  return (
    <div>
      <h2>Tus Textos</h2>
      <ul>
        {userTexts.map(text => (
          <li key={text.id}>
            <h3>{text.title}</h3>
            <p>{text.content.substring(0, 100)}...</p> {/* Muestra un extracto */}
            <button onClick={() => console.log('Editar:', text.id)}>Editar</button>
            <button onClick={() => handleDelete(text.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
