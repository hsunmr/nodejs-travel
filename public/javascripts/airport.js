//load youtube vedio
var playList=["Bsq3VkJQL0M","fkBQNtXNzyY"];
var player;

function onYouTubeIframeAPIReady(){
	for(var i =0; i<2;i++){
		player = new YT.Player("airport-vedio"+(i+1),{
			height:"390",
			width:"640",
			videoId:playList[i],
			playerVars:{
				"autoplay":0,//是否自動撥放
				"controls":0,//是否顯示控制向
				"showinfo":1,//上方是否顯示影片標題
				"rel":1,//結束是否顯示相關影片
				"iv_load_policy":3//是否顯示置入行銷聯結
			},
			events:{
				"onReady":onPlayerReady,
				"onStateChange":onPlayerStateChange
			}
		});
	}
}
function onPlayerReady(event) {

 }

function onPlayerStateChange(event) {

}
function stopVideo() {
	player.stopVideo();
}
$(document).ready(function(){
    var airline = {
        "B7":"立榮航空",
        "FE":"遠東航空",
        "AE":"華信航空",
    };
    var Airport = {
        'KHH':'高雄Kaohsiung',
        'TSA':'臺北Taipei',
        'RMQ':'臺中Taichung',
        'CYI':'嘉義Chiayi',
        'TNN':'臺南Tainan',
        'MZG':'澎湖Penghu'
    };
	var type='arrival';
	
	$('#search').on('touchstart click',(function(){
		
		//table title
		var Airport_title = '起飛機場';
		var ScheduleTime_title = '預計到站時間';
		var ActualTime_title = '實際到站時間';
		//result name
		var FlightDate = 'FlightDate';
		var AirlineID = 'AirlineID';
		var FlightNumber = 'FlightNumber';
		var AirportID = 'DepartureAirportID';
		var SFlightTime = 'ScheduleArrivalTime';
		var AFlightTime = 'ActualArrivalTime';
		var Remark = 'ArrivalRemark';
		//url filter
		var url_type = "Arrival";
		var filter_type = "Departure";
		var airline_id = $("#aircom").val();
		var airport_id = $("#airport").val();
		var filter = "$filter=";
		
		if(type == 'departure'){
			//table title
			Airport_title = '抵達機場';
			ScheduleTime_title = '預計起飛時間';
			ActualTime_title = '實際起飛時間';
			//result name
			AirportID = 'ArrivalAirportID';
			SFlightTime = 'ScheduleDepartureTime';
			AFlightTime = 'ActualDepartureTime';
			Remark = 'DepartureRemark';
			//url filter
			url_type = "Departure";
			filter_type = "Arrival";
		}
		
		var url = "https://ptx.transportdata.tw/MOTC/v2/Air/FIDS/Airport/"+ url_type +"/KNH?$orderby=Schedule" + url_type +"Time%20asc&$format=JSON";
		//filter airport and airline
		if( airline_id != "none"){
			filter += "AirlineID%20eq%20'" + airline_id +"'";
		}
		if( airport_id != "none" && filter != "$filter="){
			filter += "%20and%20" + filter_type + "AirportID%20eq%20'" + airport_id +"'";
		}else if(airport_id != "none"){
			filter += filter_type + "AirportID%20eq%20'" + airport_id +"'";
		}
			
		if(filter != "$filter=")
			url = "https://ptx.transportdata.tw/MOTC/v2/Air/FIDS/Airport/"+ url_type +"/KNH?" + filter + "&$orderby=Schedule" + url_type +"Time%20asc&$format=JSON";
		
        $.ajax({

            url: url,
            type: "GET",
            dataType: "json",
            success: function(result){
                var str ="";
                str +="<div class='table-responsive'><table class='table table-hover mb-5'>"
                        +"<thead>"
                        +    "<tr>"
                        +        "<th>日期</th>"
                        +        "<th>航空公司</th>"
                        +        "<th>班次</th>"
                        +        "<th>"+Airport_title+"</th>"
                        +        "<th>"+ScheduleTime_title+"</th>"
                        +        "<th>"+ActualTime_title+"</th>"
                        +        "<th>備註</th>"
                        +    "</tr>"
                        +"</thead>"
                        +"<tbody>";
				if(result.length == 0)
					str += "<tr><td colspan='7' style='text-align:center;'> no result </td></tr>";
						
                for(var i=0;i < result.length;i++){

					var ActualTime = '';
					var ScheduleTime = '';
					
					if(typeof(result[i][SFlightTime]) != "undefined")
						ScheduleTime = result[i][SFlightTime].slice(11);
					if(typeof(result[i][AFlightTime]) != "undefined")
						ActualTime = result[i][AFlightTime].slice(11);
				
					
                    str += "<tr>"
                         +  "<td>" + result[i][FlightDate] + "</td>"
                         +  "<td>" + airline[result[i][AirlineID]] + "</td>"
                         +  "<td>" + result[i][FlightNumber] + "</td>"
                         +  "<td>" + Airport[result[i][AirportID]] + "</td>"
                         +  "<td>" + ScheduleTime + "</td>"
                         +  "<td>" + ActualTime + "</td>"
                         +  "<td>" + result[i][Remark] + "</td>"
                         +  "</tr>";
                }
                str +="</tbody></table></div>"

                $('#result').html(str);
            },
            error: function() {  
                console.log('Request Error.');
            }
        });
    }));
	$('#arrival').click(function(){
		type = 'arrival';
		$("#airport_text").text("起飛地");
		$("#departure").css('border',0);
		$("#arrival").css('border','1px solid red');
	});
	$('#departure').click(function(){
		type = 'departure';
		$("#airport_text").text("目的地");
		$("#arrival").css('border',0);
		$("#departure").css('border','1px solid red');
	});

});
	
