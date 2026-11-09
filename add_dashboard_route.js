const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
const viewRoute = "\n// Frontend Dashboard Route\napp.get('/dashboard', (req, res) => {\n    res.render('dashboard');\n});\n";
if (!code.includes("app.get('/dashboard'")) {
    code = code.replace('app.listen(', viewRoute + '\napp.listen(');
    fs.writeFileSync('server.js', code);
    console.log('Successfully added /dashboard route!');
} else {
    console.log('Dashboard route already exists.');
}
