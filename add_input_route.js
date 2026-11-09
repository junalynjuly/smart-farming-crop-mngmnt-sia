const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
const viewRoute = "\n// Frontend View Route for Input Usage\napp.get('/input-usage', (req, res) => {\n    res.render('input_usage');\n});\n";
if (!code.includes("app.get('/input-usage'")) {
    code = code.replace('app.listen(', viewRoute + '\napp.listen(');
    fs.writeFileSync('server.js', code);
    console.log('Successfully added /input-usage route!');
} else {
    console.log('Route already exists.');
}
