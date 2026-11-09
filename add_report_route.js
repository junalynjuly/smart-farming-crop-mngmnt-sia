const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
const viewRoute = "\n// Frontend View Route for Plantings-Harvest Report\napp.get('/reports/plantings-harvests', (req, res) => {\n    res.render('plantings_harvest_report');\n});\n";
if (!code.includes("app.get('/reports/plantings-harvests'")) {
    code = code.replace('app.listen(', viewRoute + '\napp.listen(');
    fs.writeFileSync('server.js', code);
    console.log('Successfully added report route!');
} else {
    console.log('Report route already exists.');
}
