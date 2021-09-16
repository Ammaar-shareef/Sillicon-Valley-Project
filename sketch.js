var robot,robot_idle,robot_shoot;
var enemy,enemy_run,enemyGroup;
var invisground1,invisground2,invisground3,invisground4;
var bullet,bulletImg,bulletGroup;
var bulletPack,bulletPackImg,bulletPackGroup;

var enemy2,enemy2_run,enemy2Group;

var ally,ally_shoot;

var invisground5;

var score = 0;
var life = 3;
var bullets = 13;

var waitForReload = false;
var allyAlive = false;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var restart,restartImg;

var shootSound,blast,enemySound;

function preload()
{
 robot_idle = loadAnimation("robot-1.png");
 robot_shoot = loadAnimation("robot-2.png");
 enemy_run = loadAnimation("enemy-1.png","enemy-2.png");
 enemy2_run = loadAnimation("enemyR-1.png","enemyR-2.png");
 bulletImg = loadImage("bullet.png");
 bulletPackImg = loadImage("bulletPack.png");
 book = loadImage("book.png");
 restartImg = loadImage("restart.png");
 ally_shoot = loadAnimation("ally-1.png","ally-2.png");
 shootSound = loadSound("shoot.mp3");
 blast = loadSound("blast.mp3");
 enemySound = loadSound("bite.mp3");
}

function setup() 
{
  createCanvas(800,400);

  robot = createSprite(400,200,50,50);
  robot.addAnimation("run",robot_idle);
  robot.scale = 0.4;
  //robot.debug = true;
  robot.setCollider("circle",30,-150,120);
  robot.velocityY = 13;

  invisground1 = createSprite(400,410,800,20);
  invisground2 = createSprite(400,-10,800,20);
  invisground3 = createSprite(800,200,20,400);
  invisground3.visible = false;
  invisground4 = createSprite(0,200,20,400);
  invisground4.visible = false;
  invisground5 = createSprite(400,380,800,20);
  invisground5.addImage(book);
  invisground5.scale = 0.02;
  //invisground5.visible = false;

  bulletGroup = new Group();
  bulletGroup2 = new Group();
  enemyGroup = new Group();
  enemy2Group = new Group();
  bulletPackGroup = new Group();
  allyGroup = new Group();

  restart = createSprite(850,200,50,50);
  restart.addImage(restartImg);
  restart.scale = 0.2;

  enemy_run.frameDelay = 8;

  blast.setVolume(0.3);
}

