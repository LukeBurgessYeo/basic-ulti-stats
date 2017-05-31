$(function() {
    var firstHalf = true;
    var team1Offense = true;
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
        var team1Possession = team1Offense ? "O" : "D";
        var team2Possession = team1Offense ? "D" : "O";
        var team1Class = "";
        var team2Class = "";

        if (team1HasDisc) {
            if (team1Offense) {
                team1Class = "hold";
                if (team1Turns === 0) { team1Class += " perfect"; }
            } else {
                team1Class = "break";
                if (team1Turns === 0) { team1Class += " perfect"; }
            }

            team2Class = team1Offense ? "conceded" : "broken";

            team1Goals += 1;
            team1Offense = false;
            $("#team1score").html(team1Goals);
            $("#team1mode").html("Defense");
            $("#team2mode").html("Offense");
        } else {
            if (team1Offense) {
                team2Class = "break";
                if (team2Turns === 0) { team2Class += " perfect"; }
            } else {
                team2Class = "hold";
                if (team2Turns === 0) { team2Class += " perfect"; }
            }
            team1Class = team1Offense ? "broken" : "conceded";
            //team2Class = team1Offense ? "break" : "hold";

            team2Goals += 1;
            team1Offense = true;
            $("#team2score").html(team2Goals);
            $("#team1mode").html("Offense");
            $("#team2mode").html("Defense");
        }

        var newRow = "<tr><td class='" + team1Class + "'>" + team1Turns + "</td><td class='" + team1Class + "'>" + team1Possession + "</td><td>" + team1Goals + "-" + team2Goals + "</td><td class='" + team2Class + "'>" + team2Possession + "</td><td class='" + team2Class + "'>" + team2Turns + "</td></tr>";

        tableData.push(newRow);

        $("#data").html(tableData.join(""));

        team1HasDisc = !team1HasDisc;
        ressetTurnovers();

        inputs.push("score");
    });

    function ressetTurnovers() {
        team1Turns = 0;
        team2Turns = 0;
        $("#turnover").html("Turnovers");
    }
});
