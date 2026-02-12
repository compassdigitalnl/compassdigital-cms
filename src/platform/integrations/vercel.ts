/**
 * Vercel API Integration
 * Deploys client sites to Vercel
 */

interface VercelProject {
  id: string
  name: string
}

interface VercelDeployment {
  id: string
  url: string
  readyState: 'READY' | 'BUILDING' | 'ERROR'
}

/**
 * Create Vercel project and deploy
 */
export async function deployToVercel(data: {
  name: string
  environment: Record<string, string>
  gitRepo?: string
}): Promise<{ url: string; projectId: string; id: string }> {
  const token = process.env.VERCEL_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID
  const gitRepo = data.gitRepo || process.env.GITHUB_REPO

  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  if (!gitRepo) {
    throw new Error('GITHUB_REPO not configured')
  }

  try {
    console.log(`[Vercel] Creating project: ${data.name}`)

    // 1. Create Vercel project
    const createUrl = teamId
      ? `https://api.vercel.com/v10/projects?teamId=${teamId}`
      : 'https://api.vercel.com/v10/projects'

    const projectRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        framework: 'nextjs',
        gitRepository: {
          type: 'github',
          repo: gitRepo,
        },
        buildCommand: 'npm run build',
        devCommand: 'npm run dev',
        installCommand: 'npm install',
        outputDirectory: '.next',
      }),
    })

    if (!projectRes.ok) {
      const error = await projectRes.text()
      throw new Error(`Vercel project creation failed: ${error}`)
    }

    const project: VercelProject = await projectRes.json()
    console.log(`[Vercel] Project created: ${project.id}`)

    // 2. Set environment variables
    console.log(`[Vercel] Setting ${Object.keys(data.environment).length} environment variables`)

    const envUrl = teamId
      ? `https://api.vercel.com/v10/projects/${project.id}/env?teamId=${teamId}`
      : `https://api.vercel.com/v10/projects/${project.id}/env`

    for (const [key, value] of Object.entries(data.environment)) {
      await fetch(envUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          type: 'encrypted',
          target: ['production', 'preview'],
        }),
      })
    }

    console.log(`[Vercel] Environment variables set`)

    // 3. Trigger deployment
    console.log(`[Vercel] Triggering deployment`)

    const deployUrl = teamId
      ? `https://api.vercel.com/v13/deployments?teamId=${teamId}`
      : 'https://api.vercel.com/v13/deployments'

    const deployRes = await fetch(deployUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        project: project.id,
        target: 'production',
        gitSource: {
          type: 'github',
          repo: gitRepo,
          ref: 'main',
        },
      }),
    })

    if (!deployRes.ok) {
      const error = await deployRes.text()
      throw new Error(`Vercel deployment failed: ${error}`)
    }

    const deployment: VercelDeployment = await deployRes.json()
    console.log(`[Vercel] Deployment created: ${deployment.id}`)

    // 4. Wait for deployment to be ready
    const deploymentUrl = `https://${deployment.url}`

    return {
      url: deploymentUrl,
      projectId: project.id,
      id: deployment.id,
    }
  } catch (error: any) {
    console.error('[Vercel] Error deploying:', error)
    throw error
  }
}

/**
 * Add custom domain to Vercel project
 */
export async function addVercelDomain(data: {
  projectId: string
  domain: string
}): Promise<void> {
  const token = process.env.VERCEL_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  try {
    console.log(`[Vercel] Adding domain: ${data.domain}`)

    const url = teamId
      ? `https://api.vercel.com/v10/projects/${data.projectId}/domains?teamId=${teamId}`
      : `https://api.vercel.com/v10/projects/${data.projectId}/domains`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.domain,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to add domain: ${error}`)
    }

    console.log(`[Vercel] Domain added successfully`)
  } catch (error: any) {
    console.error('[Vercel] Error adding domain:', error)
    throw error
  }
}

/**
 * Delete Vercel project
 */
export async function deleteVercelProject(projectId: string): Promise<void> {
  const token = process.env.VERCEL_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  try {
    console.log(`[Vercel] Deleting project: ${projectId}`)

    const url = teamId
      ? `https://api.vercel.com/v10/projects/${projectId}?teamId=${teamId}`
      : `https://api.vercel.com/v10/projects/${projectId}`

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to delete project: ${error}`)
    }

    console.log(`[Vercel] Project deleted successfully`)
  } catch (error: any) {
    console.error('[Vercel] Error deleting project:', error)
    throw error
  }
}

/**
 * Trigger redeployment
 */
export async function redeployVercelProject(projectId: string): Promise<{ id: string; url: string }> {
  const token = process.env.VERCEL_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token) {
    throw new Error('VERCEL_TOKEN not configured')
  }

  try {
    console.log(`[Vercel] Triggering redeploy: ${projectId}`)

    const url = teamId
      ? `https://api.vercel.com/v13/deployments?teamId=${teamId}`
      : 'https://api.vercel.com/v13/deployments'

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project: projectId,
        target: 'production',
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to redeploy: ${error}`)
    }

    const deployment: VercelDeployment = await res.json()

    return {
      id: deployment.id,
      url: `https://${deployment.url}`,
    }
  } catch (error: any) {
    console.error('[Vercel] Error redeploying:', error)
    throw error
  }
}
