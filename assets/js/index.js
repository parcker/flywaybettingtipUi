//   var API_URL = "";
//  var APP_NAME = "Betting Nigeria";
//  setInterval(function () { vueAPP.GetDashboardValues(); }, 1000000);
//https://flywaytips.herokuapp.com/docs

$(document).ready(function () {
    vueAPP.GetGamesCategory();
    //setInterval(function () { vueAPP.GetDashboardValues(); }, 1000000);
});

var vueAPP = new Vue({
    el: '#vueAPP',
    data: {
        AppEnv: { Name: 'Betting Nigeria', },
        GAMES_CATEGORIES: [], GAMES: []
    },

    methods: {
        /* setTimeout(function () {
                vueAPP.LIST_BULK = vueAPP.LIST_BULK.filter(function (el) { return el.Id != row.Id; });  PageLoading.Hide();
            }, 30); */
        //http://flywaytips.herokuapp.com/games/GetGamecategory
        GetGamesCategory: function () {
           // PageLoader.Show();
            this.GAMES_CATEGORIES = [];
            $.get(API_URL + '/games/GetGamecategory', {}, function (response) {
                PageLoader.Hide();
                vueAPP.GAMES_CATEGORIES = response.result;
                console.log('Response Categories', vueAPP.GAMES_CATEGORIES);   //result:[], length:0, status:true/false
                /* createdby: ""
                    dateCreated: "2020-02-27T13:56:49.228Z"
                    dateUpdated: "2020-02-27T13:56:49.228Z"
                    id: "a16a1eef-543f-46f9-aca2-a6e395213eaf"
                    isDisabled: true
                    name: "test QA"
                    updatedby: "" */
            });
        },

        GetGamesByCategoryAndDate: function (categoryId, gamedate) {
            if (gamedate == "today") {
                var d = new Date();  
                var day = d.getDate();
                var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                var year = d.getFullYear();    
                gamedate = `${year}-${month}-${day}`;
                console.log('GameDate:', gamedate);
            }

            PageLoader.Show();
            this.GAMES = [];
            $.get(API_URL + `/games/GetGamebyCategoryAndDate/${gamedate}/${categoryId}`, {}, function (response) {
                PageLoader.Hide();
                vueAPP.GAMES = response.result;
                console.log('Response GAMES:', vueAPP.GAMES);   //result:[], length:0, status:true/false
            });

            //http://flywaytips.herokuapp.com/games/GetGamebyCategoryAndDate/{gamedate}/xxxx

        }



    }
});

const PageLoader = function () {
    let loader = "#PRE_LOADER_OVERLAY";
    return {
        Show: function () { $(loader).fadeIn(50); },
        Hide: function () { $(loader).fadeOut(90); }
    }
}();


