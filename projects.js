const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".filter-item");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        projects.forEach(project => {

            if (
                filter === "all" ||
                project.dataset.filter === filter
            ) {

                project.style.display = "block";

            } else {

                project.style.display = "none";

            }

        });

    });

});