const fs = require('fs');
const { domainToUnicode } = require('url');
const mockConsole = require('jest-mock-console');
const {default: userEvent} = require('@testing-library/user-event');

// must load document here, or else import below will fail
const html = fs.readFileSync("./index.html");
window.document.documentElement.innerHTML = html;
gallery = require("../main/gallery");

// Global declarations to be used in tests
const profileObject = {
    login: "octocat",
    avatar_url: "https://github.com/images/error/octocat_happy.gif",
    name: "monalisa octocat",
    location: "San Francisco",
    bio: "There once was...",
    public_repos: 2
};

const repoListResponse = {
    "data": {
        "repositoryOwner": {
            "repositories": {
                "nodes": [
                    {
                        "openGraphImageUrl": "https://repository-images.githubusercontent.com/369255294/8f03c100-be6e-11eb-9f71-4b844142645a",
                        "name": "github-repo-gallery",
                        "description": null,
                        "languages": {
                            "edges": [
                                {
                                    "node": {
                                        "name": "HTML"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "CSS"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "JavaScript"
                                    }
                                }
                            ]
                        },
                        "deployments": {
                            "totalCount": 0
                        },
                        "url": "https://github.com/krzwier/github-repo-gallery"
                    },
                    {
                        "openGraphImageUrl": "https://repository-images.githubusercontent.com/364132052/def35400-bcc5-11eb-977c-9b0c6bf7726b",
                        "name": "guess-the-word",
                        "description": "Web app where user inputs letters to guess a word randomly pulled from an API. (Racially sensitive version of a game known by another name.) ",
                        "languages": {
                            "edges": [
                                {
                                    "node": {
                                        "name": "HTML"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "CSS"
                                    }
                                },
                                {
                                    "node": {
                                        "name": "JavaScript"
                                    }
                                }
                            ]
                        },
                        "deployments": {
                            "totalCount": 1
                        },
                        "url": "https://github.com/krzwier/guess-the-word"
                    }
                ]
            }
        }
    }
};

const repoListArray = [
    {
        "openGraphImageUrl": "https://repository-images.githubusercontent.com/369255294/8f03c100-be6e-11eb-9f71-4b844142645a",
        "name": "github-repo-gallery",
        "description": null,
        "languages": {
            "edges": [
                {
                    "node": {
                        "name": "HTML"
                    }
                },
                {
                    "node": {
                        "name": "CSS"
                    }
                },
                {
                    "node": {
                        "name": "JavaScript"
                    }
                }
            ]
        },
        "deployments": {
            "totalCount": 0
        },
        "url": "https://github.com/krzwier/github-repo-gallery"
    },
    {
        "openGraphImageUrl": "https://repository-images.githubusercontent.com/364132052/def35400-bcc5-11eb-977c-9b0c6bf7726b",
        "name": "guess-the-word",
        "description": "Web app where user inputs letters to guess a word randomly pulled from an API. (Racially sensitive version of a game known by another name.) ",
        "languages": {
            "edges": [
                {
                    "node": {
                        "name": "HTML"
                    }
                },
                {
                    "node": {
                        "name": "CSS"
                    }
                },
                {
                    "node": {
                        "name": "JavaScript"
                    }
                }
            ]
        },
        "deployments": {
            "totalCount": 1
        },
        "url": "https://github.com/krzwier/guess-the-word"
    }

];

