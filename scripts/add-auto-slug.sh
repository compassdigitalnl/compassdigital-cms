#!/bin/bash

# Script to add auto-slug generation to collections
# Updates all collections that have slug fields but no hooks

set -e

COLLECTIONS=(
  "src/branches/ecommerce/collections/LoyaltyTiers.ts"
  "src/branches/ecommerce/collections/CustomerGroups.ts"
  "src/branches/marketplace/collections/Workshops.ts"
  "src/branches/marketplace/collections/Vendors.ts"
  "src/branches/construction/collections/ConstructionServices.ts"
  "src/branches/construction/collections/ConstructionProjects.ts"
)

for file in "${COLLECTIONS[@]}"; do
  echo "Processing: $file"

  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "  ❌ File not found, skipping"
    continue
  fi

  # Check if already has autoGenerateSlugFromName import
  if grep -q "autoGenerateSlugFromName" "$file"; then
    echo "  ⏭️  Already has auto-slug, skipping"
    continue
  fi

  # Add import statement after the shouldHideCollection import
  sed -i '' '/shouldHideCollection/a\
import { autoGenerateSlugFromName } from '\''@/utilities/slugify'\''
' "$file"

  echo "  ✅ Added import"
done

echo ""
echo "✅ Done! All collections have been updated."
echo ""
echo "Note: You still need to manually add hooks to the slug fields."
echo "Add this to each slug field:"
echo ""
echo "      hooks: {"
echo "        beforeValidate: [autoGenerateSlugFromName],"
echo "      },"
