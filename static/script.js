const promptInput = document.getElementById("prompt-input");
const generateBtn = document.getElementById("generate-btn");
const placeholder = document.getElementById("placeholder");
const result = document.getElementById("result");
const resultImage = document.getElementById("result-image");
const error = document.getElementById("error");
const errorMsg = document.getElementById("error-msg");
const downloadBtn = document.getElementById("download-btn");

let generating = false;

generateBtn.addEventListener("click", generate);

promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        generate();
    }
});

async function generate() {
    const prompt = promptInput.value.trim();
    if (!prompt || generating) return;

    generating = true;
    generateBtn.disabled = true;
    generateBtn.querySelector(".btn-text").style.display = "none";
    generateBtn.querySelector(".btn-loading").style.display = "flex";

    placeholder.style.display = "flex";
    placeholder.querySelector("p").textContent = "Generating image...";
    result.style.display = "none";
    error.style.display = "none";

    try {
        const res = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to generate");

        resultImage.src = "data:image/png;base64," + data.image;
        placeholder.style.display = "none";
        result.style.display = "flex";
    } catch (err) {
        placeholder.style.display = "none";
        error.style.display = "block";
        errorMsg.textContent = err.message;
    } finally {
        generating = false;
        generateBtn.disabled = false;
        generateBtn.querySelector(".btn-text").style.display = "flex";
        generateBtn.querySelector(".btn-loading").style.display = "none";
        placeholder.querySelector("p").textContent = "Your image will appear here";
    }
}

downloadBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = resultImage.src;
    a.download = "generated_image.png";
    a.click();
});
