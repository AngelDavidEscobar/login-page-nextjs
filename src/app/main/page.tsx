'use server';

import LogoutButton from "../components/LogoutButton";



export default async function MainPage() {
    
  return (
    <div>
      <h1>Bienvenido a Aportes Linea</h1>
      <LogoutButton />
    </div>
  );
}