

    // =================== variables ===================
    var name_inp = document.getElementById("name_inp");
    var role_inp = document.getElementById("role_inp");
    var add_btn = document.getElementById("add_btn");
    var delete_btn = document.getElementById("delete_btn");
    var char_div = document.getElementById("char_div");
    var put_btn = document.getElementById("put_btn");
    var fetch_btn = document.getElementById("fetch_btn");

    let novel_name = ""
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        let novel_url = tabs[0].url.split("/");
        let novel_url_name = novel_url[novel_url.length-2].split("-");
        novel_url_name.pop()
        novel_name = novel_url_name.join(" ")
        console.log(novel_name);
    })

    var novels = {}
    var characters = {};
    var char = {}

    // listens to the click of the button into the popup content
    add_btn.addEventListener('click', addChar)
    delete_btn.addEventListener('click', deleteChar)
    put_btn.addEventListener('click', putNovels)
    fetch_btn.addEventListener('click', fetchNovels)

    loadCharacters()
    








    function putNovels(){
        JSON.parse(httpPut("https://jsonblob.com/api/941250293765783552"));
        alert("تم الحفظ")
    }

    function fetchNovels(){
        novels = JSON.parse(httpGet("https://jsonblob.com/api/941250293765783552"));
        characters = novels[novel_name]
        saveCharacters()
        loadCharacters()
        alert("تم التحديث")
    }

    function httpGet(theUrl){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.setRequestHeader('Accept', 'application/json');
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    function httpPut(theUrl){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", theUrl, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.setRequestHeader('Accept', 'application/json');
        xmlHttp.send(JSON.stringify(novels));
    }








    function addChar() {
        char = {};
        char.name = name_inp.value;
        char.role = role_inp.value;

        switch (char.role) {
            case "بطل":
                char.color = "#6e9bff";
                break;
            case "صديق":
                char.color = "#55db3d";
                break;
            case "عدو":
                char.color = "#ff7878";
                break;
            case "انثى":
                char.color = "#ff6fd6";
                break;
            case "مهارة":
                char.color = "#ceab00";
                break;
            case "مدرب":
                char.color = "#c3940f";
                break;
            default:
                char.color = char.role.split("   ")[1];
                char.role = char.role.split("   ")[0];
                break;
        }
        
        console.log(char);
        characters[char.name] = char;
        saveCharacters();
        loadCharacters()
    }

    function deleteChar() {
        delete characters[name_inp.value]
        saveCharacters();
        loadCharacters()
    }


    function saveCharacters() {
        novels[novel_name] = characters
        chrome.storage.sync.set({"novels":novels},()=>{
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {"characters":characters});
            });
        })
        
    }

    function loadChar(name) {
        char = characters[name]
        name_inp.value = char.name
        role_inp.value = char.role
    }

    function loadCharacters() {

        try {
            chrome.storage.sync.get("novels",(data)=>{
                console.log(data);
                novels = data.novels
                if (novels[novel_name] == undefined){
                    characters = {}
                    saveCharacters()
                }else{
                    characters = novels[novel_name]
                    console.log(characters);
                }

                char_div.innerHTML = ""

                char_div.appendChild(createRow({"name":"name", "role":"role"}, "header"))
                for (const key in characters) {
                    if (Object.hasOwnProperty.call(characters, key)) {
                        char = characters[key]
                        char_div.appendChild(createRow(char))
                    }
                }
                console.log(char_div);
            })
        } catch (error) {
            saveCharacters()
        }
        
        

    }



    function createRow(columns, type="row") {
        var row_div = document.createElement('div')
        if (type=="row"){
            row_div.className = "_chars_rows"
            // row_div.addEventListener('click', loadChar(columns.name))
        }else{
            row_div.className = "_chars_header _chars_rows"
        }
        

        var name_p = document.createElement('p')
        name_p.appendChild(document.createTextNode(columns.name))
        name_p.style['color'] = columns.color
        name_p.className = "_p"
        row_div.appendChild(name_p)

        var role_p = document.createElement('p')
        role_p.appendChild(document.createTextNode(columns.role))
        name_p.style['color'] = columns.color
        role_p.className = "_p"
        row_div.appendChild(role_p)

        return row_div

    }


