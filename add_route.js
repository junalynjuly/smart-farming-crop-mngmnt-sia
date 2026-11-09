const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
const viewRoute = "\n// Frontend View Route for Plantings\napp.get('/plantings', (req, res) => {\n    res.render('plantings');\n});\n";
if (!code.includes("app.get('/plantings'")) {
    code = code.replace('app.listen(', viewRoute + '\napp.listen(');
    fs.writeFileSync('server.js', code);
    console.log('Successfully added /plantings route!');
} else {
    console.log('/plantings route already exists.');
}
