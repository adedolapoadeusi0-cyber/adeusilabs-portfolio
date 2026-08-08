const groups = document.querySelectorAll(".estimate-group");

const totalPrice = document.getElementById("estimatedCost");
const timeline = document.getElementById("timeline");

function calculateEstimate() {

    let price = 0;
    let weeks = 2;


    document.querySelectorAll(
        ".estimate-option.active:not(.feature)"
    ).forEach(option => {

        price += Number(option.dataset.price);

    });


    document.querySelectorAll(".feature.active").forEach(feature => {

        price += Number(feature.dataset.price);

    });

    if (price <= 300000) {
        weeks = 2;
    }
    else if (price <= 500000) {
        weeks = 3;
    }
    else if (price <= 700000) {
        weeks = 5;
    }
    else if (price <= 1000000) {
        weeks = 7;
    }
    else {
        weeks = 10;
    }

    totalPrice.textContent =
        "₦" + price.toLocaleString();

    timeline.textContent =
        weeks + " Weeks";
}


document.querySelectorAll(".estimate-group").forEach(group=>{

    const options = group.querySelectorAll(".estimate-option:not(.feature)");

    options.forEach(option=>{

        option.addEventListener("click",()=>{

            options.forEach(item=>item.classList.remove("active"));

            option.classList.add("active");

            calculateEstimate();

        });

    });

});

document.querySelectorAll(".feature").forEach(feature=>{

    feature.addEventListener("click",()=>{

        feature.classList.toggle("active");

        calculateEstimate();

    });

});


calculateEstimate();


const form = document.getElementById("estimateForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

const estimateGroups = document.querySelectorAll(".estimate-group");

const websiteOption =
    estimateGroups[0].querySelector(".estimate-option.active");

const pagesOption =
    estimateGroups[1].querySelector(".estimate-option.active");

const websiteType =
    websiteOption?.querySelector("h6")?.innerText || "Not selected";

const pages =
    pagesOption?.innerText || "Not selected";

const selectedFeatures = [];

document.querySelectorAll(".feature.active").forEach(feature => {
    selectedFeatures.push(feature.innerText.trim());
});

    const data = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        business: document.getElementById("business").value,

        websiteType,

        pages,

        features: selectedFeatures,

        estimatedCost: document.getElementById("estimatedCost").innerText,

        timeline: document.getElementById("timeline").innerText

    };

    try {

        const response = await fetch("https://adeusilabs-backend.onrender.com/estimate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (result.success) {

            alert("Estimate sent successfully!");

            form.reset();

        } else {

            alert("Something went wrong.");

        }

    } catch (err) {

        console.log(err);

        alert("Server error.");

    }

});