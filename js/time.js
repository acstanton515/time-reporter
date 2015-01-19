{ //global variables
  var timerow=1;
  var categories = [
    'Ticket','Innovation','Run & Maintain','Planning',
    'Training','Not Working','Customer Meeting','Staff Meeting',
    '3370 ARK2','3705 KFM','3883 Molex SRM','3886 Calgary',
    '3988 Seg KFO','3896 POC',
    'Coaching','Admin','Project','Vendor Meeting'
    ];
  var category_ids = [
    'TICK','INNO','RUMA','PLAN',
    'TRNG','NTWK','CUMT','STMT',
    '3370','3705','3883','3886',
    '3988','3896',
    'CONG','ADMN','PROJ','VEMT'
    ];
  function getCategory (c_id) {
    var i;
    for (i in category_ids) {
      if (c_id == category_ids[i])
        return categories[i];
    }
    return "Not Available";
  }
}

function rowTime(id, start, end, category, date) {
  this.id = id;
  this.startTime = start;
  this.endTime = end;
  this.category = category;
  this.date = date;
  this.toString = function (showId) {
    if (showId)
      return ""+this.id+","+this.startTime+","+this.endTime+","+this.category+","+this.date;
    else
      return ""+this.startTime+","+this.endTime+","+this.category+","+this.date;
  }
}

function getDateFormat () {
  var d = new Date();
  var mi_round = d.getMinutes();
  var mi = (mi_round < 10) ? ("0"+mi_round):mi_round;
  var hr = (d.getHours() < 10) ? ("0"+d.getHours()):d.getHours();
  var mo = (d.getMonth() < 10) ? ("0"+d.getMonth()):d.getMonth();
  var da = (d.getDate() < 10) ? ("0"+d.getDate()):d.getDate();
  return hr + ":" + mi;
}

function startDate (id) {
  var x = document.getElementById(id).getElementsByClassName("start");
  for (i = 0; i < x.length; i++) { 
      x[i].innerHTML = getDateFormat();
  }
}

function endDate (id) {
  var x = document.getElementById(id).getElementsByClassName("end");
  for (i = 0; i < x.length; i++) { 
      x[i].innerHTML = getDateFormat();
  }
  //enable user to adjust time field after an end time has been set
  adjustTime(id," .end");
  adjustTime(id," .start");
}

function adjustTime (id,timeType) {
  var ref = "#"+id+timeType;
  $(ref).addClass('adjustableTime');
  var ref2= ref+" .is-timeInput";
  $(ref).dblclick (function() {
    reporting (id, false);
    var x = $(this).html ();
    $(this).html("<input type='text' class='is-timeInput'>");
    $(ref2).timeEntry ({spinnerImage: '', show24Hours: true, timeSteps: [1, 1, 0]});
    $(ref2).timeEntry ('setTime', x);
    $(ref2).blur (function() {
      var x = $(this).val();
      $(ref).html (x);
       reporting (id, true);
       storeTimeRow (id)
    })
    $(ref2).focus ();
  })
}

function adjustTimeCategory (id) {
  var ref = "#"+id+" .category .types";
  $(ref).focus(function(){
    reporting(id, false);
  })
  $(ref).blur(function(){
    reporting(id, true);
    storeTimeRow (id);
  })
}

function categoryField (id) {
  if (categories.length != category_ids.length)
    alert ("Error. Check your categories arrays in script.js file to ensure they are equal!");
  else {
    var html_select = "<select name='Types' class='types'>";
    var i;
    for (i in categories)
      html_select = html_select+"<option value='"+category_ids[i]+"'>"+categories[i]+"</option>";
    html_select = html_select+"</select>";
    $("#"+id+" .category").html(html_select);
    // debugger;
  }
}

