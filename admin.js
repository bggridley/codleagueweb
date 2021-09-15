var szn = 4;

var Game = function (matchid, gameNumber, team1points, team2points, map, mode) { // matchid is saved. //game number is like 1-5
    this.matchid = matchid;
    this.gameNumber = gameNumber;
    this.team1points = team1points;
    this.team2points = team2points;
    this.map = map;
    this.mode = mode;
    this.stats = []; // shuold prob fill this w sum stats u know?
    this.empty = function () {
        if (this.team1points != 0 || this.team2points != 0) {
            //   alert('not empty yuhrd' + this.team1points + ", " + this.team2points);
            return false;
        }


        if (this.stats != null && Object.keys(this.stats).length != 0) {
            for (var key in this.stats) {
                var s = this.stats[key];


                if (s.score != 0 || s.kills != 0 || s.deaths != 0 || s.plants != 0 || s.defuses != 0) {
                    //  alert('not empty');
                    return false;

                }
                // if(s.)
            }
        }
        return true;
    }


};

var Stats = function (score, kills, deaths, plants, defuses, team) { // these are held within the game class, so we good
    this.score = score;
    this.kills = kills;
    this.deaths = deaths;
    this.plants = plants; // PLANTS AKA TIME
    this.defuses = defuses; // DEFUSES AKA DEFENDS. THEY ARE THE SAME
    this.mode = "SND";
    this.team = team;
    return this;
}


var games = new Map(); // game[0] = game1. etc.
var match;
var loaded = false;
var currentGame = 1;
var maps = ["Shoothouse", "Hackney", "Gun Runner", "Rammaza", "Vacant", "Crash", "Backlot", "Sawmill", "Arklov", "Hardhat"];
var modes = ["SND", "HP"];
var map = "Crash";
var mode = "SND";

function submitLogin(event) {
    event.preventDefault();

    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;

    login(user, pass, function (response) {
        if (response == true) {
            loaded = true;
            //loadAdmin();
            loadAdmin();// fadeout(loadAdmin);
            document.getElementById("adminPageLabel").innerHTML = "Admin";
        }
    });

}

function submitAddPlayer(event) {
    var gamertag = document.getElementById("gamertag");
    event.preventDefault();
    if (gamertag.value == "") {

    } else {
        addPlayer(gamertag.value, "", "", "", "", function (response) {
            loadAdmin();
        });

    }
}

function submitAddTeam(event) {
    event.preventDefault();
    var teamname = document.getElementById("teamname").value;
    var teamabbr = document.getElementById("teamabbr").value;

    if (teamname == "" || teamabbr == "") {

    } else {
        addTeam(teamname, teamabbr, function (response) {
            loadAdmin();
        });

    }
}

function newMatch() {
    document.getElementById("matchModalLabel").innerHTML = "New Match";
    // also need to reset the values to nothing/default

    submitAddMatch(null, function (id) {

        $("#saveMatchModal").attr("match_id", id);
        openMatchModal(id);
    });


}

function submitAddMatch(element, callback) {
    var team1 = document.getElementById("team1").value;
    var team2 = document.getElementById("team2").value;

    var bestOf = document.getElementById("bestOf").value;

    //alert("saving le match" + team1 + ", " + team2);

    // alert(element.getAttribute("match_id")), could be null

    mid = null;
    if (element != null) {
        mid = element.getAttribute("match_id");
        // alert("end save");
    } else {
        // defaults
        team1 = "None";
        team2 = "None";
    }


    //TODO should add a thing where everything is deleted here, u know?
    addMatch(mid, team1, team2, bestOf, function (response) {
        loadMatches();

        if (games != null && element != null) {
            games.forEach(function (value, key, map) {
                var g = value;

                if (!g.empty()) {
                    //  alert('game is not empty: ' + key);
                    addGame(mid, key, g.team1points, g.team2points, g.map, g.mode, function (r) {
                        //  console.log("adding game: " + key);

                        saveStats(mid, key);

                        // addStats(mid, gid, tag, s, k, d, p, def, function(res) {

                        //console.log("adding stats for : ")
                        //});
                    });
                } else {
                    //alert("not saving because empty game!");
                }

            });

        }

        callback(response); // this is the "match id"

    });
}


