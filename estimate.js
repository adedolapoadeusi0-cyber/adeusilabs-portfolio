const groups = document.querySelectorAll(".estimate-group");

const totalPrice = document.getElementById("estimatedCost");
const timeline = document.getElementById("timeline");

function calculateEstimate(){

    let price = 0;

    let weeks = 2;

    groups.forEach(group=>{

        const selected = group.querySelector(".estimate-option.active");

        if(selected){

            price += Number(selected.dataset.price);

        }

    });

    document.querySelectorAll(".feature.active").forEach(feature=>{

        price += Number(feature.dataset.price);

    });

    if(price <= 300000){
        weeks = 2;
    }
    else if(price <= 500000){
        weeks = 3;
    }
    else if(price <= 700000){
        weeks = 5;
    }
    else if(price <= 1000000){
        weeks = 7;
    }
    else{
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

    const websiteType =
        document.querySelector(".estimate-group:nth-of-type(1) .estimate-option.active h6").innerText;

    const pages =
        document.querySelector(".estimate-group:nth-of-type(2) .estimate-option.active").innerText;

    const selectedFeatures = [];

    document.querySelectorAll(".feature.active").forEach(feature => {
        selectedFeatures.push(feature.innerText);
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