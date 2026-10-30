\# Smart Farming and Crop Management System (SIA)



\## Group members

Singuit, Silvano, Quisel, Rebutazo, Rio, Riofrir



\## Ownership matrix

| Member | GitHub username | Tables | Endpoints | Join report endpoint and type | Feature role |

|---|---|---|---|---|---|

| A Singuit | | roles, farms, users | | | |

| B Silvano | | crops, fields, farm\_inputs | | | |

| C Quisel | | plantings, harvests, input\_usage | | | |

| D Rebutazo | | crop\_growth\_stages, crop\_thresholds, care\_tasks | | | |

| E Rio | carmelario08 | sensor_readings, alerts, audit_logs | Alerts CRUD screen, sensor readings entry, audit log view | Fields vs weather coverage gaps (FULL OUTER via UNION of LEFT and RIGHT) | Unique feature: threshold alerts and auto-created tasks, audit |

| F Riofrir | franklinriofrir16-bot | weather_logs, pest_reports | Pest_report CRUD screen, weather_logs entry, Dashboard | Pest report count per crop (RIGHT JOIN) | Reports and Dashboard |




\## How to run

1\. Run schema.sql in MySQL Workbench.

2\. Copy .env.example to .env and fill in your values.

3\. npm install, then npm start.