function draw() 
{
  background("lightgrey");

  fill("white");
  stroke("black");
  textSize(19);
  text("Score: "+score,710,30);

  fill("white");
  stroke("red");
  textSize(19);
  text("Lives: "+life,600,30);

  fill("black");
  stroke("black");
  textSize(19);
  text("Bullets: "+bullets,460,30);
   
if(gameState === PLAY){
  
 if(robot.isTouching(invisground5)){
  fill("red");
  stroke("red");
  text("Enemy robots have invaded Planet-07, You are a soldier sent to take them down!",80,150);
  text("Use spacebar to shoot, arrows to move",180,200);
  text("There will be bullet packs spawning,collect them to reload if you have run out of bullets",50,250);
 }
  
  robot.collide(invisground1);
  robot.collide(invisground2);
  robot.collide(invisground3);
  robot.collide(invisground4);

  if(bulletGroup.isTouching(enemyGroup)||bulletGroup2.isTouching(enemyGroup)){
    enemyGroup.destroyEach();
    bulletGroup.destroyEach();
    bulletGroup2.destroyEach();
    score += 1;
    blast.play();
  }

  if(bulletGroup.isTouching(enemy2Group)||bulletGroup2.isTouching(enemy2Group)){
    enemy2Group.destroyEach();
    bulletGroup.destroyEach();
    bulletGroup2.destroyEach();
    score += 1;
    blast.play();
  }

  if(enemyGroup.isTouching(robot)||enemyGroup.isTouching(invisground3)){
    enemyGroup.destroyEach();
    life -= 1;
    enemySound.play();
  }

  if(enemy2Group.isTouching(robot)||enemy2Group.isTouching(invisground3)){
    enemy2Group.destroyEach();
    life -= 1;
    enemySound.play();
  }

  if(robot.isTouching(bulletPackGroup)){
    bullets = 13;
    waitForReload = false;
    bulletPackGroup.destroyEach();
  }
 
//movements and shoot
  if(keyDown(UP_ARROW)||keyDown("w")){
    robot.y = robot.y - 7;
  }

  if(keyDown(DOWN_ARROW)||keyDown("s")){
    robot.y = robot.y + 7;
  }

  if(keyDown(LEFT_ARROW)||keyDown("a")){
    robot.x = robot.x - 7;
  }

  if(keyDown(RIGHT_ARROW)||keyDown("d")){
    robot.x = robot.x + 7;
  }

  if(keyWentDown("space") && waitForReload === false){
    robot.addAnimation("shoot",robot_shoot);
    robot.changeAnimation("shoot");
  }
  if(keyWentUp("space") && waitForReload === false){
    shootSound.play();
    shoot();
    robot.changeAnimation("run");
    bullets = bullets - 1;
  }

  if(bullets === 0){
    waitForReload = true;
  }

  if(allyGroup.isTouching(enemyGroup)){
    allyGroup.destroyEach();
    enemyGroup.destroyEach();
    score += 1;
    blast.play();
  }
  
  if(allyGroup.isTouching(enemy2Group)){
    allyGroup.destroyEach();
    enemy2Group.destroyEach();
    score += 1;
    blast.play();
  }

//calling fucntions
  spawnEnemy();
  spawnEnemy2();
  spawnBullets();
  spawnAllies();

  if(life <= 0){
    gameState = END;
  }

 } else if (gameState === END){

  enemyGroup.destroyEach();
  enemy2Group.destroyEach();
  allyGroup.destroyEach();

  enemyGroup.setLifetimeEach(-1);
  enemy2Group.setLifetimeEach(-1);
  allyGroup.setLifetimeEach(-1);

  bulletPackGroup.destroyEach();
  bulletPackGroup.setLifetimeEach(-1);

  restart.x = 400;

  if(mousePressedOver(restart)){
    reset();
  }
 }
  drawSprites();
}

function spawnEnemy()
{
if(frameCount % 100 === 0){
  enemy = createSprite(0,random(80,320),40,20);
  enemy.addAnimation("run-e",enemy_run);
  enemy.scale = 0.3;
  enemy.velocityX = (3 + score / 10);

  enemyGroup.add(enemy);
  enemy.lifetime = 260;
  //enemy.debug = true;
  enemy.setCollider("circle",0,0,100)
 }
}

function spawnEnemy2()
{
if(frameCount % 150 === 0){
  enemy2 = createSprite(0,random(80,320),40,20);
  enemy2.addAnimation("run-2",enemy2_run);
  enemy2.scale = 0.3;
  enemy2.velocityX = (3 + score / 10);

  enemy2Group.add(enemy2);
  enemy2.lifetime = 260;
  //enemy.debug = true;
  enemy2.setCollider("circle",0,0,100)
 }
}

function shoot()
{
  bullet = createSprite(robot.x,robot.y,40,20);
  bullet.addImage(bulletImg);
  bullet.scale = 0.05;
  bullet.velocityX = -10;
  
  bulletGroup.add(bullet);
  bullet.lifetime = 140;
  //bullet.debug = true;
}

function spawnBullets()
{
  if(frameCount % 280 === 0){
  bulletPack = createSprite(random(150,650),random(20,380),40,20);
  bulletPack.addImage(bulletPackImg);
  bulletPack.scale = 0.05;
  //bulletPack.velocityX = -10;
  
  bulletPackGroup.add(bulletPack);
  bulletPack.lifetime = 250;
  //bulletPack.debug = true;
  bulletPack.setCollider("circle",0,50,550);
 }
}

function spawnAllies()
{
  if(frameCount % 450 === 0){
  ally = createSprite(805,random(50,350));
  ally.addAnimation("ally",ally_shoot)
  ally.scale = 0.4;
  ally.velocityX = -5;
  //ally.debug= true;
  ally.setCollider("circle",20,0,70);

  allyGroup.add(ally);
  ally.lifetime = 150;
 }
}

function reset()
{
  bullets = 13;
  life = 3;
  score = 0;
  robot.x = 400;
  robot.y = 400;
  gameState = PLAY;
  restart.x = 850;
}
