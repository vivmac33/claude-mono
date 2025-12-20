const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, '..', 'src', 'cards');

// Recursively find all index.tsx files
function findCardFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findCardFiles(fullPath));
    } else if (entry.name === 'index.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

const cardFiles = findCardFiles(cardsDir);
let updatedCount = 0;

for (const file of cardFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Skip if already has proper border-l-4 styling
  if (content.includes('border-l-4') && content.includes('borderLeftColor')) {
    console.log(`✓ Already styled: ${path.relative(cardsDir, file)}`);
    continue;
  }
  
  // Get category from file path
  const relativePath = path.relative(cardsDir, file);
  const category = relativePath.split(path.sep)[0];
  
  // Pattern 1: <Card className="overflow-hidden">
  content = content.replace(
    /<Card className="overflow-hidden">/g,
    '<Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>'
  );
  
  // Pattern 2: <Card className={`overflow-hidden`}>
  content = content.replace(
    /<Card className={\`overflow-hidden\`}>/g,
    '<Card className="overflow-hidden border-l-4" style={{ borderLeftColor: categoryStyle.accent }}>'
  );
  
  // Pattern 3: <Card className="p-3"> (mini cards)
  content = content.replace(
    /<Card className="p-3">/g,
    '<Card className="p-3 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || \'#6366f1\' }}>'
  );
  
  // Pattern 4: <Card className="p-4">
  content = content.replace(
    /<Card className="p-4">/g,
    '<Card className="p-4 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || \'#6366f1\' }}>'
  );
  
  // Pattern 5: <Card className="p-5">
  content = content.replace(
    /<Card className="p-5">/g,
    '<Card className="p-5 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || \'#6366f1\' }}>'
  );
  
  // Pattern 6: <Card className="p-6">
  content = content.replace(
    /<Card className="p-6">/g,
    '<Card className="p-6 border-l-4" style={{ borderLeftColor: categoryStyle?.accent || \'#6366f1\' }}>'
  );
  
  // Pattern 7: Already has border-l-4 but no borderLeftColor style
  if (content.includes('border-l-4') && !content.includes('borderLeftColor')) {
    content = content.replace(
      /<Card className="([^"]*border-l-4[^"]*)">/g,
      '<Card className="$1" style={{ borderLeftColor: categoryStyle?.accent || \'#6366f1\' }}>'
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`✓ Updated: ${path.relative(cardsDir, file)}`);
    updatedCount++;
  } else {
    console.log(`- Skipped (manual check needed): ${path.relative(cardsDir, file)}`);
  }
}

console.log(`\nUpdated ${updatedCount} files`);

