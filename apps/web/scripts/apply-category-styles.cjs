#!/usr/bin/env node
/**
 * Batch update cards with category styling
 * Adds CATEGORY_STYLES import and applies to card headers
 */

const fs = require('fs');
const path = require('path');

// Category mapping based on folder names
const CATEGORY_MAP = {
  'value': 'value',
  'growth': 'growth',
  'risk': 'risk',
  'cashflow': 'cashflow',
  'income': 'income',
  'macro': 'macro',
  'technical': 'technical',
  'portfolio': 'portfolio',
  'screener': 'screener',
  'mini': 'mini',
  'commodities': 'commodities',
  'derivatives': 'derivatives',
  'mutual-funds': 'mutual-funds',
  'overview': 'overview',
};

// Cards already updated (skip these)
const SKIP_CARDS = [
  'financial-stress-radar',
  'valuation-summary', 
  'growth-summary',
];

function processCard(filePath, category) {
  const cardName = path.basename(path.dirname(filePath));
  
  if (SKIP_CARDS.includes(cardName)) {
    console.log(`  ⏭️  Skipping ${cardName} (already updated)`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has CATEGORY_STYLES
  if (content.includes('CATEGORY_STYLES')) {
    console.log(`  ⏭️  Skipping ${cardName} (already has category styles)`);
    return false;
  }
  
  // Add import for CATEGORY_STYLES if not present
  const chartThemeImport = `import { CATEGORY_STYLES } from "@/lib/chartTheme";`;
  
  // Find a good place to add the import (after other imports)
  if (!content.includes(chartThemeImport)) {
    // Add after card-output import or last import
    const importPattern = /from "@\/types\/card-output";/;
    if (content.match(importPattern)) {
      content = content.replace(
        importPattern,
        `from "@/types/card-output";\n\n${chartThemeImport}`
      );
    } else {
      // Add after react import as fallback
      content = content.replace(
        /import React from "react";/,
        `import React from "react";\n${chartThemeImport}`
      );
    }
  }
  
  // Add categoryStyle constant in the component
  const categoryId = CATEGORY_MAP[category] || 'overview';
  const categoryStyleLine = `const categoryStyle = CATEGORY_STYLES['${categoryId}'];`;
  
  // Find the main export function and add categoryStyle
  const funcPattern = /export default function \w+\([^)]*\)\s*{/;
  const match = content.match(funcPattern);
  if (match && !content.includes('categoryStyle = CATEGORY_STYLES')) {
    content = content.replace(
      match[0],
      `${match[0]}\n  ${categoryStyleLine}\n`
    );
  }
  
  // Update Card wrapper to include category border
  // Simple pattern: Add border styling to Card if not already present
  if (content.includes('<Card>') && !content.includes('border-l-4') && !content.includes('overflow-hidden')) {
    content = content.replace(
      /<Card>/g,
      '<Card className="overflow-hidden">'
    );
  }
  
  // Update CardHeader to include category background
  // Pattern: <CardHeader> -> <CardHeader className={categoryStyle.headerBg}>
  if (content.includes('<CardHeader>') && !content.includes('categoryStyle.headerBg')) {
    content = content.replace(
      /<CardHeader>/g,
      '<CardHeader className={categoryStyle.headerBg}>'
    );
  }
  
  // Update CardTitle to include category icon
  // This is trickier - look for CardTitle patterns
  const titlePatterns = [
    // Simple: <CardTitle>Title</CardTitle>
    /<CardTitle>([^<]+)<\/CardTitle>/g,
    // With className: <CardTitle className="...">Title</CardTitle>
    /<CardTitle className="([^"]+)">([^<]+)<\/CardTitle>/g,
  ];
  
  // Only add icon if not already has emoji in title
  if (!content.match(/<CardTitle[^>]*>\s*<span[^>]*>{categoryStyle\.icon}/)) {
    // Add icon to first CardTitle found
    const simpleTitle = /<CardTitle>([A-Za-z\s]+)<\/CardTitle>/;
    const simpleMatch = content.match(simpleTitle);
    if (simpleMatch && !simpleMatch[1].match(/[^\w\s]/)) {
      content = content.replace(
        simpleTitle,
        `<CardTitle className="flex items-center gap-2">\n              <span className="text-lg">{categoryStyle.icon}</span>\n              $1\n            </CardTitle>`
      );
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Updated ${cardName}`);
  return true;
}

function main() {
  const cardsDir = path.join(__dirname, '..', 'src', 'cards');
  let updated = 0;
  let skipped = 0;
  
  // Get all category folders
  const categories = fs.readdirSync(cardsDir).filter(f => {
    const stat = fs.statSync(path.join(cardsDir, f));
    return stat.isDirectory() && !f.startsWith('.');
  });
  
  console.log(`\n🎨 Applying category styles to ${categories.length} categories...\n`);
  
  for (const category of categories) {
    const categoryPath = path.join(cardsDir, category);
    console.log(`\n📁 ${category.toUpperCase()}`);
    
    // Get all card folders in this category
    const cards = fs.readdirSync(categoryPath).filter(f => {
      const stat = fs.statSync(path.join(categoryPath, f));
      return stat.isDirectory();
    });
    
    for (const card of cards) {
      const indexPath = path.join(categoryPath, card, 'index.tsx');
      if (fs.existsSync(indexPath)) {
        try {
          if (processCard(indexPath, category)) {
            updated++;
          } else {
            skipped++;
          }
        } catch (err) {
          console.log(`  ❌ Error processing ${card}: ${err.message}`);
        }
      }
    }
  }
  
  console.log(`\n✨ Done! Updated ${updated} cards, skipped ${skipped}\n`);
}

main();
