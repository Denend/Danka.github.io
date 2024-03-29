document.addEventListener("DOMContentLoaded", function(event) {
$("body").on("click touchend",".extendable-success",obj_opros.click_positive);
$("body").on("click touchend",".extendable-danger",obj_opros.click_negative);
$("body").on("click touchend","#button_submit_opros",obj_opros.click_button_opros);
$("#mail").mouseout(function (){validation.msoutMail()});
$("#pass").mouseout(function(){validation.msoutPass()});
$("#pass1").mouseout(function(){validation.msoutPass1()});
cur_url2 = location.href.substring(location.href.lastIndexOf('/'))
if(cur_url2 == "/statistics"){
mySuperChart = document.getElementById("myGraph").getContext("2d");
$.ajax({
//  data : json_string,
  contentType: "application/json; charset=utf-8",
  type : 'GET',
  dataType: "json",
  url : '/_statistics_process'
})
.done(function(data) {
  const dataValues = Object.values(data);
  if(document.documentElement.clientWidth < 767 && document.documentElement.clientWidth >419) {
Chart.defaults.global.defaultFontSize = 7;
} else if (document.documentElement.clientWidth < 420)
{
  Chart.defaults.global.defaultFontSize = 5;
} else if (document.documentElement.clientWidth> 766){
  Chart.defaults.global.defaultFontSize = 14;
};  
  var barChart = new Chart(mySuperChart, {
    type: "pie",
    data: {
      labels: ['Trump forever',  'Putin is right','Obama was the best ','Merkel is doing gj',
              'Ukraine is Europe', "Poroshenko is a good guy", 'Klichko is clever boy',
              'Reagan was the best', 'Illuminati confirmed'],
      datasets: [{
        label: "Quantity of positive answers",

        data: [
          dataValues[0],
          dataValues[1],
          dataValues[2],
          dataValues[3],
          dataValues[4],
          dataValues[5],
          dataValues[6],
          dataValues[7],
          dataValues[8]
        ],
        backgroundColor:[
      "rgb(0, 191, 255)" ,
      "rgb(255,255,0)" ,
      "rgb(238, 130, 238)",
      "rgb(255, 69, 0)",
      "rgb(0, 128, 0)",
      "rgb(0, 0, 255)",
      "rgb(75, 0, 130)",
      "rgb(165, 42, 42)",
      "rgb(60, 179, 113)"
    ],
        borderWidth:1,
        borderColor:"#777",
        hoverBorderWidth:5,
        hoverBorderColor: "black"
      }]
    },
    options: {
      title:{
        text: "Here are the results",
        fontColor: "black",
        fontSize: 25,
        position: 'right'
      },
      legend:{

      position: 'right'
    }

    }
  });
});
};
   $(function () {
      cur_url = location.href.substring(location.href.lastIndexOf('/'));
      if(cur_url == "/login?next=%2Fopros" || cur_url == "/login?next=%2Fstatistics")
         {
         cur_url = '/' + cur_url.split('F')[1];
         };
      $('.menu li').each(function () {
            link = $(this).find('a').attr('href');
            if (cur_url == link)
              {
                  $(this).addClass('active');
              };
      });
    });
});
var validation = {
  msoutMail:function(){
      var x = document.getElementById("mail");
      var forma1Div = document.getElementById("divEmail");
      if(x.value.length<=2) {
        forma1Div.classList.add("has-error");
        return false;
      }
      else {
        forma1Div.classList.remove("has-error");
      };
  },
    msoutPass:function(){
      var array = [document.getElementById("pass"),document.getElementById("divPass")];
      if(array[0].value.length<=4 ) {
        array[1].classList.add("has-error");
        return false;
      }
      else {
        array[1].classList.remove("has-error");
      };
    },
    msoutPass1:function(){
      var array1 = [document.getElementById("pass1"),document.getElementById("divPass1")]
      if(array1[0].value.length<=4 ) {
        array1[1].classList.add("has-error");
        return false;
      }
      else {
        array1[1].classList.remove("has-error");
      };
    },
}
var object_send = {};
var obj_opros={
  click_positive: function() {
    $(this).parents().eq(1).find(".extendable-danger").css("fontSize","30px");
    $(this).css("fontSize","40px");
    $(this).parents().eq(1).removeAttr("class");
    $(this).parents().eq(1).addClass("panel panel-default panel-success");
    },
  click_negative: function(){
    $(this).parents().eq(1).find(".extendable-success").css("fontSize","30px");
    $(this).css("fontSize","40px");
    $(this).parents().eq(1).removeAttr("class");
    $(this).parents().eq(1).addClass("panel panel-default panel-danger");
  },
  click_button_opros: function(){
    for(i=1;i<10;i++){
              result: 0,
              class_of_div = [];
              class_of_div[i] =  $('#opros_div'+i).attr('class'),
              result = class_of_div[i].includes("panel-success"),
              array_final = [];
              array_final[i] = result;
              object_send[i] = {
                result,
              };
              if(class_of_div[i] == "panel panel-default panel-info"){
                $("#alert_error_opros").show()
                return false
              };
             };
            var json_string = JSON.stringify(object_send);
             $.ajax({
          			data : json_string,
                contentType: "application/json; charset=utf-8",
          			type : 'POST',
                dataType: "json",
                success: function(){window.location.href="/statistics"},
          			url : '/_opros_process'
          		})
          		.done(function(data) {
                obj_stat1 = data
              });
  },
};

function validateUserName() {
  var d = [document.getElementById("mail"),document.getElementById("pass"),document.getElementById("pass1")]
  if(validation.msoutMail() == false){
      $("#alert_error").html("Login has to be longer then 3 symbols");
      $("#alert_error").show()
      return false;
  }
  else if(validation.msoutPass() == false) {
      $("#alert_error").html("Password has to be at least 5 symbols long");
      $("#alert_error").show()
      return false;
  }
  else if(d[1].value != d[2].value){
      $("#alert_error").html("Passwords dont match");
      $("#alert_error").show()
      return false;
  }
  else if(validation.msoutPass() == false || validation.msoutPass1() == false) {
      $("#alert_error").html("Password has to be at least 5 symbols long");
      $("#alert_error").show()
      return false;
  }
};
