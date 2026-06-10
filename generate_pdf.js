const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to install a module dynamically if not present
function ensureModuleInstalled(moduleName) {
  try {
    require.resolve(moduleName);
  } catch (err) {
    console.log(`Installing ${moduleName} for PDF generation...`);
    execSync(`npm install ${moduleName}`, { stdio: 'inherit' });
  }
}

function main() {
  ensureModuleInstalled('pdfkit');
  
  const PDFDocument = require('pdfkit');
  
  const mdPath = path.resolve('Thinkboard_Guide.md');
  const pdfPath = path.resolve('Thinkboard_Guide.pdf');
  
  if (!fs.existsSync(mdPath)) {
    console.error(`Error: Thinkboard_Guide.md not found at ${mdPath}`);
    process.exit(1);
  }
  
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const lines = mdContent.split(/\r?\n/);
  
  console.log('Generating PDF. Please wait...');
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4'
  });
  
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);
  
  // Title / Cover Page
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#f97316').text('THINKBOARD', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).font('Helvetica').fillColor('#4b5563').text('A Complete A to Z Guide of the MERN Stack Application', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(11).font('Helvetica-Oblique').fillColor('#6b7280').text('Prepared for Project Demonstration and Review', { align: 'center' });
  doc.moveDown(3);
  
  // Drawing a decorative line
  doc.moveTo(100, doc.y).lineTo(500, doc.y).strokeColor('#e5e7eb').lineWidth(1).stroke();
  doc.moveDown(3);
  
  let inCodeBlock = false;
  let codeBuffer = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Code block handling
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        doc.fontSize(8.5).font('Courier').fillColor('#1f2937');
        // Print the accumulated code block
        const codeText = codeBuffer.join('\n');
        doc.text(codeText, {
          width: 500,
          align: 'left',
          lineGap: 2
        });
        doc.moveDown(1.5);
        codeBuffer = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }
    
    // Headers
    if (trimmed.startsWith('# ')) {
      doc.addPage();
      const text = trimmed.substring(2);
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#1f2937').text(text);
      doc.moveDown(1);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3);
      doc.fontSize(15).font('Helvetica-Bold').fillColor('#f97316').text(text);
      doc.moveDown(0.8);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#374151').text(text);
      doc.moveDown(0.6);
      continue;
    }
    
    // Lists / Bullets
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const text = trimmed.substring(2);
      doc.fontSize(10).font('Helvetica').fillColor('#4b5563');
      doc.text(`•  ${text}`, {
        indent: 15,
        lineGap: 4
      });
      continue;
    }
    
    // Empty line
    if (trimmed === '') {
      doc.moveDown(0.5);
      continue;
    }
    
    // Normal Text
    doc.fontSize(10.5).font('Helvetica').fillColor('#374151');
    doc.text(line, {
      align: 'justify',
      lineGap: 5
    });
  }
  
  doc.end();
  
  writeStream.on('finish', () => {
    console.log(`Success! PDF generated at: ${pdfPath}`);
  });
}

try {
  main();
} catch (err) {
  console.error('Error generating PDF:', err);
}
