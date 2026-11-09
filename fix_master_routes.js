const fs = require('fs');
let file = 'routes/masterDataRoutes.js';
let content = fs.readFileSync(file, 'utf8');

const cleanDashboardRoute = `router.get('/dashboard', async (req, res) => {
    try {
        const [plantings] = await db.query('SELECT COUNT(*) AS total FROM plantings');
        const [harvests] = await db.query('SELECT COUNT(*) AS total FROM harvests');
        const [inputs] = await db.query('SELECT COUNT(*) AS total FROM input_usage');
        
        res.render('dashboard', { 
            plantingCount: plantings[0].total,
            harvestCount: harvests[0].total,
            inputCount: inputs[0].total
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;`;

const startIndex = content.indexOf("router.get('/dashboard'");
if (startIndex !== -1) {
    let baseContent = content.substring(0, startIndex);
    fs.writeFileSync(file, baseContent + cleanDashboardRoute);
    console.log('Successfully updated dashboard route!');
} else {
    console.log('Dashboard route not found.');
}
