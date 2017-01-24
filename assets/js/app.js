var myGameArea;
var myGamePiece;
var myObstacles = [];
var myscore;

function helloFunction() {
  $.amaran({
    'message'           :'A hint: use the A, W, S and D keys',
    'cssanimationIn'    :'boundeInDown',
    'cssanimationOut'   :'zoomOutUp',
    'position'          :'top right',
    'closeButton'   :true
  });
}

var config = {
  apiKey: "Fribase apiKey",
  authDomain: "Firebase authDomain",
  databaseURL: "Firebase URL",
  storageBucket: "Firebase appspot",
  messagingSenderId: "Firebase sender id"
};
firebase.initializeApp(config);
database = firebase.database();
var ref = database.ref('firebase db name');

function restartGame() {
  document.getElementById("myfilter").style.display = "none";
  document.getElementById("myrestartbutton").style.display = "none";
  myGameArea.stop();
  myGameArea.clear();
  myGameArea = {};
  myGamePiece = {};
  myObstacles = [];
  myscore = {};
  document.getElementById("canvascontainer").innerHTML = "";
  startGame()
  $.amaran({
    'message'           :'Game Restarted',
    'cssanimationIn'    :'boundeInDown',
    'cssanimationOut'   :'zoomOutUp',
    'position'          :'top right',
    'closeButton'   :true
  });
}

function startGame() {
  document.getElementsByTagName("button")[1].disabled = true;
  document.getElementsByTagName("input")[0].disabled = true;
  document.getElementsByTagName("input")[0].style.border = "2px #c0392b solid";
  myGameArea = new gamearea();
  myGamePiece = new component(30, 30, "#34495e", 10, 75);
  myscore = new component("15px", "Consolas", "", 220, 25, "text");
  myGameArea.start();
}

function gamearea() {
  this.canvas = document.createElement("canvas");
  this.canvas.width = 320;
  this.canvas.height = 180;
  document.getElementById("canvascontainer").appendChild(this.canvas);
  this.context = this.canvas.getContext("2d");
  this.pause = false;
  this.frameNo = 0;

  this.start = function() {
    this.interval = setInterval(updateGameArea, 15);
    window.addEventListener('keydown', function (e) {
      myGameArea.key = e.keyCode;
    })
    window.addEventListener('keyup', function (e) {
      myGameArea.key = false;
    });
  }
  this.stop = function() {
    clearInterval(this.interval);
    this.pause = true;
    document.getElementsByTagName("button")[1].disabled = false;
    document.getElementsByTagName("input")[0].disabled = false;
    document.getElementsByTagName("input")[0].style.border = "2px #27ae60 solid";
  }
  this.clear = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "text") {
    this.text = color;
  }
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }else{
      $.amaran({
        'message'           :'Game Over! You Have ' + myscore.score + " point",
        'cssanimationIn'    :'swing',
        'cssanimationOut'   :'zoomOutUp',
        'position'          :'top right',
        'closeButton'   :true
      });
    }
    return crash;
  }
}

function updateGameArea() {
  var x, y, min, max, height, gap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop();
      document.getElementById("myfilter").style.display = "block";
      document.getElementById("myrestartbutton").style.display = "block";
      return;
    }
  }
  if (myGameArea.pause == false) {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myscore.score +=1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
      x = myGameArea.canvas.width;
      y = myGameArea.canvas.height - 100;
      min = 40;
      max = 100;
      height = Math.floor(Math.random()*(max-min+1)+min);
      min = 40;
      max = 100;
      gap = Math.floor(Math.random()*(max-min+1)+min);
      myObstacles.push(new component(10, height, "#27ae60", x, 0));
      myObstacles.push(new component(10, x - height - gap, "#27ae60", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -1;
      myObstacles[i].update();
    }
    document.getElementById("submitScore").innerHTML = myscore.score;
    myscore.update();

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    if (myGameArea.key && myGameArea.key == 65) {myGamePiece.speedX = -2; }//geri
    if (myGameArea.key && myGameArea.key == 68) {myGamePiece.speedX = 2; }//sağ
    if (myGameArea.key && myGameArea.key == 87) {myGamePiece.speedY = -2; }//yukarı
    if (myGameArea.key && myGameArea.key == 83) {myGamePiece.speedY = 2; }//aşağı
    myGamePiece.x += myGamePiece.speedX;
    myGamePiece.y += myGamePiece.speedY;
    myGamePiece.update();
  }
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

var buttonSubmit = function () {
  var name = document.getElementById("name").value;
  var score = myscore.score;
  if (name.length === 0) {
    $.amaran({
      'message'           :'Fill in the name.!',
      'cssanimationIn'    :'boundeInDown',
      'cssanimationOut'   :'zoomOutUp',
      'position'          :'top right',
      'closeButton'   :true
    });
    document.getElementById("name").value = '';
  }else{
    $.amaran({
      'message'           :'Score Sended',
      'cssanimationIn'    :'boundeInDown',
      'cssanimationOut'   :'zoomOutUp',
      'position'          :'top right',
      'closeButton'   :true
    });
    document.getElementsByTagName("button")[1].disabled = true;
    document.getElementsByTagName("input")[0].disabled = true;
    var arr_list_items = $('#highScoreList li').remove().get();
    highScoreAdd(name, score);
    document.getElementById("name").value = '';
  }
}

var highScoreAdd = function (highName, highScore) {
  var data = {
    userName: highName,
    userScore: highScore
  };
  ref.push(data);
}

var scoreList = function (highScore, highName) {
  var ol = document.getElementById("highScoreList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(highScore + " | " + highName));
  ol.appendChild(li);
}

ref.on('value', getHighScore, errData);

function getHighScore(data) {
  var scores = data.val();
  var keys = Object.keys(scores);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var score = scores[key];
    scoreList(score.userScore, score.userName);
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

startGame();
