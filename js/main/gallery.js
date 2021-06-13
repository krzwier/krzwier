const { lineBreak } = require("acorn");
const { HmacSHA3 } = require("crypto-js");
const funkyTown = require("./funkyTown");
const imagesLoaded = require('imagesloaded');
const Masonry = require('masonry-layout');


// const overview = document.querySelector('.overview');

const repoListDiv = document.querySelector('.repo-list');

const repos = document.querySelector('.repos');

const repoData = document.querySelector('.repo-data');

const backToGallery = document.querySelector('.view-repos');

const filterInput = document.querySelector('.filter-repos');

const moreButton = document.querySelector('.more');

const username = "krzwier";

let repoList = [];

let pinnedList = [];

let more = false;

const repoListQuery = {
    'query': 'query { ' +
        'repositoryOwner(login: "' + username + '") { ' +
        '... on ProfileOwner {' +
        'itemShowcase {' +
        'items(first: 6) {' +
        'edges {' +
        'node {' +
        '... on Repository {' +
        'name' +
        '}' +
        '}' +
        '}' +
        '}' +
        '}' +
        '}' +
        'repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 100, privacy: PUBLIC) {' +
        'nodes {' +
        'openGraphImageUrl,' +
        'name,' +
        'description,' +
        'languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {' +
        'edges {' +
        'node {' +
        'name' +
        '}' +
        '}' +
        '},' +
        'deployments {' +
        'totalCount' +
        '},' +
        'url' +
        '}' +
        '}' +
        '}' +
        '}'
};

const fetchRepoList = async function (username) {

    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/JSON',
            'Content-Type': 'application.JSON',
            'Authorization': 'token ' + funkyTown(mess(), str())
        },
        body: JSON.stringify(repoListQuery)
    }).catch((e) => {
        console.error(`API call to https://api.github.com/graphql rejected in fetchRepoList("${username}") function: ${e.message}`);
    });
    try {
        const repoListObject = await res.json();
        repoList = repoListObject.data.repositoryOwner.repositories.nodes;
        const pins = repoListObject.data.repositoryOwner.itemShowcase.items.edges;
        pinnedList = [];
        for (let pin of pins) {
            pinnedList.push(pin.node.name.toLowerCase());
        }
        displayRepoList(repoList);
        return repoList;
    } catch (e) {
        console.error(`Failed conversion to JSON in fetchRepoList("${username}" function: ${e.message}`);
    };

}

const displayRepoList = function (repoList) {

    filterInput.classList.remove("hide");
    for (let repo of repoList) {
        const languages = document.createElement("ul");
        languages.classList.add("language-list");
        for (let language of repo.languages.edges) {
            const item = document.createElement("li");
            item.textContent = language.node.name;
            languages.append(item);
        }
        const li = document.createElement("div");
        li.classList.add("repo");
        if (pinnedList.includes(repo.name.toLowerCase())) {
            li.classList.add("brick");
        } else {
            li.classList.add("hide");
        }


        li.innerHTML =
            '<div class="card">' +
            '<img class="card-img-top" src="' + repo.openGraphImageUrl + '" alt="preview image">' +
            '<div class="card-body">' +
            '<h3 class="card-title">' + repo.name + '</h3>' +
            '<p class="card-text">' + repo.description + '</p>' +
            languages.outerHTML +
            '</div>' +
            '</div>';
        repoListDiv.append(li);
    }

    // wait until all images are loaded, then update masonry grid
    refreshMasonry();

    // imagesLoaded(repoListDiv, function () {
    //     // init Isotope after all images have loaded
    //     const msnry = new Masonry(repoListDiv, {
    //         itemSelector: '.repo',
    //         // columnWidth: '.grid-sizer',
    //         percentPosition: true
    //     });
    // });


}

const refreshMasonry = async function () {
    imagesLoaded(repoListDiv, function () {
        // init Isotope after all images have loaded
        const msnry = new Masonry(repoListDiv, {
            itemSelector: '.brick',
            // columnWidth: '.grid-sizer',
            percentPosition: true
        });
    });
};

window.onresize = refreshMasonry;

const mess = function () {
    return "U2F" +
        "sdGVkX1+djzTv+2R/SUPW6/" + "cyhJT3J0IUv6m" +
        "52MQAl3c29Y4" + "e0r1amKnmvPUAWIG0VcdbzIPbAxCBzX4" +
        "/ug==";
}

repoListDiv.addEventListener("click", async function (e) {
    let element = e.target;
    // let element = e.target;
    if (e.target.classList.contains("repo-list")) {
        return;
    } else {
        while (!element.classList.contains("repo")) {
            element = element.parentElement;
        }
    }
    const header = element.querySelector("h3");
    const repoName = header.textContent;
    let repoInfo = {};
    repoInfo = await getRepoInfo(repoName).catch((e) => {
        console.error(`getRepoInfo("${repoName}") function rejected promise when called by repo-list click event handler: ${e.message}`);
    });
    try {
        await displayRepoInfo(repoName, repoInfo.readme, repoInfo.languages, repoInfo.picUrl, repoInfo.url, repoInfo.numDeployments);
    } catch (e) {
        console.error(`displayRepoInfo("${repoName}", "${repoInfo.readme}", ${repoInfo.languages}, "${repoInfo.picUrl}", "${repoInfo.url}", ${repoInfo.numDeployments}) function failed when called by repo-list click event handler: ${e.message}`);
    };

    document.querySelector('#portfolio').scrollIntoView();

});


