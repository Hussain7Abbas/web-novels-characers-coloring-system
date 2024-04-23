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
let novel_name = "novel name";
if (novel_url[2] == "sunovels.com") {
    novel_name = novel_url[4].replace("-", " ");
} else if (novel_url[2] == "kolnovel.me" || novel_url[2] == "kolnovel.org") {
    let novel_url_name = novel_url.at(-2).split("-");
    novel_url_name.pop();
    novel_name = novel_url_name.join(" ");
} else if (novel_url[2] == "riwyat.com") {
    novel_name = novel_url[novel_url.length - 3].replace("-", " ");
} else if (novel_url[2] == "rewayat.club") {
    let novel_url_name = novel_url[4].split("-");
    novel_name = novel_url_name.join(" ");
} else if (novel_url[2] == "www.mtlnovel.com") {
    let novel_url_name = novel_url[3].split("-");
    novel_name = novel_url_name.join(" ");
} else if (novel_url[2] == "ar-novel.com") {
    novel_name = novel_url[4];
} else if ((novel_url[0] == "file:")) {
    novel_name = novel_url[novel_url.length - 2].replace("-", " ");
}

console.log('Kolnovels Extention ✅', { novel_name, novel_url });
novel_name = {
    "semperors dominationz": "emperors domination",
    "%d8%a7%d9%84%d8%b3%d8%b9%d9%8a-%d9%88%d8%b1%d8%a7%d8%a1-%d8%a7%d9%84%d8%ad%d9%82%d9%8a%d9%82%d8%a9": "spursuit-of-the-truthz",
    "i can copy the talent": "your talent-is-mine"
}?.[novel_name] || novel_name;
console.log('MUTUAL NAME ✅', novel_name);




let novels = {};
let characters = {};
let replaces = {};


loadCharacters();



function loadCharacters() {

    try {
        chrome.storage.local.get("novels", (data) => {
            novels = data?.novels || {}; // if novels not exist create it
            console.log('✅local storage novels', data);
            novels[novel_name] = novels[novel_name] || {}; // if a novel not exist create it
            characters = novels[novel_name]['characters'] || {};
            replaces = novels[novel_name]['replaces'] || {};

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
    if (tagsList.length == 0) {
        console.log('✅', 'not kolnovels');
        tagsList = document.getElementsByTagName("p");
    } else {
        console.log('✅', 'it\'s kolnovels');
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("strong", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h5", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h4", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h3", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h2", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("h1", "p");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("font-family: custom_font_1, serif;font-size: 18px;font-weight: bold;", " ");
        tagsList[0].innerHTML = tagsList[0].innerHTML.replaceAll("font-family: custom_font_1, serif;font-size: 18px;", " ");
    }


    for (para of tagsList) {
        for (const [key, rep] of Object.entries(replaces)) {
            para.innerHTML = para.innerHTML.replaceAll(rep.name, rep.with);
        }
        for (const [key, char] of Object.entries(characters)) {
            para.innerHTML = para.innerHTML.replaceAll(char.name, `<span class="tooltip1 ${char.role}">
                ${char.name}<span class="tooltiptext1">
                <img src="${char.img}" onerror="this.onerror=null;this.src='https://i.ibb.co/fp6tzKS/photo-2022-07-07-19-13-03.jpg'"/>
                ${char.info}
                </span>
                </span>`);
        }

    }
} 
