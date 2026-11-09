const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
const routeCode = "\n// Frontend View Routes\napp.get('/plantings', (req, res) => {\n    res.render('plantings');\n});\n";
if (code.indexOf('/plantings') === -1) {
    code = code.replace('app.listen(', routeCode + '\napp.listen(');
    fs.writeFileSync('server.js', code);
    console.log('Successfully added route!');
} else {
    console.log('Route already exists.');
}