function loadLogin() {
    update_url('/admin');

    if (loaded == true) {
        loadAdmin(); // fadeout (loadAdmin)
        return;
    } else {
        document.getElementById("webTitle").innerHTML = "DSCDL - Login";
        loadHtmlIntoId("body", "login.html", function () {
            document.getElementById("adminPage").setAttribute("class", "nav-item active");
            document.getElementById("indexPage").setAttribute("class", "nav-item");
            document.getElementById("aboutPage").setAttribute("class", "nav-item");
            document.getElementById("loginForm").addEventListener('submit', submitLogin);

            $("#body").fadeIn("fast");
        });
    }

}
function loadAdmin() {
    document.getElementById("webTitle").innerHTML = "DSCDL - Admin";
    document.getElementById("adminPage").setAttribute("class", "nav-item active");
    document.getElementById("indexPage").setAttribute("class", "nav-item disabled");
    document.getElementById("aboutPage").setAttribute("class", "nav-item disabled");


    loadHtmlIntoId("body", "admin.html", function () {
        document.getElementById("playercol1").innerHTML = "";
        document.getElementById("playercol2").innerHTML = "";
        document.getElementById("addPlayerForm").addEventListener('submit', submitAddPlayer);
        document.getElementById("addTeamForm").addEventListener('submit', submitAddTeam);
        //document.getElementById("editMatchForm").addEventListener('submit', submitAddMatch);


        // document.getElementById("addplayer_btn").setAttribute("onclick", "submitAddPlayer()");
    });


    getPlayers(function (jsonData) {

        let index = 0;
        if (Object.keys(jsonData).length == 0) {
            loadTeams(function () {
                loadMatches();

            });
        } else {

            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                //modify the modal on click instead maybe

                var col = "playercol1";
                if (index % 2 != 0) col = "playercol2";

                var prefix = value["team"];
                if (prefix == "") prefix = "None"
                var t = addContent("b", col, "team_" + value["gamertag"]);
                t.innerHTML = "[" + prefix + "] ";
                var p = addContent("a", col, "player_" + value["gamertag"]);
                p.innerHTML = value["gamertag"];
                p.style.cursor = "pointer";



                //p.setAttribute("data-toggle", "modal");
                // p.setAttribute("data-target", "#popupModal");
                p.setAttribute("onclick", "openModal(this)");



                addContent("br", col, "");
                //<a style="cursor: pointer;" data-toggle="modal" data-target="#popupModal"> Oh hey</a>

                //$("#body").fadeIn("slow");

                if (typeof (jsonData[index + 1]) === 'undefined') {
                    $("#body").fadeIn("slow");
                    loadTeams(function () {
                        loadMatches();

                    });
                }

                index++;
            });
        }
    });



}

function loadTeams(callback) {
    getTeams(function (jsonData) {

        var index = 0;
        if (Object.keys(jsonData).length == 0) {
            callback();
        } else {

            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                var t = addContent("a", "teamcol", "team" + value["abbr"]);
                t.innerHTML = value["abbr"];
                t.style.cursor = "pointer";
                t.setAttribute("onclick", "openTeamModal(this)");
                addContent("br", "teamcol", "");

                if (typeof (jsonData[index + 1]) === 'undefined') {
                    callback();
                }
                index++;
            });
        }


    });
}

function loadMatches() {
    document.getElementById("matchlist").innerHTML = "";
    for (var i = 1; i <= 4; i++) {

        addContent("div", "matchlist", "matchlist" + i).setAttribute("class", "col-sm ml-3");
    }
    getMatches(function (jsonData) {

        var index = 0;
        Object.keys(jsonData).forEach(function (key) {
            var value = jsonData[key];

            var list = "matchlist";

            list += Math.floor((index / 12) + 1);

            //alert(list);

            var id = "match_" + value["match_id"];
            $("#" + list).append('<a id="match_' + value["match_id"] + '"></a>');
            $("#" + id).html("> " + value["team1"] + " vs  " + value["team2"]).css("cursor", "pointer").attr("onclick", "openMatchModal(" + value["match_id"] + ")");
            //var t = addContent("a", list, "match_" + value["match_id"]);
            //t.innerHTML = value["match_id"] + value["team1"] + " vs  " + value["team2"];
            //t.style.cursor = "pointer";
            //t.setAttribute("onclick", "openMatchModal(" + value["match_id"] + ")");
            addContent("br", list, "");

            if (typeof (jsonData[index + 1]) === 'undefined') {
                // $("#matchlist").fadeIn();
            }

            index++;
        });
    });
}


