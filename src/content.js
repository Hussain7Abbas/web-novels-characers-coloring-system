// =======================================================================
// =======================================================================
// =======================================================================


let head = document.getElementsByTagName("head")[0];

head.innerHTML = head.innerHTML + `<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic&display=swap');

#kol_content{
   overflow: initial !important;
}
/* Tooltip container */
.tooltip1 {
    position: relative;
    display: inline-block;
  }
  
  /* Tooltip text */
  .tooltip1 .tooltiptext1 {
    visibility: hidden;
    width: fit-content;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 14px;
    
    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    bottom: 100%;
    margin-left: -60px;
    left: 50%;
    width:16vw;
    transform: translateX(-2vw);
  }
  
  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip1:hover .tooltiptext1 {
    visibility: visible;
  }

  .tooltip1 .tooltiptext1::after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }

  .chapter-content p{display: block !important; font-family: 'Noto Kufi Arabic', sans-serif;}
  section.content-wrap .chapter-content p:nth-child(odd) { display: none !important; } /* for sunnovels */
.publift-widget-22804772995{display:none!important;}
    .بطل{color: #6e9bff;}
    .صديق{color: #55db3d;}
    .عدو{color: #ff7878;}
    .انثى{color: #ff6fd6;}
    .مهارة{color: #ceab00;}
    .مدرب{color: #c3940f;}
    .طائفة{color: #c9a877;}
</style>`;

let novel_url = document.URL.split("/");
const siteName = getSiteName(novel_url);
let novelName = getNovelName(novel_url);




let novels = {};
let characters = {};
let replaces = {};


loadCharacters();



function loadCharacters() {

    try {
        chrome.storage.local.get("novels", (data) => {
            novels = data?.novels || {}; // if novels not exist create it
            console.log('✅local storage novels', data);
            novels[novelName] = novels[novelName] || {}; // if a novel not exist create it
            characters = novels[novelName]['characters'] || {};
            replaces = novels[novelName]['replaces'] || {};

            replaceCharacters();
        });
    } catch (error) {

    }



}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("save novels recieved");
    console.log(message.characters);
    characters = message.characters;
    replaces = message.replaces;
    replaceCharacters();
});


function replaceCharacters() {


    var tagsList = document.getElementsByClassName("epwrapper");

    if (siteName === "kolnovel") {
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("strong", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h5", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h4", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h3", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h2", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h1", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("font-family: custom_font_1, serif;font-size: 18px;font-weight: bold;", " ");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("font-family: custom_font_1, serif;font-size: 18px;", " ");

    } else if (siteName === "riwyat") {
        const chapterBody = document.querySelector('.reading-content');
        chapterBody.innerHTML = chapterBody.innerHTML.replaceAll(`<p style="text-align: center;">\n</p>`, "");
        chapterBody.innerHTML = chapterBody.innerHTML.replaceAll(`&nbsp;`, "");
        tagsList = chapterBody.getElementsByTagName("p");
    } else {
        tagsList = document.getElementsByTagName("p");
    }


    for (para of tagsList) {
        for (const [key, rep] of Object.entries(replaces)) {
            para.innerHTML = para.innerHTML.replaceAll(rep.name, rep.with);
        }
        for (const [key, char] of Object.entries(characters)) {
            para.innerHTML = para.innerHTML.replaceAll(char.name, `<span class="tooltip1 ${char.role}">
                ${char.name}<span class="tooltiptext1">
                <img src="${char.img}"/>
                ${char.info}
                </span>
                </span>`);
        }

    }
} 
