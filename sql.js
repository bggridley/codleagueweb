function addPlayer(tag, f, l, t, i, callback) {
    fetch('http://localhost:3000/addplayer', {

        // Adding method type 
        method: "POST",

        // Adding body or contents to send 
        body: JSON.stringify({
            gamertag: tag,
            first: f,
            last: l,
            team: t,
            image: i,
            season: szn
        }),

        // Adding headers to the request 
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            callback(responseJSON);
        });
}

function addMatch(matchid, t1, t2, besto, callback) {
    fetch('http://localhost:3000/addmatch', {

        // Adding method type 
        method: "POST",

        // Adding body or contents to send 
        body: JSON.stringify({
            matchId: matchid,
            team1: t1,
            team2: t2,
            bestOf: besto,
            season: szn
        }),

        // Adding headers to the request 
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            callback(responseJSON);
        });
}

function addGame(matchid, gid, team1p, team2p, m, gm, callback) {
    fetch('http://localhost:3000/addgame', {

        // Adding method type 
        method: "POST",

        // Adding body or contents to send 
        body: JSON.stringify({
            matchId: matchid,
            gameId: gid,
            team1points: team1p,
            team2points: team2p,
            map: m,
            gamemode: gm,
            season: szn
        }),

        // Adding headers to the request 
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            callback(responseJSON);
        });
}

function addStats(mid, gid, tag, s, k, d, p, def, t, callback) {
    fetch('http://localhost:3000/addstats', {

        // Adding method type 
        method: "POST",

        // Adding body or contents to send 
        body: JSON.stringify({
            matchid: mid,
            gameid: gid,
            gamertag: tag,
            score: s,
            kills: k,
            deaths: d,
            plants: p,
            defuses: def,
            team: t,
            season: szn
        }),

        // Adding headers to the request 
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            callback(responseJSON);
        });
}

function deletePlayer(tag, callback) {
    fetch('http://localhost:3000/deleteplayer', {

        method: "POST",
        body: JSON.stringify({
            gamertag: tag,
            season: szn
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {

            callback(responseJSON);
        });
}

function deleteMatch(id, callback) {
    fetch('http://localhost:3000/deletematch', {

        method: "POST",
        body: JSON.stringify({
            matchId: id,
            season: szn
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {

            callback(responseJSON);
        });
}

function deleteGame(matchid, gameid, callback) {
    fetch('http://localhost:3000/deletegame', {

        method: "POST",
        body: JSON.stringify({
            matchId: matchid,
            gameId: gameid,
            season: szn
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {

            callback(responseJSON);
        });
}

function deleteStats(tag, mid, gid, callback) {
    fetch('http://localhost:3000/deletestats', {

        method: "POST",
        body: JSON.stringify({
            gamertag: tag,
            matchid: mid,
            gameid: gid,
            season: szn
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {

            callback(responseJSON);
        });
}

function getPlayer(player, callback) {
    fetch('http://localhost:3000/getplayer/' + player + "/" + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;

            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                callback(value);

                // ...
            });
        }));
}

function getTeam(team, callback) {
    fetch('http://localhost:3000/getteam/' + team + "/" + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;

            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                callback(value);

                // ...
            });
        }));
}

function getMatch(matchid, callback) {
    fetch('http://localhost:3000/getmatch/' + matchid + '/' + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;

            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                callback(value);

                // ...
            });
        }));
}

function getGame(matchid, gameid, callback) {
    fetch('http://localhost:3000/getgame/' + matchid + '/' + gameid + '/' + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;

            if (Object.keys(jsonData).length === 0) {
                callback(null);
            }

            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                callback(value);

                // ...
            });
        }));
}

function getStats(matchid, gameid, gamertag, team, callback, done) {
    fetch('http://localhost:3000/getstats/' + matchid + "/" + gameid + "/" + gamertag + '/' + team + "/" + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;

            if (Object.keys(jsonData).length === 0) {
                callback(null);
                done(null);
            }

            var index =0;
            Object.keys(jsonData).forEach(function (key) {
                var value = jsonData[key];

                callback(value);

                if(typeof(jsonData[index + 1]) === 'undefined') {
                    done();
                }

                index++;
                // ...
            });
        }));
}

function getPlayers(callback) {
    fetch('http://localhost:3000/getplayers/' + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;


            callback(jsonData); // returns all the players
        }));
}

function getGames(matchid, callback) {
    fetch('http://localhost:3000/getgames/' + matchid + "/" + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ).then(res => {

            var jsonData = res.data;


            callback(jsonData); // returns all of the games
        }));
}

function getMatches(callback) {
    fetch('http://localhost:3000/getmatches/' + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;


            callback(jsonData); // returns all the players
        }));
}

function getTeams(callback) {
    fetch('http://localhost:3000/getteams/' + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status,
        })
        ).then(res => {

            var jsonData = res.data;


            callback(jsonData); // returns all the teams
        }));
}

function getPlayersByTeam(abbr, callback) {
    fetch('http://localhost:3000/getplayersbyteam/' + abbr + "/" + szn).then(response =>
        response.json().then(data => ({
            data: data,
            status: response.status
        })
        ).then(res => {

            var jsonData = res.data;


            callback(jsonData);

            /*       Object.keys(jsonData).forEach(function (key) {
                      var value = jsonData[key];
      
                      return value;
                      alert(value["gamertag"] + ", " + value["first"] + "," + value["last"]);
                      // ...
                  }); */
        }));
}


function addTeam(teamname, abbrev, callback) {
    fetch('http://localhost:3000/addteam', {

        // Adding method type 
        method: "POST",

        // Adding body or contents to send 
        body: JSON.stringify({
            team: teamname,
            abbr: abbrev,
            season: szn
        }),

        // Adding headers to the request 
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            callback(responseJSON);
        });
}

function deleteTeam(a, callback) {
    fetch('http://localhost:3000/deleteteam', {

        method: "POST",
        body: JSON.stringify({
            abbr: a,
            season: szn
        }),
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {

            callback(responseJSON);
        });
}

function generateDefaults(callback) {
    fetch('http://localhost:3000/generateDefaults').then(res => {
        callback(res); 
    });
}

function login(u, p, callback) {
    fetch('http://localhost:3000/login', {

        // Adding method type 
        method: "POST",

        // Adding body or contents to send 
        body: JSON.stringify({
            username: u,
            password: p
        }),

        // Adding headers to the request 
        headers: {
            "Content-type": "application/json"
        }
    }).then((response) => response.json())
        .then((responseJSON) => {
            // do stuff with responseJSON here...
            callback(responseJSON);
        });
}