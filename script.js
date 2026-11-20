const passwordInput = document.getElementById("password");
const passwordToggle = document.querySelector(".password-toggle");
const passwordIcon = document.querySelector(".password-toggle i");
const capsWarning = document.querySelector(".caps-warning");
const emailInput = document.getElementById("email");
const loginForm = document.querySelector(".login-form");
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "Demo@123";
const successMessage = document.createElement("p");
successMessage.className = "success-message";
const successScreen = document.createElement("div");
successScreen.className = "success-screen";
successScreen.innerHTML = `
    <div class="success-icon">
        <i class="ri-check-line"></i>
    </div>
    <h2>Welcome Back!</h2>
    <p>You have successfully signed in to your account.</p>
    <button type="button" class="back-login-btn">
        <i class="ri-arrow-left-line"></i> Back to Login
    </button>
`;
successScreen.querySelector(".back-login-btn").addEventListener("click", function() {
    successScreen.remove();
    loginForm.style.display = "";
});
const errorMessage = document.createElement("p");
errorMessage.className = "error-message";
const loginButton = document.querySelector(".login-btn");
const rememberMe = document.getElementById("remember-me");
const savedEmail =localStorage.getItem("rememberedEmail");
if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMe.checked = true;
}

passwordToggle.addEventListener("click",function() {  
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove("ri-eye-off-line");
        passwordIcon.classList.add("ri-eye-line");
        passwordToggle.setAttribute("aria-label","Hide password");
    }
    else {
        passwordInput.type = "password";
        passwordIcon.classList.remove("ri-eye-line");
        passwordIcon.classList.add("ri-eye-off-line")
        passwordToggle.setAttribute("aria-label","Show password");
    }

});

passwordInput.addEventListener("keyup", function(event) {
    if (event.getModifierState("CapsLock")){
        capsWarning.style.display = "block";      
    }
    else {
        capsWarning.style.display ="none";
    }
});

let failedAttempts = Number(localStorage.getItem("failedAttempts")) || 0;
const MAX_ATTEMPTS = 3;
let lockoutTime = 30;
let countdown;
//const lockoutEndTime = Date.now() + (30 * 1000);
let lockoutEndTime = Number(localStorage.getItem("lockoutEndTime")) || 0;
if (lockoutEndTime > Date.now()) {
    lockoutTime = Math.ceil((lockoutEndTime - Date.now()) / 1000);
    loginButton.disabled = true;
    countdown = setInterval(function() {
        lockoutTime = Math.max(
            0,
            Math.ceil((lockoutEndTime - Date.now()) / 1000)
        );

        errorMessage.textContent = `Too many failed attempts! Please wait ${lockoutTime} seconds.`;

        if (lockoutTime <= 0) {
            clearInterval(countdown);
            failedAttempts = 0;
            lockoutTime = 30;
            loginButton.disabled = false;

            localStorage.removeItem("failedAttempts");
            localStorage.removeItem("lockoutEndTime");
        }
    }, 1000);
    errorMessage.textContent = `Too many failed attempts! Please wait ${lockoutTime} seconds.`;
    loginForm.appendChild(errorMessage);
}


loginForm.addEventListener("submit",function(event) {
    event.preventDefault();
    if (loginButton.disabled) {
        return;
    }
    successMessage.remove();
    errorMessage.remove();
    	
    if ((emailInput.value == DEMO_EMAIL)&&(passwordInput.value == DEMO_PASSWORD)) {
        failedAttempts = 0;
        localStorage.removeItem("failedAttempts");
        localStorage.removeItem("lockoutEndTime");
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="ri-loader-4-line"></i> Signing in...';
        setTimeout(function() {
            loginForm.style.display = "none";
            document.querySelector(".login-card").appendChild(successScreen);
        
        }, 1000);
        if (rememberMe.checked) {
            localStorage.setItem("rememberedEmail", emailInput.value);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
        
    }
    else {
        errorMessage.textContent="Invalid email or password!";
        loginForm.appendChild(errorMessage);
        failedAttempts++;
        localStorage.setItem("failedAttempts", failedAttempts);
        if (MAX_ATTEMPTS==failedAttempts) {
            lockoutEndTime = Date.now() + (30 * 1000);
            localStorage.setItem("lockoutEndTime", lockoutEndTime);
            loginButton.disabled = true;
            countdown = setInterval(function() {
                lockoutTime = Math.max(
                    0,
                    Math.ceil((lockoutEndTime - Date.now()) / 1000)
                );

                errorMessage.textContent = `Too many failed attempts! Please wait ${lockoutTime} seconds.`;
                if (lockoutTime <= 0) {
                    failedAttempts = 0;
                    lockoutTime = 30;
                    clearInterval(countdown);
                    loginButton.disabled = false;
                    localStorage.removeItem("failedAttempts");
                    localStorage.removeItem("lockoutEndTime");
                }
                

            }, 1000);
        }
            
    }   
});