const fileListResponse = {
    "data": {
        "repository": {
            "object": {
                "entries": [
                    {
                        "name": ".gitignore",
                        "object": {
                            "text": ".DS_Store\nthumbs.db\n.vscode\n.eslintrc.json\n\nTODO\n\nnode_modules/\npackage-lock.json\ncoverage/"
                        }
                    },
                    {
                        "name": "README.md",
                        "object": {
                            "text": "# guess-the-word\n\nProject created in Javascript course in the [Skillcrush](https://skillcrush.com/) [Break Into Tech](https://skillcrush.com/break-into-tech-blueprint) program.\n\nPracticed TDD in working on this project.  Test coverage is 100%, including both UI and logic.  Tests written in Jest.  Also experimented with Mocha but did not end up using it in main (see mocha branch).\n\nDemo here: https://krzwier.github.io/guess-the-word\n"
                        }
                    },
                    {
                        "name": "css",
                        "object": {}
                    },
                    {
                        "name": "img",
                        "object": {}
                    },
                    {
                        "name": "index.html",
                        "object": {
                            "text": "<!DOCTYPE html>\n<html lang=\"en\">\n\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Guess the Word</title>\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" />\n    <link href=\"https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&family=Unlock&display=swap\"\n      rel=\"stylesheet\" />\n    <link rel=\"stylesheet\" href=\"css/normalize.css\" />\n    <link rel=\"stylesheet\" href=\"css/styles.css\" />\n    <script src=\"js/main/script.js\" defer></script>\n  </head>\n\n  <body>\n    <div class=\"container\">\n      <h1>\n        <img class=\"logo\" src=\"img/logo.png\" alt=\"Guess The Word\" />\n        </a>\n      </h1>\n      <p class=\"message\"></p>\n      <p class=\"word-in-progress\"></p>\n      <p class=\"remaining\">You have <span>8 guesses</span> remaining.</p>\n      <ul class=\"guessed-letters\"></ul>\n      <div class=\"guess-form\">\n        <label for=\"letter\">Type one letter:</label>\n        <input type=\"text\" name=\"letter\" class=\"letter\" />\n        <div class=\"form-element button-element\">\n          <button class=\"guess\">Guess!</button>\n        </div>\n      </div>\n      <button class=\"play-again hide\">Play Again!</button>\n    </div>\n  </body>\n\n</html>"
                        }
                    },
                    {
                        "name": "js",
                        "object": {}
                    },
                    {
                        "name": "package.json",
                        "object": {
                            "text": "{\n    \"name\": \"guess-the-word\",\n    \"type\": \"module\",\n    \"description\": \"\",\n    \"main\": \"js/main/script.js\",\n    \"keywords\": [],\n    \"author\": \"\",\n    \"license\": \"ISC\",\n    \"scripts\": {\n        \"test\": \"jest --verbose --coverage\",\n        \"debug\": \"node --debug-brk --inspect node_modules/.bin/jest\"\n    },\n    \"jest\": {\n        \"automock\": false,\n        \"setupFilesAfterEnv\": [\n            \"<rootDir>/setupJest.js\"\n        ]\n    },\n    \"devDependencies\": {\n        \"@testing-library/jest-dom\": \"^5.12.0\",\n        \"jest\": \"^26.5.0\",\n        \"jest-fetch-mock\": \"^3.0.3\"\n    }\n}\n"
                        }
                    },
                    {
                        "name": "setupJest.js",
                        "object": {
                            "text": "require('jest-fetch-mock').enableMocks();\n// global.fetch = require('@testing-library/jest-dom/extend-expect');\n// global.fetch = jest.fn(() =>\n//   Promise.resolve({\n//     json: () => Promise.resolve({ rates: { CAD: 1.42 } }),\n//   })\n// );"
                        }
                    }
                ]
            }
        }
    }
};

const repoListResponseWithDeployments = {
    "data": {
        "repositoryOwner": {
            "repositories": {
                "nodes": [
                    {
                        "openGraphImageUrl": "https://repository-images.githubusercontent.com/360380005/67d05f80-b955-11eb-8bd7-68b595b345d1",
                        "name": "spelling-tutor",
                        "description": "Web app I created to help my kids study their spelling lists.",
                        "languages": {
                          "edges": [
                            {
                              "node": {
                                "name": "HTML"
                              }
                            },
                            {
                              "node": {
                                "name": "CSS"
                              }
                            },
                            {
                              "node": {
                                "name": "JavaScript"
                              }
                            }
                          ]
                        },
                        "deployments": {
                          "totalCount": 13
                        },
                        "url": "https://github.com/krzwier/spelling-tutor"
                      }
                ]
            }
        }
    }
};

