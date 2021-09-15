
var sndStats = []; // will go by gamertag
var hpStats = [];
var teamStats = [];
var playoffs = [];

function fadeOut(callback) {
    $("#body").fadeOut("fast", function () {
        callback();
    });
}

function loadAbout() {
    update_url('/about');
    document.getElementById("webTitle").innerHTML = "DSCDL - About";
    document.getElementById("indexPage").setAttribute("class", "nav-item disabled");
    document.getElementById("adminPage").setAttribute("class", "nav-item disabled");
    document.getElementById("aboutPage").setAttribute("class", "nav-item active");
    loadHtmlIntoId("body", "about.html", function () {
        $('#bustinvsskeary').ready(function () {

            $("#body").fadeIn("slow", function () {

            });
            //your code (will be called once iframe is done loading)
        });

    });
}

function update_url(url) {
    history.pushState(null, null, url);
}

function loadMain() {
    var loc = window.location.pathname;

    if (loc === "/about") {
        loadAbout();
    } else if (loc === "/admin") {
        loadLogin();
    } else {
        loadHome();
    }
}

function loadHome() {
    update_url('/home');
    document.getElementById("webTitle").innerHTML = "DSCDL - Home";
    document.getElementById("indexPage").setAttribute("class", "nav-item active");
    document.getElementById("adminPage").setAttribute("class", "nav-item disabled");
    document.getElementById("aboutPage").setAttribute("class", "nav-item disabled");

    loadHtmlIntoId("body", "main.html", function () {
        var canvas = document.getElementById('yoffs');
        //Always check for properties and methods, to make sure your code doesn't break in other browsers.
        if (canvas.getContext) {
            var context = canvas.getContext('2d');
        }


        document.getElementById("seasonTitle").innerHTML = "Season " + szn;

        generateDefaults(function (c) {
            //  alert('generated defaults');


            calculateStats(function () {

                var teams = getTeams(function (jsonData) {
                    var j = 0;
                    Object.keys(jsonData).forEach(function (key) {
                        var value = jsonData[key];

                        var team = addContent("div", "viewteams", value["abbr"])
                        team.setAttribute("class", "col-sm font-weight-bold");
                        var tstats = teamStats[value["abbr"]];
                        team.innerHTML = "Team [" + value["abbr"] + "]" + " (" + tstats.seed + ")";

                        var team2 = addContent("div", value["abbr"], "team_" + value["abbr"])
                        team2.setAttribute("class", "col-sm font-weight-bold");
                        team2.innerHTML = "(" + tstats.wins + "-" + tstats.losses + ") " + tstats.points + " pts.";


                        var players = getPlayersByTeam(value["abbr"], function (player) {
                            var i = 0;
                            Object.keys(player).forEach(function (k) {
                                var v = player[k];

                                //addContent("br", value["abbr"], "");
                                var p = addContent("p", "team_" + value["abbr"], "");
                                p.setAttribute("class", "font-weight-normal");
                                p.style.marginTop = "0px";
                                p.style.marginBottom = "0px";
                                p.innerHTML = v["gamertag"] + " (" + (sndStats[v["gamertag"]].kills / sndStats[v["gamertag"]].deaths).toFixed(2) + ")";

                                if (typeof (jsonData[j + 1]) === 'undefined' && typeof (player[i + 1]) === 'undefined') {
                                    //alert('how many times?');
                                    {
                                        var names = [];
                                        var kills = [];
                                        var deaths = [];
                                        var kd = [];
                                        var ppg = [];
                                        var dpg = [];
                                        var score = [];
                                        var o = 0;
                                        for (var entry in sndStats) {

                                            names[o] = entry;
                                            kills[o] = sndStats[entry].kills;
                                            deaths[o] = sndStats[entry].deaths;
                                            ppg[o] = (sndStats[entry].plants / sndStats[entry].gamesplayed).toFixed(2);
                                            dpg[o] = (sndStats[entry].defuses / sndStats[entry].gamesplayed).toFixed(2);
                                            score[o] = (sndStats[entry].score / sndStats[entry].gamesplayed).toFixed(2);
                                            // kd[o] = 0;

                                            kd[o] = (sndStats[entry].kills / sndStats[entry].deaths).toFixed(2);
                                            o++;
                                        }


                                        let chart = document.getElementById("chart").getContext('2d');



                                        let statsChart = new Chart(chart, {
                                            type: 'bar',
                                            data: {
                                                labels: names,
                                                datasets: [{
                                                    label: 'Kills',
                                                    data: kills,

                                                    hidden: true
                                                },
                                                {
                                                    label: 'Deaths',
                                                    data: deaths,

                                                    hidden: true
                                                },
                                                {
                                                    label: 'K/D',
                                                    data: kd,

                                                },
                                                {
                                                    label: 'PPG',
                                                    data: ppg,

                                                },
                                                {
                                                    label: 'DPG',
                                                    data: dpg,

                                                },
                                                {
                                                    label: 'SPG',
                                                    data: score,
                                                    hidden: true

                                                }]
                                            },
                                            options: {}
                                        });


                                        var length = statsChart.data.datasets.length;
                                        for (var b = 0; b < length; b++) {
                                            var startAt = 0.25;
                                            var endAt = 1.0;
                                            var increment = (endAt - startAt) / length;
                                            // we need to generate a number from 0 to 1, so

                                            statsChart.data.datasets[b].backgroundColor = d3.interpolateRainbow(startAt + (b * increment));
                                        }

                                        statsChart.update();
                                    }


                                    {
                                        var names = [];
                                        var kills = [];
                                        var deaths = [];
                                        var kd = [];
                                        var tpg = [];
                                        var dpg = [];
                                        var score = [];
                                        var o = 0;
                                        for (var entry in hpStats) {

                                            names[o] = entry;
                                            kills[o] = hpStats[entry].kills;
                                            deaths[o] = hpStats[entry].deaths;
                                            tpg[o] = (hpStats[entry].time / hpStats[entry].gamesplayed).toFixed(2);
                                            dpg[o] = (hpStats[entry].defends / hpStats[entry].gamesplayed).toFixed(2);
                                            score[o] = (hpStats[entry].score / hpStats[entry].gamesplayed).toFixed(2);
                                            // kd[o] = 0;

                                            kd[o] = (hpStats[entry].kills / hpStats[entry].deaths).toFixed(2);
                                            o++;
                                        }


                                        let chart = document.getElementById("chartHp").getContext('2d');



                                        let statsChart = new Chart(chart, {
                                            type: 'bar',
                                            data: {
                                                labels: names,
                                                datasets: [{
                                                    label: 'Kills',
                                                    data: kills,

                                                    hidden: true
                                                },
                                                {
                                                    label: 'Deaths',
                                                    data: deaths,

                                                    hidden: true
                                                },
                                                {
                                                    label: 'SPG',
                                                    data: score,
                                                    hidden: true

                                                },
                                                {
                                                    label: 'K/D',
                                                    data: kd,

                                                },
                                                {
                                                    label: 'TPG',
                                                    data: tpg,

                                                },
                                                {
                                                    label: 'DPG',
                                                    data: dpg,

                                                }
                                                ]
                                            },
                                            options: {}
                                        });


                                        var length = statsChart.data.datasets.length;
                                        for (var b = 0; b < length; b++) {
                                            var startAt = 0.25;
                                            var endAt = 1.0;
                                            var increment = (endAt - startAt) / length;
                                            // we need to generate a number from 0 to 1, so

                                            statsChart.data.datasets[b].backgroundColor = d3.interpolateInferno(startAt + (b * increment));
                                        }

                                        statsChart.update();



                                    }
                                    setTimeout(function () {
                                        $("#body").fadeIn("slow", function () {
                                            // Animation complete


                                        });
                                    }, 100);

                                }

                                i++;
                            });
                        });

                        j++;
                    });
                });

            });
        });


    });

    // should output "TEST"
    //guiMain.load();
    // initialize the Gui's and call it's load function

    /*
        clear();
        //document.getElementById('contentPanel').innerHtml = "hello";
        var left = addLeftPanel(15);
    
        for (var i = 0; i < 100; i++) {
            var a = addContent('div', 'leftPanel', 'test');
            a.innerHTML = "YUH YUH YUH YUH";
        }
    
        var l = addContent('div', 'leftPanel', 'test');
    
        l.innerHTML = "LAST";
        loadTable();/*
    }
    
    
    function clear() {
        let left = document.getElementById('leftPanel');
    
        if (left != null) {
            left.parentNode.removeChild(left);
            left.remove();
        }
    
    
        var panel = document.getElementById('contentPanel');
        panel.innerHTML = ' ';
        panel.style.width = '100%';
    }
    
    function addLeftPanel(leftWidth) {
        var panel = document.getElementById("contentPanel");
        panel.style.width = (100 - leftWidth) + '%';//70%';
        var left = addContent("div", "leftPos", "leftPanel");
        left.setAttribute('class', 'col-sm-4');
        left.style.width = leftWidth + "%";;
    
        return left;
    }
    
    function loadTable() {
        //deleteContent();
        var table = addContent("table", "contentPanel", "table");
        //table.setAttribute("style", "padding:10px");
        table.innerHTML = "";
        table.setAttribute("class", "border");
    
        //  table.setAttribute("contenteditable", "true");
        // this just clears the table
        var statHeaders = ["Player", "K/D", "Kills", "Deaths", "Avg Score", "Avg Plants", "Avg Defuses"]
    
        for (var i = 0; i < 20; i++) { // 10 players for example
            var row = table.insertRow(i);
            row.setAttribute("class", "border");
    
            if (i % 2 == 0) {
                row.setAttribute("style", "border-collapse:separate;background-color:#f5f5f2");
            } else {
                row.setAttribute("style", "border-collapse:separate;background-color:#fafafa");
            }
    
            for (var j = 0; j < statHeaders.length; j++) {
                var cell = row.insertCell(j);
                cell.setAttribute("style", "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px");
                if (i == 0) {
                    row.setAttribute("style", "border-collapse:separate;background-color:#fafafa;padding-top:15px;padding-bottom:15px;color:white;background-color:#67a2a3");
                    cell.innerHTML = statHeaders[j];
                } else {
                    cell.innerHTML = "0.10";
                }
    
                cell.setAttribute("class", "unselectable");
                cell.onclick = function () {
    
                    clickAtId(this);
                };
            }
        }
    }
    
    function clickAtId(element) {
        // getPlayer("snegboi69");
        //addPlayer("YES BOI", "aksudhuasydhuasydtausydg GUY", "HUGE MAN", "lol.jpg"); // confirmed works.
        /* await fetch('http://localhost:3000/getplayer/snegboi69', {
             headers: {
                 'Content-Type': 'application/json'
             },
             method: 'GET'
         })
             .then(res => {
                 if (res.ok) {
                     window.alert(res.json());
                 } else {
                     throw Error(`Request rejected with status ${res.status}`);
                 }
             })
             .catch(console.error);
    */
    //alert(element.cellIndex + ", " + element.parentNode.rowIndex);
}


