const fs = require('fs');
const xml = fs.readFileSync('temp_extract/word/document.xml', 'utf8');

function extractTables(xml) {
    const tableRegex = /<w:tbl>([\s\S]*?)<\/w:tbl>/g;
    const rowRegex = /<w:tr[\s\S]*?>([\s\S]*?)<\/w:tr>/g;
    const cellRegex = /<w:tc[\s\S]*?>([\s\S]*?)<\/w:tc>/g;
    const textRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;

    let tableMatch;
    let tableIndex = 0;
    while ((tableMatch = tableRegex.exec(xml)) !== null) {
        console.log(`\n=== Table ${tableIndex} ===`);
        const rows = tableMatch[1].match(/<w:tr[\s\S]*?>[\s\S]*?<\/w:tr>/g) || [];
        rows.forEach((row, rowIndex) => {
            const cells = row.match(/<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/g) || [];
            let rowText = cells.map(cell => {
                let cellText = '';
                let tMatch;
                const tRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
                while ((tMatch = tRegex.exec(cell)) !== null) {
                    cellText += tMatch[1];
                }
                return cellText.trim();
            });
            console.log(`R${rowIndex}: | ${rowText.join(' | ')} |`);
        });
        tableIndex++;
    }
}

extractTables(xml);
