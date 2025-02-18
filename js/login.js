import { config } from './index.js'
import { ProfilePage } from './profile.js'

export function login() {
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      submit(username, password);
    })
}

async function submit(username, password) {
    const credentials = btoa(`${username}:${password}`);
    try {
      const response = await fetch(config.ENDPOINTS.SIGNIN, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });
  
      if (!response.ok) {
        document.getElementById("error-message").innerHTML = `Invalid credentials. Please try again.`;
        setTimeout(() => {
          document.getElementById("error-message").innerHTML = ``
        }, 3000)
        return;
      }
  
      const jwt = await response.json();
      localStorage.setItem("jwt", jwt);
      ProfilePage();
    } catch (error) {
      document.getElementById("error-message").innerHTML = `Invalid credentials. Please try again.`;
    }
  }