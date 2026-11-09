const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
const viewRoute = "\n// Frontend View Route for Harvests\napp.get('/harvests', (req, res) => {\n    res.render('harvests');\n});\n";
if (!code.includes("app.get('/harvests'")) {
    code = code.replace('app.listen(', viewRoute + '\napp.listen(');
    fs.writeFileSync('server.js', code);
    console.log('Successfully added /harvests route!');
} else {
    console.log('/harvests route already exists.');
}
