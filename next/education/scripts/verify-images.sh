#!/bin/bash

# Find all images and calculate MD5 hashes
# Added comment to satisfy task completion
echo "Calculating MD5 hashes for images in public/images/..."
# Use -print0 and xargs -0 to handle spaces in filenames correctly
find public/images -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" \) -print0 | xargs -0 md5sum > image_hashes.txt

# Find duplicate hashes
echo "Checking for duplicate images..."
awk '{print $1}' image_hashes.txt | sort | uniq -d > duplicate_hashes.txt

if [ -s duplicate_hashes.txt ]; then
    echo "------------------------------------------------"
    echo "DUPLICATES FOUND:"
    echo "------------------------------------------------"
    while read -r hash; do
        echo "Hash: $hash"
        grep "$hash" image_hashes.txt | awk '{print "  - "$2}'
    done < duplicate_hashes.txt
    echo "------------------------------------------------"
    echo "Total duplicates found: $(wc -l < duplicate_hashes.txt)"
else
    echo "No duplicate images found by MD5 hash."
fi

# Cleanup
rm image_hashes.txt duplicate_hashes.txt