//create load game shld be called once at the start, when the inital game 1 is loaded
// and also when switching the current game.
function createLoadGames(gameid, matchid, callback) {
    currentGame = gameid;

    // alert(matchid + "m");
    getGame(matchid, gameid, function (value) {
        if (value == null) {
            if ((typeof (games.get(gameid)) === 'undefined')) {
                // alert(gameid + "game is undefined. should create a new one and load into memory.");
                games.set(gameid, new Game(matchid, gameid, 0, 0, "Crash", "SND"));
                // the stats will filled when the game is switched

                mode = games.get(gameid).mode;
                map = games.get(gameid).map;
                callback();

            } else {
                mode = games.get(gameid).mode;
                map = games.get(gameid).map;
                callback();
            }
        } else {
            //  alert("no way" + matchid);
            games.delete(gameid);
            games.set(gameid, new Game(matchid, gameid, value["team1points"], value["team2points"], value["map"], value["gamemode"]));
            // load the old one, which was previously saved.

            mode = games.get(gameid).mode;
            map = games.get(gameid).map;

            callback();
            // alert(currentGame + "nownow");
            // load the stats from the server
        }






        // alert(map);
        // should work now !
        //document.getElementById("map")

        // once this is all done, we will apply the data from the game to the modal.
    });
}

function openMatchModal(element) {
    // refreshMatchModal();
    currentGame = 1;
    map = "Crash"; // just set the defaults
    mode = "SND";
    bestOf = 3;
    document.getElementById("team1points").value = 0;
    document.getElementById("team2points").value = 0;



    if (games != null) {
        games.forEach(function (value, key, map) {
            delete value;
        });

        games.clear();

        games = new Map();
    }

    getMatch(element, function (value) {
        match = value;
        document.getElementById("bestOf").selectedIndex = value["best_of"] === 3 ? 0 : 1;
      //  alert(value["best_of"]);
        document.getElementById("matchModalLabel").innerHTML = "Edit \"" + value["match_id"] + "\"";

        document.getElementById("matchModalDelete").onclick = function () {
            deleteMatch(value["match_id"], function (a) {
                loadAdmin();
                //alert("deleting match");
                deleteGame(value["match_id"], -1, function (b) {
                    // alert("deleting game");
                    loadMatches();
                    deleteStats(null, value["match_id"], -1, function (c) {
                        //  alert('deleting all le stats');

                    });
                });
            });
        };
        teamDropdown("team1", value["team1"], function () {
            teamDropdown("team2", value["team2"], function () {

                createLoadGames(currentGame, value["match_id"], function () {
                    refreshMatchModal();
                    updateMatchModalTable(1);
                    updateMatchModalTable(2);
                });
            });
        });



        $("#saveMatchModal").attr("match_id", value["match_id"]);
        document.getElementById("saveMatchModal").onclick = function () {
            // console.log("about to saev");
            submitAddMatch(document.getElementById("saveMatchModal"), function (id) {
                console.log("saved match: " + id);
            });
        }

        $("#team1").change(function (e) {
            //refreshMatchModal();
            updateMatchModalTable(1);
        });

        $("#team2").change(function (e) {
            //refreshMatchModal();
            updateMatchModalTable(2);
        });

        $("#game").off('change').on('change', function (e) {
            saveStats(value["match_id"], currentGame);

            currentGame = parseInt(document.getElementById("game").value);
            // alert("changing to : " + currentGame);
            createLoadGames(currentGame, value["match_id"], function () {
                // alert("refreshing for the match ID: " + value["match_id"]);
                mode = games.get(currentGame).mode;
                refreshMatchModal();
                updateMatchModalTable(1);
                updateMatchModalTable(2);
            });

        });

        $("#mode").off('change').on('change', function (e) {
            saveStats(value["match_id"], currentGame);

            games.get(currentGame).mode = document.getElementById("mode").value;
            mode = games.get(currentGame).mode;
            refreshMatchModal();
            updateMatchModalTable(1);
            updateMatchModalTable(2);
            // console.log("setting game: " + currentGame + " map to " + games[currentGame].map);
        });

        $("#map").off('change').on('change', function (e) {

            games.get(currentGame).map = document.getElementById("map").value;
            // console.log("setting game: " + currentGame + " map to " + games[currentGame].map);
        });

        $('#team1points').off('input').on('input', function () {
            games.get(currentGame).team1points = document.getElementById("team1points").value;
        });

        $('#team2points').off('input').on('input', function () {
            games.get(currentGame).team2points = document.getElementById("team2points").value;
        });

        $("#bestOf").change(function (e) {
            refreshMatchModal();
        });

        $("#matchModal").modal();

    });
}

