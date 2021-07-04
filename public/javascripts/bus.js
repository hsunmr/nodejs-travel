refreshList = function(items,mode){
    var str = '';
    for (var i = 0; i < items.length; i++){

        str += 
        `<li class="card" title="路線詳情">
            <i class="fas fa-thumbtack" title="加到最愛路線"></i>
            <a href="#" class="busLink">
        `;
        if(mode == "chinese"){
            str += 
            `   <p class="bus-way" data-zh="${ items[i].DepartureStopNameZh } - ${ items[i].DestinationStopNameZh }" data-en="${ items[i].DepartureStopNameEn } - ${ items[i].DestinationStopNameEn }">${ items[i].DepartureStopNameZh } - ${ items[i].DestinationStopNameZh }</p>
                <p class="bus-num" data-zh="${ items[i].SubRoutes[0].SubRouteName.Zh_tw }" data-en="${ items[i].SubRoutes[0].SubRouteName.En}">${ items[i].SubRoutes[0].SubRouteName.Zh_tw }</p>
            `
        }
        else if(mode == "english"){
            str += 
            `   <p class="bus-way" data-zh="${ items[i].DepartureStopNameZh } - ${ items[i].DestinationStopNameZh }" data-en="${ items[i].DepartureStopNameEn } - ${ items[i].DestinationStopNameEn }">${ items[i].DepartureStopNameEn } - ${ items[i].DestinationStopNameEn }</p>
                <p class="bus-num" data-zh="${ items[i].SubRoutes[0].SubRouteName.Zh_tw }" data-en="${ items[i].SubRoutes[0].SubRouteName.En}">${ items[i].SubRoutes[0].SubRouteName.En }</p>
            `
        }
        str +="</a></li>";
    }
    $(".bus-info").hide();
    $("#now-position").text("");
    $(".bus-search").show();
    
    $("#list").html(str);
    

}

$(document).ready(function(){
   
    //load bus data
    var url = "https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/KinmenCounty?$format=JSON";
    var way_url = '';
    var now_way;
    var way_var = '';
    var data = '';
    var mode = 'chinese';
    var page = 'home';
   
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result){
            data = result;
            refreshList(result,mode);    
        },
        error: function() {  
            console.log('Request Error.');
        }
    });
    //search
    $(".search").on('input',function(){
        var value = $(".search").val();
        filterItems = function(val){
            return data.filter(function(index){
                return index.SubRoutes[0].SubRouteName.Zh_tw.indexOf(val.toUpperCase())==0;
            })
        }
        refreshList(filterItems(value),mode);
    });
    //button click
    $("#return-btn,#Zh-btn,#En-btn").click(function(){
        $(".search").val('');

        if(this.id == "return-btn"){  //return button
            clearInterval(way_var);
            refreshList(data,mode);
            page = "home";
            return true;
        }
        if(this.id == "Zh-btn")      //chinese button
            mode = "chinese";
        else if(this.id == "En-btn") //english button
            mode = "english";

        if(page == "home")
            refreshList(data,mode);
        else if(page == "way"){
            renderWay(now_way,mode);
        }
    });
    //render way page
    renderWay = function(now_way,mode){
    
        var way = now_way.find('.bus-way').text();
        var num = now_way.find('.bus-num').attr('data-zh');
        
        way_url = 'https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/KinmenCounty?$filter=RouteName%2FZh_tw%20eq%20%27' + num + '%27&Direction%20eq%20%270%27&$orderby=StopSequence%20&$format=JSON';     
       
        $.ajax({
            url: way_url,
            type: "GET",
            dataType: "json",
            success: function(result){ 
                var str ='';
                var stopname ='';
                var over,stop,arrive,min = '';
                for(var i=0 ; i < result.length;i++){
                    
                    if(mode == "chinese"){
                        stopname = result[i].StopName.Zh_tw;
                        over = "過站";
                        stop = "末班駛離";
                        arrive = "進站中";
                        min = "分";
                    }
                    else if(mode == "english"){
                        stopname = result[i].StopName.En;
                        over = "over";
                        stop = "stop";
                        arrive = "arrive";
                        min = "min";
                    }
                    
                    const Time = Math.floor(result[i].EstimateTime / 60);
                    if (result[i].EstimateTime == undefined) { //no bus - over
                        str +=
                            `<li class="bus-state">
                                <div class="station over">
                                    <div class="time">${over}</div>
                                </div>
                                <div class="way"></div>
                                <div class="sta-name">${stopname}</div>
                            </li>`
                    } else if (result[i].EstimateTime < 0){ //leave
                        str +=
                            `<li class="bus-state">
                                <div class="station stop">
                                    <div class="time">${stop}</div>
                                </div>
                                <div class="way"></div>
                                <div class="sta-name">${stopname}</div>
                            </li>`
                    } else if (result[i].EstimateTime == 0) { //Inbound 
                        str +=
                            `<li class="bus-state">
                                <div class="station arrive">
                                    <div class="time">${arrive}</div>
                                </div>
                                <div class="way"></div>
                                <div class="sta-name">${stopname}</div>
                                <div class="bus"> <i class="fa fa-bus"></i><span>${result[i].PlateNumb}</span></div>
                            </li>`
                    } else if (result[i].EstimateTime == 60) { //on min left
                        str +=
                            `<li class="bus-state">
                                <div class="station arrive">
                                    <div class="time">${Time}${min}</div>
                                </div>
                                <div class="way"></div>
                                <div class="sta-name">${stopname}</div>
                                <div class="bus"> <i class="fa fa-bus"></i><span>${result[i].PlateNumb}</span></div>
                            </li>`
                    } else if (result[i].EstimateTime) { //show how long will get this station
                        str +=
                            `<li class="bus-state">
                                <div class="station">
                                    <div class="time">${Time}${min}</div>
                                </div>
                                <div class="way"></div>
                                <div class="sta-name">${stopname}</div>
                            </li>`
                    }
                }
                $(".bus-search").hide();
                $(".bus-info").show();
                if(mode == "chinese"){
                    $("#now-position").text( now_way.find('.bus-num').attr('data-zh') + " 號公車路線");
                    way = now_way.find('.bus-way').attr('data-zh');
                }
                else if(mode == "english"){
                    $("#now-position").text(  now_way.find('.bus-num').attr('data-en') + " Bus route");
                    way = now_way.find('.bus-way').attr('data-en');
                }
                $(".bus-info").html(
                    "<h3>" + way + "</h3>"
                );
                $("#list").html(str);
                page = "way";
            },
            error: function() {  
                console.log('Request Error.');
            }
        });

    }
    checkway = function(){
        renderWay(now_way,mode);
    };
    $(document).on("click" , ".busLink" , function(){
        now_way = $(this);
        renderWay(now_way,mode);                //render page
        way_var = setInterval(checkway,30000);  //set interval
    });

});