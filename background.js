window.characters = {}


chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    characters = message['characters'];
    console.log(characters);
})