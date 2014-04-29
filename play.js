var play_state = {

    create: function() { 
        // Fuction called after 'preload' to setup the game    
        
        //Display Bird
        this.bird = this.game.add.sprite(100,245,'bird');

        //Add gravity
        this.bird.body.gravity.y = 1000;

        //Call to jump function
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
        
        //Group of Pipes
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);
    
        score = 0;
        var style = {font:"30px Arial",fill:"#ffffff"};
        this.label_score = this.game.add.text(20,20,"0", style);
    
        this.bird.anchor.setTo(-0.2,0.5);

        this.jump_sound = this.game.add.audio('jump');

        this.counter = 0;
    },
    
    update: function() {
        // Function called 60 times per second

        //If bird is out of the world, call restart_game function
        if (this.bird.inWorld==false) 
            this.restart_game();

        this.game.physics.overlap(this.bird,this.pipes,this.hit_pipe,null,this);
        
        if (this.bird.angle < 20) 
            this.bird.angle += 1;

    },

    jump: function(){

        if (this.bird.alive==false) 
            return;
        //Verticle velocity to bird
        this.bird.body.velocity.y = -350;

        //this.game.add.tween(this.bird).to({angle: -20}, 100).start();
        var animation = this.game.add.tween(this.bird);
        animation.to({angle: -20}, 100);
        animation.start();

        this.jump_sound.play();

    },

    restart_game: function() {
        this.game.time.events.remove(this.timer);
        this.game.state.start('menu');

    },

    add_one_pipe: function(x, y){

        //Get the first dead pipe
        var pipe = this.pipes.getFirstDead();

        //Set the new position of the pipe
        pipe.reset(x,y);

        //Add velocity to the pipe to make it move
        pipe.body.velocity.x=-200;

        //Kill the pipe
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function(){

        var hole = Math.floor(Math.random()*5)+1;

        for (var i = 0; i < 8; i++){
            if (i!=hole && i != hole + 1) this.add_one_pipe(400,i*60+10);
        }

        this.counter += 1;

        if (this.counter == 1){ 
            score = 0;
        }
        else{
            score +=1;
        }
        this.label_score.content = score;

    },

    hit_pipe: function(){
        if (this.bird.alive==false) 
            return;
        this.bird.alive = false;
        this.game.time.events.remove(this.timer);
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x=0;
        }, this);
    },
};