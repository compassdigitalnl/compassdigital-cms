#!/usr/bin/env python3
"""
Script to add auto-slug to packages/modules collections
"""

import re

files = [
    "packages/modules/core/collections/Pages.ts",
    "packages/modules/catalog/collections/ProductCategories.ts",
    "packages/modules/catalog/collections/Products.ts",
    "packages/modules/catalog/collections/ProductCollections.ts",
    "packages/modules/accounts/collections/CustomerGroups.ts",
]

for filepath in files:
    print(f"Processing: {filepath}")

    try:
        with open(filepath, 'r') as f:
            content = f.read()

        # Check if already has import
        if 'autoGenerateSlug' in content:
            print(f"  ⏭️  Already has auto-slug import, skipping")
            continue

        # Determine which function to use based on file
        if 'Pages.ts' in filepath or 'Products.ts' in filepath:
            import_func = 'autoGenerateSlug'
        else:
            import_func = 'autoGenerateSlugFromName'

        # Add import after 'payload' import
        if "import type { CollectionConfig } from 'payload'" in content:
            content = content.replace(
                "import type { CollectionConfig } from 'payload'",
                f"import type {{ CollectionConfig }} from 'payload'\nimport {{ {import_func} }} from '@/utilities/slugify'"
            )
            print(f"  ✅ Added {import_func} import")
        else:
            print(f"  ⚠️  Could not find import location")
            continue

        # Add hooks to slug field
        # Match slug field and add hooks
        pattern = r"(\{\s+name:\s*'slug',\s+type:\s*'text',\s+required:\s*true,\s+unique:\s*true,(?:[^\}]*?admin:\s*\{[^\}]*?\},)?)\s*\},"

        replacement = rf"\1\n        hooks: {{\n          beforeValidate: [{import_func}],\n        }},\n      }},"

        updated_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        if updated_content != content:
            with open(filepath, 'w') as f:
                f.write(updated_content)
            print(f"  ✅ Added hooks to slug field")
        else:
            # Try simpler pattern
            with open(filepath, 'w') as f:
                f.write(content)  # At least save the import
            print(f"  ⚠️  Could not auto-add hooks (will need manual update)")

    except Exception as e:
        print(f"  ❌ Error: {e}")

print("\n✅ Done!")
