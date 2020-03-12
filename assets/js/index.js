//   var API_URL = "";
//  var APP_NAME = "Betting Nigeria";
//  setInterval(function () { vuePage.GetDashboardValues(); }, 1000000);
//https://flywaytips.herokuapp.com/docs

$(document).ready(function () {
    vuePage.GetGamesCategory();
    //setInterval(function () { vuePage.GetDashboardValues(); }, 1000000);
    vuePage.GAMES = listFakeGames.result;
    vuePage.Game = listFakeGames.result[0];
});

var vuePage = new Vue({
    el: '#vuePage',
    data: {
        AppEnv: { Name: 'Betting Nigeria', },
        GAMES_CATEGORIES: [], GAMES: [], Game: {}, IsGame:true
    },

    methods: {
        /* setTimeout(function () {
                vuePage.LIST_BULK = vuePage.LIST_BULK.filter(function (el) { return el.Id != row.Id; });  PageLoading.Hide();
            }, 30); */
        //http://flywaytips.herokuapp.com/games/GetGamecategory
        GetToday: function () {
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
            var year = d.getFullYear();
            return `${year}-${month}-${day}`;
        },        

        getGameOdd: function (listOdd, itemName) {
            let item = listOdd.filter(function (el) { return el.name == itemName; })[0]; 
            return item;
        },
        GetGamesCategory: function () {
            PageLoader.Show();
            this.GAMES_CATEGORIES = [];
            this.Game = { gamestartTime: this.GetToday() };
            try {
                $.get(API_URL + '/games/GetGamecategory', {}, function (response) {
                    PageLoader.Hide();
                    vuePage.GAMES_CATEGORIES = response.result;
                    console.log('Response Categories', vuePage.GAMES_CATEGORIES[0]);   //result:[], length:0, status:true/false
                    /* createdby: ""
                        dateCreated: "2020-02-27T13:56:49.228Z"
                        dateUpdated: "2020-02-27T13:56:49.228Z"
                        id: "a16a1eef-543f-46f9-aca2-a6e395213eaf"
                        isDisabled: true
                        name: "test QA"
                        updatedby: "" */
                }).fail(function (err) { console.log('ERROR:', err); PageLoader.Hide(); });
            } catch (e) { PageLoader.Hide(); }
        },

        GetCategoryGames: function (obj) {
            /* http://localhost:3000/games/GetGamebyCategoryAndDate/2014-01-02/fbd6ed73-0b00-47f9-9ed0-9182830151db
home - AWAY   HOME, DRAW, AWAY    */
            this.GetGamesByCategoryAndDate(obj.id, 'today');
        },

        GetGamesByCategoryAndDate: function (categoryId, gamedate) {
            if (gamedate == "today") {
                gamedate = this.GetToday();
            }

            PageLoader.Show();
            this.GAMES = [];
            this.IsGame = true;
            try {
                $.get(API_URL + `/games/GetGamebyCategoryAndDate/${gamedate}/${categoryId}`, {}, function (response) {
                    PageLoader.Hide();
                    vuePage.GAMES = response.result;
                    console.log('Response GAMES:', vuePage.GAMES);   //result:[], length:0, status:true/false
                }).fail(function (err) {
                    PageLoader.Hide();
                    vuePage.GAMES = listFakeGames.result;
                    vuePage.Game = vuePage.GAMES[0] || { gamestartTime: this.GetToday() };
                    console.log('FakeData:', vuePage.GAMES);
                });
            } catch (e) { }

            //http://flywaytips.herokuapp.com/games/GetGamebyCategoryAndDate/{gamedate}/xxxx

        }



    }
});


var listFakeGames = {
    "message": "3 games retrived", "status": true, "result":
        [{
            "league": "CONCAF", "hometeam": "Chealse", "awayteam": "Arsenal", "categoryname": "FootBall",
            "gameodds": [
                { "id": "9f3c28e5-7ec9-4483-b9c0-ce7fe1e657e9", "name": "Home win", "value": 3.6 },
                { "id": "5909200d-9a51-45d4-b7c0-bd4e2cb4dcc0", "name": "Draw", "value": 12.6 },
                { "id": "fd3574c3-544c-43b7-85f2-c45dbd493ca5", "name": "Away win", "value": 4.6 }
            ],
            "gameprediction": {
                "dateCreated": "2020-03-04T21:02:56.390Z", "dateUpdated": "2020-03-04T21:02:56.390Z",
                "isDisabled": true, "createdby": "", "updatedby": "",
                "id": "c5d4e2ea-cda0-4727-b59c-055c828f57e2", "homeresult": "2", "awayresult": "0",
                "bothresult": "2:0", "winner": "Chealse",
                "bothteamToscore": true   
            },
            "gamestartTime": "2014-01-02T00:00:00.000Z", "image": "assets/image/flags/Chilean.png",
            "id": "6eadc7ed-3922-460e-8fc4-08a4e90f0f06"
        }, {
                "league": "Africa Nations Cup",
            "hometeam": "Manchester", "awayteam": "Arsenal", "categoryname": "FootBall",
            "gameodds": [
                { "id": "9f3c28e5-7ec9-4483-b9c0-ce7fe1e657e9", "name": "Home win", "value": 3.6 },
                { "id": "fd3574c3-544c-43b7-85f2-c45dbd493ca5", "name": "Away win", "value": 4.6 },
                { "id": "5909200d-9a51-45d4-b7c0-bd4e2cb4dcc0", "name": "Draw", "value": 12.6 }],
            "gameprediction": {
                "dateCreated": "2020-03-04T21:07:55.484Z", "dateUpdated": "2020-03-04T21:07:55.484Z", "isDisabled": true,
                "createdby": "", "updatedby": "", "id": "3b0924f9-e93c-42a3-9eaf-8e121ca949f3", "homeresult": "2", "awayresult": "0",
                "bothresult": "2:0", "winner": "Chealse", "bothteamToscore": true
                }, "gamestartTime": "2014-01-02T00:00:00.000Z", "image": "assets/image/flags/Indian.png", "id": "0cb2b47e-4bfb-469b-b769-f784a9a8f806"
            }, {

                "league": "European League",
            "hometeam": "Man. Utd", "awayteam": "Arsenal", "categoryname": "FootBall",
            "gameodds": [{ "id": "9f3c28e5-7ec9-4483-b9c0-ce7fe1e657e9", "name": "Home win", "value": 3.6 },
            { "id": "fd3574c3-544c-43b7-85f2-c45dbd493ca5", "name": "Away win", "value": 4.6 },
            { "id": "5909200d-9a51-45d4-b7c0-bd4e2cb4dcc0", "name": "Draw", "value": 12.6 }],
            "gameprediction": {
                "dateCreated": "2020-03-04T21:07:58.377Z", "dateUpdated": "2020-03-04T21:07:58.377Z",
                "isDisabled": true, "createdby": "", "updatedby": "", "id": "3b069ac2-2b80-4f23-a7bb-51fb02d575ed",
                "homeresult": "2", "awayresult": "1", "bothresult": "2:1", "winner": "Chealse", "bothteamToscore": true
            }, "gamestartTime": "2014-01-02T00:00:00.000Z", "image": "assets/image/flags/Colombian.png",
            "id": "4298c337-d070-4391-9a25-7ad7ea4154ae"
        }]
};