const fileListWithDeployments = {
    "data": {
      "repository": {
        "object": {
          "entries": [
            {
              "name": ".DS_Store",
              "object": {
                "text": null
              }
            },
            {
              "name": ".gitignore",
              "object": {
                "text": ".DS_Store"
              }
            },
            {
              "name": ".vscode",
              "object": {}
            },
            {
              "name": "README.md",
              "object": {
                "text": "# spelling-tutor\n\nI have four school-age children, and studying spelling is not always a pleasant affair 😬. There is often frustration and sometimes even tears, and keeping all of the different spelling lists straight for each of them can be tricky.\n\nI happened to be learning Javascript in a [Skillcrush](https://skillcrush.com/) course, and it occurred to me that I could practice my new skills while creating a web app for my kids to study their spelling lists.\n\nThe app grew and I added various easter eggs along the way, including gifs that display in response to certain user interactions (I fetched from the GIPHY API).  When I added a menu so that my kids could pick the voice that the computer used to read their spelling lists, spelling time turned into giggle time.  Our school year is now almost finished, but this app has seen lots of use.  Accordingly, it has benefitted from a lot of UI testing 😆.  The best part is that my kids are so proud that their mom created it 🦸‍♀️!  They even enjoy watching (and sometimes helping) when I update the code each week with their new spelling lists. Who knows--maybe I'm raising a new generation of coders!\n\nLive version [here](https://krzwier.github.io/spelling-tutor/).\n"
              }
            },
            {
              "name": "css",
              "object": {}
            },
            {
              "name": "img",
              "object": {}
            },
            {
              "name": "index.html",
              "object": {
                "text": "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Spelling Tutor</title>\n    <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Open+Sans:ital,wght@0,400;0,600;1,400&display=swap\" rel=\"stylesheet\" />\n    <link rel=\"stylesheet\" href=\"https://pro.fontawesome.com/releases/v5.10.0/css/all.css\" integrity=\"sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p\" crossorigin=\"anonymous\" />\n\n    <link rel=\"stylesheet\" href=\"css/styles.css\" />\n    <script src=\"js/script.js\" defer></script>\n</head>\n\n<body>\n    <!-- <div id=\"background\"></div> -->\n    <div class=\"landing modal\">\n        <div class=\"modal-container\">\n            <h1>Hello there!</h1>\n            <p>Who are you?</p>\n\n            <input id=\"name\" spellcheck=\"false\" placeholder=\"Type your name here\"></input>\n            <button id=\"submit-name\">Enter</button>\n            <button id=\"speech-settings\"><i class=\"fas fa-cog\"></i></button>\n        </div>\n    </div>\n\n    <div class=\"settings modal hide\">\n        <div class=\"modal-container\">\n            <button class=\"modal-x\"><i class=\"fas fa-times\"></i></button>\n            <h1>Speech Settings</h1>\n            <table>\n                <tr class=\"slider\">\n                    <td class=\"label\">Rate</td>\n                    <td class=\"middle\"><input class=\"range\" type=\"range\" min=\"0.5\" max=\"2\" value=\"1\" step=\"0.1\" id=\"rate\"></td>\n                    <td class=\"rate-value\">1</td>\n                </tr>\n                <tr class=\"slider\">\n                    <td class=\"label\">Pitch</td>\n                    <td class=\"middle\"><input class=\"range\" type=\"range\" min=\"0\" max=\"2\" value=\"1\" step=\"0.1\" id=\"pitch\"></td>\n                    <td class=\"pitch-value\">1</td>\n                </tr>\n            </table>\n            <select>\n            </select>\n        </div>\n        <div class=\"controls\">\n            <button id=\"play\" type=\"button\"><img src=\"img/voice-white.png\" alt=\"speak\"></button>\n            <button id=\"ok\" type=\"button\"><i class=\"fas fa-check\"></i></button>\n        </div>\n        </form>\n\n\n\n\n\n    </div>\n    </div>\n\n    <div class=\"entry modal hide\">\n        <div class=\"modal-container\">\n            <button class=\"modal-x\"><i class=\"fas fa-times\"></i></button>\n\n            <h1>Welcome, user!</h1>\n            <p>Are you ready to spell?</p>\n            <div class=\"two-wide\">\n                <button id=\"yes\">Yes</button>\n                <button id=\"no\">No</button>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"sad modal hide\">\n        <div class=\"modal-container\">\n            <button class=\"modal-x\"><i class=\"fas fa-times\"></i></button>\n\n            <img class=\"animated-gif\" src=\"img/sad-face.gif\" alt=\"Sad\" />\n        </div>\n    </div>\n\n\n\n    <div class=\"tsk modal hide\">\n        <div class=\"modal-container\">\n            <button class=\"modal-x\"><i class=\"fas fa-times\"></i></button>\n\n            <img class=\"animated-gif\" src=\"img/shake-head.gif\" alt=\"disapproving\" />\n\n        </div>\n    </div>\n\n    <div class=\"quiz modal hide\">\n        <div class=\"modal-container\">\n            <button class=\"modal-x\"><i class=\"fas fa-times\"></i></button>\n\n            <h1>Spelling Quiz</h1>\n\n            <div class=\"show-letter\"></div>\n\n            <div class=\"two-wide\">\n                <input spellcheck=\"false\" id=\"guess\"></input>\n                <button id=\"submit-guess\"><i class=\"fas fa-arrow-right\"></i></button>\n            </div>\n\n            <div class=\"two-wide\">\n                <p>Repeat word:</p>\n                <button id=\"speak-button\"><img src=\"img/voice-white.png\" alt=\"head speaking\" /></button>\n            </div>\n\n            <div class=\"meter\">\n                <span style=\"width: 0\"></span>\n            </div>\n            <p id=\"num-words\">Word</p>\n\n            <div class=\"please modal hide box sb\">\n                <h1>Wait, really?</h1>\n                <div class=\"modal-container\">\n\n                    <img class=\"animated-gif\" src=\"img/please.gif\" alt=\"please don't leave me\" />\n                </div>\n                <div>\n                    <button id=\"yes-close\">Yes</button>\n                    <button id=\"no-close\">No</button>\n                </div>\n\n            </div>\n        </div>\n    </div>\n\n    <div class=\"congrats modal hide\">\n        <div class=\"modal-container\">\n            <button class=\"modal-x\"><i class=\"fas fa-times\"></i></button>\n\n\n            <img class=\"animated-gif\" src=\"img/celebrate.gif\" alt=\"celebrate\" />\n\n        </div>\n    </div>\n\n\n\n</body>\n\n</html>"
              }
            },
            {
              "name": "js",
              "object": {}
            },
            {
              "name": "package.json",
              "object": {
                "text": "{\n  \"name\": \"spelling-tutor\",\n  \"version\": \"1.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.html\",\n  \"dependencies\": {},\n  \"keywords\": []\n}"
              }
            }
          ]
        }
      }
    }
  };

