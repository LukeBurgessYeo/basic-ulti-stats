$(function() {
    var firstHalf = true;
    var team1Offense = true;
    var team1HasDisc = true;
    var team1ScoredLast = [];
    var team1Turns = 0;
    var team2Turns = 0;
    var team1Goals = 0;
    var team2Goals = 0;
    var tableData = ["<table id='data' class='table table-bordered table-condensed'><tr><th>Turns</th><th>O/D</th><th>Score</th><th>O/D</th><th>Turns</th></tr></table>"];
    var inputs = [];
    var scoretable = [];

    function ScoreEntry(_Team1Turns, _Team1Side, _Team1Score, _Team2Turns, _Team2Side, _Team2Score, _Team1Scored) {
        this.Team1Turns = _Team1Turns;
        this.Team1Side = _Team1Side;
        this.Team1Score = _Team1Score;
        this.Team2Turns = _Team2Turns;
        this.Team2Side = _Team2Side;
        this.Team2Score = _Team2Score;
        this.Team1Scored = _Team1Scored;
    }

    function Results() {
        this.PointsPlayed = [0, 0];
        this.GoalsScored = [0, 0];
        this.Turnovers = [0, 0];
        this.Blocks = [0, 0];
        this.Breaks = [0, 0];
        this.NoTurnGoals = [0, 0];
        this.GoalsWithTurns = [0, 0];
        this.HadDiscPoints = [0, 0];
        this.ConversionRate = [0, 0];
        this.PerfectConversionRate = [0, 0];
        this.MeanTurnsPerPoint = [0, 0];
        this.RecoveryRate = [0, 0];
        this.DefensiveSuccessRate = 0;
    }

    var team1Results = new Results();
    var team2Results = new Results();

    $("#gameTitle").blur(function() {
        $("#title").html($("#gameTitle").html() + ": " + $("#team1name").html() + " vs " + $("#team2name").html());
    });

    $("#team1name").blur(function() {
        $(".team1").html($("#team1name").html());
        $("#title").html($("#gameTitle").html() + ": " + $("#team1name").html() + " vs " + $("#team2name").html());
    });

    $("#team2name").blur(function() {
        $(".team2").html($("#team2name").html());
        $("#title").html($("#gameTitle").html() + ": " + $("#team1name").html() + " vs " + $("#team2name").html());
    });

    $("#turnover").click(function() {
        if (team1HasDisc) {
            team1Turns += 1;
            changeTeamColour(false);
        } else {
            team2Turns += 1;
            changeTeamColour(true);
        }
        $("#turnover").html(team1Turns + " Turnovers " + team2Turns);
        team1HasDisc = !team1HasDisc;

        inputs.push("turnover");
        $("#halftime").attr("disabled", true);
        $("#undo").attr("disabled", false);
    });

    $("#score").click(function() {
        var team1scored;
        var team1Side;
        var team2Side;
        var team1Class = "";
        var team2Class = "";

        if (team1Offense) {
            team1Side = "O";
            team2Side = "D";
        } else {
            team1Side = "D";
            team2Side = "O";
        }

        if (team1HasDisc) {
            team1scored = true;
            team1Goals += 1;
            $("#team1score").html(team1Goals);
            $("#team1mode").html("Defense");
            $("#team2mode").html("Offense");
            team1ScoredLast.push(true);

            if (team1Offense) {
                team1Class = "hold";
                team2Class = "conceded";
                (team1Turns === 0) ? team1Class += " perfect" : team1Class += "";
            } else {
                team1Class = "break";
                team2Class = "broken";
                (team1Turns === 0) ? team1Class += " perfect" : team1Class += "";
            }

            team1Offense = false;
        } else {
            team1scored = false;
            team2Goals += 1;
            $("#team2score").html(team2Goals);
            $("#team1mode").html("Offense");
            $("#team2mode").html("Defense");
            team1ScoredLast.push(false);

            if (team1Offense) {
                team2Class = "break";
                team1Class = "broken";
                if (team2Turns === 0) {
                    team2Class += " perfect";
                }
            } else {
                team2Class = "hold";
                team1Class = "conceded"
                if (team2Turns === 0) {
                    team2Class += " perfect";
                }
            }

            team1Offense = true;
        }

        var entry = new ScoreEntry(team1Turns, team1Side, team1Goals, team2Turns, team2Side, team2Goals, team1scored);
        scoretable.push(entry);

        var newRow = "<tr><td class='" + team1Class + "'>" + entry.Team1Turns + "</td><td class='" + team1Class + "'>" + entry.Team1Side + "</td><td>" + entry.Team1Score + "-" + entry.Team2Score + "</td><td class='" + team2Class + "'>" + entry.Team2Side + "</td><td class='" + team2Class + "'>" + entry.Team2Turns + "</td></tr>";
        tableData.push(newRow);
        $("#data").html(tableData.join(""));

        team1HasDisc = !team1HasDisc;
        changeTeamColour(team1HasDisc);
        resetTurnovers();

        firstHalf ? $("#halftime").attr("disabled", false) : $("#halftime").attr("disabled", true);

        updateTable();
        inputs.push("score");
        $("#undo").attr("disabled", false);
    });

    $("#halftime").click(function() {
        firstHalf = false;
        team1Offense = false;
        team1HasDisc = false;

        $("#team1mode").html("Defense");
        $("#team2mode").html("Offense");
        changeTeamColour(team1HasDisc);

        tableData.push("<tr><td colspan='5' class='half'>HALF</td></tr>");
        $("#data").html(tableData.join(""));

        $("#halftime").attr("disabled", true);

        inputs.push("half");
        $("#undo").attr("disabled", false);
    });

    $("#undo").click(function() {
        switch (inputs[inputs.length - 1]) {
            case "turnover":
                undoTurnover();
                break;
            case "score":
                undoScore();
                break;
            case "half":
                undoHalf();
                break;
        }

        changeTeamColour(team1HasDisc);
        updateTable();
        inputs.pop();
        if (inputs.length === 0) {
            $("#undo").attr("disabled", true);
        }
    });

    function changeTeamColour(team1hasdisc) {
        if (team1hasdisc) {
            $("#team1name").css("color", "yellow");
            $("#team2name").css("color", "white");
        } else {
            $("#team1name").css("color", "white");
            $("#team2name").css("color", "yellow");
        }
    }

    function resetTurnovers() {
        team1Turns = 0;
        team2Turns = 0;
        $("#turnover").html("Turnover");
    }

    function undoTurnover() {
        team1HasDisc ? (team2Turns -= 1) : (team1Turns -= 1);
        team1HasDisc = !team1HasDisc;
        $("#turnover").html(team1Turns + " Turnovers " + team2Turns);
    }

    function undoScore() {
        team1HasDisc = !team1HasDisc;

        scoretable[scoretable.length - 1].Team1Scored ? (team1Goals -= 1) : (team2Goals -= 1);
        $("#team1score").html(team1Goals);
        $("#team2score").html(team2Goals);

        team1Turns = scoretable[scoretable.length - 1].Team1Turns;
        team2Turns = scoretable[scoretable.length - 1].Team2Turns;
        $("#turnover").html(team1Turns + " Turnovers " + team2Turns);

        if (scoretable.length > 1) {
            if (scoretable[scoretable.length - 1].Team1Side == "O") {
                team1Offense = true;
                $("#team1mode").html("Offense");
                $("#team2mode").html("Defense");
            } else {
                team1Offense = false;
                $("#team1mode").html("Defense");
                $("#team2mode").html("Offense");
            }
        } else {
            $("#team1mode").html("Offense");
            $("#team2mode").html("Defense");
            team1Offense = true;
        }

        team1ScoredLast.pop();
        scoretable.pop();
        tableData.pop();
        $("#data").html(tableData.join(""));
        if (tableData.length == 1) {
            $("#halftime").attr("disabled", true);
        }
    }

    function undoHalf() {
        firstHalf = true;

        if (scoretable[scoretable.length - 1].Team1Scored) {
            team1Offense = false;
            team1HasDisc = false;
            $("#team1mode").html("Defense");
            $("#team2mode").html("Offense");
        } else {
            team1Offense = true;
            team1HasDisc = true;
            $("#team1mode").html("Offense");
            $("#team2mode").html("Defense");
        }

        tableData.pop();
        $("#data").html(tableData.join(""));
        $("#halftime").attr("disabled", false);
    }

    function updateTable() {
        computeResults();

        $("#ppO1").html(team1Results.PointsPlayed[0]);
        $("#ppD1").html(team1Results.PointsPlayed[1]);
        $("#ppO2").html(team2Results.PointsPlayed[0]);
        $("#ppD2").html(team2Results.PointsPlayed[1]);

        $("#gsO1").html(team1Results.GoalsScored[0]);
        $("#gsD1").html(team1Results.GoalsScored[1]);
        $("#gsO2").html(team2Results.GoalsScored[0]);
        $("#gsD2").html(team2Results.GoalsScored[1]);

        $("#toO1").html(team1Results.Turnovers[0]);
        $("#toD1").html(team1Results.Turnovers[1]);
        $("#toO2").html(team2Results.Turnovers[0]);
        $("#toD2").html(team2Results.Turnovers[1]);

        $("#blO1").html(team1Results.Blocks[0]);
        $("#blD1").html(team1Results.Blocks[1]);
        $("#blO2").html(team2Results.Blocks[0]);
        $("#blD2").html(team2Results.Blocks[1]);

        $("#brO1").html(team1Results.Breaks[0]);
        $("#brD1").html(team1Results.Breaks[1]);
        $("#brO2").html(team2Results.Breaks[0]);
        $("#brD2").html(team2Results.Breaks[1]);

        $("#ntO1").html(team1Results.NoTurnGoals[0]);
        $("#ntD1").html(team1Results.NoTurnGoals[1]);
        $("#ntO2").html(team2Results.NoTurnGoals[0]);
        $("#ntD2").html(team2Results.NoTurnGoals[1]);

        $("#gtO1").html(team1Results.GoalsWithTurns[0]);
        $("#gtD1").html(team1Results.GoalsWithTurns[1]);
        $("#gtO2").html(team2Results.GoalsWithTurns[0]);
        $("#gtD2").html(team2Results.GoalsWithTurns[1]);

        $("#hdO1").html(team1Results.HadDiscPoints[0]);
        $("#hdD1").html(team1Results.HadDiscPoints[1]);
        $("#hdO2").html(team2Results.HadDiscPoints[0]);
        $("#hdD2").html(team2Results.HadDiscPoints[1]);

        $("#crO1").html(team1Results.ConversionRate[0] + "%");
        $("#crD1").html(team1Results.ConversionRate[1] + "%");
        $("#crO2").html(team2Results.ConversionRate[0] + "%");
        $("#crD2").html(team2Results.ConversionRate[1] + "%");

        $("#pcO1").html(team1Results.PerfectConversionRate[0] + "%");
        $("#pcD1").html(team1Results.PerfectConversionRate[1] + "%");
        $("#pcO2").html(team2Results.PerfectConversionRate[0] + "%");
        $("#pcD2").html(team2Results.PerfectConversionRate[1] + "%");

        $("#mtO1").html(team1Results.MeanTurnsPerPoint[0]);
        $("#mtD1").html(team1Results.MeanTurnsPerPoint[1]);
        $("#mtO2").html(team2Results.MeanTurnsPerPoint[0]);
        $("#mtD2").html(team2Results.MeanTurnsPerPoint[1]);

        $("#rrO1").html(team1Results.RecoveryRate[0] + "%");
        $("#rrD1").html(team1Results.RecoveryRate[1] + "%");
        $("#rrO2").html(team2Results.RecoveryRate[0] + "%");
        $("#rrD2").html(team2Results.RecoveryRate[1] + "%");

        $("#ds1").html(team1Results.DefensiveSuccessRate + "%");
        $("#ds2").html(team2Results.DefensiveSuccessRate + "%");
    }

    function computeResults() {
        team1Results = new Results();
        team2Results = new Results();

        for (let x = 0; x < scoretable.length; x++) {
            if (scoretable[x].Team1Side == "O") {
                team1Results.PointsPlayed[0] += 1;
                (scoretable[x].Team1Scored) ? team1Results.GoalsScored[0] += 1 : team2Results.GoalsScored[1] += 1;
                team1Results.Turnovers[0] += scoretable[x].Team1Turns;
                team2Results.Turnovers[1] += scoretable[x].Team2Turns;

                if (scoretable[x].Team1Turns > 0) {
                    team2Results.HadDiscPoints[1] += 1;
                }
            } else {
                team1Results.PointsPlayed[1] += 1;
                (scoretable[x].Team1Scored) ? team1Results.GoalsScored[1] += 1 : team2Results.GoalsScored[0] += 1;
                team1Results.Turnovers[1] += scoretable[x].Team1Turns;
                team2Results.Turnovers[0] += scoretable[x].Team2Turns;

                if (scoretable[x].Team2Turns > 0) {
                    team1Results.HadDiscPoints[1] += 1;
                }
            }

            if (scoretable[x].Team1Scored) {
                if (scoretable[x].Team1Turns == 0) {
                    (scoretable[x].Team1Side == "O") ? team1Results.NoTurnGoals[0] += 1 : team1Results.NoTurnGoals[1] += 1;
                }
            } else {
                if (scoretable[x].Team2Turns == 0) {
                    (scoretable[x].Team2Side == "O") ? team2Results.NoTurnGoals[0] += 1 : team2Results.NoTurnGoals[1] += 1;
                }
            }
        }

        team2Results.PointsPlayed[0] = team1Results.PointsPlayed[1];
        team2Results.PointsPlayed[1] = team1Results.PointsPlayed[0];

        team1Results.Blocks[0] = team2Results.Turnovers[1];
        team1Results.Blocks[1] = team2Results.Turnovers[0];
        team2Results.Blocks[0] = team1Results.Turnovers[1];
        team2Results.Blocks[1] = team1Results.Turnovers[0];

        team1Results.Breaks[0] = -1 * team2Results.GoalsScored[1];
        team1Results.Breaks[1] = team1Results.GoalsScored[1];
        team2Results.Breaks[0] = -1 * team1Results.GoalsScored[1];
        team2Results.Breaks[1] = team2Results.GoalsScored[1];

        team1Results.GoalsWithTurns[0] = team1Results.GoalsScored[0] - team1Results.NoTurnGoals[0];
        team1Results.GoalsWithTurns[1] = team1Results.GoalsScored[1] - team1Results.NoTurnGoals[1];
        team2Results.GoalsWithTurns[0] = team2Results.GoalsScored[0] - team2Results.NoTurnGoals[0];
        team2Results.GoalsWithTurns[1] = team2Results.GoalsScored[1] - team2Results.NoTurnGoals[1];

        team1Results.HadDiscPoints[0] = team1Results.PointsPlayed[0];
        team2Results.HadDiscPoints[0] = team2Results.PointsPlayed[0];

        if (team1Results.HadDiscPoints[0] > 0) {
            team1Results.ConversionRate[0] = Math.round(100 * team1Results.GoalsScored[0] / team1Results.HadDiscPoints[0]);
        }
        if (team1Results.HadDiscPoints[1] > 0) {
            team1Results.ConversionRate[1] = Math.round(100 * team1Results.GoalsScored[1] / team1Results.HadDiscPoints[1]);
        }
        if (team2Results.HadDiscPoints[0] > 0) {
            team2Results.ConversionRate[0] = Math.round(100 * team2Results.GoalsScored[0] / team2Results.HadDiscPoints[0]);
        }
        if (team2Results.HadDiscPoints[1] > 0) {
            team2Results.ConversionRate[1] = Math.round(100 * team2Results.GoalsScored[1] / team2Results.HadDiscPoints[1]);
        }

        if (team1Results.HadDiscPoints[0] > 0) {
            team1Results.PerfectConversionRate[0] = Math.round(100 * team1Results.NoTurnGoals[0] / team1Results.HadDiscPoints[0]);
        }
        if (team1Results.HadDiscPoints[1] > 0) {
            team1Results.PerfectConversionRate[1] = Math.round(100 * team1Results.NoTurnGoals[1] / team1Results.HadDiscPoints[1]);
        }
        if (team2Results.HadDiscPoints[0] > 0) {
            team2Results.PerfectConversionRate[0] = Math.round(100 * team2Results.NoTurnGoals[0] / team2Results.HadDiscPoints[0]);
        }
        if (team2Results.HadDiscPoints[1] > 0) {
            team2Results.PerfectConversionRate[1] = Math.round(100 * team2Results.NoTurnGoals[1] / team2Results.HadDiscPoints[1]);
        }

        if (team1Results.HadDiscPoints[0] > 0) {
            team1Results.MeanTurnsPerPoint[0] = Math.round(100 * team1Results.Turnovers[0] / team1Results.HadDiscPoints[0]) / 100;
        }
        if (team1Results.HadDiscPoints[1] > 0) {
            team1Results.MeanTurnsPerPoint[1] = Math.round(100 * team1Results.Turnovers[1] / team1Results.HadDiscPoints[1]) / 100;
        }
        if (team2Results.HadDiscPoints[0] > 0) {
            team2Results.MeanTurnsPerPoint[0] = Math.round(100 * team2Results.Turnovers[0] / team2Results.HadDiscPoints[0]) / 100;
        }
        if (team2Results.HadDiscPoints[1] > 0) {
            team2Results.MeanTurnsPerPoint[1] = Math.round(100 * team2Results.Turnovers[1] / team2Results.HadDiscPoints[1]) / 100;
        }

        if (team1Results.HadDiscPoints[0] - team1Results.NoTurnGoals[0] > 0) {
            team1Results.RecoveryRate[0] = Math.round(100 * team1Results.GoalsWithTurns[0] / (team1Results.HadDiscPoints[0] - team1Results.NoTurnGoals[0]));
        }
        if (team1Results.HadDiscPoints[1] - team1Results.NoTurnGoals[1] > 0) {
            team1Results.RecoveryRate[1] = Math.round(100 * team1Results.GoalsWithTurns[1] / (team1Results.HadDiscPoints[1] - team1Results.NoTurnGoals[1]));
        }
        if (team2Results.HadDiscPoints[0] - team2Results.NoTurnGoals[0] > 0) {
            team2Results.RecoveryRate[0] = Math.round(100 * team2Results.GoalsWithTurns[0] / (team2Results.HadDiscPoints[0] - team2Results.NoTurnGoals[0]));
        }
        if (team2Results.HadDiscPoints[1] - team2Results.NoTurnGoals[1] > 0) {
            team2Results.RecoveryRate[1] = Math.round(100 * team2Results.GoalsWithTurns[1] / (team2Results.HadDiscPoints[1] - team2Results.NoTurnGoals[1]));
        }

        if (team1Results.PointsPlayed[1] > 0) {
            team1Results.DefensiveSuccessRate = Math.round(100 * team1Results.HadDiscPoints[1] / team1Results.PointsPlayed[1]);
        }
        if (team2Results.PointsPlayed[1] > 0) {
            team2Results.DefensiveSuccessRate = Math.round(100 * team2Results.HadDiscPoints[1] / team2Results.PointsPlayed[1]);
        }

    }
});
