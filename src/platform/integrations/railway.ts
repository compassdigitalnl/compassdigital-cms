/**
 * Railway API Integration
 * Provisions PostgreSQL databases for clients
 */

interface RailwayProject {
  id: string
  name: string
}

interface RailwayService {
  id: string
  connectionString: string
  host: string
  port: number
  database: string
  user: string
  password: string
}

/**
 * Create Railway project and PostgreSQL database
 */
export async function createRailwayDatabase(data: {
  name: string
  domain: string
}): Promise<{ url: string; id: string }> {
  const apiKey = process.env.RAILWAY_API_KEY

  if (!apiKey) {
    throw new Error('RAILWAY_API_KEY not configured')
  }

  try {
    console.log(`[Railway] Creating project: client-${data.domain}`)

    // 1. Create project
    const projectRes = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateProject($name: String!) {
            projectCreate(input: { name: $name }) {
              id
              name
            }
          }
        `,
        variables: {
          name: `client-${data.domain}`,
        },
      }),
    })

    const projectData = await projectRes.json()

    if (projectData.errors) {
      throw new Error(`Railway API error: ${JSON.stringify(projectData.errors)}`)
    }

    const project = projectData.data.projectCreate
    console.log(`[Railway] Project created: ${project.id}`)

    // 2. Create PostgreSQL service
    const serviceRes = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateService($projectId: String!) {
            serviceCreate(input: {
              projectId: $projectId
              source: { image: "postgres:16-alpine" }
            }) {
              id
            }
          }
        `,
        variables: {
          projectId: project.id,
        },
      }),
    })

    const serviceData = await serviceRes.json()

    if (serviceData.errors) {
      throw new Error(`Railway service error: ${JSON.stringify(serviceData.errors)}`)
    }

    const service = serviceData.data.serviceCreate
    console.log(`[Railway] PostgreSQL service created: ${service.id}`)

    // 3. Get connection string (wait a bit for service to initialize)
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const connectionRes = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ServiceDetails($serviceId: String!) {
            service(id: $serviceId) {
              id
              variables
            }
          }
        `,
        variables: {
          serviceId: service.id,
        },
      }),
    })

    const connectionData = await connectionRes.json()
    const variables = connectionData.data.service.variables

    // Build connection string from variables
    const dbUrl = `postgresql://${variables.PGUSER}:${variables.PGPASSWORD}@${variables.PGHOST}:${variables.PGPORT}/${variables.PGDATABASE}`

    console.log(`[Railway] Database provisioned successfully`)

    return {
      url: dbUrl,
      id: service.id,
    }
  } catch (error: any) {
    console.error('[Railway] Error provisioning database:', error)
    throw error
  }
}

/**
 * Delete Railway database
 */
export async function deleteRailwayDatabase(serviceId: string): Promise<void> {
  const apiKey = process.env.RAILWAY_API_KEY

  if (!apiKey) {
    throw new Error('RAILWAY_API_KEY not configured')
  }

  try {
    console.log(`[Railway] Deleting service: ${serviceId}`)

    await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteService($serviceId: String!) {
            serviceDelete(id: $serviceId)
          }
        `,
        variables: {
          serviceId,
        },
      }),
    })

    console.log(`[Railway] Service deleted successfully`)
  } catch (error: any) {
    console.error('[Railway] Error deleting database:', error)
    throw error
  }
}