function saveStats(matchid, currentGame) {
    var cg = games.get(currentGame);

    var t1 = document.getElementById("team1").value;
    var t2 = document.getElementById("team2").value;

    if (cg != null) {
        Object.keys(cg.stats).forEach(function (key, index) {
            vv = cg.stats[key];

            //  alert(res["team"] + ", the teams: " + t1 + ", " + t2);

            // if (r["team"] === t1 || r["team"] === t2) {
            if (vv.score != 0 || vv.kills != 0 || vv.deaths != 0 || vv.plants != 0 || vv.defuses != 0) {
                // if (vv.team === t1 || vv.team === t2) {
                addStats(matchid, currentGame, key, vv.score, vv.kills, vv.deaths, vv.plants, vv.defuses, vv.team, function (res) {
                    //      alert("added stats" + vv.team);
                });

            }


            // });
            // alert("match iD::" + value["match_id"]);
        }, cg.stats);
    }
}

function updateMatchModalTable(i) {
    var cg = games.get(currentGame); // the game will have no stats
    var teamname = document.getElementById("team" + i).value;


    //alert("team " + i + ": " + teamname);

    $("#gameTable" + i).html(""); // clear this table
    var col = ["Score", "Kills", "Deaths", "Plants", "Defuses"];
    var rows = 5; //here's your number of rows and columns
    var cols = 6;
    var table = $('<table id="gameTableContent' + i + '">');
    var th = $('<thead id="gameTableHead' + i + '"></thead>');
    var thr = $('<tr class="d-flex">');
    thr.appendTo(th);

    var tb = $('<tbody id="gameTableBody' + i + '"></tbody>');
    th.appendTo(table);
    tb.appendTo(table);


    //get stats from server. (by this TEAM. find all the stats with team=i)
    // push these stats to the cg.stats

    // load all the players for the game. if there is NOT player existing in this game's stats, push a new one (0,0,0,0,0,team)

    // then we will load all of the teams by stats.
    for (var stat in cg.stats) {
        var s = cg.stats[stat];
        if (s.kills == 0 && s.deaths == 0 && s.defuses == 0 && s.plants == 0 && s.score == 0 && s.team == i) {
            delete cg.stats[stat];
        }
    }

    getStats(match["match_id"], currentGame, -1, i, function (va) {
        //  alert(va["team"] + va["gamertag"]);
        if (va != null) {
            //  alert('adding: ' + va["gamertag"] + " with team: " + va["team"]);
            cg.stats[va["gamertag"]] = new Stats(va["score"], va["kills"], va["deaths"], va["plants"], va["defuses"], va["team"]);
        }
    },

        function () {
            if (true) {
                // alert('called');
                getPlayersByTeam(teamname, function (player) {
                    var index = 0;

                    if (Object.keys(player).length == 0) {
                        done(teamname, cols, col, thr, cg, table, i);
                    } else {

                        Object.keys(player).forEach(function (k) {
                            var v = player[k];

                            if (typeof (cg.stats[v["gamertag"]]) === 'undefined') {
                                cg.stats[v["gamertag"]] = new Stats(0, 0, 0, 0, 0, i);
                                //    alert('new: ' + v["gamertag"] + "team: " + i);
                            }

                            if (typeof (player[index + 1]) === 'undefined') {
                                //  alert('giong to done?!');
                                done(teamname, cols, col, thr, cg, table, i); // lots of shit needs to be added
                            }

                            index++;
                        });
                    }
                });
            }
        });
    //table.editableTableWidget();


}

