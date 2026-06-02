'use client';
import {useState} from 'react'; import {supabase} from '@/lib/supabase';
export default function Login(){const[email,setEmail]=useState('');const[sent,setSent]=useState(false);
async function go(){const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}}); if(error) alert(error.message); else setSent(true);}
return <main className="shell" style={{maxWidth:520}}><div className="card"><h1>🥗 DietApp</h1><p>Entra con magic link. La sesión queda guardada en este navegador.</p><label>Correo</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"/><button className="btn" style={{width:'100%',marginTop:14}} onClick={go}>Enviar enlace</button>{sent&&<p className="notice">Revisa tu correo y abre el enlace.</p>}</div></main>}
