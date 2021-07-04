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
$(document).ready(function(){

    $("#menuBtn").click(function(){
        menuToggle();
    });
});