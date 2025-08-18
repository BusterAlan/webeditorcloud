'use client';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Login from '../components/Login';
import TextEditor from '../components/TextEditor';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div>
      {currentUser ? <TextEditor /> : <Login />}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
