
let jsonBlobId = '1157229262708531200';

var name_inp = document.getElementById('name_inp');
var role_inp = document.getElementById('role_inp');
var info_inp = document.getElementById('info_inp');
var img_inp = document.getElementById('img_inp');
var search_inp = document.getElementById('search_inp');

var fetch_btn = document.getElementById('fetch_btn');
var put_btn = document.getElementById('put_btn');


var rep_name_inp = document.getElementById('rep_name_inp');
var rep_with_inp = document.getElementById('rep_with_inp');

var add_btn = document.getElementById('add_btn');
var delete_btn = document.getElementById('delete_btn');

var char_div = document.getElementById('char_div');
var rep_char_div = document.getElementById('rep_char_div');

var coloring_btn = document.getElementById('coloring_btn');
var replacing_btn = document.getElementById('replacing_btn');

var add_rep_btn = document.getElementById('add_rep_btn');
var delete_rep_btn = document.getElementById('delete_rep_btn');
var search_rep_inp = document.getElementById('search_rep_inp');

var last_modified_p = document.getElementById('last_modified_p');

let novel_name = '';
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    let novel_url = tabs[0].url.split('/');
    if (novel_url[2] == 'sunovels.com') {
        novel_name = novel_url[4].replace('-', ' ');
    } else if (novel_url[2] == "kolnovel.lol") {
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
    } else if ((novel_url[0] == "file:")) {
        novel_name = novel_url[novel_url.length - 2].replace("-", " ");
    }
    console.log('Kolnovels Extention ✅', novel_name);
    novel_name = {
        "semperors dominationz": "emperors domination",
        "i can copy the talent": "your talent-is-mine"
    }?.[novel_name] || novel_name;
    console.log('MUTUAL NAME ✅', novel_name);
});

var date = new Date;
var novels = {};
var characters = {};
var replaces = {};
settings = {
    'last_modified': `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
};
var characters_sorted_list = [];
var char = {};


// listens to the click of the button into the popup content
add_btn.addEventListener('click', addChar);
delete_btn.addEventListener('click', deleteChar);

search_inp.addEventListener('keypress', searchChar);
search_rep_inp.addEventListener('keypress', searchRepChar);

fetch_btn.addEventListener('click', fetchNovels);
put_btn.addEventListener('click', putNovels);

coloring_btn.addEventListener('click', openColoring);
replacing_btn.addEventListener('click', openReplacing);

add_rep_btn.addEventListener('click', addRep);
delete_rep_btn.addEventListener('click', deleteRep);

loadCharacters();



async function putNovels() {
    if (confirm('هل انت متاكد من عملية التصدير؟')) {
        await httpReq(`https://jsonblob.com/api/jsonBlob/${jsonBlobId}`, "PUT", JSON.stringify(novels));
        sendTelegramBackup(JSON.stringify(novels));
    } else {
        console.log('put Declined');
    }
}

async function fetchNovels() {
    if (confirm('هل انت متاكد من عملية الاستيراد؟')) {
        novels = await httpReq(`https://jsonblob.com/api/jsonBlob/${jsonBlobId}`, "GET");
        novels = novels || {}; // if novels is undefined, set it to an empty object
        novels[novel_name] = novels[novel_name] || {
            'characters': novels?.[novel_name]?.characters || {},
            'replaces': novels?.[novel_name]?.replaces || {},
            'settings': novels?.[novel_name]?.settings || {}
        };

        saveCharacters();
        loadCharacters();
    }
}

async function httpReq(theUrl, type, body) {
    const res = await fetch(theUrl, {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body
    });
    const result = await res.json();
    if (res.status === 200) {
        alert("✅ تمت العملية بنجاح");
        console.log('📩 httpRes: ', result);
    } else {
        alert("❌ حدث خطأ");
        console.log('❌ Error: ', await res.error());
    }
    return result;
}








function addChar() {
    char = {};
    char.name = name_inp.value;
    char.role = role_inp.value;
    char.info = info_inp.value;
    char.img = img_inp.value;
    char.timestamp = new Date().getTime();;

    switch (char.role) {
        case '':
            alert('يرجى ادخال الدور');
            return;
        case 'بطل':
            char.color = '#6e9bff';
            break;
        case 'صديق':
            char.color = '#55db3d';
            break;
        case 'عدو':
            char.color = '#ff7878';
            break;
        case 'انثى':
            char.color = '#ff6fd6';
            break;
        case 'مهارة':
            char.color = '#ceab00';
            break;
        case 'مدرب':
            char.color = '#c3940f';
            break;
        case 'طائفة':
            char.color = '#c9a877';
            break;
        default:
            char.color = char.role.split('   ')[1];
            char.role = char.role.split('   ')[0];
            break;
    }

    console.log(char);
    characters[char.name] = char;
    saveCharacters();
    loadCharacters();
}

