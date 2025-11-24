const fs = require('fs')
const path = require('path')

const baseFolder = 'D:\\HANMARINE GLOBAL INDONESIA\\SCANNING CREW\\@VACATION CREW'

function scanDirectory(dir, level = 0) {
  try {
    const items = fs.readdirSync(dir)
    const indent = '  '.repeat(level)
    
    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${item}/`)
        if (level < 3) { // Max 3 levels deep
          scanDirectory(fullPath, level + 1)
        }
      } else {
        console.log(`${indent}📄 ${item}`)
      }
    })
  } catch (error) {
    console.error(`❌ Error scanning ${dir}:`, error.message)
  }
}

console.log('🔍 Scanning folder structure:\n')
console.log(`📁 ${baseFolder}/\n`)

if (fs.existsSync(baseFolder)) {
  scanDirectory(baseFolder)
  console.log('\n✅ Scan complete!')
} else {
  console.log('❌ Folder not found! Please check the path.')
}
