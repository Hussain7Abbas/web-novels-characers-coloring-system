// =======================================================================
// =======================================================================
// =======================================================================

let novel_url = document.URL.split("/");
let novel_url_name = novel_url[novel_url.length-2].split("-");
novel_url_name.pop()
let novel_name = novel_url_name.join(" ")
console.log(novel_name);


let novels = {}
let characters = {}


loadCharacters()



function loadCharacters() {

    try {
        chrome.storage.sync.get("novels",(data)=>{
            console.log(data);
            novels = data.novels
            if (novels[novel_name] == undefined){
                characters = {}
            }else{
                characters = novels[novel_name]
                console.log(characters);
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
    replaceCharacters()
})


function replaceCharacters() {

    // var replaceDict = [
    //     ["خطوات تسلل الضباب","خطوات الضباب", "skill"]
    // ];

    var tagsList = document.getElementsByTagName("p");
    for (par of tagsList){
        var innerHTML = par.innerHTML;

        // replaceDict.forEach(name=>{
        //     var index = innerHTML.indexOf(name[0]);
        //     while (index >= 0){
        //         innerHTML = innerHTML.substring(0,index) + name[1] + innerHTML.substring(index + name[0].length);
        //         index = innerHTML.indexOf(name[0], index+=5);
        //     }
        //     par.innerHTML = innerHTML;
        // });

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
