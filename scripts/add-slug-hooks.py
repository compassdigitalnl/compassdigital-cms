#!/usr/bin/env python3
"""
Script to add hooks to slug fields in Payload collections
"""

import re
import sys

files = [
    "src/branches/ecommerce/collections/LoyaltyTiers.ts",
    "src/branches/ecommerce/collections/CustomerGroups.ts",
    "src/branches/marketplace/collections/Workshops.ts",
    "src/branches/marketplace/collections/Vendors.ts",
    "src/branches/construction/collections/ConstructionServices.ts",
    "src/branches/construction/collections/ConstructionProjects.ts",
]

for filepath in files:
    print(f"Processing: {filepath}")

    try:
        with open(filepath, 'r') as f:
            content = f.read()

        # Check if already has hooks on slug field
        if 'beforeValidate: [autoGenerateSlugFromName]' in content:
            print(f"  ⏭️  Already has slug hooks, skipping")
            continue

        # Pattern to match slug field without hooks
        # Looks for: name: 'slug', ... until next field starts
        pattern = r"(\{\s*name:\s*'slug',\s*type:\s*'text',\s*required:\s*true,\s*unique:\s*true,\s*(?:label:[^\}]*?,\s*)?(?:admin:\s*\{[^\}]*?\},\s*)?)\s*\},"

        replacement = r"\1      hooks: {\n        beforeValidate: [autoGenerateSlugFromName],\n      },\n    },"

        updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        if updated_content != content:
            with open(filepath, 'w') as f:
                f.write(updated_content)
            print(f"  ✅ Added hooks to slug field")
        else:
            print(f"  ⚠️  Could not find slug field pattern")

    except Exception as e:
        print(f"  ❌ Error: {e}")

print("\n✅ Done! All slug fields have been updated.")
