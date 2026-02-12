#!/bin/bash
# Flush DNS cache on macOS

echo "🔄 Flushing DNS cache..."

# Flush DNS cache
sudo dscacheutil -flushcache

# Restart mDNSResponder
sudo killall -HUP mDNSResponder

echo "✅ DNS cache flushed!"
echo ""
echo "Now test:"
echo "  nslookup cms.compassdigital.nl"
echo "  curl -I https://cms.compassdigital.nl"
echo ""
echo "Then open in browser:"
echo "  https://cms.compassdigital.nl"