// this function will add up all of the stats and assign a 'stats' element to each gamertag
// go by abbr



var TeamStats = function (wins, losses, points) { // matchid is saved. //game number is like 1-5
    this.wins = wins;
    this.losses = losses;
    this.points = points;
    this.seed = 0;
    return this;
};

var SNDStats = function (score, kills, deaths, plants, defuses) { // matchid is saved. //game number is like 1-5
    this.kills = kills;
    this.score = score;
    this.deaths = deaths;
    this.plants = plants;
    this.defuses = defuses;
    this.gamesplayed = 0;

    this.add = function (score, kills, deaths, plants, defuses) {
        this.gamesplayed++;
        this.kills += kills;
        this.score += score;
        this.deaths += deaths;
        this.plants += plants;
        this.defuses += defuses;
    }
    return this;
};

var HPStats = function (score, kills, deaths, plants, defuses) { // matchid is saved. //game number is like 1-5
    this.gamesplayed = 0;
    this.score = score;
    this.kills = kills;
    this.time = deaths;
    this.deaths = plants;
    this.defends = defuses;
    this.gamesplayed = 0;
    this.add = function (score, kills, deaths, plants, defuses) {
        this.gamesplayed++;
        this.kills += kills;
        this.score += score;
        this.time += deaths;
        this.deaths += plants;
        this.defends += defuses;
    }
    return this;
};

