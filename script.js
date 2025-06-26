//Date and time display
function formatNumber(num) {
  return num.toString().padStart(2, "0");
}
function updateDateTime() {
  const now = new Date();

  const hours = formatNumber(now.getHours());
  const minutes = formatNumber(now.getMinutes());
  const day = formatNumber(now.getDate());
  const month = formatNumber(now.getMonth() + 1);
  const year = now.getFullYear();

  document.querySelector(".time").textContent = `${hours}:${minutes}`;
  document.querySelector(".date").textContent = `${day}-${month}-${year}`;
}

setInterval(updateDateTime, 60000); //change every minute
updateDateTime(); // Run once on load

//utility function for open, close, maximize/minimize and drag the window
function setupAppWindow({ icon, win, closeBtn, maxBtn, topbar, default: def }) {
  const iconEl = document.querySelector(icon);
  const winEl = document.querySelector(win);
  const closeEl = document.querySelector(closeBtn);
  const maxEl = document.querySelector(maxBtn);
  const topbarEl = document.querySelector(topbar);

  setupAppWindow.zIndexTop = setupAppWindow.zIndexTop || 100;

  let isMax = false;
  // OPEN
  iconEl.addEventListener("dblclick", () => {
    winEl.style.display = "block";
    winEl.style.top = def.top;
    winEl.style.left = def.left;
    winEl.style.width = def.width;
    winEl.style.height = def.height;
    winEl.style.borderRadius = "10px";
    winEl.style.zIndex = ++setupAppWindow.zIndexTop;
    isMax = false
  });

  // CLOSE
  closeEl.addEventListener("click", () => {
    winEl.style.display = "none";
  });

  
  // MAXIMIZE/RESTORE
  maxEl.addEventListener("click", () => {
    
    if (isMax) {
      winEl.style.width = def.width;
      winEl.style.height = def.height;
      winEl.style.top = def.top;
      winEl.style.left = def.left;
      winEl.style.borderRadius = "10px";
      isMax = false;
    } else {
      winEl.style.width = `${window.innerWidth}px`;
      winEl.style.height = `${window.innerHeight}px`;
      winEl.style.top = "0";
      winEl.style.left = "0";
      winEl.style.borderRadius = "0";
      isMax = true;
    }
  });

  // DRAGGABLE LOGIC
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  topbarEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - winEl.offsetLeft;
    offsetY = e.clientY - winEl.offsetTop;
    topbarEl.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    const winWidth = winEl.offsetWidth;
    const winHeight = winEl.offsetHeight;

    const maxLeft = window.innerWidth - winWidth;
    const maxTop = window.innerHeight - winHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    winEl.style.left = `${newLeft}px`;
    winEl.style.top = `${newTop}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// for This PC window
setupAppWindow({
  icon: "#thispc",
  win: ".thispcfolder",
  closeBtn: ".closethispc",
  maxBtn: ".maxthispc",
  topbar: ".topthispc",
  default: { width: "50vw", height: "50vh", top: "10vh", left: "10vw" },
});

// for Recylce Bin window
setupAppWindow({
  icon: "#recyclebin",
  win: ".recyclebinfolder",
  closeBtn: ".closerecyclebin",
  maxBtn: ".maxrecyclebin",
  topbar: ".toprecyclebin",
  default: { width: "50vw", height: "50vh", top: "15vh", left: "15vw" },
});

//delete from recycle-bin LOGIC
document
  .querySelectorAll(".recyclebinfolder .content .delete-btn")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
  });

// for Notepad window
setupAppWindow({
  icon: "#notepad",
  win: ".notepadfolder",
  closeBtn: ".closenotepad",
  maxBtn: ".maxnotepad",
  topbar: ".topnotepad",
  default: { width: "50vw", height: "50vh", top: "20vh", left: "20vw" },
});

// for Terminal window
setupAppWindow({
  icon: "#terminal",
  win: ".terminalfolder",
  closeBtn: ".closeterminal",
  maxBtn: ".maxterminal",
  topbar: ".topterminal",
  default: { width: "50vw", height: "50vh", top: "25vh", left: "10vw" },
});

//notepad functionality LOGIC
const textarea = document.querySelector(".notepadfolder textarea");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const clearBtn = document.querySelector(".clear");
const saveBtn = document.querySelector(".save");
const loadBtn = document.querySelector(".load");

let currentFontSize = 14;

zoomInBtn.addEventListener("click", () => {
  currentFontSize += 3;
  textarea.style.fontSize = `${currentFontSize}px`;
});
zoomOutBtn.addEventListener("click", () => {
  currentFontSize = Math.max(currentFontSize - 3, 14);
  textarea.style.fontSize = `${currentFontSize}px`;
});
clearBtn.addEventListener("click", () => {
  textarea.value = "";
});
saveBtn.addEventListener("click", () => {
  localStorage.setItem("content", textarea.value.toString());
});
loadBtn.addEventListener("click", () => {
  textarea.value = localStorage.getItem("content");
});

// Terminal functionality LOGIC
const inputEl = document.getElementById("terminal-input");
const outputEl = document.getElementById("terminal-output");

const commands = {
  help: () => `Available Commands: help , clear, date, whoami, pwd, ls, cd`,

  clear: () => {
    outputEl.innerHTML = "";
    return "VanillaOS Terminal. Type `help` to get started.";
  },

  date: () => new Date().toString(),

  whoami: () => "TUSHAR RAI",

  pwd: () => currentPath,

  ls: () => Object.keys(fileSystem[currentPath] || {}).join("  "),

  cd: (args) => {
    let path = "";
    args.forEach((arg) => {
      path += arg;
    });
    document.querySelector(
      ".terminal-input .path"
    ).innerHTML = `PS C:\\Users\\TUSHAR RAI\\${path}>`;
    return `PS C:\\Users\\TUSHAR RAI\\${path}>`;
  },
};

let currentPath = "/";
let fileSystem = {
  "/": {
    Documents: {},
    "notes.txt": "This is a file",
  },
};

//handle input command
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const raw = inputEl.value.trim();
    if (!raw) return;

    // Display entered command
    appendOutput(`PS C:\\Users\\TUSHAR RAI> ${raw}`);

    const [cmd, ...args] = raw.split(" ");
    const fn = commands[cmd];

    let result = fn ? fn(args) : `Command not found: ${cmd}`;
    if (result) appendOutput(result);

    inputEl.value = "";
  }
});

function appendOutput(text) {
  const line = document.createElement("div");
  line.className = "line";
  line.textContent = text;
  outputEl.appendChild(line);
  outputEl.scrollTop = outputEl.scrollHeight;
}

//for chrome window
setupAppWindow({
  icon: "#chrome",
  win: ".chromefolder",
  closeBtn: ".closechrome",
  maxBtn: ".maxchrome",
  topbar: ".topchrome",
  default: { width: "70vw", height: "70vh", top: "15vh", left: "25vw" },
});

const iframe = document.querySelector(".chrome-iframe");
const urlbar = document.querySelector(".urlbar");

document.querySelector(".go").addEventListener("click", () => {
  const url = urlbar.value;
  if (!url.startsWith("http")) {
    iframe.src = "https://" + url;
  } else {
    iframe.src = url;
  }
});

// start menu window
const start = document.getElementById("start");
var toggle = false;
start.addEventListener("click", () => {
  if (!toggle) {
    document.querySelector(".start-menu").style.display = "block";
  } else {
    document.querySelector(".start-menu").style.display = "none";
  }
  toggle = !toggle;
});

//start apps from start menu LOGIC
const apps = document.querySelectorAll(".app");
apps.forEach((app) => {
  const target = app.getAttribute("data-app");
  setupAppWindow({
    icon: `.app`,
    win: `.${target}folder`,
    closeBtn: `.close${target}`,
    maxBtn: `.max${target}`,
    topbar: `.top${target}`,
    default: { width: "50vw", height: "50vh", top: "15vh", left: "25vw" },
  });
  setupAppWindow.zIndexTop = setupAppWindow.zIndexTop || 100;
  app.addEventListener("click", () => {
    const win = document.querySelector(`.${target}folder`);
    win.style.display = "block";
    win.style.zIndex = ++setupAppWindow.zIndexTop;
    console.log("chala")
  });
});

//setting window LOGIC
document
  .querySelector(".start-menu .settings")
  .addEventListener("click", () => {
    document.querySelector(".settingsfolder").style.display = "flex";
    document.querySelector(".start-menu").style.display = "none";
  });

setupAppWindow({
  icon: ".start-menu .settings",
  win: ".settingsfolder",
  closeBtn: ".closesettings",
  maxBtn: ".maxsettings",
  topbar: ".topsettings",
  default: { width: "60vw", height: "65vh", top: "25vh", left: "25vw" },
});

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.add("hidden"));
    tab.classList.add("active");
    const tabName = tab.getAttribute("data-tab");
    document.getElementById(tabName).classList.remove("hidden");
  });
});

//brightness LOGIC
const brightnessSlider = document.querySelector(".brightness-slider");
brightnessSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  document.body.style.filter = `brightness(${value}%)`;
});

//switch theme LOGIC
const themeBtns = document.querySelectorAll(".theme-btn");

themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("data-theme");

    if (theme === "dark") {
      document.body.style.filter = "invert(1)";
    } else {
      document.body.style.filter = "invert(0)";
    }
  });
});

//change wallpaper LOGIC
const wallpaperThumbs = document.querySelectorAll(".wallpaper-thumb");
wallpaperThumbs.forEach((img) => {
  img.addEventListener("click", () => {
    const src = img.getAttribute("src");
    document.querySelector(".wallpaper").style.backgroundImage = `url(${src})`;
  });
});

