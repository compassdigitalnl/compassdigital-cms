import { redirect } from 'next/navigation'

/**
 * Legacy route — redirects to /merken/[slug]
 */
export default async function LegacyBrandPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/merken/${slug}`)
}