function done(teamname, cols, col, thr, cg, table, i) {
    // is done with all of the players. now we will load all of the stats.
    var r = 0;

    for (var c = 0; c < cols; c++) {
        var val = teamname;
        if (c > 0) {
            val = col[c - 1];

            if (mode == "HP") {
                if (c == 3) {
                    val = "Time";
                } else if (c == 4) {
                    val = "Deaths";
                } else if (c == 5) {
                    val = "Defends";
                }
            }
        }
        $('<th class="col-2">' + val + '</th>').appendTo(thr);
    }

    // r = 1;

    // only add if the key is the same as the teamname
    for (var key in cg.stats) {
        var s = cg.stats[key];

        if (s.team == i) {
            //   alert(s.team + ", " + i);
            var tr = $('<tr class="d-flex">');
            tr.appendTo(table);

            var editable = false;
            for (var c = 0; c < cols; c++) {
                var val = ''; // the gamertag is the key

                if (c == 0) {
                    editable = false;
                    val = key;
                } else {
                    editable = true;
                    switch (c) {
                        case 1:
                            val = s.score;
                            break;
                        case 2:
                            val = s.kills;
                            break;
                        case 3:
                            val = s.deaths;
                            break;
                        case 4:
                            val = s.plants;
                            break;
                        case 5:
                            val = s.defuses;
                    };
                }

                if (!editable) {
                    $('<td class="col-2">' + val + '</td>').appendTo(tr);
                } else {
                    var tabIndex = ((i - 1) * 35) + ((r) * 5) + (c + 1);
                    $('<td class ="col-2" tabIndex=-1> <div contentEditable=true tabindex="' + tabIndex + '" gamertag="' + key + '" col=' + c + ' class="row_data" edit_type="click">' + val + ' </div></td>').appendTo(tr);
                }
            }

            if (typeof (cg.stats[r + 1]) === 'undefined') {
                $("#gameTable" + i).html("");
                table.appendTo('#gameTable' + i);
                $('#gameTableContent' + i).attr("class", "table");
                //$('#gameTableBody' + i).sortable();
                // implement this later when tab index is implemented


                $(document).off('keydown').on('keydown', '.row_data', function (e) {

                    if ($(this).closest('div').attr('edit_type') == 'button') {
                        return false;
                    }

                    var keyCode = e.keyCode || e.which;

                    if (keyCode == 9) {

                    }


                    $(this).closest('div').focus();
                    $(this).closest('div').click();
                    // $(this).focus();
                });

                $(document).off('focusin').on('focusin', '.row_data', function (event) {
                    event.preventDefault();
                    if (parseInt($(this).closest('div').html()) === 0) {
                        // e.preventDefault();
                        $(this).closest('div').html('');
                        // alert("hg");
                    }
                });
                $(document).off('focusout').on('focusout', '.row_data', function (event) {
                    event.preventDefault();

                    if ($(this).attr('edit_type') == 'button') {
                        return false;
                    }


                    var tag = $(this).attr("gamertag");
                    console.log(tag + $(this).attr("col"));


                    var col = $(this).attr("col");
                    var statVal = $(this).html();


                    var stat = cg.stats[tag]; // kind of has to exist at this point lol

                    switch (parseInt(col)) {
                        case 1:
                            stat.score = statVal;
                            break;
                        case 2:
                            stat.kills = statVal;
                            break;
                        case 3:
                            stat.deaths = statVal;
                            break;
                        case 4:
                            stat.plants = statVal;
                            break;
                        case 5:
                            stat.defuses = statVal;
                            break;
                    }


                    cg.stats[tag] = stat;


                    if ($(this).closest('div').html() === '') {
                        $(this).closest('div').html("0");
                        //alert("hg");
                    }

                    var row_div = $(this)
                        .removeClass('bg-warning') //add bg css
                        .css('padding', '')

                    //out put to show
                });
            }
        }
        r++;
    }
}

