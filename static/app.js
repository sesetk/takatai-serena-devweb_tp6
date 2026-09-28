const originURL = "/";

const form = document.getElementById("submit-link");
const urlInput = document.getElementById("url");
const submitButton = document.getElementById("submit-button");
const errorBox = document.getElementById("error");
const resultBox = document.getElementById("result");
const shortLink = document.getElementById("short-link");
const copyButton = document.getElementById("copy-button");
const copyFeedback = document.getElementById("copy-feedback");

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  resultBox.hidden = true;
}

function showResult(link) {
  errorBox.hidden = true;
  shortLink.href = link.short;
  shortLink.textContent = link.short;
  copyFeedback.textContent = "";
  resultBox.hidden = false;
}

// envoie POST /api-v2/ en JSON ; renvoie le lien créé ou lève une erreur
async function createLink(url) {
  const response = await fetch(`${originURL}api-v2/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  // si la réponse n'est pas du JSON, on continue avec un objet vide
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Erreur ${response.status}`);
  }
  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // empêche le rechargement de la page
  submitButton.disabled = true;

  try {
    const link = await createLink(urlInput.value.trim());
    showResult(link);
  } catch (err) {
    // fetch lève une TypeError quand le serveur est injoignable
    const message =
      err instanceof TypeError
        ? "Impossible de contacter le serveur."
        : err.message;
    showError(message);
  } finally {
    submitButton.disabled = false;
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shortLink.textContent);
    copyFeedback.textContent = "Copié !";
  } catch {
    copyFeedback.textContent = "Copie impossible, sélectionnez le lien à la main.";
  }
});