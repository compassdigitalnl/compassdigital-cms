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
    throw new Error(
      'RAILWAY_API_KEY not configured in environment variables. ' +
        'Get a new API token from https://railway.app/account/tokens and add it to your .env file.'
    )
  }

  try {
    console.log(`[Railway] Creating project: client-${data.domain}`)
    console.log(`[Railway] Using API key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`)

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

    // Check for authentication errors specifically
    if (projectData.errors) {
      const authError = projectData.errors.find((err: any) =>
        err.message?.toLowerCase().includes('not authorized') ||
        err.message?.toLowerCase().includes('unauthorized') ||
        err.message?.toLowerCase().includes('authentication')
      )

      if (authError) {
        throw new Error(
          'Railway API authentication failed. The RAILWAY_API_KEY is invalid or expired. ' +
            'Please generate a new API token at https://railway.app/account/tokens ' +
            'and update your .env file with the new token.'
        )
      }

      throw new Error(`Railway API error: ${JSON.stringify(projectData.errors)}`)
    }

    const project = projectData.data.projectCreate
    console.log(`[Railway] Project created: ${project.id}`)

    // 2. Create PostgreSQL service using Railway's managed Postgres template
    // Note: Using templateDeploy with Railway's official Postgres template
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
              name: "postgres"
              source: { image: "ghcr.io/railwayapp-templates/postgres-ssl:edge" }
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
      const authError = serviceData.errors.find((err: any) =>
        err.message?.toLowerCase().includes('not authorized') ||
        err.message?.toLowerCase().includes('unauthorized')
      )

      if (authError) {
        throw new Error(
          'Railway API authentication failed during service creation. ' +
            'The RAILWAY_API_KEY is invalid or expired. ' +
            'Please generate a new API token at https://railway.app/account/tokens'
        )
      }

      throw new Error(`Railway service error: ${JSON.stringify(serviceData.errors)}`)
    }

    const service = serviceData.data.serviceCreate
    console.log(`[Railway] PostgreSQL service created: ${service.id}`)

    // 3. Get environment ID for this project (needed for variables query)
    const envRes = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetEnvironments($projectId: String!) {
            project(id: $projectId) {
              environments {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
        variables: { projectId: project.id },
      }),
    })

    const envData = await envRes.json()
    const environments = envData.data?.project?.environments?.edges || []
    const productionEnv = environments.find((e: any) => e.node.name === 'production') || environments[0]
    const environmentId = productionEnv?.node?.id

    if (!environmentId) {
      throw new Error('Could not find Railway environment for database project')
    }

    console.log(`[Railway] Environment ID: ${environmentId}`)

    // 4. Wait for service to initialize and get connection variables
    // Railway's variables query: variables(environmentId, serviceId, projectId)
    const maxAttempts = 10
    let attempt = 0
    let dbUrl: string | null = null

    while (attempt < maxAttempts && !dbUrl) {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      attempt++

      const variablesRes = await fetch('https://backboard.railway.app/graphql/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetVariables($environmentId: String!, $serviceId: String!, $projectId: String!) {
              variables(
                environmentId: $environmentId
                serviceId: $serviceId
                projectId: $projectId
              )
            }
          `,
          variables: {
            environmentId,
            serviceId: service.id,
            projectId: project.id,
          },
        }),
      })

      const variablesData = await variablesRes.json()
      console.log(`[Railway] Variables attempt ${attempt}:`, JSON.stringify(variablesData).substring(0, 200))

      if (variablesData.errors) {
        console.log(`[Railway] Variables query error: ${JSON.stringify(variablesData.errors)}`)
        continue
      }

      const vars = variablesData.data?.variables || {}

      if (vars.PGHOST && vars.PGPASSWORD) {
        // Build connection string from PostgreSQL variables
        dbUrl = `postgresql://${vars.PGUSER || 'postgres'}:${vars.PGPASSWORD}@${vars.PGHOST}:${vars.PGPORT || '5432'}/${vars.PGDATABASE || 'railway'}`
        console.log(`[Railway] Database provisioned successfully (attempt ${attempt})`)
      } else if (vars.DATABASE_URL) {
        // Some templates provide DATABASE_URL directly
        dbUrl = vars.DATABASE_URL
        console.log(`[Railway] Database URL found directly (attempt ${attempt})`)
      }
    }

    if (!dbUrl) {
      // Railway per-project provisioning failed. Fall back to the shared Railway PostgreSQL.
      console.warn('[Railway] Per-project provisioning timed out. Falling back to shared PostgreSQL...')
      return await createSharedDatabase({ name: data.name, domain: data.domain, serviceId: service.id })
    }

    return {
      url: dbUrl,
      id: service.id,
    }
  } catch (error: any) {
    console.error('[Railway] Error provisioning database:', error)

    // If Railway project/service creation fails entirely, try the shared fallback
    const platformUrl = process.env.PLATFORM_DATABASE_URL
    if (platformUrl) {
      console.warn('[Railway] Falling back to shared PostgreSQL after error:', error.message)
      return await createSharedDatabase({ name: data.name, domain: data.domain })
    }

    throw error
  }
}

/**
 * Create a database on the shared Railway PostgreSQL server.
 * Used as fallback when per-project provisioning fails.
 *
 * Requires PLATFORM_DATABASE_URL to point to the shared Railway PostgreSQL instance.
 * The DB name is derived from the client domain: "client_[domain]" (e.g., "client_plastimed01").
 */
async function createSharedDatabase(data: {
  name: string
  domain: string
  serviceId?: string
}): Promise<{ url: string; id: string }> {
  const platformUrl = process.env.PLATFORM_DATABASE_URL

  if (!platformUrl) {
    throw new Error(
      'Railway per-project provisioning failed and PLATFORM_DATABASE_URL is not set as fallback.',
    )
  }

  // Derive safe database name: lowercase, alphanumeric + underscores only
  const dbName = `client_${data.domain.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`

  console.log(`[Railway] Creating database '${dbName}' on shared PostgreSQL server...`)

  // Use Node.js pg module to create the database
  const { Client } = await import('pg')

  // Connect to the shared server (database 'postgres' or 'railway')
  const adminUrl = platformUrl.replace(/\/[^/]*$/, '/postgres')

  const adminClient = new Client({ connectionString: adminUrl })
  await adminClient.connect()

  try {
    // Check if database already exists
    const existing = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    )

    if (existing.rowCount === 0) {
      // CREATE DATABASE cannot be run in a transaction, so use direct query
      await adminClient.query(`CREATE DATABASE "${dbName}"`)
      console.log(`[Railway] Database '${dbName}' created on shared server`)
    } else {
      console.log(`[Railway] Database '${dbName}' already exists on shared server`)
    }
  } finally {
    await adminClient.end()
  }

  // Build connection URL pointing to the new database
  const clientDbUrl = platformUrl.replace(/\/[^/?]*(\?.*)?$/, `/${dbName}$1`)

  return {
    url: clientDbUrl,
    id: data.serviceId || `shared-${dbName}`, // Synthetic ID for shared databases
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