const getRepoInfo = async function (repoName) {
    let picUrl = "";
    let url = "";
    let numDeployments = 0;
    const languages = [];
    for (let repo of repoList) {
        if (repo.name === repoName) {
            for (let language of repo.languages.edges) {
                languages.push(language.node.name);
            }
            picUrl = repo.openGraphImageUrl;
            url = repo.url;
            numDeployments = repo.deployments.totalCount;
            break;
        }
    }
    // fetch readme file
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Accept': 'application/JSON',
            'Content-Type': 'application.JSON',
            'Authorization': 'token ' + funkyTown(mess(), str())
        },
        body: JSON.stringify({
            'query': 'query { ' +
                'repository(owner: "' + username + '", name: "' + repoName + '") { ' +
                'object(expression: "HEAD:") {' +
                '... on Tree {' +
                'entries {' +
                'name,' +
                'object {' +
                '... on Blob {' +
                'text' +
                '}' +
                '}' +
                '}' +
                '}' +
                '}' +
                '}' +
                '}'
        })
    }).catch((e) => {
        console.error(`API call to https://api.github.com/graphql rejected in getRepoInfo("${repoName}") function: ${e.message}`);
    });
    let readme = "";
    try {
        const files = await res.json();
        for (let file of files.data.repository.object.entries) {
            if (file.name.toUpperCase() === "README.MD") {
                readme = file.object.text;
                break;
            }
        }
    } catch (e) {
        console.error(`Failed conversion to JSON in getRepoInfo("${repoName}" function: ${e.message}`);
    };
    return { repoName, readme, languages, picUrl, url, numDeployments };

};

const displayRepoInfo = async function (repoName, rawReadme, languages, picUrl, url, numDeployments) {

    const res = await fetch("https://api.github.com/markdown", {
        method: "POST",
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            'text': rawReadme
        })
    }).catch((e) => {
        console.error(`API call to https://api.github.com/markdown rejected in displayRepoInfo("${repoName}", "${rawReadme}", ${languages}, "${picUrl}", "${url}", ${numDeployments}) function: ${e.message}`);
    });
    let readme = "";
    try {
        readme = await res.text();
    } catch (e) {
        console.error(`Failed conversion to text in displayRepoInfo("${repoName}", "${rawReadme}", ${languages}, "${picUrl}", "${url}", ${numDeployments}) function: ${e.message}`);
    };
    const languagesUL = document.createElement("ul");
    languagesUL.classList.add("language-list");
    for (let language of languages) {
        const item = document.createElement("li");
        item.textContent = language;
        languagesUL.append(item);
    }
    repoData.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.classList.add("repo-info-wrapper");
    let htmlString =
        '<div><img src="' + picUrl + '" alt="preview image"></div>' +
        '<div class="readme">' +
        readme +
        "<div>" + languagesUL.outerHTML + "</div>" +
        '<div class="buttons"><a class="visit" href="' + url + '" target="_blank" rel="noreferrer noopener">GitHub Repo</a>';
    if (numDeployments >= 1) {
        htmlString = htmlString +
            '<a class="visit live" href="https://' + username + '.github.io/' + repoName + '/" target="_blank" rel="noreferrer noopener">Live Version</a></div>';
    } else {
        htmlString = htmlString + '</div>';
    }
    htmlString = htmlString + '</div>';
    newDiv.innerHTML = htmlString;
    repoData.append(newDiv);


    repoData.classList.remove("hide");
    repos.classList.add("hide");
    moreButton.classList.add("hide");
    backToGallery.classList.remove("hide");
};

backToGallery.addEventListener("click", async function () {
    repos.classList.remove("hide");
    repoData.classList.add("hide");
    backToGallery.classList.add("hide");
    moreButton.classList.remove("hide");
    await refreshMasonry();
    document.querySelector('#portfolio').scrollIntoView();
});

filterInput.addEventListener("input", function (e) {
    chooseVisibleRepos();
});

const chooseVisibleRepos = function () {
    const searchText = filterInput.value.toLowerCase();
    const repos = document.querySelectorAll(".repo");
    for (let repo of repos) {
        const repoHeader = repo.querySelector("h3");
        const repoTitle = repoHeader.textContent.toLowerCase();
        if (repoTitle.includes(searchText)) {
            if (!more && !pinnedList.includes(repoTitle)) {
                repo.classList.add("hide");
                repo.classList.remove("brick");
            } else {
                repo.classList.remove("hide");
                repo.classList.add("brick");
            }
        } else {
            repo.classList.add("hide");
            repo.classList.remove("brick");
        }
    }
    refreshMasonry();
}

moreButton.addEventListener("click", function (e) {
    more = !more;
    if (more) {
        moreButton.innerHTML = 'Show less &uarr;';
    } else {
        moreButton.innerHTML = 'Show more &darr;';
    }
    chooseVisibleRepos();
    if (!more) {
        document.querySelector('#portfolio').scrollIntoView();
    }
});

const str = function () {
    return "wG5MsUxQiia45xu5iUX" + "pgs" + "y4nGZ9W9jFNViWg" +
        "3BDHQaPnfxKnioaw7TW9JqrTbUt";
}

/* istanbul ignore next */
module.exports = {
    fetchRepoList,
    displayRepoList,
    getRepoInfo
};