function refreshMatchModal() {
    //document.getElementById("gameTableHead1").getElementsByTagName("th")[0].innerHTML = document.getElementById("team1").value;
    //document.getElementById("gameTableHead2").getElementsByTagName("th")[0].innerHTML = document.getElementById("team2").value;
    //sets the headers of the table to the team names

    //currentGame = parseInt(document.getElementById("game").value); // save the current game
    //alert("currentGame is now: " + currentGame);
    // refresh the list and set the current to the selected


    document.getElementById("game").innerHTML = "";
    var bestOf = parseInt(document.getElementById("bestOf").value);

    // generate game for the current selection


    var amnt = bestOf;
    if (bestOf === 3) {
        amnt += 1;
    }

    for (var i = 1; i <= amnt; i++) {

        var l = addContent("option", "game", "game" + i);
        l.innerHTML = i;
        var sel = "";

        if (i == currentGame)
            l.setAttribute("selected", "");

    }

    if (currentGame < 0 || currentGame > bestOf + 1) currentGame = 1; //reset the current game

    document.getElementById("map").innerHTML = "";
    for (var i = 0; i < (mode === "SND" ? maps.length : 3); i++) {
        var m = addContent("option", "map", maps[i]);
        m.innerHTML = maps[i];
        if (maps[i] == map) {
            m.setAttribute("selected", "");
        }
    }

    document.getElementById("mode").innerHTML = "";
    for (var i = 0; i < modes.length; i++) {
        var m = addContent("option", "mode", modes[i]);
        m.innerHTML = modes[i];
        if (modes[i] == mode) {
            m.setAttribute("selected", "");
        }
    }

    document.getElementById("team1points").value = games.get(currentGame).team1points;
    document.getElementById("team2points").value = games.get(currentGame).team2points;


    // search in SND_GAMES for a game where the matchID is the same.
    // if it's not the same, just create a new game and use that
    // shuold probably use something like a hashmap or something to try to load and see if there are existing games

    /*     $("#gameTable").html("");
        
     */

}

function openTeamModal(element) {
    document.getElementById("teamModalLabel").innerHTML = "Edit \"" + element.innerHTML + "\"";
    document.getElementById("teamModalDelete").onclick = function () {
        deleteTeam(element.innerHTML, function (r) {
            getPlayersByTeam(element.innerHTML, function (player) {
                var index = 0;
                var empty = true;
                Object.keys(player).forEach(function (k) {
                    var v = player[k];

                    empty = false;
                    addPlayer(v["gamertag"], v["first"], v["last"], "", "", function (response) {
                        if (!player[index + 1]) {
                            loadAdmin();
                        }
                        index++;
                    });


                });

                if (empty) {
                    loadAdmin();
                }

            });
        });
    }
    $("#teamModal").modal();
}


function openModal(element) {
    var gamertag = element.innerHTML;

    getPlayer(gamertag, function (j) {
        document.getElementById("popupModalLabel").innerHTML = "Edit \"" + gamertag + "\"";
        document.getElementById("firstname_popup").value = j["first"];
        document.getElementById("lastname_popup").value = j["last"];
        var sel = j["team"];

        teamDropdown("popupTeams", sel, function () {
            $("#popupModal").modal();

        });

        document.getElementById("popupModalSave").onclick = function () {
            var selectedTeam = document.getElementById("popupTeams").value;
            if (selectedTeam == "None") selectedTeam = "";
            addPlayer(gamertag, document.getElementById("firstname_popup").value, document.getElementById("lastname_popup").value, selectedTeam, "", function () {
                loadAdmin();
            });
        }

        document.getElementById("popupModalDelete").onclick = function () {
            deletePlayer(gamertag, function () {
                loadAdmin();
            });
        }

    });

    /// set ALL the attributes for the modal so that they correspond n shit


}

function teamDropdown(id, sel, callback) {
    getTeams(function (jsonData) {

        document.getElementById(id).innerHTML = "";
        var d = addContent("option", id, "none");
        d.innerHTML = "None";
        d.setAttribute("selected", "");
        var index = 0;
        Object.keys(jsonData).forEach(function (key) {
            var value = jsonData[key];

            var te = addContent("option", id, id + "_" + value["abbr"]);
            console.log("added team + " + value["abbr"])
            //te.value = value["abbr"];
            te.innerHTML = value["abbr"];

            if (value["abbr"] == sel) {
                te.setAttribute("selected", "");
                d.removeAttribute("selected");
            }

            if (typeof (jsonData[index + 1]) === 'undefined') {
                //    alert('should only do this once!');
                callback();
            }

            index++;
        });
    });
}