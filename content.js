// =======================================================================
// =======================================================================
// =======================================================================

let novels = {}
let characters = {}
var novelName_h1 = document.getElementsByClassName("entry-title")[0];
let novel_name = novelName_h1.innerHTML.split(" ")
novel_name.pop()
novel_name = novel_name.join(" ")
console.log(novel_name)

loadCharacters()



function loadCharacters() {
    if (localStorage.getItem("novels") == null){
        localStorage.setItem("novels", JSON.stringify(novels))
    }
    novels = JSON.parse(localStorage.getItem("novels"))
    if (novels[novel_name] == null){
        novels[novel_name] = {}
        localStorage.setItem("novels", JSON.stringify(novels))
    }
    
    console.log(novels);
    characters = novels[novel_name]
    
    replaceCharacters()
    chrome.runtime.sendMessage({"characters":characters})
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    console.log("save novels recieved");
    console.log(message.characters)
    characters = message.characters
    saveCharacters()
    loadCharacters()
})


        
function saveCharacters() {
    novels[novel_name] = characters
    localStorage.setItem("novels", JSON.stringify(novels))
    loadCharacters()
}



function replaceCharacters() {


    var replaceDict = [
        ["خطوات تسلل الضباب","خطوات الضباب", "skill"]
    ];

    var tagsList = document.getElementsByTagName("p");
    for (par of tagsList){
        var innerHTML = par.innerHTML;

        replaceDict.forEach(name=>{
            var index = innerHTML.indexOf(name[0]);
            while (index >= 0){
                innerHTML = innerHTML.substring(0,index) + name[1] + innerHTML.substring(index + name[0].length);
                index = innerHTML.indexOf(name[0], index+=5);
            }
            par.innerHTML = innerHTML;
        });

        for (const key in characters) {
            if (Object.hasOwnProperty.call(characters, key)) {
                char = characters[key];
                var index = innerHTML.indexOf(char.name);
                while (index >= 0){
                    innerHTML = innerHTML.substring(0,index) + "<span style='color: "+ char.color + "'>" + char.name + "</span>" + innerHTML.substring(index + char.name.length);
                    index = innerHTML.indexOf(char.name, index+=30);
                }
                par.innerHTML = innerHTML;
            }
        }

    }
} 