function deleteChar() {
    delete characters[name_inp.value];
    saveCharacters();
    loadCharacters();
}


function addRep() {
    rep = {};
    rep.name = rep_name_inp.value;
    rep.with = rep_with_inp.value;
    console.log(rep);
    replaces[rep.name] = rep;
    saveCharacters();
    loadCharacters();
}

function deleteRep() {
    delete replaces[rep_name_inp.value];
    saveCharacters();
    loadCharacters();
}


function saveCharacters() {
    // create the novel if it doesn't exist
    console.log('✅novel_name', novel_name);
    console.log('✅novels', novels);
    novels = novels || {};  // if novels is undefined, set it to an empty object
    novels[novel_name] = novels[novel_name] || { // if the novel doesn't exist, create it
        'characters': characters || {},
        'replaces': replaces || {},
        'settings': { 'last_modified': `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` }
    };

    chrome.storage.local.set({ 'novels': novels }, () => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, novels[novel_name]);
        });
    });
}

function obj_toSorted_arr(_obj, _property) {
    var list_obj = Object.keys(_obj).reduce(function (p, c) {
        return p.concat(_obj[c]);
    }, []);
    list_obj.sort((a, b) => (a[_property] > b[_property]) ? -1 : ((b[_property] > a[_property]) ? 1 : 0));
    return list_obj;
}

function loadChar(_currentRow, _name) {
    char = characters[_name];
    name_inp.value = char.name;
    role_inp.value = char.role;
    info_inp.value = char.info;
    img_inp.value = char.img;

    selectActiveRow(_currentRow);
}

function loadRep(_currentRow, _name, _with) {
    rep_name_inp.value = _name;
    rep_with_inp.value = _with;
    selectActiveRow(_currentRow);
}




function searchChar() {
    var searchCharacters = searchFor(characters, search_inp.value);
    console.log(searchCharacters, search_inp.value);

    char_div.innerHTML = '';
    char_div.appendChild(createRow({ 'name': 'الاسم', 'role': 'الدور' }, 'header'));


    characters_sorted_list = obj_toSorted_arr(searchCharacters, 'role');
    characters_sorted_list.forEach(char => {
        char_div.appendChild(createRow(char));
    });
}

function searchRepChar() {
    var searchReplaces = searchFor(replaces, search_rep_inp.value);
    console.log(searchReplaces, search_rep_inp.value);

    rep_char_div.innerHTML = '';
    rep_char_div.appendChild(createRepRow({ 'name': 'الاسم', 'with': 'الاستبدال' }, 'header', {}));
    for (const key in searchReplaces) {
        if (Object.hasOwnProperty.call(searchReplaces, key)) {
            rep = searchReplaces[key];
            let char1 = characters[rep.with];
            if (char1 == undefined) {
                char1 = { 'color': 'white', 'info': '' };
            }
            rep_char_div.appendChild(createRepRow(rep, 'row', char1));

        }
    }
}




function loadCharacters() {

    try {
        chrome.storage.local.get('novels', (data) => {
            console.log('🍅 novel name: ', novel_name);
            console.log('🍅 local storage data', data);
            novels = data.novels || {}; // if novels is undefined, set it to an empty object
            if (novels[novel_name]) {
                characters = novels[novel_name]['characters'];
                replaces = novels[novel_name]['replaces'];
                settings = novels[novel_name]['settings'];
            } else {
                characters = {};
                replaces = {};
                settings = { 'last_modified': `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` };
                saveCharacters();
            }


            console.log("🍅 loaded characters", { characters, replaces, settings });



            last_modified_p.innerHTML = settings['last_modified'];

            char_div.innerHTML = '';
            char_div.appendChild(createRow({ 'name': 'الاسم', 'role': 'الدور' }, 'header'));


            characters_sorted_list = obj_toSorted_arr(characters, 'role');
            characters_sorted_list.forEach(char => {
                char_div.appendChild(createRow(char));
            });




            rep_char_div.innerHTML = '';
            rep_char_div.appendChild(createRepRow({ 'name': 'الاسم', 'with': 'الاستبدال' }, 'header', {}));
            for (const key in replaces) {
                if (Object.hasOwnProperty.call(replaces, key)) {
                    rep = replaces[key];
                    let char1 = characters[rep.with];
                    if (char1 == undefined) {
                        char1 = { 'color': 'white', 'info': '' };
                    }
                    rep_char_div.appendChild(createRepRow(rep, 'row', char1));

                }
            }


        });

    } catch (error) {
        saveCharacters();
    }



}











