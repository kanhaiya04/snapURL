const buttons = document.getElementsByClassName("btn");
const button1 = buttons[0];
const button2 = buttons[1];

button1.addEventListener("click", function () {
  const url = document.getElementById("url").value;
  createShortUrl(url);
});

button2.addEventListener("click", function () {
  const url = document.getElementById("analyticsUrl").value;
  getAnalytics(url);
});

const createShortUrl = async (url) => {
  const response = await fetch(`https://snapurl-vtxw.onrender.com/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ url }),
  });
  const shorturl = await response.json();
  localStorage.setItem("url", shorturl.randomValue);
  window.location.href = "./shortURL.html";
};

const getAnalytics = async (shorturl) => {
  const response = await fetch(`https://snapurl-vtxw.onrender.com/analyticssubmit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ shorturl }),
  });
  const hits = await response.json();
  const analtyics = document.getElementById("analytics");
  analtyics.innerText = `Total Hits: ${hits.currhit}`;
};
