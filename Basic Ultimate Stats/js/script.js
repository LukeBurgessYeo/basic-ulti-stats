$(function() {
    var firstHalf = true;
    var team1HasDisc = true;
    var team1Turns = 0;
    var team2Turns = 0;
    var team1Goals = 0;
    var team2Goals = 0;
    var tableData = ["<table id='data' class='table table-bordered table-condensed'><tr><th>Turns</th><th>O/D</th><th>Score</th><th>O/D</th><th>Turns</th></tr></table>"];
    var inputs = [];

    $("#team1name").blur(function() {
        $(".team1").html($("#team1name").html());
    });

    $("#team2name").blur(function() {
        $(".team2").html($("#team2name").html());
    });

    $("#turnover").click(function() {
        if (team1HasDisc) {
            team1Turns += 1;
        } else {
            team2Turns += 1;
        }

        team1HasDisc = !team1HasDisc;

        $("#turnover").html(team1Turns + " Turnovers " + team2Turns);

        inputs.push("turnover");
    });

    $("#score").click(function() {
        var team1Possession = team1HasDisc ? "O" : "D";
        var team2Possession = team1HasDisc ? "D" : "O";

        if (team1HasDisc) {
            team1Goals += 1;
            $("#team1score").html(team1Goals);
            $("#team1mode").html("Defense");
            $("#team2mode").html("Offense");
        } else {
            team2Goals += 1;
            $("#team2score").html(team2Goals);
            $("#team1mode").html("Offense");
            $("#team2mode").html("Defense");
        }

        var newRow = "<tr><td>" + team1Turns + "</td><td>" + team1Possession + "</td><td>" + team1Goals + "-" + team2Goals + "</td><td>" + team2Possession + "</td><td>" + team2Turns + "</td></tr>";

        tableData.push(newRow);

        $("#data").html(tableData.join(""));

        ressetTurnovers();
        team1HasDisc = !team1HasDisc;
    });

    function ressetTurnovers() {
        team1Turns = 0;
        team2Turns = 0;
        $("#turnover").html("Turnovers");
    }
});
