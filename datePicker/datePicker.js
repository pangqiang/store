(function(){
	var datePicker={},
	  	myDate=new Date()

	datePicker.getMonthData=function(year,month){
		var ret=[]
		//判断第一天对应的是周几
		var firstDayWeek=new Date(year,month-1,1).getDay();
		if(firstDayWeek===0){firstDayWeek=7}
		//判断某一个月的天数
		var lastDay=new Date(year,month,0).getDate();
		//获取当前月份上一月的天数（即最后一天）
		var lastDayoflastmonth=new Date(year,month-1,0).getDate()
		var prelastMonthDays=firstDayWeek-1
		for (var i = 0; i <6*7; i++) {
			var date=i+1-prelastMonthDays;
			var showDate=date;
			var thisMonth=month;
			if(date<=0){
				//上一个月
				thisMonth=month-1;
				showDate=lastDayoflastmonth+date;
			}
			if(date >lastDay){
				//下一个月
				thisMonth=month+1;
				showDate=showDate-lastDay
			}
			if(thisMonth===0)thisMonth=12
			if(thisMonth===13)thisMonth=1

				ret.push(
				{
					date:date,
					showDate:showDate,
					month:thisMonth,
					lastDay:lastDay,
					year:year
				})
			
		}
		return ret
	}
	/*确定不可选择的天数*/
	function Prohibition(year,month){
		// console.log(arguments);
		$.ajax({
				type:'GET',
				url:'date.json',
				data:{
					'year':year,
					'month':month
				},
				dataType:"json",
				success:function(res){
					var temp_reserve=res.ban.reserve;
					var temp_live=res.ban.live;
					if(temp_reserve||temp_live){
						for (var i = 0; i < temp_reserve.length; i++) {
							$('td[data-date='+temp_reserve[i]+'].now').addClass('selected_reserve')
						}
						for (var i = 0; i < temp_live.length; i++) {
							$('td[data-date='+temp_live[i]+'].now').addClass('selected_live')
						}
					}
				},
				error:function(res){
					console.log(res);
					alert('返回不可选数据有误！');

				}
			})
	}

	/*列表渲染*/

	function creatList(year,month) {
		var data=datePicker.getMonthData(year,month),
			tbody=$('.ui-dataPicker-body tbody'),
			thead=$('.ui-dataPicker-body thead')
			datePickerHeader=$('.ui-datePicker-wrapper .ui-datePicker-header'),
			tbody_html='',
			thead_html='',
			datePickerHeader_html='';
			datePickerHeader_html+='<a href="###" class="ui-datePicker-btn prev">&lt;</a>'+
						'<a><span id="Year">'+addZero(year)+'</span>-<span id="Month">'+addZero(month)+'</span></a>'+
						'<a href="###" class="ui-datePicker-btn next">&gt;</a>'
						
			thead_html='<tr><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td><td>日</td></tr>'
			
		for (var i = 0; i < data.length; i++) {
			if(i%7==0){
				tbody_html+='<tr>'
				}
				if(data[i].date<=0){
					tbody_html+='<td data-date="'+data[i].showDate+'" class="prev item"><span data-date="'+data[i].year+'-'+data[i].month+'-'+data[i].showDate+'">'+data[i].showDate+'</span></td>'
				}else if(data[i].date>data[i].lastDay){
					tbody_html+='<td data-date="'+data[i].showDate+'" class="next item"><span data-date="'+data[i].year+'-'+data[i].month+'-'+data[i].showDate+'">'+data[i].showDate+'</span></td>'
				}else{
					tbody_html+='<td data-date="'+data[i].showDate+'" class="item now"><span data-date="'+data[i].year+'-'+data[i].month+'-'+data[i].showDate+'">'+data[i].showDate+'</span></td>'
				}
				if(i%7==6){
					tbody_html+='</tr>'
				}	
			}
			tbody.html(tbody_html);
			thead.html(thead_html);
			datePickerHeader.html(datePickerHeader_html);
			Prohibition(year,month);

		}
	/*补零函数*/
	function addZero(num){
		return num<10? '0'+num:num;
	}
	//初始化函数
	datePicker.mydate=function(argument){
		var myDate=new Date(),
			arg=arguments,
			el=arg[0].el,
			_date=arg[0].current_date,
			data=new Date(_date)
			year=data.getFullYear(),
			month=data.getMonth()+1
				if(!year||!month){
			var year=myDate.getFullYear()
			var month=myDate.getMonth()+1
		}

	//日历切换 
	$('.ui-datePicker-header').on('click',function(e){
		if(e.target.classList.contains('prev')){
			if(year>=(myDate.getFullYear())){
				month--
			if(month<1){
				year--
				month=12;
			}
			}else{
				return false;
			}
		}else if(e.target.classList.contains('next')){
			//将月份选择区间限制到半年
				month++
				if(month>12){
					year++
					month=1
				}
		}
			creatList(year,month);
	})
	creatList(year,month);
}

window.datePicker=datePicker

})()