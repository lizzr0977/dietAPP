'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loginMagic() {
    if (!email.trim()) {
      alert('Pon tu correo');
      return;
    }

    setLoading(true);
    const redirectTo = `${window.location.origin}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);

    if (error) alert(error.message);
    else setSent(true);
  }

  async function createAccount() {
    if (!email.trim()) {
      alert('Pon tu correo');
      return;
    }

    if (!password || password.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Cuenta creada. Si Supabase pide confirmación, revisa tu correo. Si no, ya puedes entrar con contraseña.');
  }

  async function loginPassword() {
    if (!email.trim()) {
      alert('Pon tu correo');
      return;
    }

    if (!password) {
      alert('Pon tu contraseña');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = '/';
  }

  return (
    <main className="shell" style={{ maxWidth: 560 }}>
      <div className="card">
        <h1>🥗 DietApp</h1>

        <p>
          Entra con correo y contraseña para evitar el límite de correos de Supabase.
          También puedes usar magic link si lo prefieres.
        </p>

        <label>Correo</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
        />

        <label>Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="mínimo 6 caracteres"
          type="password"
          autoComplete="current-password"
        />

        <div className="actions">
          <button className="btn" onClick={loginPassword} disabled={loading}>
            Entrar con contraseña
          </button>

          <button className="btn secondary" onClick={createAccount} disabled={loading}>
            Crear cuenta con contraseña
          </button>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '18px 0' }} />

        <p className="muted">
          Magic link manda un correo. Si lo usas muchas veces, Supabase puede bloquear temporalmente el envío.
        </p>

        <button className="btn outline" style={{ width: '100%' }} onClick={loginMagic} disabled={loading}>
          Enviar magic link
        </button>

        {sent && (
          <p className="notice">
            Revisa tu correo. Abre el enlace más nuevo desde este mismo navegador.
          </p>
        )}
      </div>
    </main>
  );
}
