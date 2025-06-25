//Date and time display
setInterval(function () {
  var x = new Date();
  document.querySelector(
    ".time"
  ).innerHTML = `${x.getHours()}:${x.getMinutes()}`;
  document.querySelector(".date").innerHTML = `${x.getDate()}-${
    x.getMonth() + 1
  }-${x.getFullYear()}`;
}, 1000);

const thispc = document.getElementById("thispc");
const thispcfolder = document.querySelector(".thispcfolder");
thispc.addEventListener("dblclick", (e) => {
  thispcfolder.style.display = "block";
});

const closethispc = document.querySelector(".closethispc");
const maxthispc = document.querySelector(".maxthispc");
closethispc.addEventListener("click", (e) => {
  thispcfolder.style.display = "none";
});
maxthispc.addEventListener("click", (e) => {
  if (thispcfolder.style.height == "50vh" && thispcfolder.style.width == "50vw") {
    thispcfolder.style.height = "100vh";
    thispcfolder.style.width = "100vw";
    thispcfolder.style.top = 0;
    thispcfolder.style.left = 0;
    thispcfolder.style.borderRadius = 0;
  } else {
    thispcfolder.style.height = "50vh";
    thispcfolder.style.width = "50vw";
    thispcfolder.style.top = "20vh";
    thispcfolder.style.left = "10vw";
    thispcfolder.style.borderRadius = "10px";
  }
});