const readmeHTMLWithDeployments = 
    '<h1><a id="user-content-spelling-tutor" class="anchor" href="#spelling-tutor" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>spelling-tutor</h1>' +
    '<p>I have four school-age children, and studying spelling is not always a pleasant affair <g-emoji class="g-emoji" alias="grimacing" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f62c.png">😬</g-emoji>. There is often frustration and sometimes even tears, and keeping all of the different spelling lists straight for each of them can be tricky.</p>' +
    '<p>I happened to be learning Javascript in a <a href="https://skillcrush.com/" rel="nofollow">Skillcrush</a> course, and it occurred to me that I could practice my new skills while creating a web app for my kids to study their spelling lists.</p>' +
    '<p>The app grew and I added various easter eggs along the way, including gifs that display in response to certain user interactions (I fetched from the GIPHY API).  When I added a menu so that my kids could pick the voice that the computer used to read their spelling lists, spelling time turned into giggle time.  Our school year is now almost finished, but this app has seen lots of use.  Accordingly, it has benefitted from a lot of UI testing <g-emoji class="g-emoji" alias="laughing" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f606.png">😆</g-emoji>.  The best part is that my kids are so proud that their mom created it <g-emoji class="g-emoji" alias="superhero_woman" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f9b8-2640.png">🦸‍♀️</g-emoji>!  They even enjoy watching (and sometimes helping) when I update the code each week with their new spelling lists. Who knows--maybe I\'m raising a new generation of coders!</p>' +
    '<p>Live version <a href="https://krzwier.github.io/spelling-tutor/" rel="nofollow">here</a>.</p>';


const readmeHTML =
    '<h1><a id="user-content-guess-the-word" class="anchor" href="#guess-the-word" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>guess-the-word</h1>' +
    '<p>Project created in Javascript course in the <a href="https://skillcrush.com/" rel="nofollow">Skillcrush</a> <a href="https://skillcrush.com/break-into-tech-blueprint" rel="nofollow">Break Into Tech</a> program.</p>' +
    '<p>Practiced TDD in working on this project.  Test coverage is 100%, including both UI and logic.  Tests written in Jest.  Also experimented with Mocha but did not end up using it in main (see mocha branch).</p>' +
    '<p>Demo here: <a href="https://krzwier.github.io/guess-the-word" rel="nofollow">https://krzwier.github.io/guess-the-word</a></p>';


