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


const estimateBtn = document.getElementById("estimateBtn");

estimateBtn.addEventListener("click", async () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const business = document.getElementById("business").value;

    // Get selected Website Type
    const websiteType = document.querySelector(".estimate-group:nth-child(1) .active").innerText;

    // Get selected Pages
    const pages = document.querySelector(".estimate-group:nth-child(2) .active").innerText;

    // Get selected Features
    const features = [];

    document.querySelectorAll(".feature.active").forEach(feature => {
        features.push(feature.innerText);
    });

    const estimatedCost = document.getElementById("estimatedCost").innerText;

    const timeline = document.getElementById("timeline").innerText;

    const response = await fetch("http://localhost:5000/estimate", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name,
            email,
            business,
            websiteType,
            pages,
            features,
            estimatedCost,
            timeline

        })

    });

    const data = await response.json();

    if(data.success){

        alert("Estimate sent successfully!");

    }else{

        alert("Something went wrong.");

    }

});