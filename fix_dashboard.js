const fs = require('fs');
let file = 'routes/masterDataRoutes.js';
let content = fs.readFileSync(file, 'utf8');

// Update route definition to async
content = content.replace(
    "router.get('/dashboard', (req, res) => {",
    "router.get('/dashboard', async (req, res) => {"
);

// Replace callback db.query with async/await
content = content.replace(
    /db\.query\(sql,\s*\(err,\s*results\)\s*=>\s*\{[\s\S]*?\}\);/,
    `try {
        const [results] = await db.query(sql);
        res.render('dashboard', { pestCounts: results });
    } catch (err) {
        res.status(500).send(err.message);
    }`
);

fs.writeFileSync(file, content);
console.log('Successfully fixed masterDataRoutes.js!');
