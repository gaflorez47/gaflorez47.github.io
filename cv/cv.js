$(function(){
  $rankingTemplate = $(".ranks").remove();
  $(".skills .rank").each(function(index,elem){
    var rank = parseInt($(elem).data("rank"));
    $ranking = $rankingTemplate.clone();
    $(".star", $ranking).each(function(ind, elem2){
      if(ind < rank) $(elem2).addClass("active");
    });
    $(elem).append($ranking);
  });
});