beforeEach(() => {
    jest.resetModules();
    fetch.resetMocks();
    window.document.documentElement.innerHTML = html;
    gallery = require("../main/gallery");
});

afterEach(() => {

    window.document.documentElement.innerHTML = "";
});

describe('fetchProfile(username)', () => {

    it('calls API and returns data', async () => {
        fetch.mockResponseOnce(JSON.stringify(profileObject), { status: 200 });
        const result = await gallery.fetchProfile("octocat");
        expect(result).toEqual(profileObject);
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/users/octocat`);

    });

    it('prints error to console when fetch is rejected', async () => {
        const restoreConsole = mockConsole();
        fetch.mockReject(() => Promise.reject("API is down"));
        const result = await gallery.fetchProfile("octocat");
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/users/octocat');
        expect(console.error.mock.calls.length).toEqual(2);
        expect(console.error.mock.calls[0][0]).toContain('API call');
        expect(console.error.mock.calls[1][0]).toContain('Failed conversion to JSON');
        restoreConsole();
    });

});

describe('displayProfile(userData)', () => {
    it('creates figure with correct link inside overview element', () => {
        gallery.displayProfile(profileObject);
        const newImg = window.document.querySelector('.overview>div>figure>img');
        expect(newImg.src).toBe("https://github.com/images/error/octocat_happy.gif");
    });

    it('displays correct name inside overview element', () => {
        gallery.displayProfile(profileObject);
        const infoDiv = window.document.querySelector(".overview>div>div");
        expect(infoDiv.innerHTML).toContain("<p><strong>Name:</strong> monalisa octocat</p>");
    });
});

describe('fetchRepoList(username)', () => {

    it('calls API and returns data', async () => {
        fetch.mockResponseOnce(JSON.stringify(repoListResponse));
        const result = await gallery.fetchRepoList("krzwier");
        expect(result).toEqual(repoListArray);
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual(`https://api.github.com/graphql`);
    });

    it('prints error to console when fetch is rejected', async () => {
        const restoreConsole = mockConsole();
        fetch.mockReject(() => Promise.reject("API is down"));
        await gallery.fetchRepoList("octocat");
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/graphql');
        expect(console.error.mock.calls.length).toEqual(2);
        expect(console.error.mock.calls[0][0]).toContain('API call');
        expect(console.error.mock.calls[1][0]).toContain('Failed conversion to JSON');
        restoreConsole();
    });

});

describe('displayRepoList(repoData)', () => {

    it('displays repos as list items inside repo-list element', () => {
        const repoData = repoListArray;
        gallery.displayRepoList(repoData);
        const listItems = window.document.querySelectorAll(".repo-list>li");
        expect(listItems.length).toEqual(2);
    });

    it('displays correct name inside of repo list element', () => {
        gallery.displayRepoList(repoListArray);
        const listItemTitle = window.document.querySelector(".repo-list>li>h3");
        expect(listItemTitle.textContent).toBe("github-repo-gallery");
    });
});


describe('getRepoInfo(repoName)', () => {

    it('retrieves info from array, fetches readme text, and returns correct data', async () => {
        fetch.mockResponses(
            [
                JSON.stringify(repoListResponse),
                { status: 200 }
            ],
            [
                JSON.stringify(fileListResponse),
                { status: 200 }
            ]);
        await gallery.fetchRepoList("krzwier");
        const returnedData = await gallery.getRepoInfo("guess-the-word");
        expect(returnedData.repoName).toEqual("guess-the-word");
        const expectedReadme = "# guess-the-word\n\nProject created in Javascript course in the [Skillcrush](https://skillcrush.com/) [Break Into Tech](https://skillcrush.com/break-into-tech-blueprint) program.\n\nPracticed TDD in working on this project.  Test coverage is 100%, including both UI and logic.  Tests written in Jest.  Also experimented with Mocha but did not end up using it in main (see mocha branch).\n\nDemo here: https://krzwier.github.io/guess-the-word\n";
        expect(returnedData.readme).toEqual(expectedReadme);
        expect(returnedData.languages).toEqual(["HTML", "CSS", "JavaScript"]);
        expect(returnedData.picUrl).toEqual("https://repository-images.githubusercontent.com/364132052/def35400-bcc5-11eb-977c-9b0c6bf7726b");
        expect(returnedData.url).toEqual("https://github.com/krzwier/guess-the-word");
        expect(returnedData.numDeployments).toEqual(1);

    });

    it('prints errors to console when fetch fails', async () => {
        const restoreConsole = mockConsole();
        fetch.mockResponseOnce(JSON.stringify(repoListResponse));
        const result = await gallery.fetchRepoList("krzwier");
        fetch.resetMocks();
        fetch.mockRejectOnce(() => Promise.reject("API is down"));
        await gallery.getRepoInfo("guess-the-word");
        expect(console.error.mock.calls.length).toEqual(2);
        expect(console.error.mock.calls[0][0]).toContain('API call to https://api.github.com/graphql rejected in getRepoInfo');
        expect(console.error.mock.calls[1][0]).toContain('Failed conversion to JSON in getRepoInfo');
        restoreConsole();

    });

});

