const button = document.getElementById("copyButton");
button.addEventListener("click", function () {
  const copyText = document.getElementById("copyText");

  copyText.select();
  copyText.setSelectionRange(0, 99999);

  document.execCommand("copy");

  const copyButton = document.getElementById("copyButton");
  copyButton.innerText = "Text Copied!";
});

const copyText = document.getElementById("copyText");
copyText.value = localStorage.getItem("url");
localStorage.removeItem("url");
