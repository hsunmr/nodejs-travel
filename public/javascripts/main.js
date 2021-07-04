
init = function(){
    setTimeout(function() {
        $("html,body").scrollTop(0)
    }, 0)
    $("body").addClass("load");
    $(".loading").delay(1500).animate({opacity:0},{
        duration:1500,
        complete:function(){
            $("body").removeClass("load");
            $(window).scrollTop(0);
            $(".loading").css("display","none");        
        }
    });
  
};
menuToggle = function() {
    if($("body").hasClass("is-open")){
        $("body").toggleClass("is-open");
        $(window).scrollTop(a);
    }else{
        a = $(window).scrollTop();
        $(window).scrollTop(0);
        $("body").toggleClass("is-open") 
    }
};

$(window).on("load", function() {
    init();
});
$(document).ready(function(){

    $("#menuBtn").click(function(){
        menuToggle();
    });

    $(".hero-scroll").css('bottom','57px');
    
    //Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                scrollTop: (target.offset().top + 1)
                }, 1000);
            }
        }
    });
    $("#close-icon").on("click",function(){
        $("#selector-content").slideUp();
        $("#selector-header #close-icon").fadeOut();
    });
    $("#random").click(function(){
        $("#selector-content").slideDown();
        $("#selector-header #close-icon").fadeIn().css("display","inline-block");
        var attraction_random = Math.floor(Math.random()*10);
        var food_random = Math.floor(Math.random()*9);
        var str ="<div class='row p-0 p-sm-2'>"
                +" <div class='col-6'>"
                +"  <h4>推薦景點!!</h4>"
                +"  <img src='" + attrations[attraction_random]["img"] + "'class='w-100 pt-3 rounded'>"
                +"  <h5>" + attrations[attraction_random]["name"] + "</h5>"
                +" </div>"
                +" <div class='col-6'>"
                +"  <h4>推薦食物!!</h4>"
                +"  <img src='" + foods[food_random]["img"] + "'class='w-100 pt-3 rounded'>"
                +"  <h5>" + foods[food_random]["name"] + "</h5>"
                +" </div></div>";
        $("#selector-content").html(str); 
    });
    //currentQuiz 目前答道題數
    var currentQuiz = null;
    $("#psy-test").click(function(){
        $("#selector-content").slideDown();
        $("#selector-header #close-icon").fadeIn().css("display","inline-block");
        currentQuiz = null;
        var str = "<h3>適合你的景點與食物</h3>"
                + "<div id='result'><h4 id='question'></h4><br><div id='options'></div></div>";
        str += "<button class='btn btn-success' id='startButton' onclick='startButtonClick()'>開始作答</button>";  
        $("#selector-content").html(str); 
    });
    
    
    startButtonClick = function(){
        if (currentQuiz == null) {
            currentQuiz = 0;
            var str = "<div id='result'><h4 id='question'></h4><br><div id='options'></div></div>";
            $('#result').html(str);
            refresh_question(currentQuiz);

            $('#startButton').text("NEXT");
           
        } else {
            //巡視每個選項是否有被選取
            $.each($(":radio"),function(i,val){

                if(val.checked){
                    //使用者所選取項目是否已產生最終結果(A-E)
                    if(isNaN(questions[currentQuiz].answers[i][1])){
                        var finalResult =questions[currentQuiz].answers[i][1];
                        var str ="<div class='row p-0 p-sm-2'>"
                                +" <div class='col-6'>"
                                +"  <h4>推薦景點!!</h4>"
                                +"  <img src='" + finalAnswers[finalResult]["attraction"]["img"] + "'class='w-100 pt-3 rounded'>"
                                +"  <h5>" + finalAnswers[finalResult]["attraction"]["name"] + "</h5>"
                                +" </div>"
                                +" <div class='col-6'>"
                                +"  <h4>推薦食物!!</h4>"
                                +"  <img src='" + finalAnswers[finalResult]["food"]["img"] + "'class='w-100 pt-3 rounded'>"
                                +"  <h5>" + finalAnswers[finalResult]["food"]["name"] + "</h5>"
                                +" </div></div>";
                        $('#result').html(str);

                        currentQuiz = null;

                        $('#startButton').text("重新開始");
                    }else{
                        currentQuiz = questions[currentQuiz].answers[i][1]-1;
                        refresh_question(currentQuiz);

                    }
                    return false;
                }
            });
           
        } 
    }

    var refresh_question= function(currentQuiz){
        $('#question').text(questions[currentQuiz].question);

        $('#options').empty();
        
        for(var x=0;x<questions[currentQuiz].answers.length;x++){
            $('#options').append("<input type='radio' name='options' value="+1+"><label>"+questions[currentQuiz].answers[x][0]+"</label><br><br>");
        }
    }
    

    //food section hover animation
    $("#foods a").hover(function(){
        $(this).addClass("hover");
    },function(){
        $(this).removeClass("hover");
    });

    //traffic animation
    
    //img onload
    var bus_ctx = $("#bus")[0].getContext("2d");
    var plane_ctx = $("#plane")[0].getContext("2d");
    bus_img = new Image();
    plane_img = new Image();
    bus_img.src = "/images/traffic/bus_spritesheet.png";
    plane_img.src = "/images/traffic/plane.png";

    bus_img.onload = function(){
        bus_ctx.drawImage(bus_img,0,110,150,90,12,10,80,50);
    };
    plane_img.onload = function(){
        plane_ctx.drawImage(plane_img,0,0,256,256,12,0,80,80);
    };
    //hover animation
    var bushover = false;
    var planehover = false;
    var index = 12;
    var busindex = 0;
    var buswidth = [0,155.809,314.809,470.809];

    $("#bus,#plane").hover(function(){
        switch($(this).attr("id")){
            case "bus":bushover=true;bussprite(); break;
            case "plane":planehover=true;planesprite(); break;
        } 
    },function(){

        switch($(this).attr("id")){
            case "bus":
                bushover=false;
                bus_ctx.clearRect(index, 10, 80, 50);
                bus_ctx.drawImage(bus_img,0,110,150,90,12,10,80,50);
                break;
            case "plane":
                planehover=false;
                plane_ctx.clearRect(index, 0, 80, 80);
                plane_ctx.drawImage(plane_img,0,0,256,256,12,0,80,80);
                break;   
        }
        index = 12;
    
    });
    bussprite = function(){
        if(bushover == true)
            window.requestAnimationFrame(bussprite);
            
        if(busindex > 3){
            busindex = 0;
        }
        if(index < -90)
            index = 100;
        
        bus_ctx.clearRect(index, 10, 80, 50);
        index--;

        bus_ctx.drawImage(bus_img,buswidth[busindex],110,150,90,index,10,80,50);
        busindex++;
    }
    planesprite = function(){
        
        if(planehover == true)
            window.requestAnimationFrame(planesprite); 
        
        if(index > 100)
            index = -100;
        
        plane_ctx.clearRect(index, 0, 80, 80);
        index+=2;

        plane_ctx.drawImage(plane_img,0,0,256,256,index,0,80,80);

    }
    //click action
    $("#bus,#plane").click(function(){
        if($(this).attr("id")=="bus")
            window.location.href = "/bus";
        else
            window.location.href = "/airport";
    }); 
    
    var sections = [];      //get subnav section
    var attraction_sections = [];
    var id = '';
    var attraction_now = '';


    $("#hero-subnav a").each(function(){
        sections.push($($(this).attr('href')));
    });
    $("#attractions .attraction-item").each(function(){
        attraction_sections.push("#" + $(this).attr('id'));
    });

    $(window).scroll(function () {
        
        var scrollTop = $(window).scrollTop();
        
        //change hero-info color
        if(scrollTop > 100){
            $('body').addClass('fixed');
        }else{
            $('body').removeClass('fixed');
        }
        

        if(!$("body").hasClass('is-open')){

            //about section scroll animation
            if(scrollTop > $("#about").offset().top - 350){
                $("#about-text").css('opacity',1);
                $("#about-icon").css('left',0);
            }
            if($("#about-text").offset().top > 0 && scrollTop > $("#about-text").offset().top - 150){
                $("#about-img img").css('opacity',1);
            }
            //attractions section scroll animation
            for(var i in attraction_sections){
                var attraction = attraction_sections[i];
                if(scrollTop > $(attraction).offset().top - 500){
                    var attraction_change = attraction;
                }
            }
            if(attraction_change != attraction_now){
                attraction_now = attraction_change;
                var first = " .left";
                var second = " .right";
                if(window.matchMedia('(max-width: 1024px)').matches && !($(attraction_now).hasClass('no-order'))){
                    first = " .right";
                    second = " .left";
                }
                $(attraction_now + first).animate({"opacity":1,"left":0},500);
                $(attraction_now + second).delay(500).animate({"opacity":1,"left":0},500);
            }
            //food section scroll animation
            if(scrollTop >  $(".summary").offset().top - 500){
                $(".summary").css('opacity',1);
            }
            $(".food-item").each(function(){
                if(scrollTop > $(this).offset().top - 500){
                    $(this).addClass("active");
                }
            });

            //determine scrolltop position 
            for(var i in sections){
                var section = sections[i];
                if(scrollTop >= section.offset().top - 200){
                    var scrolled_id = section.attr('id');
                }
            }
            //change active
            if(scrolled_id != id){
                id = scrolled_id;
                $("#hero-subnav li").removeClass('active');
                $("a[href='#" + scrolled_id + "']").parent("li").addClass('active');
            }
        }
    });
  
    
   
});