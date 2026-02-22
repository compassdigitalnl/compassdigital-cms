import AuthTemplate from '../login/AuthTemplate'

export const metadata = {
  title: 'Registreren | Shop',
  description: 'Maak een account aan',
}

export default function RegisterPage() {
  return <AuthTemplate defaultTab="register" />
}