function actionButtons (id, isNew, isStopped) {
  var y = "<button class='submit time-button' title='submit'><img src='img/Add.png' alt='Submit' class='img-button'></button>";
  if (isNew)
    if (!isStopped)
      var y2 = "<button class='stop time-button' title='stop'><img src='img/Stop.png' alt='Stop' class='img-button'></button>";
    else
      var y2 = '';
  else
    var y2 = "<button class='remove time-button' title='remove'><img src='img/Cross.png' alt='Remove' class='img-button'></button>";
  var ref = "#"+id;
  $(ref+" .actions").html(y+y2);
  if (isNew) {
    if (!isStopped)
      $(ref+" .submit").click(function () {
        submit(id, false, false);
      });
    else
      $(ref+" .submit").click(function () {
        submit(id, true, true);
      });
    if (!isStopped)
      $(ref+" .stop").click(function () {
        submit(id, true, false);
      });
  }
  else {
    $(ref+" .submit").click(function () {
      submit(id, false, true);
    });
    $(ref+" .remove").click(function () {
      remove(id);
    });
  }
}

function addRow (isInsert,ref_id) {
  var table = document.getElementById('time');
  var d = new Date();
  var dM = ((d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : d.getMonth()+1);
  var dD = ((d.getDate()+1) < 10 ? "0"+(d.getDate()) : d.getDate());
  var date = ""+d.getFullYear()+"-"+dM+"-"+dD;
  if ( document.getElementById(date) == null ) {
    var row = table.insertRow(1);
    row.setAttribute('id',date);
    row.setAttribute('class','date');
    var cell = row.insertCell(0);
    cell.setAttribute('colspan','5');
    cell.innerHTML = d.toDateString();
  }
  var row;
  if (!isInsert)
    row = table.insertRow(2);
  else {
    var i = $("#time").children().children().first();
    var counter = 1;
    while (!i.is("#"+ref_id)) {
      i = i.next();
      counter = counter + 1;
    }
    row = table.insertRow(counter-1);
    date = $("#"+ref_id).attr('class');
  }
  row.setAttribute('id',timerow);
  row.setAttribute('class',date);
  row.insertCell(0).setAttribute('class','start');
  row.insertCell(1).setAttribute('class','end');
  row.insertCell(2).setAttribute('class','span');
  row.insertCell(3).setAttribute('class','category');
  row.insertCell(4).setAttribute('class','actions');
  if (!isInsert) {
    actionButtons (timerow,true, false);
    startDate (timerow);
    categoryField (timerow);
  }
  else {
    //this is an inserted row and needs time copied from the original row we inserted from (end)
    actionButtons (timerow,false, false);
    startDate(timerow);
    endDate(timerow);
    $("#"+timerow+" .start").text( $("#"+ref_id+" .end").text());
    $("#"+timerow+" .end"  ).text( $("#"+ref_id+" .end").text());
    categoryField (timerow);
    adjustTimeCategory(timerow);
    reporting (timerow, true);
    storeTimeRow (timerow);
  }
}

function submit (id, isStop, isInsert) {
  if (!isStop && !isInsert) { //completely new row from a non-stopped position
    endDate (id);
    reporting (id, true);
    storeTimeRow (id);
    actionButtons(id,false,false);
    timerow++;
    addRow(false,null);
    adjustTimeCategory(id);
  }
  else if (isStop && !isInsert) { //stop action which should not be from insert
    endDate (id); 
    reporting (id, true);
    storeTimeRow (id);
    actionButtons(id,true,true);
    adjustTimeCategory(id);
  }
  else if (!isStop && isInsert) { //insert action, which should not occur when stopped (i.e. middle insert)
    actionButtons(id,false,false);
    timerow++;
    addRow(true,id);
  }
  else {  //insert action, which should occur when stopped (i.e. top insert)
    actionButtons(id,false,false);
    timerow++;
    addRow(false,null);
  }
}

function remove (id) {
  reporting (id, false);
  var ref = "#"+id;
  localStorage.removeItem("time_row_object_"+id);
  $(ref).remove();
}

function reporting (id, isAdd) {
  var table = document.getElementById('report');
  var date = $("#"+id).attr('class');
  var dParse = date.split("-");
  var d = new Date(dParse[0],dParse[1]-1,dParse[2]);
  date = date+"-report";
  if ( document.getElementById(date) == null ) {
    var row = table.insertRow(1);
    row.setAttribute('id',date);
    row.setAttribute('class','date');
    var cell = row.insertCell(0);
    cell.setAttribute('colspan','5');
    cell.innerHTML = d.toDateString();
    row = table.insertRow(2);
    row.setAttribute('id',date+"_TOTL");
    row.setAttribute('class','total');
    row.insertCell(0).innerHTML="Total";
    row.insertCell(1).innerHTML="0";
    row.cells[1].setAttribute('data-minutes','0');
    row.insertCell(2).innerHTML="0";
    row.cells[2].setAttribute('style','display:none;');
  }
  var ref_start = "#"+id+" .start";
  var ref_end = "#"+id+" .end";
  var y = $(ref_start).text().split(":");
  var time_start = new Date(00,0,0,y[0],y[1]);
  y = $(ref_end).text().split(":");
  var time_end = new Date(00,0,0,y[0],y[1]);
  var diff = (time_end-time_start);
  var diff_min = (diff < 0) ? 0 : diff/1000/60;
  function minutesToRoundedHours (min) {
    var min_round = (min%15 < 8) ? min-(min%15) : min+(15-min%15);
    return min_round/60;
  }
  var ref_type = "#"+id+" .types";
  var x = $(ref_type).val();
  if ( document.getElementById(date+"_"+x) == null ) {
    var i = $("#report").children().children().first();
    var counter = 1;
    while (!i.is("#"+date)) {
      i = i.next();
      counter = counter + 1;
    }
    row = table.insertRow(counter);
    row.setAttribute('id',date+"_"+x);
    row.insertCell(0).innerHTML=getCategory(x);
    row.insertCell(1).innerHTML=minutesToRoundedHours(diff_min); //hr
    row.cells[1].setAttribute('data-minutes',diff_min);
    row.insertCell(2).innerHTML=1; //count
    row.cells[2].setAttribute('style','display:none;');
  }
  else {
    var ref = "#"+date+"_"+x;
    if (isAdd) {
      var minutes_now = $(ref).contents().eq(1).attr('data-minutes');
      $(ref).contents().eq(1).text(minutesToRoundedHours(Number(minutes_now)+diff_min));
      $(ref).contents().eq(1).attr('data-minutes',Number(minutes_now)+diff_min);
      var count_now = $(ref).contents().eq(2).text();
      $(ref).contents().eq(2).text(parseInt(count_now)+1);
      $(ref).show();
    }
    else {
      var minutes_now = $(ref).contents().eq(1).attr('data-minutes');
      $(ref).contents().eq(1).text(minutesToRoundedHours(Number(minutes_now)-diff_min));
      $(ref).contents().eq(1).attr('data-minutes',Number(minutes_now)-diff_min);
      var count_now = $(ref).contents().eq(2).text();
      $(ref).contents().eq(2).text(parseInt(count_now)-1);
      if (parseInt($(ref).contents().eq(2).text()) == 0 )
        $(ref).hide();
    }
  }
  var ref = "#"+date+"_TOTL";
  if (isAdd) {
    var minutes_now = $(ref).contents().eq(1).attr('data-minutes');
    $(ref).contents().eq(1).text(minutesToRoundedHours(Number(minutes_now)+diff_min));
    $(ref).contents().eq(1).attr('data-minutes',Number(minutes_now)+diff_min);
    var count_now = $(ref).contents().eq(2).text();
    $(ref).contents().eq(2).text(parseInt(count_now)+1);
  }
  else {
    var minutes_now = $(ref).contents().eq(1).attr('data-minutes');
    $(ref).contents().eq(1).text(minutesToRoundedHours(Number(minutes_now)-diff_min));
    $(ref).contents().eq(1).attr('data-minutes',Number(minutes_now)-diff_min);
    var count_now = $(ref).contents().eq(2).text();
    $(ref).contents().eq(2).text(parseInt(count_now)-1); 
  }
  $("#"+id+" .span").text(diff_min);
}

function storeTimeRow (id) {
  var i = $("#"+id);
  var date = i.attr('class');
  var rowT = new rowTime(id,$("#"+id+" .start").text(),$("#"+id+" .end").text(),$("#"+id+" .category .types").val(),date);
  localStorage.setItem("time_row_object_"+id,rowT.toString(true));
  if (Number(localStorage.getItem("time_row_ceiling")) < id) {
    localStorage.setItem("time_row_ceiling",id);
  }
}

function addStoredRow (rowT) {
  var table = document.getElementById('time');
  var date = rowT.date;
  var dParse = date.split("-");
  var d = new Date(dParse[0],dParse[1]-1,dParse[2]);
  if ( document.getElementById(date) == null ) {
    var row = table.insertRow(1);
    row.setAttribute('id',date);
    row.setAttribute('class','date');
    var cell = row.insertCell(0);
    cell.setAttribute('colspan','5');
    cell.innerHTML = d.toDateString();
  }
  var row = table.insertRow(2);
  row.setAttribute('id',rowT.id);
  row.setAttribute('class',date);
  row.insertCell(0).setAttribute('class','start');
  row.insertCell(1).setAttribute('class','end');
  row.insertCell(2).setAttribute('class','span');
  row.insertCell(3).setAttribute('class','category');
  row.insertCell(4).setAttribute('class','actions');

  actionButtons (rowT.id,false, false);
  startDate(rowT.id);
  endDate(rowT.id);
  $("#"+rowT.id+" .start").text( rowT.startTime);
  $("#"+rowT.id+" .end"  ).text( rowT.endTime);
  categoryField (rowT.id);
  $("#"+rowT.id+" .category .types").val(rowT.category);
  adjustTimeCategory(rowT.id);
  reporting (rowT.id, true);
}

function dynamicSort(property) { 
  return function (obj1,obj2) {
    return obj1[property] > obj2[property] ? 1
      : obj1[property] < obj2[property] ? -1 : 0;
  }
}

function dynamicSortMultiple() {
  var props = arguments;
  return function (obj1, obj2) {
    var i = 0, result = 0, numberOfProperties = props.length;
    while(result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  }
}

function loadTimeRows (isStartup, isExport, isImport, importString) {
  var sort_arr = [];
  var arr = [];
  if (isStartup || isExport) {
    var i = 1;
    var ceiling = Number(localStorage.getItem("time_row_ceiling"));
    while (i <= ceiling) {
      if (localStorage.getItem("time_row_object_"+i) != null) {
        var rowA = localStorage.getItem("time_row_object_"+i).split(",");
        var rowT = new rowTime(rowA[0],rowA[1],rowA[2],rowA[3],rowA[4]);
        arr.push(rowT);
      }
      i++;
    }
    timerow = Number(ceiling)+1;
  }
  else {  //is Import
    var importArray = importString.split("\n");
    //debugger;
    for (j in importArray) {
      var rowA = importArray[j].split(",");
      if (!/\S/.test(importArray[j]))
        continue;
      try {
        if (rowA.length != 4) throw "line "+(Number(j)+1)+" has wrong format";
        // if (/[^0-9]/.test(rowA[0])) throw "invalid id on line "+(Number(j)+1);
        if (!/[0-2][0-9]:[0-5][0-9]/.test(rowA[0])) throw "invalid start time on line "+(Number(j)+1);
        if (!/[0-2][0-9]:[0-5][0-9]/.test(rowA[1])) throw "invalid end time on line "+(Number(j)+1);
        if (/2[4-9]:/.test(rowA[0])) throw "invalid start time on line "+(Number(j)+1);
        if (/2[4-9]:/.test(rowA[1])) throw "invalid end time on line "+(Number(j)+1);
        if (rowA[0].length != 5) throw "invalid start time on line "+(Number(j)+1);
        if (rowA[1].length != 5) throw "invalid end time on line "+(Number(j)+1);
        if (category_ids.indexOf(rowA[2]) == -1 ) throw "invalid category on line "+(Number(j)+1);
        var splitDate = rowA[3].split('-');
        if (splitDate.length != 3) throw "invalid date on line "+(Number(j)+1);
        if (rowA[3].length != 10) throw "invalid date on line "+(Number(j)+1);
        var testDate = new Date (splitDate[0],splitDate[1]-1,splitDate[2],rowA[1].split(":")[0],rowA[1].split(":")[1]);
        if (testDate.getFullYear() != splitDate[0]) throw "invalid date on line "+(Number(j)+1);
        if (testDate.getMonth() != splitDate[1]-1) throw "invalid date on line "+(Number(j)+1);
        if (testDate.getDate() != splitDate[2]) throw "invalid date on line "+(Number(j)+1);
        var nowDate = new Date();
        if (nowDate.getTime() < testDate.getTime()) throw "invalid date, date later than now on line "+(Number(j)+1);
      }
      catch(err) {
        $("#import-result-text").html("error: "+err+"<br>format: StartTime,EndTime,FourCharacterCategoryCode,Date<br>syntax: HH:MM,HH:MM,CATE,YYYY-MM-DD");
        return -1;
      }
      var rowT = new rowTime(timerow,rowA[0],rowA[1],rowA[2],rowA[3]);
      timerow++;
      arr.push(rowT);
    }
  }
  // for (x in arr) {console.log(arr[x].toString(false));};console.log("===============")
   sort_arr = arr.sort(dynamicSortMultiple("date","startTime"));
  var x;
  // for (x in sort_arr) {console.log(sort_arr[x].toString(false));}
  if (isStartup || isImport)
  {
    for (x in sort_arr) {
      addStoredRow(sort_arr[x]);
      if (isImport)
        storeTimeRow(sort_arr[x].id)
      }
  }
  else { //is Export 
    var y;
    var config_str = "";
    for (y in sort_arr) {
      config_str = config_str + sort_arr[y].toString(false) + "\r\n";
    }
    $("#export-box").val(config_str);
  }
}

{ //on startup
  //load existing data
  loadTimeRows (true,false,false);
  //load starting time
  addRow (false,null);
  
  document.getElementById("nav01").innerHTML =
  "<ul id='menu'>" +
  "<li id='time-nav'>Time</li>" +
  "<li id='report-nav'>Report</li>" +
  "<li id='config-nav'>Config</li>" +
  "<li id='export-nav'>Export</li>" +
  "<li id='import-nav'>Import</li>" +
  "</ul>";
  $("#time-nav").click(function(){
    $("#time-section").toggle();
  });
  $("#report-nav").click(function(){
    $("#report-section").toggle();
  });
  $("#config-nav").click(function(){
    $("#config-section").toggle();
  });
  $("#export-nav").click(function(){
    loadTimeRows (false,true,false);
    $("#export-section").toggle();
  });
  $("#import-nav" ).click(function(){
    $("#import-section").toggle();
  });
  $("#import-button").click(function(){
    var ret = loadTimeRows(false,false,true,$("#import-box").val());
    if (ret != -1) {
      $("#import-box").val("")
      $("#import-result-text").text("");
      location.reload(false)  //quick fix to make the imported rows go to the right spot... i'm really lazy :(
    }
  });
  $("#config-section").hide();
  $("#export-section").hide();
  $("#import-section").hide();
}