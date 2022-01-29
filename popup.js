

    // =================== variables ===================
    var bgScript
    var name_inp = document.getElementById("name_inp");
    var color_inp = document.getElementById("color_inp");
    var role_inp = document.getElementById("role_inp");
    var add_btn = document.getElementById("add_btn");
    var delete_btn = document.getElementById("delete_btn");
    var char_div = document.getElementById("char_div");

    var characters = {};
    var char = {}

    // listens to the click of the button into the popup content
    add_btn.addEventListener('click', addChar)
    delete_btn.addEventListener('click', devareChar)

    loadCharacters()
    
    function addChar() {
        char = {};
        char.name = name_inp.value;
        char.color = color_inp.value;
        char.role = role_inp.value;
        console.log(char);
        characters
        characters[char.name] = char;
        saveCharacters();
    }

    function devareChar() {
        delete characters[name_inp.value]
        saveCharacters();
    }


    function saveCharacters() {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"characters":characters});
        });
        loadCharacters()
    }

    function loadChar(name) {
        char = characters[name]
        name_inp.value = char.name
        color_inp.value = char.color
        role_inp.value = char.role
    }

    function loadCharacters() {
        bgScript = chrome.extension.getBackgroundPage()
        characters = bgScript.characters;

        char_div.appendChild(createRow({"name":"name", "color":"color", "role":"role"}, "header"))
        // var characters_p = `<div id="chars_header" class="_chars_rows"><p class="_p">الاسم</p><p class="_p">اللون</p><p class="_p">الدور</p></div>`
        for (const key in characters) {
            if (Object.hasOwnProperty.call(characters, key)) {
                char = characters[key]

                char_div.appendChild(createRow(char))

                // characters_p += `<div class="_chars_rows" id="`+char.name+`"><p class="_p">`+char.name+`</p><p class="_p" style="color: `+char.color+`;">`+char.color+`</p><p class="_p">`+char.role+`</p></div>`
            }
        }
        console.log(char_div);
        // char_div.innerHTML = characters_p

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

        var color_p = document.createElement('p')
        color_p.appendChild(document.createTextNode(columns.color))
        color_p.style['color'] = columns.color
        color_p.className = "_p"
        row_div.appendChild(color_p)

        var role_p = document.createElement('p')
        role_p.appendChild(document.createTextNode(columns.role))
        name_p.style['color'] = columns.color
        role_p.className = "_p"
        row_div.appendChild(role_p)

        return row_div

    }


