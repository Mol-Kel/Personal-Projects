document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const strengthFill = document.getElementById("strengthFill");
    const strengthLabel = document.getElementById("strengthLabel");

    // Toggle password visibility
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.textContent = type === "password" ? "Show" : "Hide";
    });

    // Validate password on input
    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;
        const results = validatePassword(password);
        updateUI(results);
    });

    function validatePassword(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            consecutive: !/(.)\1{2,}/.test(password) // No 3+ identical consecutive chars
        };
    }

    function updateUI(results) {
        const password = passwordInput.value;
        const criteria = ["length", "uppercase", "lowercase", "number", "special", "consecutive"];

        // Update criteria indicators
        criteria.forEach((criterion) => {
            const element = document.getElementById(criterion);
            if (results[criterion]) {
                element.classList.add("valid");
                element.classList.remove("invalid");
            } else {
                element.classList.add("invalid");
                element.classList.remove("valid");
            }
        });

        // Calculate strength percentage
        const validCriteria = Object.values(results).filter(Boolean).length;
        const totalCriteria = Object.keys(results).length;
        const strengthPercentage = password ? (validCriteria / totalCriteria) * 100 : 0;

        // Update strength meter
        strengthFill.style.width = `${strengthPercentage}%`;

        // Set strength color and label
        let strengthColor, strengthText;
        if (strengthPercentage === 0) {
            strengthColor = "#eee";
            strengthText = "No Password";
        } else if (strengthPercentage < 30) {
            strengthColor = "#ed2915";
            strengthText = "Very Weak";
        } else if (strengthPercentage < 50) {
            strengthColor = "#e67e22";
            strengthText = "Weak";
        } else if (strengthPercentage < 70) {
            strengthColor = "#f1c40f";
            strengthText = "Fair";
        } else if (strengthPercentage < 90) {
            strengthColor = "#2ecc71";
            strengthText = "Good";
        } else {
            strengthColor = "#14e53d";
            strengthText = "Strong";
        }

        strengthFill.style.backgroundColor = strengthColor;
        strengthLabel.textContent = strengthText;
    }
});