function createRow(_char, _type = 'row') {

    var row_div = document.createElement('div');
    if (_type == 'row') {
        row_div.className = '_chars_rows';
    } else {
        row_div.className = '_chars_header _chars_rows';
    }


    var name_p = document.createElement('p');
    name_p.appendChild(document.createTextNode(_char.name));
    name_p.style['color'] = _char.color;
    name_p.className = '_p';
    row_div.appendChild(name_p);

    var role_p = document.createElement('p');
    role_p.appendChild(document.createTextNode(_char.role));
    role_p.style['color'] = _char.color;
    role_p.className = '_p';
    row_div.appendChild(role_p);


    var info_span = document.createElement('span');
    if (_char.info == '') { _char.info = 'بدون وصف'; }

    var row_container = document.createElement('div');
    row_container.className = 'tooltip1';
    if (_type == 'row') {
        var img = document.createElement('img');
        img.src = _char.img;
        img.onerror = function () {
            this.src = 'https://i.ibb.co/fp6tzKS/photo-2022-07-07-19-13-03.jpg';
        };
        info_span.appendChild(img);

        info_span.appendChild(document.createTextNode(_char.info));
        info_span.className = 'tooltiptext1';

        row_container.appendChild(info_span);
        row_div.addEventListener('click', () => { loadChar(row_div, _char.name); });
    }
    row_container.appendChild(row_div);


    return row_container;

}

function createRepRow(_columns, _type = 'row', _char) {

    var row_div = document.createElement('div');
    if (_type == 'row') {
        row_div.className = '_chars_rows';
    } else {
        row_div.className = '_chars_header _chars_rows';
    }


    var name_p = document.createElement('p');
    name_p.appendChild(document.createTextNode(_columns.name));
    name_p.style['color'] = _char.color;
    name_p.className = '_p';
    row_div.appendChild(name_p);

    var role_p = document.createElement('p');
    role_p.appendChild(document.createTextNode(_columns.with));
    role_p.style['color'] = _char.color;
    role_p.className = '_p';
    row_div.appendChild(role_p);



    var info_span = document.createElement('span');
    if (_char.info == '') { _char.info = 'بدون وصف'; }
    info_span.appendChild(document.createTextNode(_char.info));
    info_span.className = 'tooltiptext1';

    var row_container = document.createElement('div');
    row_container.className = 'tooltip1';

    if (_type == 'row') {
        row_container.appendChild(info_span);
        row_div.addEventListener('click', () => { loadRep(row_div, _columns.name, _columns.with); });
    }

    row_container.appendChild(row_div);


    return row_container;

}



function openColoring() { openCity(coloring_btn, 'coloring'); }
function openReplacing() { openCity(replacing_btn, 'replacing'); }

function openCity(currentBtn, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(cityName).style.display = 'block';
    currentBtn.className += ' active';
}



function selectActiveRow(_currentRow) {
    rows = document.getElementsByClassName('_chars_rows');
    for (i = 0; i < rows.length; i++) {
        rows[i].className = rows[i].className.replace(' _active_row', '');
    }
    _currentRow.className += ' _active_row';
}











// =============================================================
// ====================== Extra Funcitons ======================
// =============================================================


function searchFor(_characters, _text) {
    var results = [];
    for (const _char_key in _characters) {
        if (Object.hasOwnProperty.call(_characters, _char_key)) {
            if (JSON.stringify(_characters[_char_key]).indexOf(_text) > -1) {
                console.log(_characters[_char_key]);
                results.push(_characters[_char_key]);
            }
        }
    }
    return results;
}


function sendTelegramBackup(data) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + "-"
        + currentdate.getMinutes() + "-"
        + currentdate.getSeconds();
    var chat_id = 547571285; // replace with yours
    var enc_data = data;
    var token = "5543097483:AAE7XUbXPQqwdu2CvbXDRKjRnn0_EJnJ6rw"; // from botfather

    var blob = new Blob([enc_data], { type: 'plain/text' });

    var formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('document', blob, `kolnovels_backup ${datetime}.txt`);

    var request = new XMLHttpRequest();
    request.open('POST', `https://api.telegram.org/bot${token}/sendDocument`);
    request.send(formData);

};