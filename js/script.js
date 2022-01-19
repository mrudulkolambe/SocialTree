let main = document.getElementById('main');
let elementContainer = document.getElementById('elementContainer');
let linkContainer = document.getElementById('linkContainer');

async function getData() {
    let jsonObj = await fetch("/json/data.json");
    let response = await jsonObj.text();
    return JSON.parse(response);
}
async function elementRender() {
    let data = await getData();
    elementContainer.innerHTML = "";
    for (let i = 0; i < data.data.length; i++) {
        elementContainer.innerHTML += `
        <li class="elements" onclick="renderLinks(this.children[0].id)">
            <span id="${userName(data.data[i].user)}" class="name">${data.data[i].user}</span>
        </li> 
    `
    }
}
async function renderLinks(id) {
    history.pushState({ page: 1 }, "title 1", `?user=${id}`);
    elementContainer.style.display = "none";
    document.title = `Social Tree - ${id}`
    linkContainer.style.display = "flex";
    let data = await getData();
    for (let i = 0; i < data.data.length; i++) {
        if (userName(data.data[i].user) == id) {
            linkContainer.innerHTML = `
            <div onclick="closeContainer()" class="closeContainer"><i class="fas fa-times"></i></div>
            <div class="linkHeader">
            <div class="image">
                <img src="${data.data[i].img}" alt="">
            </div>
            <div class="name">
                ${data.data[i].user}
            </div>
        </div>
        <div class="skills">${data.data[i].position}</div>
        <div class="linkBody" id="linkBody"></div>
            `;
            renderLinkItems(data.data[i].links)
        }
    }
}

function renderLinkItems(links) {
    linkBody.innerHTML = '';
    for (let i = 0; i < links.length; i++) {
        linkBody.innerHTML += `
        <a href="${links[i].link}" class="${links[i].class}" target="_blank">
                    <div class="icon">${links[i].icon}</div>
                    <div class="link">${links[i].name}</div>
        </a>
        `
    }
}

function getId() {
    let queryString = window.location.search;
    let urlParam = new URLSearchParams(queryString);
    let id = urlParam.get('id');
    if (id == undefined) {
        elementContainer.style.display = "grid";
        linkContainer.style.display = "none";
        elementRender();
    } else {
        renderLinks(id)
    }
}
getId();

function closeContainer() {
    elementContainer.style.display = "grid";
    linkContainer.style.display = "none";
    if (window.location.href.indexOf('?') > -1) {
        history.pushState('', document.title, window.location.pathname);
    }
}


function search() {
    let input, filter, ul, li, span, i, txtValue;
    input = document.getElementById("searchUser");
    filter = input.value.toUpperCase();
    ul = document.getElementById("elementContainer");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        span = li[i].getElementsByTagName("span")[0];
        txtValue = span.textContent || span.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function userName(name) {
    if (name.includes("_")) {
        let array = name.split("_");
        return array.join(" ");
    } else {
        let array = name.split(" ");
        return array.join("_");
    }
}