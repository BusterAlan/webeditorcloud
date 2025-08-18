'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../util/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function TextEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentDocId, setCurrentDocId] = useState(null);
  const [userTexts, setUserTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { currentUser, logout } = useAuth();

  // Cargar textos del usuario al inicio
  useEffect(() => {
    if (currentUser) {
      loadUserTexts();
    }
  }, [currentUser]);

  const loadUserTexts = async () => {
    try {
      const textsRef = collection(db, 'texts');
      const q = query(textsRef, where('authorId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const texts = [];
      querySnapshot.forEach((doc) => {
        texts.push({ id: doc.id, ...doc.data() });
      });
      
      setUserTexts(texts);
    } catch (error) {
      console.error('Error al cargar textos:', error);
    }
  };

  const handleSaveText = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para guardar un texto.');
      return;
    }
    if (!title || !content) {
      alert('El título y el contenido no pueden estar vacíos.');
      return;
    }

    setLoading(true);
    try {
      if (currentDocId) {
        // Actualizar documento existente
        const docRef = doc(db, 'texts', currentDocId);
        await updateDoc(docRef, {
          title: title,
          content: content,
          lastUpdated: serverTimestamp(),
        });
        alert('Texto actualizado exitosamente!');
      } else {
        // Crear nuevo documento
        const textsCollection = collection(db, 'texts');
        const docRef = await addDoc(textsCollection, {
          title: title,
          content: content,
          authorId: currentUser.uid,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        });
        setCurrentDocId(docRef.id);
        alert('Texto guardado exitosamente!');
      }
      
      // Recargar la lista de textos
      await loadUserTexts();
    } catch (error) {
      console.error('Error al guardar el texto:', error);
      alert('Error al guardar el texto. Inténtalo de nuevo.');
    }
    setLoading(false);
  };

  const handleNewText = () => {
    setTitle('');
    setContent('');
    setCurrentDocId(null);
  };

  const handleLoadText = (text) => {
    setTitle(text.title);
    setContent(text.content);
    setCurrentDocId(text.id);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!currentUser) {
    return null; // El componente Login se mostrará en su lugar
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px'
      }}>
        <h1>Editor de Texto Cloud</h1>
        <div>
          <span style={{ marginRight: '15px' }}>
            Bienvenido, {currentUser.email}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Panel izquierdo - Lista de textos */}
        <div style={{ width: '300px' }}>
          <div style={{ marginBottom: '15px' }}>
            <button 
              onClick={handleNewText}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Nuevo Texto
            </button>
          </div>

          <h3>Mis Textos</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {userTexts.map((text) => (
              <div 
                key={text.id}
                onClick={() => handleLoadText(text)}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: currentDocId === text.id ? '#e3f2fd' : 'white'
                }}
              >
                <strong>{text.title}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {text.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Fecha no disponible'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho - Editor */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Título del texto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '18px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <textarea
            placeholder="Escribe tu texto aquí..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              padding: '15px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
              fontFamily: 'monospace'
            }}
          />

          <div style={{ marginTop: '15px' }}>
            <button 
              onClick={handleSaveText}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Guardando...' : (currentDocId ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
