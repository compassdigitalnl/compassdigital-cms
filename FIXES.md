Fix: DATABASE_URL mismatch bij PM2 client deployments                                                                                          
                                                                                                                                                 
  Probleem                                                                                                                                       
                                                                                                                                                 
  In /home/ploi/cms.compassdigital.nl/src/lib/provisioning/adapters/PloiAdapter.ts, genereert generateDeploymentScript() een deploy script dat
  alleen PORT exporteert naar PM2. De DATABASE_URL wordt niet expliciet geëxporteerd, waardoor PM2 de waarde van de parent shell erft (de        
  platform database railway) in plaats van de tenant database uit .env.                                                                          

  Wat moet er aangepast worden

  File: src/lib/provisioning/adapters/PloiAdapter.ts

  In de methode generateDeploymentScript(), voeg voor de pm2 restart/start commando's het volgende toe:

  # Load and export all environment variables from .env
  set -a
  [ -f .env ] && source .env
  set +a

  Dit zorgt ervoor dat alle variabelen uit .env (inclusief DATABASE_URL) als environment variabelen worden geëxporteerd, zodat pm2 restart
  --update-env ze correct oppikt.

  Verificatie

  Na de fix zou een nieuw geprovisioned client site (bijv. client01.compassdigital.nl) automatisch de juiste DATABASE_URL moeten gebruiken.
  Controleerbaar met:
  pm2 env <process-id> | grep DATABASE_URL

  ---
  Dat is de enige codewijziging die nodig is. De .env file wordt al correct gegenereerd door ProvisioningService.buildEnvironmentVariables() —
  het probleem zit puur in het deploy script dat de .env niet sourced voor PM2.