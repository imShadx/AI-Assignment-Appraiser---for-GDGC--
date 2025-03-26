const button = document.getElementById("button");
const fakeInput = document.getElementById("fakeInput");
const input = document.getElementById("input");
const review = document.getElementById("review");
let selectedFile = null;

//hover effects
button.addEventListener("mouseover", () => {
  button.classList.toggle("buttonHover");
});
button.addEventListener("mouseout", () => {
  button.classList.toggle("buttonHover");
});

fakeInput.addEventListener("mouseover", () => {
  fakeInput.classList.toggle("inputHover");
});
fakeInput.addEventListener("mouseout", () => {
  fakeInput.classList.toggle("inputHover");
});

//making sure the label and input works
fakeInput.addEventListener("click", (event) => {
    input.click();
  });
  
  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      selectedFile = input.files[0]; // Store selected file
      fakeInput.textContent = selectedFile.name; // Update UI with filename
    }
  });

//adding functionality to the button and passing the file onto the backend
button.addEventListener("click", async () => {
  if (!selectedFile) {
    window.alert("Please submit a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // ✅ FIX: Check if aiResponse exists instead of extractedText
    if (data.aiResponse) {
        review.innerHTML = data.aiResponse
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert bold text
        .replace(/\* (.*?)\n/g, "<li>$1</li>") // Convert bullet points to list items
        .replace(/<\/li><li>/g, "</li>\n<li>") // Proper line breaks
        .replace(/^<li>/, "<ul><li>") // Ensure list starts properly
        .replace(/<\/li>$/, "</li></ul>"); // Ensure list closes properly
    } else {
      review.textContent = "Error: " + (data.error || "Unknown error");
    }
  } catch (error) {
    console.log(error);
  }
});
