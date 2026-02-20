Instructies voor Claude lokaal: Fix deploy-ploi.sh         
                                                                                                                                                 
  Het bestand deploy-ploi.sh (in de root van de repo) wijst naar de verkeerde directory, PM2 process en port. Het deployt nu naar                
  cms.compassdigital.nl terwijl het voor plastimed01.compassdigital.nl bedoeld is.

  Wat er fout is (huidige staat):

  - Regel 13: cd /home/ploi/cms.compassdigital.nl → moet /home/ploi/plastimed01.compassdigital.nl zijn
  - Regel 47: export PORT=4000 → moet 4001 zijn
  - Regel 51/53: PM2 process cms-compassdigital → moet payload-cms zijn
  - Regel 56: Zelfde: cms-compassdigital → payload-cms
  - Regel 73: Health check op localhost:4000 → moet localhost:4001 zijn

  Gewenste staat:

  #!/bin/bash
  #
  # Ploi Deployment Script voor plastimed01.compassdigital.nl
  # PM2 process: payload-cms | Port: 4001
  #
  set -e

  echo "=== Starting Deployment: plastimed01.compassdigital.nl ==="
  echo "Time: $(date)"

  cd /home/ploi/plastimed01.compassdigital.nl

  git pull origin main

  npm install --legacy-peer-deps --silent

  rm -rf .next
  NODE_OPTIONS="--max-old-space-size=2048" npm run build

  if pm2 describe payload-cms > /dev/null 2>&1; then
    pm2 restart payload-cms --update-env
  else
    pm2 start npm --name payload-cms -- start
  fi

  pm2 save

  sleep 5
  curl -s -o /dev/null -w "Health check: HTTP %{http_code}" http://localhost:4001/
  echo ""
  echo "Deployment complete: $(date)"