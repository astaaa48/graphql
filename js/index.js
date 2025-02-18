import { ProfilePage } from './profile.js'
import { login } from './login.js'

const config = {
  ENDPOINTS: {
    SIGNIN: "https://learn.zone01oujda.ma/api/auth/signin",
    GRAPHQL: "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql"
  },
  USER_DATA : {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    campus: "",
    auditRatio: "",
    totalUp: "",
    totalDown: "",
    successrojects: 0,
    current_projects: [],
    finished_projects: [],
    XP: 0,
  }
};

const loginPage = `
  <div class="login-container">
    <h1>Login</h1>
    <form id="login-form">
      <input type="text" id="username" placeholder="Username or Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p id="error-message"></p>
  </div>
`;




const profileHTML = (userData) => `
<header>
        <div class="Page-Top">
            <div class="compus">
              <img src=src/logo.png alt="Logo" class="logo">
              <h1>Campus ${userData.campus}</h1>
            </div>
            <button id="logout">Logout</button>
          </div>
        <h1>Welcome, ${userData.firstName} ${userData.lastName}!</h1>
</header>
<div class="profile-container">
  <div class="personal-info">
    <h2>Personal Information</h2>
    <p><strong>Username: </strong>${userData.username}</p>
    <p><strong>Email: </strong>${userData.email}</p>
    <p><strong>Your XP: </strong> ${userData.XP}</p>
  </div>
   <div class="current-projects">
      <h2>Current Projects</h2>
      ${userData.current_projects.map(project => {
    const path = (project.group.path).split('/').pop();
    return `<p>${path}</p>`
  }).join('')
  }
  </div>
  <div class="projects-success">
    <h2>Number of projects: ${userData.successrojects}</h2>
    <h2>Projects Names:</strong></h2>
      ${userData.finished_projects.map(project => {
  const path = (project.group.path).split('/').pop();
  return `<p>${path}</p>`
}).join('')
  }
  </div>
 
  <div id="graph1" class="graph1">
    <div id="title">
      <h2>you worked with : <p id="NamesAndTimes"></p></h2>
      
    </div>
    <div id="svg-graph111">
    </div>
  </div>
  
  <div id="graph2">
  </div>
</div>
`;



function isLoging() {
  if (localStorage.getItem("jwt")) {
    ProfilePage();
  } else {
    document.body.innerHTML = loginPage;
    login()
  }
}

isLoging()

function formatSize(sizeInBytes, xp) {
  var result;
  if (sizeInBytes < 1000) {
    result = sizeInBytes + " B";
  } else if (sizeInBytes < 1000 * 1000) {
    if (xp === "XP") {
      result = Math.floor(sizeInBytes / 1000) + " kB";
    } else {
      result = (sizeInBytes / 1000).toFixed(2) + " KB";
    }
  } else {
    if (xp === "XP") {
      result = Math.floor(sizeInBytes / 1000 / 1000) + " MB";
    } else {
      sizeInBytes = (sizeInBytes / 1000 / 1000).toFixed(3);
      result = sizeInBytes.slice(0, 4) + " MB";
    }
  }
  return result;
}

export { formatSize, profileHTML, loginPage, config}