function calculateStats(callback) {

    getPlayers(function (pl) {
        for (var kk in Object.keys(pl)) {
            var player = pl[kk];

            sndStats[player["gamertag"]] = new SNDStats(0, 0, 0, 0, 0);
            hpStats[player["gamertag"]] = new HPStats(0, 0, 0, 0, 0);
        }
    });

    getTeams(function (t) {
        for (var kk in Object.keys(t)) {
            var e = t[kk];

            teamStats[e["abbr"]] = new TeamStats(0, 0, 0);
        }
    });

    // this will
    for (var key in teamStats) {
        teamStats[key].wins = 0;
        teamStats[key].losses = 0;
        teamStats[key].points = 0;
    }

    for (var key in sndStats) {
        sndStats[key].score = 0;
        sndStats[key].kills = 0;
        sndStats[key].deaths = 0;
        sndStats[key].plants = 0;
        sndStats[key].defuses = 0;
    }

    for (var key in hpStats) {
        hpStats[key].score = 0;
        hpStats[key].kills = 0;
        hpStats[key].deaths = 0;
        hpStats[key].time = 0;
        hpStats[key].defends = 0;
    }

    var index = 0;
    getMatches(function (match) {


        if (Object.keys(match).length == 0) {
            callback();
            return;
        }

        Object.keys(match).forEach(function (k) {
            var m = match[k];

            var bestOf = m["best_of"];
            // now, if all


            var team1score = 0;
            var team2score = 0;
            var loserpoint = false;
            var hpWinner = 0; // 1 = team 2
            var jdex = 0;
            getGames(m["match_id"], function (j) {
                var sndCount = 0;


                Object.keys(j).forEach(function (l) {
                    var g = j[l];

                    var t1 = g["team1points"];
                    var t2 = g["team2points"];


                    if (t1 > t2) {

                        if (g["gamemode"] === "HP") {
                            hpWinner = 1;
                        } else {
                            team1score++;
                        }
                    } else if (t2 > t1) {
                        //team2score++;
                        if (g["gamemode"] === "HP") {
                            hpWinner = 2;
                        } else {
                            team2score++;
                        }
                    }

                    if (g["gamemode"] === "SND") {
                        sndCount++;
                    }

                    getStats(m["match_id"], g["game_id"], -1, -1, function (p) {

                        if (p != null) {
                            if (g["gamemode"] == "SND") {
                                if (typeof (sndStats[p["gamertag"]]) === 'undefined') {
                                    sndStats[p["gamertag"]] = new SNDStats(0, 0, 0, 0, 0);
                                    // alert('making new');
                                }



                                sndStats[p["gamertag"]].add(p["score"], p["kills"], p["deaths"], p["plants"], p["defuses"]);

                                // alert(sndStats[p["gamertag"]].kills);
                            } else {
                                if (typeof (hpStats[p["gamertag"]]) === 'undefined') {
                                    hpStats[p["gamertag"]] = new HPStats(0, 0, 0, 0, 0);

                                }
                                hpStats[p["gamertag"]].add(p["score"], p["kills"], p["deaths"], p["plants"], p["defuses"]);
                            }
                        }
                    },
                        function () {

                        });


                    if (typeof (j[jdex + 1]) === 'undefined') {



                        if (sndCount == bestOf) {
                            loserpoint = true;
                        }


                        var tm1 = m["team1"];
                        var tm2 = m["team2"];
                        if (typeof (teamStats[tm1]) === 'undefined') {
                            teamStats[tm1] = new TeamStats(0, 0, 0);
                        }

                        if (typeof (teamStats[tm2]) === 'undefined') {
                            teamStats[tm2] = new TeamStats(0, 0, 0);
                        }


                        if (bestOf === 3) {
                            if (team2score > team1score) {
                                teamStats[tm2].wins++;
                                teamStats[tm2].points += 3;


                                teamStats[tm1].losses++;
                                if (loserpoint) teamStats[tm1].points++;


                                // teamStats[t["abbr"]].points++;
                            } else {
                                teamStats[tm1].wins++;
                                teamStats[tm1].points += 3;
                                //teamStats[t1["abbr"]].points++;
                                teamStats[tm2].losses++;
                                if (loserpoint) teamStats[tm2].points++;
                            }

                            if (hpWinner == 2) {
                                teamStats[tm2].points++;
                            } else if (hpWinner == 1) {
                                teamStats[tm1].points++;
                            }

                            //  alert(tm1 + ': ' + team1score + " | " + tm2 + ": " + team2score);
                        }

                        if (typeof (match[index + 1]) === 'undefined') {

                            var pts = [];
                            for (var key in teamStats) {
                                var t = teamStats[key];
                                pts.push(t.points);
                            }

                            pts.sort(function (a, b) { return b - a }); // highest to lowest

                            for (var i = 0; i < pts.length; i++) {
                                for (var key in teamStats) {
                                    var t = teamStats[key];

                                    if (t.points == pts[i]) {
                                        t.seed = (i + 1);
                                    }
                                }
                            }


                            


                            // maybe delay this a lill bit
                            callback();
                        }

                        // e.g match is done here
                        index++;
                    }

                    jdex++;
                });
            });
            // alert()
            // index++;
        });
    });
}

function addContent(elementTag, parentId, elementId) {

    // Adds an element to the document
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    p.appendChild(newElement);

    return newElement;
}



window.onload = loadMain;