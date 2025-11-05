import os
import json
from pathlib import Path
import shutil

# Brand name mappings (Korean to English)
BRAND_MAPPING = {
    '갤럭시': 'galaxy',
    '갤럭시라이프스타일': 'galaxy-lifestyle',
    '구호': 'kuho',
    '구호플러스': 'kuho-plus',
    '디애퍼처': 'departure',
    '꼼데가르송': 'comme-des-garcons',
    '랙앤본': 'rag-and-bone',
    '로가디스': 'rogatis',
    '르무통': 'le-mouton',
    '메종키츠네': 'maison-kitsune',
    '시에': 'cie',
    '스포티앤리치': 'sporty-and-rich',
    '세인트제임스': 'saint-james',
    '샌드사운드': 'sand-sound',
    '빈폴': 'beanpole',
    '비이커': 'beaker',
    '이세이미야케': 'issey-miyake',
    '이뉴골프': 'inew-golf',
    '에잇세컨즈': 'eight-seconds',
    '에잇세컨드': 'eight-seconds',
    '텐꼬르소꼬모': 'ten-corso-como',
    '코스': 'cos',
    '캐나다구스': 'canada-goose',
    '제너럴 아이디어': 'general-idea',
    '헤라': 'hera',
    '파타고니아': 'patagonia',
    '띠어리': 'theory'
}

def find_all_images(root_path):
    """Find all image files recursively"""
    extensions = ['.png', '.PNG', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
    image_files = []

    for ext in extensions:
        for file_path in Path(root_path).rglob(f'*{ext}'):
            image_files.append(file_path)

    return sorted(image_files)

def create_new_filename(file_path):
    """Create a new systematic English filename"""
    path_parts = file_path.parts
    filename = file_path.name
    stem = file_path.stem
    ext = file_path.suffix

    # Skip if already in English format or is a special file
    if filename in ['favicon.ico', 'google.svg', 'naver.svg', 'logo.svg']:
        return None

    # Handle brand files with Korean names
    if 'brand_' in filename:
        for korean, english in BRAND_MAPPING.items():
            if korean in filename:
                new_name = f'brand_{english}{ext}'
                return new_name

    # Handle standalone brand names in icons folder
    if 'icons' in path_parts:
        for korean, english in BRAND_MAPPING.items():
            if stem == korean:
                new_name = f'brand_{english}{ext}'
                return new_name

    # Handle documentation images
    if 'docs' in path_parts and 'setup' in path_parts:
        # Convert camelCase to kebab-case and lowercase
        if stem == 'featureBranch':
            return 'feature-branch.png'
        elif stem == 'cmdImage01':
            return 'cmd-image-01.png'
        elif stem == 'cmdImage02':
            return 'cmd-image-02.png'
        elif stem == 'pullRequest':
            return 'pull-request.png'
        elif stem == 'myFeatureBranch':
            return 'my-feature-branch.png'

    # Files already in good English format
    if stem.startswith(('main', 'beauty_', 'golf_', 'sport_', 'life_', 'outdoor_')):
        return None

    return None

def main():
    root_path = Path(r'c:\dev\ecommerce-fullstack-app')

    # Find all image files
    print("Finding all image files...")
    all_images = find_all_images(root_path)

    print(f"Found {len(all_images)} image files\n")

    # Create rename mapping
    rename_operations = []

    for img_path in all_images:
        new_filename = create_new_filename(img_path)

        if new_filename:
            new_path = img_path.parent / new_filename
            rename_operations.append({
                'old': str(img_path),
                'new': str(new_path),
                'old_name': img_path.name,
                'new_name': new_filename
            })

    # Display rename plan
    print("=" * 80)
    print("RENAME PLAN")
    print("=" * 80)

    for op in rename_operations:
        print(f"\n{op['old_name']}")
        print(f"  -> {op['new_name']}")
        print(f"  Location: {Path(op['old']).parent}")

    print(f"\n\nTotal files to rename: {len(rename_operations)}")

    # Save rename mapping to JSON
    mapping_file = root_path / 'image_rename_mapping.json'
    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(rename_operations, f, indent=2, ensure_ascii=False)

    print(f"\nRename mapping saved to: {mapping_file}")

    # Perform renames
    print("\n" + "=" * 80)
    print("PERFORMING RENAMES")
    print("=" * 80)

    renamed_count = 0
    for op in rename_operations:
        old_path = Path(op['old'])
        new_path = Path(op['new'])

        if old_path.exists():
            try:
                # Check if target already exists
                if new_path.exists() and old_path != new_path:
                    print(f"WARNING: Target exists, skipping: {new_path.name}")
                    continue

                old_path.rename(new_path)
                print(f"[OK] Renamed: {op['old_name']} -> {op['new_name']}")
                renamed_count += 1
            except Exception as e:
                print(f"[ERROR] Error renaming {op['old_name']}: {e}")
        else:
            print(f"[ERROR] File not found: {old_path}")

    print(f"\n\nSuccessfully renamed {renamed_count} files")

    # Generate summary report
    summary = {
        'total_images_found': len(all_images),
        'files_renamed': renamed_count,
        'timestamp': str(Path.cwd()),
        'categories': {}
    }

    for img in all_images:
        category = 'other'
        if 'brands' in img.parts:
            category = 'brands'
        elif 'icons' in img.parts:
            category = 'icons'
        elif 'beauty' in img.parts:
            category = 'beauty'
        elif 'golf' in img.parts:
            category = 'golf'
        elif 'sport' in img.parts:
            category = 'sport'
        elif 'life' in img.parts:
            category = 'life'
        elif 'outdoor' in img.parts:
            category = 'outdoor'
        elif 'docs' in img.parts:
            category = 'documentation'

        summary['categories'][category] = summary['categories'].get(category, 0) + 1

    summary_file = root_path / 'image_rename_summary.json'
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\nSummary saved to: {summary_file}")

if __name__ == '__main__':
    main()
