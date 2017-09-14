$(function() {
  $('[data-toggle="tooltip"]').tooltip({
    container: 'body',
    html: true
  });
  restoreUI();

  var firstHalf = (localStorage.firstHalf != undefined) ? ((localStorage.firstHalf == "true") ? true : false) : true;
  var team1Offense = (localStorage.team1Offense != undefined) ? ((localStorage.team1Offense == "true") ? true : false) : true;
  var team1HasDisc = (localStorage.team1HasDisc != undefined) ? ((localStorage.team1HasDisc == "true") ? true : false) : true;
  var team1ScoredLast = (localStorage.team1ScoredLast != undefined) ? JSON.parse(localStorage.team1ScoredLast) : [];
  var team1Passes = (localStorage.team1Passes != undefined) ? JSON.parse(localStorage.team1Passes) : [0];
  var team2Passes = (localStorage.team2Passes != undefined) ? JSON.parse(localStorage.team2Passes) : [];
  var team1Turns = (localStorage.team1Turns != undefined) ? JSON.parse(localStorage.team1Turns) : 0;
  var team2Turns = (localStorage.team2Turns != undefined) ? JSON.parse(localStorage.team2Turns) : 0;
  var team1Goals = (localStorage.team1Goals != undefined) ? JSON.parse(localStorage.team1Goals) : 0;
  var team2Goals = (localStorage.team2Goals != undefined) ? JSON.parse(localStorage.team2Goals) : 0;
  var tableData = (localStorage.tableData != undefined) ? JSON.parse(localStorage.tableData) : [];
  updateTableHeader($("#team1name").html(), $("#team2name").html());
  var inputs = (localStorage.inputs != undefined) ? JSON.parse(localStorage.inputs) : [];
  var scoretable = (localStorage.scoretable != undefined) ? JSON.parse(localStorage.scoretable) : [];

  var team1Results = (localStorage.team1Results != undefined) ? JSON.parse(localStorage.team1Results) : new Results();
  var team2Results = (localStorage.team2Results != undefined) ? JSON.parse(localStorage.team2Results) : new Results();

  restoreData();

  function ScoreEntry(_Team1Passes, _Team1Turns, _Team1Side, _Team1Score, _Team2Passes, _Team2Turns, _Team2Side, _Team2Score, _Team1Scored) {
    this.Team1Passes = _Team1Passes;
    this.Team1Turns = _Team1Turns;
    this.Team1Side = _Team1Side;
    this.Team1Score = _Team1Score;
    this.Team2Passes = _Team2Passes;
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
    this.ConversionRate = ["0/0", "0/0"];
    this.PerfectConversionRate = ["0/0", "0/0"];
    this.MeanTurnsPerPoint = [0, 0];
    this.RecoveryRate = ["0/0", "0/0"];
    this.DefensiveSuccessRate = "0/0";
    this.TotalPasses = [0, 0];
    this.CompletionRate = [0, 0];
    this.MeanPassesPerPoint = [0, 0];
    this.MeanPassesPerPoss = [0, 0];
  }

  function saveData() {
    localStorage.firstHalf = firstHalf.toString();
    localStorage.team1Offense = team1Offense.toString();
    localStorage.team1HasDisc = team1HasDisc.toString();
    localStorage.team1ScoredLast = JSON.stringify(team1ScoredLast);
    localStorage.team1Passes = JSON.stringify(team1Passes);
    localStorage.team2Passes = JSON.stringify(team2Passes);
    localStorage.team1Turns = team1Turns;
    localStorage.team2Turns = team2Turns;
    localStorage.team1Goals = team1Goals;
    localStorage.team2Goals = team2Goals;
    localStorage.tableData = JSON.stringify(tableData);
    localStorage.inputs = JSON.stringify(inputs);
    localStorage.scoretable = JSON.stringify(scoretable);
    localStorage.team1Results = JSON.stringify(team1Results);
    localStorage.team2Results = JSON.stringify(team2Results);
    localStorage.tournamentTitle = $("#tournamentTitle").html();
    localStorage.gameTitle = $("#gameTitle").html();
    localStorage.team1name = $("#team1name").html();
    localStorage.team2name = $("#team2name").html();
  }

  function restoreUI() {
    if (localStorage.tournamentTitle != undefined) {
      $("#tournamentTitle").html(localStorage.tournamentTitle)
    };
    if (localStorage.gameTitle != undefined) {
      $("#gameTitle").html(localStorage.gameTitle)
    };
    if (localStorage.team1name != undefined) {
      $("#team1name").html(localStorage.team1name)
    };
    if (localStorage.team2name != undefined) {
      $("#team2name").html(localStorage.team2name)
    };
    $(".team1").html($("#team1name").html());
    $(".team2").html($("#team2name").html());
  }

  function resetUI() {
    $("#tournamentTitle").html("Tournament");
    $("#gameTitle").html("Game Title");
    $("#team1name").html("Team 1");
    $("#team2name").html("Team 2");
    $(".team1").html($("#team1name").html());
    $(".team2").html($("#team2name").html());
    updateTitle();
  }

  function restoreData() {
    changeTeamColour(team1HasDisc);
    if (team1Offense) {
      $("#team1mode").html("Offense");
      $("#team2mode").html("Defense");
    } else {
      $("#team1mode").html("Defense");
      $("#team2mode").html("Offense");
    }
    $("#team1score").html(team1Goals);
    $("#team2score").html(team2Goals);
    $("#turnover").html(team1Turns + " Turnovers " + team2Turns);
    (team1HasDisc && team1Passes.length > 0) && $("#pass").html("Passes: " + team1Passes[team1Passes.length - 1]);
    (!team1HasDisc && team2Passes.length > 0) && $("#pass").html("Passes: " + team2Passes[team2Passes.length - 1]);
    $("#data").html(tableData.join(""));
    updateTable();
    if (inputs.length > 0) {
      $("#undo").attr("disabled", false);
      $("#switch").attr("disabled", true);
    } else {
      $("#undo").attr("disabled", true);
      $("#switch").attr("disabled", false);
    }
    (firstHalf && inputs.length > 0 && inputs[inputs.length - 1] == "score") ? $("#halftime").attr("disabled", false): $("#halftime").attr("disabled", true);
  }

  function resetData() {
    firstHalf = true;
    team1Offense = true;
    team1HasDisc = true;
    team1ScoredLast = [];
    team1Passes = [0];
    team2Passes = [];
    team1Turns = 0;
    team2Turns = 0;
    team1Goals = 0;
    team2Goals = 0;
    tableData = [];
    updateTableHeader($("#team1name").html(), $("#team2name").html());
    inputs = [];
    scoretable = [];

    team1Results = new Results();
    team2Results = new Results();

    restoreData();
  }

  function updateTableHeader(team1, team2) {
    tableData[0] = "<table id='data' class='table table-bordered table-condensed'><tr><th colspan='3' class='team1'>" + team1 + "</th><th class='notop'></th><th colspan='3' class='team2'>" + team2 + "</th></tr><tr id='title'><th>Passes</th><th>Turns</th><th>O/D</th><th>Score</th><th>O/D</th><th>Turns</th><th>Passes</th></tr></table>";
  }

  function updateTitle() {
    $("#title").html($("#tournamentTitle").html() + ": " + $("#gameTitle").html() + "- " + $("#team1name").html() + " vs " + $("#team2name").html());
  }

  $("#tournamentTitle").blur(function() {
    saveData();
    updateTitle();
  });

  $("#gameTitle").blur(function() {
    saveData();
    updateTitle();
  });

  $("#team1name").blur(function() {
    $(".team1").html($("#team1name").html());
    saveData();
    updateTitle();
    updateTableHeader($("#team1name").html(), $("#team2name").html());
  });

  $("#team2name").blur(function() {
    $(".team2").html($("#team2name").html());
    saveData();
    updateTitle();
    updateTableHeader($("#team1name").html(), $("#team2name").html());
  });

  $("#switch").click(function() {
    t1 = $("#team1name").html();
    t2 = $("#team2name").html();
    $("#team1name").html(t2);
    $("#team2name").html(t1);
    $(".team1").html(t2);
    $(".team2").html(t1);
    updateTableHeader($("#team1name").html(), $("#team2name").html());
    saveData();
  });

  $("#turnover").click(function() {
    $("#switch").attr("disabled", true);
    if (team1HasDisc) {
      team2Passes.push(0);
      team1Turns += 1;
      changeTeamColour(false);
      $("#pass").html("Passes: " + team2Passes[team2Passes.length - 1]);
    } else {
      team1Passes.push(0);
      team2Turns += 1;
      changeTeamColour(true);
      $("#pass").html("Passes: " + team1Passes[team1Passes.length - 1]);
    }
    $("#turnover").html(team1Turns + " Turnovers " + team2Turns);
    team1HasDisc = !team1HasDisc;

    inputs.push("turnover");
    $("#halftime").attr("disabled", true);
    $("#undo").attr("disabled", false);
    saveData();
  });

  $("#pass").click(function() {
    if (team1HasDisc) {
      team1Passes[team1Passes.length - 1] += 1;
      $("#pass").html("Passes: " + team1Passes[team1Passes.length - 1]);
    } else {
      team2Passes[team2Passes.length - 1] += 1;
      $("#pass").html("Passes: " + team2Passes[team2Passes.length - 1]);
    }
    inputs.push("pass");
    $("#undo").attr("disabled", false);
    saveData();
  });

  $("#score").click(function() {
    $("#pass").html("Pass");
    $("#switch").attr("disabled", true);
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
        (team1Turns === 0) ? team1Class += " perfect": team1Class += "";
      } else {
        team1Class = "break";
        team2Class = "broken";
        (team1Turns === 0) ? team1Class += " perfect": team1Class += "";
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

    var entry = new ScoreEntry(team1Passes, team1Turns, team1Side, team1Goals, team2Passes, team2Turns, team2Side, team2Goals, team1scored);
    scoretable.push(entry);

    var newRow = "<tr><td class='" + team1Class + "'>" + entry.Team1Passes.toString() + "</td><td class='" + team1Class + "'>" + entry.Team1Turns + "</td><td class='" + team1Class + "'>" + entry.Team1Side + "</td><td>" + entry.Team1Score + "-" + entry.Team2Score + "</td><td class='" + team2Class + "'>" + entry.Team2Side + "</td><td class='" + team2Class + "'>" + entry.Team2Turns + "</td><td class='" + team2Class + "'>" + entry.Team2Passes.toString() + "</td></tr>";
    tableData.push(newRow);
    $("#data").html(tableData.join(""));

    team1HasDisc = !team1HasDisc;
    changeTeamColour(team1HasDisc);
    resetPasses();
    resetTurnovers();

    firstHalf ? $("#halftime").attr("disabled", false) : $("#halftime").attr("disabled", true);

    updateTable();
    inputs.push("score");
    $("#undo").attr("disabled", false);
    saveData();
  });

  $("#halftime").click(function() {
    firstHalf = false;
    team1Offense = false;
    team1HasDisc = false;

    $("#team1mode").html("Defense");
    $("#team2mode").html("Offense");
    changeTeamColour(team1HasDisc);

    tableData.push("<tr><td colspan='7' class='half'>HALF</td></tr>");
    $("#data").html(tableData.join(""));

    $("#halftime").attr("disabled", true);

    inputs.push("half");
    $("#undo").attr("disabled", false);
    saveData();
  });

  $("#undo").click(function() {
    switch (inputs[inputs.length - 1]) {
      case "turnover":
        undoTurnover();
        break;
      case "pass":
        undoPass();
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
      $("#switch").attr("disabled", false);
    }
    saveData();
  });

  $("#save").click(function() {
    var t = confirm("Save game data to Dropbox?");
    if (t) {
      console.log("saved")
    };
  });

  $("#clear").click(function() {
    var t = confirm("Are you sure you want to clear all data?\nThis cannot be undone.");
    if (t) {
      localStorage.clear();
      resetData();
      resetUI();
    };
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

  function resetPasses() {
    team1Passes = (team1HasDisc) ? [0] : [];
    team2Passes = (!team1HasDisc) ? [0] : [];
    $("#pass").html("Pass");
  }

  function resetTurnovers() {
    team1Turns = 0;
    team2Turns = 0;
    $("#turnover").html("Turnover");
  }

  function undoTurnover() {
    if (team1HasDisc) {
      team2Turns -= 1;
      team1Passes.pop();
      $("#pass").html("Passes: " + team2Passes[team2Passes.length - 1]);
    } else {
      (team1Turns -= 1);
      team2Passes.pop();
      $("#pass").html("Passes: " + team1Passes[team1Passes.length - 1]);
    }
    team1HasDisc = !team1HasDisc;
    $("#turnover").html(team1Turns + " Turnovers " + team2Turns);
  }

  function undoPass() {
    if (team1HasDisc) {
      team1Passes[team1Passes.length - 1] -= 1;
      $("#pass").html("Passes: " + team1Passes[team1Passes.length - 1]);
    } else {
      team2Passes[team2Passes.length - 1] -= 1;
      $("#pass").html("Passes: " + team2Passes[team2Passes.length - 1]);
    }
  }

  function undoScore() {
    team1HasDisc = !team1HasDisc;

    scoretable[scoretable.length - 1].Team1Scored ? (team1Goals -= 1) : (team2Goals -= 1);
    $("#team1score").html(team1Goals);
    $("#team2score").html(team2Goals);

    team1Turns = scoretable[scoretable.length - 1].Team1Turns;
    team2Turns = scoretable[scoretable.length - 1].Team2Turns;
    $("#turnover").html(team1Turns + " Turnovers " + team2Turns);

    team1Passes = scoretable[scoretable.length - 1].Team1Passes;
    team2Passes = scoretable[scoretable.length - 1].Team2Passes;
    (team1HasDisc) ? $("#pass").html("Passes: " + team1Passes[team1Passes.length - 1]): $("#pass").html("Passes: " + team2Passes[team2Passes.length - 1]);

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

    $("#crO1").html(team1Results.ConversionRate[0]);
    $("#crD1").html(team1Results.ConversionRate[1]);
    $("#crO2").html(team2Results.ConversionRate[0]);
    $("#crD2").html(team2Results.ConversionRate[1]);

    $("#pcO1").html(team1Results.PerfectConversionRate[0]);
    $("#pcD1").html(team1Results.PerfectConversionRate[1]);
    $("#pcO2").html(team2Results.PerfectConversionRate[0]);
    $("#pcD2").html(team2Results.PerfectConversionRate[1]);

    $("#mtO1").html(team1Results.MeanTurnsPerPoint[0]);
    $("#mtD1").html(team1Results.MeanTurnsPerPoint[1]);
    $("#mtO2").html(team2Results.MeanTurnsPerPoint[0]);
    $("#mtD2").html(team2Results.MeanTurnsPerPoint[1]);

    $("#rrO1").html(team1Results.RecoveryRate[0]);
    $("#rrD1").html(team1Results.RecoveryRate[1]);
    $("#rrO2").html(team2Results.RecoveryRate[0]);
    $("#rrD2").html(team2Results.RecoveryRate[1]);

    $("#ds1").html(team1Results.DefensiveSuccessRate);
    $("#ds2").html(team2Results.DefensiveSuccessRate);

    $("#tpO1").html(team1Results.TotalPasses[0]);
    $("#tpD1").html(team1Results.TotalPasses[1]);
    $("#tpO2").html(team2Results.TotalPasses[0]);
    $("#tpD2").html(team2Results.TotalPasses[1]);

    $("#pcrO1").html(team1Results.CompletionRate[0] + "%");
    $("#pcrD1").html(team1Results.CompletionRate[1] + "%");
    $("#pcrO2").html(team2Results.CompletionRate[0] + "%");
    $("#pcrD2").html(team2Results.CompletionRate[1] + "%");

    $("#mppO1").html(team1Results.MeanPassesPerPoint[0]);
    $("#mppD1").html(team1Results.MeanPassesPerPoint[1]);
    $("#mppO2").html(team2Results.MeanPassesPerPoint[0]);
    $("#mppD2").html(team2Results.MeanPassesPerPoint[1]);

    $("#mpoO1").html(team1Results.MeanPassesPerPoss[0]);
    $("#mpoD1").html(team1Results.MeanPassesPerPoss[1]);
    $("#mpoO2").html(team2Results.MeanPassesPerPoss[0]);
    $("#mpoD2").html(team2Results.MeanPassesPerPoss[1]);
  }

  function computeResults() {
    team1Results = new Results();
    team2Results = new Results();

    for (let x = 0; x < scoretable.length; x++) {
      if (scoretable[x].Team1Side == "O") {
        team1Results.PointsPlayed[0] += 1;
        (scoretable[x].Team1Scored) ? team1Results.GoalsScored[0] += 1: team2Results.GoalsScored[1] += 1;
        team1Results.Turnovers[0] += scoretable[x].Team1Turns;
        team2Results.Turnovers[1] += scoretable[x].Team2Turns;
        team1Results.TotalPasses[0] += scoretable[x].Team1Passes.reduce((a, b) => a + b, 0);
        team2Results.TotalPasses[1] += scoretable[x].Team2Passes.reduce((a, b) => a + b, 0);

        if (scoretable[x].Team1Turns > 0) {
          team2Results.HadDiscPoints[1] += 1;
        }
      } else {
        team1Results.PointsPlayed[1] += 1;
        (scoretable[x].Team1Scored) ? team1Results.GoalsScored[1] += 1: team2Results.GoalsScored[0] += 1;
        team1Results.Turnovers[1] += scoretable[x].Team1Turns;
        team2Results.Turnovers[0] += scoretable[x].Team2Turns;
        team1Results.TotalPasses[1] += scoretable[x].Team1Passes.reduce((a, b) => a + b, 0);
        team2Results.TotalPasses[0] += scoretable[x].Team2Passes.reduce((a, b) => a + b, 0);

        if (scoretable[x].Team2Turns > 0) {
          team1Results.HadDiscPoints[1] += 1;
        }
      }

      if (scoretable[x].Team1Scored) {
        if (scoretable[x].Team1Turns == 0) {
          (scoretable[x].Team1Side == "O") ? team1Results.NoTurnGoals[0] += 1: team1Results.NoTurnGoals[1] += 1;
        }
      } else {
        if (scoretable[x].Team2Turns == 0) {
          (scoretable[x].Team2Side == "O") ? team2Results.NoTurnGoals[0] += 1: team2Results.NoTurnGoals[1] += 1;
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
      team1Results.ConversionRate[0] = team1Results.GoalsScored[0] + "/" + team1Results.HadDiscPoints[0];
    }
    if (team1Results.HadDiscPoints[1] > 0) {
      team1Results.ConversionRate[1] = team1Results.GoalsScored[1] + "/" + team1Results.HadDiscPoints[1];
    }
    if (team2Results.HadDiscPoints[0] > 0) {
      team2Results.ConversionRate[0] = team2Results.GoalsScored[0] + "/" + team2Results.HadDiscPoints[0];
    }
    if (team2Results.HadDiscPoints[1] > 0) {
      team2Results.ConversionRate[1] = team2Results.GoalsScored[1] + "/" + team2Results.HadDiscPoints[1];
    }

    if (team1Results.HadDiscPoints[0] > 0) {
      team1Results.PerfectConversionRate[0] = team1Results.NoTurnGoals[0] + "/" + team1Results.HadDiscPoints[0];
    }
    if (team1Results.HadDiscPoints[1] > 0) {
      team1Results.PerfectConversionRate[1] = team1Results.NoTurnGoals[1] + "/" + team1Results.HadDiscPoints[1];
    }
    if (team2Results.HadDiscPoints[0] > 0) {
      team2Results.PerfectConversionRate[0] = team2Results.NoTurnGoals[0] + "/" + team2Results.HadDiscPoints[0];
    }
    if (team2Results.HadDiscPoints[1] > 0) {
      team2Results.PerfectConversionRate[1] = team2Results.NoTurnGoals[1] + "/" + team2Results.HadDiscPoints[1];
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
      team1Results.RecoveryRate[0] = team1Results.GoalsWithTurns[0] + "/" + (team1Results.HadDiscPoints[0] - team1Results.NoTurnGoals[0]);
    }
    if (team1Results.HadDiscPoints[1] - team1Results.NoTurnGoals[1] > 0) {
      team1Results.RecoveryRate[1] = team1Results.GoalsWithTurns[1] + "/" + (team1Results.HadDiscPoints[1] - team1Results.NoTurnGoals[1]);
    }
    if (team2Results.HadDiscPoints[0] - team2Results.NoTurnGoals[0] > 0) {
      team2Results.RecoveryRate[0] = team2Results.GoalsWithTurns[0] + "/" + (team2Results.HadDiscPoints[0] - team2Results.NoTurnGoals[0]);
    }
    if (team2Results.HadDiscPoints[1] - team2Results.NoTurnGoals[1] > 0) {
      team2Results.RecoveryRate[1] = team2Results.GoalsWithTurns[1] + "/" + (team2Results.HadDiscPoints[1] - team2Results.NoTurnGoals[1]);
    }

    if (team1Results.PointsPlayed[1] > 0) {
      team1Results.DefensiveSuccessRate = team1Results.HadDiscPoints[1] + "/" + team1Results.PointsPlayed[1];
      team1Results.MeanPassesPerPoint[1] = Math.round(100 * team1Results.TotalPasses[1] / team1Results.PointsPlayed[1]) / 100;
    }
    if (team2Results.PointsPlayed[1] > 0) {
      team2Results.DefensiveSuccessRate = team2Results.HadDiscPoints[1] + "/" + team2Results.PointsPlayed[1];
      team2Results.MeanPassesPerPoint[1] = Math.round(100 * team2Results.TotalPasses[1] / team2Results.PointsPlayed[1]) / 100;
      team2Results.MeanPassesPerPoss[1] = Math.round(100 * team2Results.TotalPasses[1] / (team2Results.Turnovers[1] + team2Results.GoalsScored[1])) / 100;
    }

    if (team1Results.PointsPlayed[0] > 0) {
      team1Results.MeanPassesPerPoint[0] = Math.round(100 * team1Results.TotalPasses[0] / team1Results.PointsPlayed[0]) / 100;
    }
    if (team2Results.PointsPlayed[0] > 0) {
      team2Results.MeanPassesPerPoint[0] = Math.round(100 * team2Results.TotalPasses[0] / team2Results.PointsPlayed[0]) / 100;
    }
    if (team1Results.Turnovers[1] + team1Results.GoalsScored[1] > 0) {
      team1Results.MeanPassesPerPoss[1] = Math.round(100 * team1Results.TotalPasses[1] / (team1Results.Turnovers[1] + team1Results.GoalsScored[1])) / 100;
    }
    if (team2Results.Turnovers[1] + team2Results.GoalsScored[1] > 0) {
      team2Results.MeanPassesPerPoss[1] = Math.round(100 * team2Results.TotalPasses[1] / (team2Results.Turnovers[1] + team2Results.GoalsScored[1])) / 100;
    }

    if (team1Results.PointsPlayed[0] > 0) {
      team1Results.MeanPassesPerPoss[0] = Math.round(100 * team1Results.TotalPasses[0] / (team1Results.Turnovers[0] + team1Results.GoalsScored[0])) / 100;
    }
    if (team2Results.PointsPlayed[0] > 0) {
      team2Results.MeanPassesPerPoss[0] = Math.round(100 * team2Results.TotalPasses[0] / (team2Results.Turnovers[0] + team2Results.GoalsScored[0])) / 100;
    }

    if (team1Results.TotalPasses[0] + team1Results.Turnovers[0] > 0) {
      team1Results.CompletionRate[0] = Math.round(100 * team1Results.TotalPasses[0] / (team1Results.TotalPasses[0] + team1Results.Turnovers[0]));
    }
    if (team1Results.TotalPasses[1] + team1Results.Turnovers[1] > 0) {
      team1Results.CompletionRate[1] = Math.round(100 * team1Results.TotalPasses[1] / (team1Results.TotalPasses[1] + team1Results.Turnovers[1]));
    }
    if (team2Results.TotalPasses[0] + team2Results.Turnovers[0] > 0) {
      team2Results.CompletionRate[0] = Math.round(100 * team2Results.TotalPasses[0] / (team2Results.TotalPasses[0] + team2Results.Turnovers[0]));
    }
    if (team2Results.TotalPasses[1] + team2Results.Turnovers[1] > 0) {
      team2Results.CompletionRate[1] = Math.round(100 * team2Results.TotalPasses[1] / (team2Results.TotalPasses[1] + team2Results.Turnovers[1]));
    }

  }
});
