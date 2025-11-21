const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcel() {
  const workbook = new ExcelJS.Workbook();
  const file = path.join(__dirname, 'docs/INTERGIS CO, LTD/6.Jika di approv dibuatkan/Training record INTERGIS.xlsx');
  await workbook.xlsx.readFile(file);
  
  console.log('=== TRAINING RECORD INTERGIS ===');
  workbook.eachSheet((worksheet, id) => {
    console.log('\nSheet: ' + worksheet.name);
    let count = 0;
    worksheet.eachRow((row, rowNum) => {
      if (count < 15) {
        row.eachCell((cell, colNum) => {
          if (cell.value) {
            console.log('  [' + rowNum + ',' + colNum + ']: ' + JSON.stringify(cell.value).substring(0, 50));
            count++;
          }
        });
      }
    });
  });
}

checkExcel().catch(console.error);
