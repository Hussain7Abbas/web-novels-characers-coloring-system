// =======================================================================
// =======================================================================
// =======================================================================


let head = document.getElementsByTagName("head")[0]

head.innerHTML = head.innerHTML + `<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic&display=swap');

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
    left: 50%;
    margin-left: -60px;
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

    .بطل{color: #6e9bff;}
    .صديق{color: #55db3d;}
    .عدو{color: #ff7878;}
    .انثى{color: #ff6fd6;}
    .مهارة{color: #ceab00;}
    .مدرب{color: #c3940f;}
</style>`

let novel_url = document.URL.split("/");
let novel_name = "novel name"
if (novel_url[2] == "sunovels.com") {
    novel_name = novel_url[4].replace("-", " ")
} else {
    let novel_url_name = novel_url[novel_url.length-2].split("-");
    novel_url_name.pop()
    novel_name = novel_url_name.join(" ")
}
console.log(novel_name);


let novels = {}
let characters = {}
let replaces = {}


loadCharacters()



function loadCharacters() {

    try {
        chrome.storage.local.get("novels",(data)=>{
            novels = data.novels
            if (novels[novel_name] == undefined){
                characters = {}
                replaces = {}
            }else{
                characters = novels[novel_name]["characters"]
                replaces = novels[novel_name]["replaces"]
            }
            replaceCharacters()
        })
    } catch (error) {
        
    }
    
    

}


chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    console.log("save novels recieved");
    console.log(message.characters)
    characters = message.characters
    replaces = message.replaces
    replaceCharacters()
})


function replaceCharacters() {

    var tagsList = document.getElementsByTagName("p");
    for (para of tagsList){
        var innerHTML = para.innerHTML;


        for (const key in replaces) {
            if (Object.hasOwnProperty.call(replaces, key)) {
                rep = replaces[key];
                var index = innerHTML.indexOf(rep.name);
                while (index >= 0){
                    innerHTML = innerHTML.substring(0,index) + rep.with + innerHTML.substring(index + rep.name.length);
                    index = innerHTML.indexOf(rep.name, index+=rep.with.length);
                }
                para.innerHTML = innerHTML;
            }
        }




        for (const key in characters) {
            if (Object.hasOwnProperty.call(characters, key)) {
                char = characters[key];
                var index = innerHTML.indexOf(char.name);
                while (index >= 0){
                    innerHTML = innerHTML.substring(0,index) + `<span class="tooltip1 `+ char.role +`">` + char.name + `<span class="tooltiptext1">`+ char.info +`</span></span>` + innerHTML.substring(index + char.name.length);
                    index = innerHTML.indexOf(char.name, index+=(char.name.length+71));
                }
                para.innerHTML = innerHTML;
            }
        }

    }
} 
