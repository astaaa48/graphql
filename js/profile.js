import { config,loginPage,formatSize,profileHTML} from './index.js'
import { query } from "./query.js";
import { login } from './login.js'

let members = [];

export async function ProfilePage() {
    const jwt = localStorage.getItem("jwt");
  
    if (!jwt) {
      document.body.innerHTML = loginPage;
      login()
      return;
    };
  
    try {
      const response = await fetch(config.ENDPOINTS.GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ query }),
      });
  
      const result = await response.json();
     
      if (result.errors) {
        throw new Error("Failed to fetch user data");
      }
  
      const Data = result.data.user;
  
      Data.forEach(Element => {
        config.USER_DATA.username = Element.login;
        config.USER_DATA.firstName = Element.firstName;
        config.USER_DATA.lastName = Element.lastName;
        config.USER_DATA.email = Element.email;
        config.USER_DATA.campus = Element.campus;
        config.USER_DATA.auditRatio = (parseFloat(Element.auditRatio)).toFixed(1);
        config.USER_DATA.totalUp = parseFloat(Element.totalUp)
        config.USER_DATA.totalDown = parseFloat(Element.totalDown)
        config.USER_DATA.current_projects = Element.current_projects;
        config.USER_DATA.successrojects = Element.finished_projects.length;
        config.USER_DATA.finished_projects = Element.finished_projects;
        config.USER_DATA.XP = formatSize(parseFloat(Element.transactions_aggregate.aggregate.sum.amount), "XP");
      });
  
      config.USER_DATA.finished_projects.forEach(project => {
        project.group.members.forEach(member => {
          const userlogin = member.userLogin;
          if (userlogin !== config.USER_DATA.username) {
            let existingMember = members.find(m => m.userlogin === userlogin);
            if (!existingMember) {
              members.push({ userlogin, times: 1 });
            } else {
              existingMember.times++;
            }
          }
        });
      });
  
      document.body.innerHTML = profileHTML(config.USER_DATA);
      const graph1 = document.getElementById("svg-graph111");
      createSVG(graph1, "graph1", members.length);
      const svg1 = document.getElementById("svg-graph1");
      createGRAPH(svg1, members);
      const graph2 = document.getElementById("graph2");
      createAuditRatio(config.USER_DATA, graph2);
      document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("jwt"); 
        members = []; 
        document.body.innerHTML = loginPage;
        login(); 
      });
    } catch (error) {
      console.error("Failed to render profile page:", error);
      document.body.innerHTML = loginPage;
      login()
      return
    }
  }


  function createSVG(graph, id, dataLength) {
    const barWidth = 30;
    const barSpacing = 15;
    const minWidth = 400;
    const graphHeight = 300;
  
    const graphWidth = Math.max(minWidth, dataLength * (barWidth + barSpacing) + 20);
  
    const svgString = ` 
      <svg xmlns="http://www.w3.org/2000/svg" id="svg-${id}" width="${graphWidth}" height="100%" 
           viewBox="0 0 ${graphWidth} ${graphHeight}" preserveAspectRatio="xMinYMin meet">
      </svg>`;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
  
    graph.appendChild(svgElement);
  }
  
  function createGRAPH(svg, DATA) {
    if (!DATA.length) return;
  
    DATA.sort((a, b) => b.times - a.times);
  
    const maxTimes = DATA[0].times;
    const barWidth = 30;
    const barSpacing = 15;
    const graphHeight = 280;
    const baseX = 0;
    const NamesAndTimes = document.getElementById("NamesAndTimes");
  
    DATA.forEach((item, index) => {
  
      const barHeight = (item.times / maxTimes) * 250;
      const x = baseX + index * (barWidth + barSpacing);
      const y = graphHeight - barHeight;
  
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", barWidth);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("fill", "blue");
      rect.setAttribute("cursor", "pointer");
  
      rect.addEventListener("mouseover", () => {
        NamesAndTimes.textContent = `${item.userlogin}: ${item.times} times`;
      });
  
      svg.appendChild(rect);
    });
  }
  
  function createAuditRatio(USER_DATA, graph2) {
    const widthUp = USER_DATA.totalUp
    const widthDown = USER_DATA.totalDown
    const totalwidth = widthUp + widthDown;
    const ratioColor = widthUp > widthDown ? 'green' : 'red';
    const need = widthUp > widthDown ? 'your good' : `you need ${formatSize(widthDown - widthUp)}`;

    const svgString = `
    <svg width="350" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="61" width="${(widthUp / (totalwidth)) * 200}" height="9" fill="green" />;
      <rect x="10" y="81" width="${(widthDown / (totalwidth)) * 200}" height="9" fill="red" />
  
      <text x="10" y="40" font-size="20" fill="black">Your ratio: <tspan fill="${ratioColor}">${USER_DATA.auditRatio}  </tspan></text>
      <text x="190" y="140" font-size="15" fill="black"> <tspan fill="${ratioColor}"> ${need} </tspan></text>

      <text x="${25 + (widthUp / (totalwidth)) * 200}" y="70" font-size="14" fill="black">🟩 Up: ${formatSize(USER_DATA.totalUp)}</text>
      <text x="${20 + (widthDown / (totalwidth)) * 200}" y="90" font-size="14" fill="black">🟥 Down: ${formatSize(USER_DATA.totalDown)}</text>
    </svg>`
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    graph2.appendChild(svgElement);
  }
