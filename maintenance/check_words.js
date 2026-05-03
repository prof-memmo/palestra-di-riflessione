const fs = require('fs');

try {
    let code = fs.readFileSync('js/exercises.js', 'utf8');
    code += '\nmodule.exports = exercises;';
    fs.writeFileSync('temp_exercises.js', code);
    
    const exercises = require('./temp_exercises.js');
    if (!exercises.generi) {
        console.log("No generi found.");
        process.exit(0);
    }
    
    let count = 0;
    for (const [genreName, levels] of Object.entries(exercises.generi)) {
        for (const [levelName, levelArr] of Object.entries(levels)) {
            for (const item of levelArr) {
                const words = item.text.replace(/<[^>]+>/g, '').split(/[\s\n\r]+/).filter(w => w.length > 0).length;
                if (words < 600) {
                    console.log(`SHORT: ${genreName} - ${levelName} - id ${item.id}: ${words} parole`);
                    count++;
                } else {
                    console.log(`OK: ${genreName} - ${levelName} - id ${item.id}: ${words} parole`);
                }
            }
        }
    }
    console.log(`\nTotal short texts: ${count}`);
} catch (e) {
    console.error(e);
}
