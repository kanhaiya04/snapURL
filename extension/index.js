const button = document.getElementById("btn");

button.addEventListener("click", function () {
  const url = document.getElementById("url").value;
  createShortUrl(url);
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
