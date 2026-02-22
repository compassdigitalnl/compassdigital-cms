import AuthTemplate from './AuthTemplate'

export const metadata = {
  title: 'Inloggen | Shop',
  description: 'Log in op uw account',
}

export default function LoginPage() {
  return <AuthTemplate defaultTab="login" />
}
