const observer = new MutationObserver((mutations) => {
  let button = document.querySelector(
    "header header button[aria-label='New chat']"
  );
  if (button) {
    observer.disconnect();

    while (button.parentElement.children.length == 1) {
      button = button.parentElement;
    }

    const blurToggleDiv = button.cloneNode(true);
    const blurToggleButton = blurToggleDiv.querySelector("button");
    const blurToggleSvgContainer =
      blurToggleButton.querySelector("svg").parentElement;

    const blurChat = () => {
      blurToggleSvgContainer.innerHTML = closeEye;
      blurToggleButton.setAttribute("title", "Reveal chats");
      blurToggleButton.setAttribute("aria-label", "Reveal chats");
      document.body.classList.add("whatsblur_blur");
    };
    const revealChat = () => {
      blurToggleSvgContainer.innerHTML = openEye;
      blurToggleButton.setAttribute("title", "Blur chats");
      blurToggleButton.setAttribute("aria-label", "Blur chats");
      document.body.classList.remove("whatsblur_blur");
    };

    blurToggleButton.onclick = () => {
      if (document.body.classList.contains("whatsblur_blur")) {
        revealChat();
        chrome.storage.sync.set({ whatsblur_blur: true });
      } else {
        blurChat();
        chrome.storage.sync.set({ whatsblur_blur: false });
      }
    };
    button.before(blurToggleDiv);
    if (isBlur) {
      blurChat();
    } else {
      revealChat();
    }
  }
});

let isBlur = false;
let openEye;
let closeEye;

const main = async () => {
  openEye = await (await fetch(chrome.runtime.getURL("blur-icon.svg"))).text();
  closeEye = await (
    await fetch(chrome.runtime.getURL("unblur-icon.svg"))
  ).text();

  observer.observe(document, { childList: true, subtree: true });
  chrome.storage.sync.get("whatsblur_blur", (result) => {
    if (result.whatsblur_blur) {
      isBlur = true;
    }
  });
};

main();