describe('Clicking on a repo', () => {

    it('unhides repo data and hides repo list', async () => {
        fetch.mockResponses(
            [
                JSON.stringify(repoListResponse),
                { status: 200 }
            ],
            [
                JSON.stringify(fileListResponse),
                { status: 200 }
            ],
            [
                readmeHTML,
                { status: 200 }
            ]);
        const result = await gallery.fetchRepoList("krzwier");
        const repoTitle = document.querySelector(".repo-list>li>h3");
        repoTitle.click();
        // wait for click to propagate up parent elements and complete
        await new Promise((r) => setTimeout(r, 1000));
        const repoData = document.querySelector(".repo-data");
        const repos = document.querySelector(".repos");
        expect(repoData.classList).not.toContain("hide");
        expect(repos.classList).toContain("hide");
    });
    
    it('shows "live version" button if repo has deployments', async () => {
        fetch.mockResponses(
            [
                JSON.stringify(repoListResponseWithDeployments),
                { status: 200 }
            ],
            [
                JSON.stringify(fileListWithDeployments),
                { status: 200 }
            ],
            [
                readmeHTMLWithDeployments,
                { status: 200 }
            ]);
        const result = await gallery.fetchRepoList("krzwier");
        const repoTitle = document.querySelector(".repo-list>li>h3");
        repoTitle.click();
        // wait for click to propagate up parent elements and complete
        await new Promise((r) => setTimeout(r, 1000));
        const liveButton = document.querySelector(".live");
        expect(liveButton).not.toBeNull();
    });

});

describe('Clicking on area in repo-list but outside repo', () => {

    it('does nothing', async () => {
        gallery.displayRepoList(repoListArray);

        // act
        const repoListUL = document.querySelector(".repo-list");
        repoListUL.click();

        // assert after waiting for click event to propagate
        setTimeout(() => {
            const repoData = document.querySelector(".repo-data");
            const repos = document.querySelector(".repos");
            expect(repoData.classList).toContain("hide");
            expect(repos.classList).not.toContain("hide");
        }, 1000);

    });


});

describe('clicking "Back to Repo Gallery" button', () => {

    it('hides repo info, unhides repo list, and hides itself', () => {
        const repos = document.querySelector('.repos');
        const repoData = document.querySelector('.repo-data');
        const backToGallery = document.querySelector('.view-repos');

        backToGallery.click();

        expect(repos.classList).not.toContain("hide");
        expect(repoData.classList).toContain("hide");
        expect(backToGallery.classList).toContain("hide");

    });

});

describe('typing in the search box', () => {

    it('"z" hides all repos', () => {
        gallery.displayRepoList(repoListArray);
        const filterInput = document.querySelector('.filter-repos');
        userEvent.type(filterInput, "z");
        const hiddenRepos = window.document.querySelectorAll(".repo.hide");
        expect(hiddenRepos.length).toEqual(2);
    });

    it('"g" hides no repos', () => {
        gallery.displayRepoList(repoListArray);
        const filterInput = document.querySelector('.filter-repos');
        userEvent.type(filterInput, "g");
        const hiddenRepos = window.document.querySelectorAll(".repo.hide");
        expect(hiddenRepos.length).toEqual(0);
    });


    it('"gu" hides 1 repo', () => {
        gallery.displayRepoList(repoListArray);
        const filterInput = document.querySelector('.filter-repos');
        userEvent.type(filterInput, "gu");
        const hiddenRepos = window.document.querySelectorAll(".repo.hide");
        expect(hiddenRepos.length).toEqual(1);
    });

})

