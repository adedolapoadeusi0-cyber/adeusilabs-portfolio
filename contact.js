const form = document.getElementById("contactForm");
const button = document.getElementById("contactBtn");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    button.disabled = true;
    button.innerText = "Sending...";

    const data = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        company: document.getElementById("company").value,

        service: document.getElementById("service").value,

        budget: document.getElementById("budget").value,

        message: document.getElementById("message").value

    };

    try{

        const response = await fetch("http://localhost:5000/contact",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        const result = await response.json();

        if(result.success){

            button.innerHTML = "✓ Message Sent";

            form.reset();

        }else{

            button.disabled = false;
            button.innerHTML = "Send Message";

            alert("Something went wrong.");

        }

    }catch(err){

        console.log(err);

        button.disabled = false;
        button.innerHTML = "Send Message";

        alert("Server error.");

    }

});