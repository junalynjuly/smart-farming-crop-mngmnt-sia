<<<<<<< HEAD
console.log("Smart Farming JavaScript is connected!");
=======
console.log("Smart Farming JavaScript is connected!");

async function loadGrowthStages() {
    const container = document.getElementById("growth-stages-list");

    try {
        const response = await fetch("/api/growth-stages");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Could not load growth stages."
            );
        }

        container.innerHTML = "";

        const table = document.createElement("table");

        table.innerHTML = `
            <tr>
                <th>Stage ID</th>
                <th>Crop ID</th>
                <th>Stage Name</th>
                <th>Stage Order</th>
                <th>Start Day</th>
                <th>End Day</th>
                <th>Actions</th>
            </tr>
        `;

        result.data.forEach(stage => {
            const row = document.createElement("tr");

            [
                stage.stage_id,
                stage.crop_id,
                stage.stage_name,
                stage.stage_order,
                stage.start_day,
                stage.end_day
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionsCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {
                editGrowthStage(stage);
            });

            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                deleteGrowthStage(stage);
            });

            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);
            table.appendChild(row);
        });

        container.appendChild(table);

    } catch (error) {
        container.textContent =
            "Unable to load growth stages. Please try again.";
        console.error(error);
    }
}

function isValidGrowthStage(stage) {
    return (
        Number.isInteger(stage.crop_id) &&
        stage.crop_id > 0 &&
        typeof stage.stage_name === "string" &&
        stage.stage_name.trim() !== "" &&
        Number.isInteger(stage.stage_order) &&
        stage.stage_order > 0 &&
        Number.isInteger(stage.start_day) &&
        stage.start_day >= 0 &&
        Number.isInteger(stage.end_day) &&
        stage.end_day >= stage.start_day
    );
}

const form = document.getElementById("growth-stage-form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const growthStage = {
        crop_id: Number(document.getElementById("crop-id").value),
        stage_name: document.getElementById("stage-name").value.trim(),
        stage_order: Number(document.getElementById("stage-order").value),
        start_day: Number(document.getElementById("start-day").value),
        end_day: Number(document.getElementById("end-day").value)
    };

    if (!isValidGrowthStage(growthStage)) {
        alert("Please enter valid growth-stage information.");
        return;
    }

    try {
        const response = await fetch("/api/growth-stages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(growthStage)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Could not add growth stage."
            );
        }

        alert("Growth stage added successfully!");

        form.reset();
        await loadGrowthStages();

    } catch (error) {
        alert(error.message || "An error occurred while adding the stage.");
    }
});

async function editGrowthStage(stage) {
    const stageName = prompt("Enter stage name:", stage.stage_name);

    if (stageName === null) return;

    const stageOrder = prompt("Enter stage order:", stage.stage_order);
    if (stageOrder === null) return;

    const startDay = prompt("Enter start day:", stage.start_day);
    if (startDay === null) return;

    const endDay = prompt("Enter end day:", stage.end_day);
    if (endDay === null) return;

    const growthStage = {
        crop_id: Number(stage.crop_id),
        stage_name: stageName.trim(),
        stage_order: Number(stageOrder),
        start_day: Number(startDay),
        end_day: Number(endDay)
    };

    if (!isValidGrowthStage(growthStage)) {
        alert("Please enter valid growth-stage information.");
        return;
    }

    try {
        const response = await fetch(
            `/api/growth-stages/${stage.stage_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(growthStage)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Could not update growth stage."
            );
        }

        alert("Growth stage updated successfully!");
        await loadGrowthStages();

    } catch (error) {
        alert(error.message || "An error occurred while updating the stage.");
    }
}

async function deleteGrowthStage(stage) {
    const confirmed = confirm(
        `Are you sure you want to delete "${stage.stage_name}"?`
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `/api/growth-stages/${stage.stage_id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Could not delete growth stage."
            );
        }

        alert("Growth stage deleted successfully!");
        await loadGrowthStages();

    } catch (error) {
        alert(error.message || "An error occurred while deleting the stage.");
    }
}

loadGrowthStages();
>>>>>>> origin/main
